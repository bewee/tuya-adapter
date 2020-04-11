'use strict';

const TuyaDevice = require('./tuya-device');
const StringProperty = require('../properties/string-property');
const NumberProperty = require('../properties/number-property');
const BooleanProperty = require('../properties/boolean-property');

class GenericDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this.name = cnf.name&&cnf.name!='' ? cnf.name : 'Device';
    this.description = `Tuya Device`;
    this['@type'] = [];

    this.tuyapi.on('data', ((data) => {
      console.debug(this.id, 'Data', data);
      if (data && data.dps) {
        for (const dps in data.dps) {
          if (!this.properties.get(dps)) {
            console.debug(this.id, 'Datatype of dps', dps, 'is', typeof data.dps[dps]);
            switch (typeof data.dps[dps]) {
              case 'boolean':
                this.addProperty(new BooleanProperty(this, {dps: dps}));
                break;
              case 'number':
                this.addProperty(new NumberProperty(this, {dps: dps}));
                break;
              default:
                this.addProperty(new StringProperty(this, {dps: dps}));
                break;
            }
          }
          const prop = this.properties.get(dps);
          prop.update(data.dps[dps]);
          this.notifyPropertyChanged(prop);
        }
      } else {
        if (data === 'json obj data unvalid') {
          console.warn(this.id, 'Device replied with json obj data unvalid');
        } else {
          console.error(this.id, 'Device replied with ', data);
          console.error(this.id, 'Please check your key value!');
          this.stop();
        }
      }
      this.adapter.handleDeviceUpdated(this);
    }).bind(this));
  }
}

module.exports = GenericDevice;
