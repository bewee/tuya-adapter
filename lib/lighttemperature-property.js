'use strict';

const {_Adapter, _Database, _Device, Property} = require('gateway-addon');

class LighttemperatureProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, dps, {
      label: 'Light temperature',
      type: 'integer',
      '@type': 'ColorTemperatureProperty',
      value: 0,
      min: 0,
      max: 100,
      //multipleOf: 0.1,
      unit: 'percent',
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

module.exports = LighttemperatureProperty;
