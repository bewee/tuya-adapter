'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');

class SwitchDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    if (!('gangs' in this.ownconf)) {
      this.ownconf.gangs = 1;
    }

    if (this.ownconf.gangs > 1)
      this.name = cnf.name&&cnf.name!='' ? cnf.name : `${this.ownconf.gangs} gang switch`;
    this['@type'] = ['OnOffSwitch'];

    if (this.ownconf.gangs == 1)
      this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    else
      for (let i = 1; i <= this.ownconf.gangs; i++)
        this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps[`on${i}`], default_dps: i, num: i}));
  }
}

module.exports = SwitchDevice;
