'use strict';

const Device = require('gateway-addon').Device;
const TuyAPI = require('tuyapi');
const PowerProperty = require('../properties/power-property');
const BrightnessProperty = require('../properties/brightness-property');
const LighttemperatureProperty = require('../properties/lighttemperature-property');

class LampDevice extends Device {
  constructor(adapter, tid, key) {
    super(adapter, `tuya-${tid}`);

    this.tid = tid;
    this.key = key;

    this.name = 'Lamp';
    this['@type'] = ['Light', 'OnOffSwitch'];
    this.description = 'tuya lamp';

    this.properties.set('on', new PowerProperty(this, 20));
    this.properties.set('brightness', new BrightnessProperty(this, 22, 24));
    this.properties.set('lighttemperature', new LighttemperatureProperty(this, 23));

    this.tuyapi = new TuyAPI({
      id: this.tid,
      key: this.key,
    });
    this.tuyapi._responseTimeout = this.adapter.config.timeout/2;
    this.tuyapi._connectTimeout = this.adapter.config.timeout/2;
    this.tuyapi._pingPongPeriod = this.adapter.config.timeout;
    this.tuyapi.on('connected', () => {
      this.connectedNotify(true);
    });
    this.tuyapi.on('disconnected', () => {
      this.connectedNotify(false);
      if ('dead' in this) return;
      setTimeout((() => {
        this.tuyapi.connect();
      }).bind(this), this.adapter.config.timeout*1000);
    });
    this.tuyapi.on('error', (err) => {
      console.log(this.id, 'Error', err);
    });
    this.tuyapi.on('data', ((data) => {
      console.log(this.id, 'Data', data);
      for (const [_key, prop] of this.properties) {
        if (prop.dps in data.dps) {
          prop.update(data.dps[prop.dps]);
          this.notifyPropertyChanged(prop);
        }
      }
    }).bind(this));
  }

  setVisibility(list) {
    for (const [key, prop] of this.properties) {
      if (list.includes(key))
        prop.visible = true;
      else
        prop.visible = false;
    }
  }

  run() {
    if ('dead' in this) return;
    this.tuyapi.find({timeout: this.adapter.config.timeout}).then((() => {
      this.tuyapi.connect();
    }).bind(this)).catch((() => {
      this.run();
    }).bind(this));
  }

  stop() {
    console.log(this.id, 'Stop!');
    this.dead = true;
    this.tuyapi.disconnect();
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
