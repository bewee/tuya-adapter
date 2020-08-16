'use strict';

const TuyaProperty = require('../tuya-property');

class CurrentMonitorProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, 'currentMonitor', {
      label: 'Electric Current',
      type: 'number',
      '@type': 'CurrentProperty',
      value: 0,
    }, cnf);
  }

  update(value) {
    super.update(value);
    value = value/1000.0; //plug sends current in unit mA
    this.setCachedValueAndNotify(value);
  }
}

module.exports = CurrentMonitorProperty;
