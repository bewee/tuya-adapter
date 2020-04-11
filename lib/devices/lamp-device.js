'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const BrightnessProperty = require('../properties/brightness-property');
const LighttemperatureProperty = require('../properties/lighttemperature-property');

class LampDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this['@type'] = ['Light', 'OnOffSwitch'];

    if (!this.ownconf.minbrightness || !this.ownconf.maxbrightness || !this.ownconf.minlighttemperature || !this.ownconf.maxlighttemperature) {
      if (!this.ownconf.minbrightness) {
        console.info(this.id, 'Set minbrightness to default 0');
        this.ownconf.minbrightness = 0;
      }
      if (!this.ownconf.maxbrightness) {
        console.info(this.id, 'Set maxbrightness to default 1000');
        this.ownconf.maxbrightness = 1000;
      }
      if (!this.ownconf.minlighttemperature) {
        console.info(this.id, 'Set minlighttemperature to default 0');
        this.ownconf.minlighttemperature = 0;
      }
      if (!this.ownconf.maxlighttemperature) {
        console.info(this.id, 'Set maxlighttemperature to default 1000');
        this.ownconf.maxlighttemperature = 1000;
      }
      this.saveOwnConfig();
    }

    this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    this.addProperty(new BrightnessProperty(this, {dps: this.ownconf.dps.brightness, default_dps: 2}));
    this.addProperty(new LighttemperatureProperty(this, {dps: this.ownconf.dps.lighttemperature, default_dps: 3}));
  }
}

module.exports = LampDevice;
