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
      this.addProperty(new PowerProperty(this, this.ownconf.dps.on, 1));
    else
      for (let i = 1; i <= gangs; i++)
        this.addProperty(new PowerProperty(this, this.ownconf.dps[`on${i}`], i, null, null, i));
  }
}

module.exports = SwitchDevice;
