'use strict';

const Property = require('gateway-addon').Property;

class TuyaProperty extends Property {
  constructor(device, name, desc, cnf) {
    super(device, name, desc);
    this.dps = cnf.dps;
    this.default_dps = cnf.default_dps;
    this.setcb = cnf.setcb;
    this.updatecb = cnf.updatecb;
    this.visible = typeof desc.visible !== 'undefined' ? desc.visible : true;
    this.id = `${this.device.id}/${this.name}`;
  }

  update(value) {
    console.debug(this.id, 'update(', value, ')');
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    if (!this.dps) {
      this.dps = this.default_dps;
      console.info(this.id, 'Set default dps!', this.dps);
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
      console.info(this.id, 'Autodetect dps', dps);
    } else {
      dps = this.default_dps;
      console.info(this.id, 'Set default dps', dps);
    }
    this.dps = parseInt(dps);
    this.device.ownconf.dps[this.name] = this.dps;
    delete obj[dps];
  }

  autodps(_obj) {
    return null;
  }

  asDict() {
    const dict = super.asDict();
    dict.visible = this.visible;
    return dict;
  }
}

module.exports = TuyaProperty;
