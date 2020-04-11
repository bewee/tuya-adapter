'use strict';

const TuyaProperty = require('./tuya-property');

class BrightnessProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, 'brightness', {
      label: 'Brightness',
      type: 'integer',
      '@type': 'BrightnessProperty',
      value: 1,
      min: 1,
      max: 100,
      multipleOf: 0.1,
    }, cnf);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(value/this.device.ownconf.maxbrightness*100);
  }

  setValue(value) {
    return new Promise(((resolve) => {
      super.setValue(value).then(() => {
        resolve(this.setTuyapi(value));
      }).catch(((err) => {
        if (err.startsWith('Value is not a multiple of: '))
          resolve(this.setTuyapi(value));
        else
          console.error(this.id, 'Error during setValue', err);
      }).bind(this));
    }).bind(this));
  }

  setTuyapi(value) {
    const v = parseInt(value*this.device.ownconf.maxbrightness/100);
    const cmd = {dps: this.dps, set: v};
    console.debug(this.id, 'Execute tuyapi command', cmd);
    this.device.tuyapi.set(cmd);
    return v;
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
  }
}

module.exports = BrightnessProperty;
