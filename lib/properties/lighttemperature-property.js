'use strict';

const TuyaProperty = require('./tuya-property');

class LighttemperatureProperty extends TuyaProperty {
  constructor(device, dps, default_dps, setcb, updatecb) {
    super(device, 'lighttemperature', {
      label: 'Light temperature',
      type: 'integer',
      '@type': 'ColorTemperatureProperty',
      value: 0,
      min: 2500,
      max: 6500,
    }, dps, default_dps, setcb, updatecb);
  }

  update(value) {
    super.update(value);
    this.setCachedValueAndNotify((value*1000/this.device.ownconf.maxlighttemperature)*4+2500);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then(() => {
        resolve(this.setTuyapi(value));
      }).catch(((err) => {
        if (err.startsWith('Value is not a multiple of: '))
          resolve(this.setTuyapi(value));
        else
          reject(err);
      }).bind(this));
    }).bind(this));
  }

  setTuyapi(value) {
    const v = parseInt(((value-2500)/4)*this.device.ownconf.maxlighttemperature/1000);
    this.device.tuyapi.set({dps: this.dps, set: v});
    return v;
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'number'));
  }
}

module.exports = LighttemperatureProperty;
