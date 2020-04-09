'use strict';

const Property = require('gateway-addon').Property;

class TuyaProperty extends Property {
  constructor(device, name, desc, cnf) {
    super(device, name, desc);
    this.dps = cnf.dps;
    this.default_dps = cnf.default_dps;
    this.setcb = cnf.setcb;
    this.updatecb = cnf.updatecb;
  }

  update(value) {
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    if (!this.dps) {
      this.dps = this.default_dps;
      this.device.ownconf.dps[this.name] = this.dps;
      this.device.saveOwnConfig();
    }
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    }).bind(this));
  }

  autodetect(obj) {
    let dps = this.autodps(obj);
    if (dps) {
      console.log(this.device.id, `Autodetect dps for property ${this.name}`, dps);
    } else {
      dps = this.default_dps;
      console.log(this.device.id, `Set default dps for property ${this.name}`, dps);
    }
    this.dps = dps;
    this.device.ownconf.dps[this.name] = dps;
    delete obj[dps];
  }

  autodps(_obj) {
    return null;
  }
}

module.exports = TuyaProperty;
