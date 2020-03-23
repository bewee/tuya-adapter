'use strict';

const {_Adapter, _Database, _Device, Property} = require('gateway-addon');

class BrightnessProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, 'brightness', {
      label: 'Brightness',
      type: 'integer',
      '@type': 'BrightnessProperty',
      value: 1,
      min: 1,
      max: 100,
      multipleOf: 0.1,
    });
    this.dps = dps;
    this.setcb = setcb;
    this.updatecb = updatecb;
  }

  update(value) {
    this.setCachedValueAndNotify(value/10.0);
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.dps !== null) this.device.tuyapi.set({dps: this.dps, set: parseInt(value*10)});
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).catch(((err) => {
        if (err.startsWith('Value is not a multiple of: ')) {
          const v = Math.round(value*10)/10.0;
          if (this.dps !== null) this.device.tuyapi.set({dps: this.dps, set: parseInt(value*10)});
          if (this.setcb) this.setcb(value);
          resolve(v);
          return;
        }
        reject(err);
      }).bind(this));
    }).bind(this));
  }
}

module.exports = BrightnessProperty;
