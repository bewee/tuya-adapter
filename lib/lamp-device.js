'use strict';

const {_Adapter, _Database, Device, _Property} = require('gateway-addon');
const TuyAPI = require('tuyapi');
const PowerProperty = require('./power-property');
const ModeProperty = require('./mode-property');

// 20: power
// 21: mode (white, ??? )

class LampDevice extends Device {
  constructor(adapter, tid, key) {
    super(adapter, `tuya-${tid}`);

    this.tid = tid;
    this.key = key;

    this.name = 'Lamp';
    this['@type'] = ['OnOffSwitch'];
    this.description = 'tuya lamp';

    this.properties.set('on', new PowerProperty(this, 20));
    this.properties.set('mode', new ModeProperty(this, 21, ['white', 'colour', 'scene']));

    this.tuyapi = new TuyAPI({
      id: this.tid,
      key: this.key,
    });
    this.tuyapi._responseTimeout = 5;
    this.tuyapi._connectTimeout = 5;
    this.tuyapi._pingPongPeriod = 10;
    this.tuyapi.on('connected', () => {
      this.connectedNotify(true);
    });
    this.tuyapi.on('disconnected', () => {
      this.connectedNotify(false);
      if ('dead' in this) return;
      this.setTimeout((() => {
        this.tuyapi.connect();
      }).bind(this), 10*1000);
    });
    this.tuyapi.on('error', (err) => {
      console.log(this.id, 'Error', err);
    });
    this.tuyapi.on('data', ((data) => {
      console.log(this.id, 'Data', data);
      for (const [_key, prop] of this.properties) {
        if (prop.dps in data.dps) {
          prop.setCachedValue(data.dps[prop.dps]);
          this.notifyPropertyChanged(prop);
        }
      }
    }).bind(this));
  }

  run() {
    if ('dead' in this) return;
    this.tuyapi.find({timeout: 10}).then((() => {
      this.tuyapi.connect();
    }).bind(this)).catch((() => {
      this.run();
    }).bind(this));
  }

  stop() {
    console.log(this.id, 'Stop!');
    this.dead = true;
  }

  connectedNotify(stat) {
    super.connectedNotify(stat);
    if (!('connected' in this)) {
      this.connected = stat;
      return;
    }
    if (this.connected !== stat) {
      if (stat) {
        console.log(this.id, 'Connected!');
      } else {
        console.log(this.id, 'Disconnected!');
      }
      this.connected = stat;
    }
  }
}

module.exports = LampDevice;
