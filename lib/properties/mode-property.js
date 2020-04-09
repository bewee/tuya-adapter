'use strict';

const TuyaProperty = require('./tuya-property');

class ModeProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, 'mode', {
      label: 'Mode',
      type: 'string',
      enum: cnf.modestxt?cnf.modestxt:cnf.modes,
      value: '',
    }, cnf);
    this.modes = cnf.modes;
    this.modestxt = cnf.modestxt;
  }

  update(value) {
    super.update(value);
    if (this.modestxt)
      this.setCachedValueAndNotify(this.modestxt[this.modes.indexOf(value)]);
    else
      this.setCachedValueAndNotify(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.modestxt)
          this.device.tuyapi.set({dps: this.dps, set: this.modes[this.modestxt.indexOf(value)]});
        else
          this.device.tuyapi.set({dps: this.dps, set: value});
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    }).bind(this));
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (this.modes.includes(obj[x])));
  }
}

module.exports = ModeProperty;
