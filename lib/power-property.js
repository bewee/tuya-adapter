'use strict';

const {_Adapter, _Database, _Device, Property} = require('gateway-addon');

class PowerProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, 'on', {
      '@type': 'OnOffProperty',
      label: 'On/Off',
      type: 'boolean',
      value: false,
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
    return new Promise((resolve, reject) => {
      super.setValue(value).then(((updatedValue) => {
        if (this.dps) this.device.tuyapi.set({dps: this.dps, set: value});
        this.device.notifyPropertyChanged(this);
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).bind(this)).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = PowerProperty;
