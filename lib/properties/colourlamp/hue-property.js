'use strict';

const Property = require('gateway-addon').Property;

class HueProperty extends Property {
  constructor(device) {
    super(device, 'hue', {
      label: 'Hue',
      type: 'number',
      '@type': 'LevelProperty',
      min: 0,
      max: 359,
      value: 0,
    });
  }

  setCachedValue(value) {
    super.setCachedValue(Math.round(value));
  }

  setValue(value) {
    return new Promise(((resolve) => {
      super.setValue(value).then((updatedValue) => {
        this.device.properties.get('colour').updateHue(value);
        resolve(updatedValue);
      }).catch((err) => {
        console.error(`${this.device.properties.get('colour').id}/${this.name}`, 'Error during setValue', err);
      });
    }).bind(this));
  }
}

module.exports = HueProperty;
