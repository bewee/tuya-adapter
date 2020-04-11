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
    const setcb = this.setcb; this.setcb = null;
    return new Promise(((resolve) => {
      super.setValue(value).then((updatedValue) => {
        this.setcb = setcb;
        const cmd = this.modestxt ?
          {dps: this.dps, set: this.modes[this.modestxt.indexOf(value)]} :
          {dps: this.dps, set: value};
        if (this.setcb) this.setcb(cmd.set);
        console.debug(this.id, 'Execute tuyapi command', cmd);
        this.device.tuyapi.set(cmd);
        resolve(updatedValue);
      }).catch((err) => {
        this.setcb = setcb;
        console.error(this.id, 'Error during setValue', err);
      });
    }).bind(this));
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (this.modes.includes(obj[x])));
  }
}

module.exports = ModeProperty;
