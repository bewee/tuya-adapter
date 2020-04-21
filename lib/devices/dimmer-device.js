'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const LevelProperty = require('../properties/level-property');

class DimmerDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this['@type'] = ['MultiLevelSwitch', 'OnOffSwitch'];

    this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    this.addProperty(new LevelProperty(this, {dps: this.ownconf.dps.level, default_dps: 2}));
  }
}

module.exports = DimmerDevice;
