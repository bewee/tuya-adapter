'use strict';

const Property = require('gateway-addon').Property;

class LightnessProperty extends Property {
  constructor(device) {
    super(device, 'lightness', {
      label: 'Lightness',
      type: 'number',
      '@type': 'LevelProperty',
      min: 1,
      max: 100,
      value: 0,
      multipleOf: 0.1,
      unit: 'percent',
    });
  }

  setCachedValue(value) {
    const v = Math.round(value*10)/10.0;
    super.setCachedValue(v);
  }

  setValue(value) {
    return new Promise(((resolve) => {
      super.setValue(value).then((updatedValue) => {
        this.device.properties.get('colour').updateLightness(value);
        resolve(updatedValue);
      }).catch(((err) => {
        if (err.startsWith('Value is not a multiple of: ')) {
          const val = Math.round(value/0.1)*0.1;
          this.device.properties.get('colour').updateLightness(val);
          resolve(val);
          return;
        }
        console.error(`${this.device.properties.get('colour').id}/${this.name}`, 'Error during setValue', err);
      }).bind(this));
    }).bind(this));
  }
}

module.exports = LightnessProperty;
