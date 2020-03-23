'use strict';

const Property = require('gateway-addon').Property;

class NumberProperty extends Property {
  constructor(device, dps, setcb, updatecb) {
    super(device, dps, {
      label: dps,
      type: 'number',
      value: 0,
    });
    this.dps = dps;
    this.setcb = setcb;
    this.updatecb = updatecb;
  }

  update(value) {
    this.setCachedValueAndNotify(value);
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.dps) this.device.tuyapi.set({dps: this.dps, set: value});
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    }).bind(this));
  }
}

module.exports = NumberProperty;
