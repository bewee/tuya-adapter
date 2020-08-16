'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const PowerMonitorProperty = require('../properties/plug-energy-monitor/power-monitor-property');
const CurrentMonitorProperty = require('../properties/plug-energy-monitor/current-monitor-property');
const VoltageMonitorProperty = require('../properties/plug-energy-monitor/voltage-monitor-property');

class PlugEnergyMonitorDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    if (!('sockets' in this.ownconf)) {
      this.ownconf.sockets = 1;
    }

    if (this.ownconf.sockets > 1)
      this.name = cnf.name&&cnf.name!='' ? cnf.name : `Plug with energy monitoring (${this.ownconf.sockets} sockets)`;
    this['@type'] = ['SmartPlug'];

    if (this.ownconf.sockets == 1)
      this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));
    else
      for (let i = 1; i <= this.ownconf.sockets; i++)
        this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps[`on${i}`], default_dps: i, num: i}));

    this.addProperty(new CurrentMonitorProperty(this, {dps: this.ownconf.dps.currentMonitor, default_dps: 18}));
    this.addProperty(new PowerMonitorProperty(this, {dps: this.ownconf.dps.powerMonitor, default_dps: 19}));
    this.addProperty(new VoltageMonitorProperty(this, {dps: this.ownconf.dps.voltageMonitor, default_dps: 20}));
  }
}

module.exports = PlugEnergyMonitorDevice;
