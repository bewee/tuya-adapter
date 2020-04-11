'use strict';

const TuyaProperty = require('./tuya-property');

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
    this.setCachedValueAndNotify((value*1000/this.device.ownconf.maxlighttemperature)*4+2500);
  }

  setValue(value) {
    return new Promise(((resolve) => {
      super.setValue(value).then(() => {
        resolve(this.setTuyapi(value));
      }).catch(((err) => {
        if (err.startsWith('Value is not a multiple of: '))
          resolve(this.setTuyapi(value));
        else
          console.error(this.id, 'Error during setValue', err);
      }).bind(this));
    }).bind(this));
  }

  setTuyapi(value) {
    const v = parseInt(((value-2500)/4)*this.device.ownconf.maxlighttemperature/1000);
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
