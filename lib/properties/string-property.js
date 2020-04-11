'use strict';

const TuyaProperty = require('./tuya-property');

class StringProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, cnf.name?cnf.name:cnf.dps, {
      label: cnf.name?cnf.name:cnf.dps,
      type: 'string',
      value: '',
    }, cnf);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(value);
  }

  setValue(value) {
    return new Promise(((resolve) => {
      super.setValue(value).then((updatedValue) => {
        const cmd = {dps: this.dps, set: value};
        console.debug(this.id, 'Execute tuyapi command', cmd);
        this.device.tuyapi.set(cmd);
        resolve(updatedValue);
      }).catch((err) => {
        console.error(this.id, 'Error during setValue', err);
      });
    }).bind(this));
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'string'));
  }
}

module.exports = StringProperty;
