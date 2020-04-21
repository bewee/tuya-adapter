'use strict';

const TuyaProperty = require('./tuya-property');
const remap = require('../helpers').remap;

class LighttemperatureProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, 'lighttemperature', {
      label: 'Light temperature',
      type: 'integer',
      '@type': 'ColorTemperatureProperty',
      value: 0,
      min: 2500,
      max: 6500,
    }, cnf);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify(remap(value, this.device.ownconf.minlighttemperature, this.device.ownconf.maxlighttemperature, 2500, 6500, 1));
  }

  setValue(value) {
    return new Promise(((resolve) => {
      super.setValue(value).then((updatedValue) => {
        this.setTuyapi(updatedValue);
        resolve(updatedValue);
      }).catch(((err) => {
        console.error(this.id, 'Error during setValue', err);
      }).bind(this));
    }).bind(this));
  }

  setTuyapi(value) {
    const v = remap(value, 2500, 6500, this.device.ownconf.minlighttemperature, this.device.ownconf.maxlighttemperature, 1);
    const cmd = {dps: this.dps, set: v};
    console.debug(this.id, 'Execute tuyapi command', cmd);
    this.device.tuyapi.set(cmd);
    return v;
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
  }
}

module.exports = LighttemperatureProperty;
