'use strict';

const TuyaProperty = require('./tuya-property');

class NumberProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, cnf.name?cnf.name:cnf.dps, {
      label: cnf.name?cnf.name:cnf.dps,
      type: 'number',
      value: 0,
    }, cnf);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        this.device.tuyapi.set({dps: this.dps, set: value});
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    }).bind(this));
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
  }
}

module.exports = NumberProperty;
