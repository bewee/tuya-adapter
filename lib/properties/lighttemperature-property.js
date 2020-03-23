'use strict';

const Property = require('gateway-addon').Property;

class LighttemperatureProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, 'lighttemperature', {
      label: 'Light temperature',
      type: 'integer',
      '@type': 'ColorTemperatureProperty',
      value: 0,
      min: 2500,
      max: 6500,
    });
    this.dps = dps;
    this.setcb = setcb;
    this.updatecb = updatecb;
  }

  update(value) {
    this.setCachedValueAndNotify(value*4+2500);
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.dps) this.device.tuyapi.set({dps: this.dps, set: parseInt((value-2500)/4)});
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).catch(((err) => {
        reject(err);
      }).bind(this));
    }).bind(this));
  }
}

module.exports = LighttemperatureProperty;
