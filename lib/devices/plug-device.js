'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');

class PlugDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    if (!('sockets' in this.ownconf)) {
      this.ownconf.sockets = 1;
    }

    if (this.ownconf.sockets > 1)
      this.name = cnf.name&&cnf.name!='' ? cnf.name : `Plug (${this.ownconf.sockets} sockets)`;
    this['@type'] = ['SmartPlug'];

    if (this.ownconf.sockets == 1)
      this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    else
      for (let i = 1; i <= this.ownconf.sockets; i++)
        this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps[`on${i}`], default_dps: i, num: i}));
  }
}

module.exports = PlugDevice;
