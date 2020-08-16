'use strict';

const TuyaProperty = require('../tuya-property');

class VoltageMonitorProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, 'voltageMonitor', {
      label: 'Voltage',
      type: 'number',
      '@type': 'VoltageProperty',
      value: 0,
    }, cnf);
  }

  update(value) {
    super.update(value);
    value = value/10.0; //plug sends power in unit Volt * 10
    this.setCachedValueAndNotify(value);
  }
}

module.exports = VoltageMonitorProperty;
