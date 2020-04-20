'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const LevelProperty = require('../properties/level-property');

class DimmerDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this['@type'] = ['MultiLevelSwitch', 'OnOffSwitch'];

    if (!this.ownconf.minlevel || !this.ownconf.maxlevel) {
      if (!this.ownconf.minlevel) {
        console.info(this.id, 'Set minlevel to default 0');
        this.ownconf.minlevel = 0;
      }
      if (!this.ownconf.maxlevel) {
        console.info(this.id, 'Set maxlevel to default 1000');
        this.ownconf.maxlevel = 1000;
      }
      this.saveOwnConfig();
    }

    this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    this.addProperty(new LevelProperty(this, {dps: this.ownconf.dps.level, default_dps: 2}));
  }
}

module.exports = DimmerDevice;
