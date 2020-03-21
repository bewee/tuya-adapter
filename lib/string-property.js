'use strict';

const {_Adapter, _Database, _Device, Property} = require('gateway-addon');

class StringProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, dps, {
      label: dps,
      type: 'string',
      value: '',
    });
    this.device = device;
    this.dps = dps;
    this.setcb = setcb;
    this.updatecb = updatecb;
  }

  update(value) {
    this.setCachedValue(value);
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.dps) this.device.tuyapi.set({dps: this.dps, set: value});
        this.device.notifyPropertyChanged(this);
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    }).bind(this));
  }
}

module.exports = StringProperty;