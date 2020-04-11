'use strict';

const TuyaProperty = require('./tuya-property');

class PowerProperty extends TuyaProperty {
  constructor(device, cnf) {
    if (cnf.num)
      super(device, `on${cnf.num}`, {
        '@type': 'OnOffProperty',
        label: `On/Off ${cnf.num}`,
        type: 'boolean',
        value: false,
      }, cnf);
    else
      super(device, 'on', {
        '@type': 'OnOffProperty',
        label: 'On/Off',
        type: 'boolean',
        value: false,
      }, cnf);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(value);
  }

  setValue(value) {
    return new Promise((resolve) => {
      super.setValue(value).then(((updatedValue) => {
        const cmd = {dps: this.dps, set: value};
        console.debug(this.id, 'Execute tuyapi command', cmd);
        this.device.tuyapi.set(cmd);
        resolve(updatedValue);
      }).bind(this)).catch((err) => {
        console.error(this.id, 'Error during setValue', err);
      });
    });
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'boolean'));
  }

}

module.exports = PowerProperty;
