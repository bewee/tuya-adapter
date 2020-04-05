'use strict';

const Property = require('gateway-addon').Property;

class PowerProperty extends Property {
  constructor(device, dps, setcb, updatecb, num) {
    if (num)
      super(device, `on${num}`, {
        '@type': 'OnOffProperty',
        label: `On/Off ${num}`,
        type: 'boolean',
        value: false,
      });
    else
      super(device, 'on', {
        '@type': 'OnOffProperty',
        label: 'On/Off',
        type: 'boolean',
        value: false,
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
    return new Promise((resolve, reject) => {
      super.setValue(value).then(((updatedValue) => {
        if (this.dps) this.device.tuyapi.set({dps: this.dps, set: value});
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).bind(this)).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = PowerProperty;
