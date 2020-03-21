'use strict';

const {_Adapter, _Database, _Device, Property} = require('gateway-addon');

class BrightnessProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, dps, {
      label: 'Brightness',
      type: 'integer',
      '@type': 'BrightnessProperty',
      value: 1,
      min: 1,
      max: 100,
      //multipleOf: 0.1,
    });
    this.device = device;
    this.dps = dps;
    this.setcb = setcb;
    this.updatecb = updatecb;
  }

  update(value) {
    this.setCachedValue(value/10.0);
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.dps) this.device.tuyapi.set({dps: this.dps, set: parseInt(value*10)});
        this.device.notifyPropertyChanged(this);
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    }).bind(this));
  }
}

module.exports = BrightnessProperty;
