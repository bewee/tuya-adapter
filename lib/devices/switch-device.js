'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');

class SwitchDevice extends TuyaDevice {
  constructor(adapter, cnf, cid, gangs) {
    super(adapter, cnf, cid);

    if (gangs > 1)
      this.name = cnf.name&&cnf.name!='' ? cnf.name : `${gangs} gang switch`;
    this['@type'] = ['OnOffSwitch'];

    if (gangs == 1)
      this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    else
      for (let i = 1; i <= gangs; i++)
        this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps[`on${i}`], default_dps: i, num: i}));
  }
}

module.exports = SwitchDevice;
