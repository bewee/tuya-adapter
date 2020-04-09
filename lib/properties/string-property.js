'use strict';

const TuyaProperty = require('./tuya-property');

class StringProperty extends TuyaProperty {
  constructor(device, dps, default_dps, setcb, updatecb) {
    super(device, dps, {
      label: dps,
      type: 'string',
      value: '',
    }, dps, default_dps, setcb, updatecb);
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
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'string'));
  }
}

module.exports = StringProperty;
