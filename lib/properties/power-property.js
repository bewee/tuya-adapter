'use strict';

const TuyaProperty = require('./tuya-property');

class PowerProperty extends TuyaProperty {
  constructor(device, cnf) {
    if (cnf.num)
      super(device, `on${cnf.num}`, {
        '@type': 'OnOffProperty',
        label: `On/Off ${cnf.num}`,
        type: 'boolean',
        value: false,
      }, cnf);
    else
      super(device, 'on', {
        '@type': 'OnOffProperty',
        label: 'On/Off',
        type: 'boolean',
        value: false,
      }, cnf);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(value);
  }

  setValue(value) {
    return new Promise((resolve, reject) => {
      super.setValue(value).then(((updatedValue) => {
        this.device.tuyapi.set({dps: this.dps, set: value});
        resolve(updatedValue);
      }).bind(this)).catch((err) => {
        reject(err);
      });
    });
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'boolean'));
  }

}

module.exports = PowerProperty;
