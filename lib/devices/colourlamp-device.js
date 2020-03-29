'use strict';

const Device = require('gateway-addon').Device;
const TuyAPI = require('tuyapi');
const PowerProperty = require('../properties/power-property');
const ModeProperty = require('../properties/mode-property');
const BrightnessProperty = require('../properties/brightness-property');
const LighttemperatureProperty = require('../properties/lighttemperature-property');
const ColourProperty = require('../properties/colourlamp/colour-property');
const HueProperty = require('../properties/colourlamp/hue-property');
const SaturationProperty = require('../properties/colourlamp/saturation-property');
const LightnessProperty = require('../properties/colourlamp/lightness-property');

class ColourLampDevice extends Device {
  constructor(adapter, tid, key, name) {
    super(adapter, `tuya-${tid}`);

    this.tid = tid;
    this.key = key;

    this.name = name ? name : 'Lamp';
    this['@type'] = ['Light', 'OnOffSwitch'];
    this.description = 'tuya colour lamp';

    this.properties.set('on', new PowerProperty(this, 20));

    const modecb = ((mode) => {
      switch (mode) {
        case 'white':
          this.setVisibility(['on', 'mode', 'brightness', 'lighttemperature']);
          break;
        case 'colour':
          this.setVisibility(['on', 'mode', 'colour', 'hue', 'saturation', 'lightness']);
          break;
      }
      this.adapter.handleDeviceUpdated(this);
    }).bind(this);
    this.properties.set('mode', new ModeProperty(this, 21, ['white', 'colour'], ['White', 'Colour'], modecb, modecb));

    this.properties.set('brightness', new BrightnessProperty(this, 22, 24));
    this.properties.set('lighttemperature', new LighttemperatureProperty(this, 23));
    this.properties.set('colour', new ColourProperty(this, 24));
    this.properties.set('hue', new HueProperty(this));
    this.properties.set('saturation', new SaturationProperty(this));
    this.properties.set('lightness', new LightnessProperty(this));

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

module.exports = ColourLampDevice;
