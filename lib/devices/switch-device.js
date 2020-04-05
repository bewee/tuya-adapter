'use strict';

const Device = require('gateway-addon').Device;
const TuyAPI = require('tuyapi');
const PowerProperty = require('../properties/power-property');

class SwitchDevice extends Device {
  constructor(adapter, tid, key, name, gangs) {
    super(adapter, `tuya-${tid}`);

    this.tid = tid;
    this.key = key;

    this.name = name ? name : 'Switch';
    this['@type'] = ['OnOffSwitch'];
    this.description = 'tuya switch';

    if (gangs == 1)
      this.properties.set(`on`, new PowerProperty(this, 1));
    else
      for (let i = 1; i <= gangs; i++)
        this.properties.set(`on${i}`, new PowerProperty(this, i, null, null, i));

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
      const oldconnected = this.connected;
      this.connectedNotify(false);
      if ('dead' in this) return;
      setTimeout((() => {
        this.tuyapi.connect().catch((err) => {
          if (oldconnected)
            console.error(this.id, 'Error!', err);
        });
      }).bind(this), this.adapter.config.timeout*1000);
    });
    this.tuyapi.on('error', (err) => {
      console.log(this.id, 'Error', err);
    });
    this.tuyapi.on('data', ((data) => {
      console.log(this.id, 'Data', data);
      if (data && data.dps) {
        for (const [_key, prop] of this.properties) {
          if (prop.dps in data.dps) {
            prop.update(data.dps[prop.dps]);
            this.notifyPropertyChanged(prop);
          }
        }
      } else {
        if (data !== 'json obj data unvalid') {
          console.error(this.id, 'Error! Please check your key value!');
          this.stop();
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

module.exports = SwitchDevice;
