'use strict';

const TuyaProperty = require('./tuya-property');

class BrightnessProperty extends TuyaProperty {
  constructor(device, dps, default_dps, setcb, updatecb) {
    super(device, 'brightness', {
      label: 'Brightness',
      type: 'integer',
      '@type': 'BrightnessProperty',
      value: 1,
      min: 1,
      max: 100,
      multipleOf: 0.1,
    }, dps, default_dps, setcb, updatecb);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(value/this.device.ownconf.maxbrightness*100);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then(() => {
        resolve(this.setTuyapi(value));
      }).catch(((err) => {
        if (err.startsWith('Value is not a multiple of: '))
          resolve(this.setTuyapi(value));
        else
          reject(err);
      }).bind(this));
    }).bind(this));
  }

  setTuyapi(value) {
    const v = parseInt(value*this.device.ownconf.maxbrightness/100);
    this.device.tuyapi.set({dps: this.dps, set: v});
    return v;
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
  }
}

module.exports = BrightnessProperty;
