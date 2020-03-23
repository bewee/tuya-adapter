'use strict';

const Property = require('gateway-addon').Property;

class LighttemperatureProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, 'lighttemperature', {
      label: 'Light temperature',
      type: 'integer',
      '@type': 'ColorTemperatureProperty',
      value: 0,
      min: 0,
      max: 100,
      multipleOf: 0.1,
      unit: 'percent',
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
        if (this.dps) this.device.tuyapi.set({dps: this.dps, set: parseInt(value*10)});
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

module.exports = LighttemperatureProperty;
