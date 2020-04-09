'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');

class PlugDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this['@type'] = ['SmartPlug', 'OnOffSwitch'];

    this.addProperty(new PowerProperty(this, this.ownconf.dps.on, 1));
  }
}

module.exports = PlugDevice;
