'use strict';

const TuyaProperty = require('./tuya-property');

class ReadOnlyNumberProperty extends TuyaProperty {
  constructor(device, name, cnf) {
    super(device, name, {
      label: cnf.name?cnf.name:cnf.dps,
      type: 'number',
      value: 0,
    }, cnf);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(value);
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
  }
}

module.exports = ReadOnlyNumberProperty;
