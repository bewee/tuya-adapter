'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const BrightnessProperty = require('../properties/brightness-property');
const LevelProperty = require('../properties/level-property');

class FireplaceHeaterDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this['@type'] = ['Light'];

    this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    this.addProperty(new LevelProperty(this, {dps: this.ownconf.dps.on, default_dps: 101}));
    this.addProperty(new BrightnessProperty(this, {dps: this.ownconf.dps.on, default_dps: 102}));
  }
}

module.exports = FireplaceHeaterDevice;
