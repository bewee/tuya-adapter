'use strict';

const TuyaProperty = require('../tuya-property');

class PowerMonitorProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, 'powerMonitor', {
      label: 'Electric Power',
      type: 'number',
      '@type': 'InstantaneousPowerProperty',
      value: 0,
    }, cnf);
  }

  update(value) {
    super.update(value);
    value = value/10.0; //plug sends power in unit Watt * 10
    this.setCachedValueAndNotify(value);
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
  }
}

module.exports = PowerMonitorProperty;
