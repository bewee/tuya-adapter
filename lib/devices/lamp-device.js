'use strict';

const Device = require('gateway-addon').Device;
const TuyAPI = require('tuyapi');
const PowerProperty = require('../properties/power-property');
const BrightnessProperty = require('../properties/brightness-property');
const LighttemperatureProperty = require('../properties/lighttemperature-property');

class LampDevice extends Device {
  constructor(adapter, conf) {
    super(adapter, `tuya-${conf.id}`);

    this.tid = conf.id;
    this.key = conf.key;
    this.maxval = conf.maxval;

    this.name = conf.name&&conf.name!='' ? conf.name : 'Lamp';
    this['@type'] = ['Light', 'OnOffSwitch'];
    this.description = 'tuya lamp';

    this.properties.set('on', new PowerProperty(this, 1));
    this.properties.set('brightness', new BrightnessProperty(this, 2));
    this.properties.set('lighttemperature', new LighttemperatureProperty(this, 3));

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
    let firstdata = true;
    this.tuyapi.on('data', ((data) => {
      console.log(this.id, 'Data', data);
      if (data && data.dps) {
        if (firstdata) {
          firstdata = false;
          const obj = JSON.parse(JSON.stringify(data.dps));
          {
            const dps = Object.keys(obj).find((x) => (typeof (obj[x]) === 'boolean'));
            if (dps) {
              console.log(this.id, 'Autodetect dps for property on', dps);
              this.properties.get('on').dps = dps;
              delete obj[dps];
            }
          }
          {
            const dps = Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
            if (dps) {
              console.log(this.id, 'Autodetect dps for property brightness', dps);
              this.properties.get('brightness').dps = dps;
              delete obj[dps];
            }
          }
          {
            const dps = Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
            if (dps) {
              console.log(this.id, 'Autodetect dps for property lighttemperature', dps);
              this.properties.get('lighttemperature').dps = dps;
              delete obj[dps];
            }
          }
        }
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

module.exports = LampDevice;
