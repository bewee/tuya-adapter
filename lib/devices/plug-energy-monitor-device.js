'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const ReadOnlyNumberProperty = require('../properties/read-only-number-property');

class PlugEnergyMonitorDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    if (!('sockets' in this.ownconf)) {
      this.ownconf.sockets = 1;
    }

    if (this.ownconf.sockets > 1)
      this.name = cnf.name&&cnf.name!='' ? cnf.name : `Plug with energy monitoring`;
    this['@type'] = ['SmartPlug'];

    if (this.ownconf.sockets == 1){
      this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
      this.addProperty(new ReadOnlyNumberProperty(this, "unknown", {dps: this.ownconf.dps.unknown, default_dps: 9}));
      this.addProperty(new ReadOnlyNumberProperty(this, "current", {dps: this.ownconf.dps.current, default_dps: 18}));
      this.addProperty(new ReadOnlyNumberProperty(this, "power", {dps: this.ownconf.dps.power, default_dps: 19}));
      this.addProperty(new ReadOnlyNumberProperty(this, "potential", {dps: this.ownconf.dps.potential, default_dps: 20}));
    }
  }
}

module.exports = PlugEnergyMonitorDevice;
