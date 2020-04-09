'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const BrightnessProperty = require('../properties/brightness-property');
const LighttemperatureProperty = require('../properties/lighttemperature-property');

class LampDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this['@type'] = ['Light', 'OnOffSwitch'];

    if (!this.ownconf.maxbrightness) {
      this.ownconf.maxbrightness = 1000;
      this.saveOwnConfig();
    }
    if (!this.ownconf.maxlighttemperature) {
      this.ownconf.maxlighttemperature = 1000;
      this.saveOwnConfig();
    }

    this.addProperty(new PowerProperty(this, this.ownconf.dps.on, 1));
    this.addProperty(new BrightnessProperty(this, this.ownconf.dps.brightness, 2));
    this.addProperty(new LighttemperatureProperty(this, this.ownconf.dps.lighttemperature, 3));
  }
}

module.exports = LampDevice;
