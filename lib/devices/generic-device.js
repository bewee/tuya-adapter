'use strict';

const Device = require('gateway-addon').Device;
const TuyAPI = require('tuyapi');
const StringProperty = require('../properties/string-property');
const NumberProperty = require('../properties/number-property');
const BooleanProperty = require('../properties/boolean-property');

class GenericDevice extends Device {
  constructor(adapter, conf) {
    super(adapter, `tuya-${conf.id}`);

    this.tid = conf.id;
    this.key = conf.key;

    this.name = conf.name&&conf.name!='' ? conf.name : 'Device';
    this['@type'] = [];
    this.description = 'tuya generic device';

    this.tuyapi = new TuyAPI({
      id: this.tid,
      key: this.key,
    });
    this.tuyapi._responseTimeout = this.adapter.config.timeout/2;
    this.tuyapi._connectTimeout = this.adapter.config.timeout/2;
    this.tuyapi._pingPongPeriod = this.adapter.config.timeout;
    this.tuyapi.on('connected', () => {
      this.connectedNotify(true);
    });
    this.tuyapi.on('disconnected', () => {
      const oldconnected = this.connected;
      this.connectedNotify(false);
      if ('dead' in this) return;
      setTimeout((() => {
        this.tuyapi.connect().catch((err) => {
          if (oldconnected)
            console.error(this.id, 'Error!', err);
        });
      }).bind(this), this.adapter.config.timeout*1000);
    });
    this.tuyapi.on('error', (err) => {
      console.log(this.id, 'Error', err);
    });
    this.tuyapi.on('data', ((data) => {
      console.log(this.id, 'Data', data);
      if (data && data.dps) {
        for (const dps in data.dps) {
          if (!this.properties.get(dps)) {
            switch (typeof data.dps[dps]) {
              case 'boolean':
                this.properties.set(dps, new BooleanProperty(this, dps));
                break;
              case 'number':
                this.properties.set(dps, new NumberProperty(this, dps));
                break;
              default:
                this.properties.set(dps, new StringProperty(this, dps));
                break;
            }
          }
          const prop = this.properties.get(dps);
          prop.update(data.dps[dps]);
          this.notifyPropertyChanged(prop);
        }
      } else {
        if (data !== 'json obj data unvalid') {
          console.error(this.id, 'Error! Please check your key value!');
          this.stop();
        }
      }
      this.adapter.handleDeviceUpdated(this);
    }).bind(this));
  }

  run() {
    if ('dead' in this) return;
    this.tuyapi.find({timeout: this.adapter.config.timeout}).then((() => {
      this.tuyapi.connect();
    }).bind(this)).catch((() => {
      this.run();
    }).bind(this));
  }

  stop() {
    console.log(this.id, 'Stop!');
    this.dead = true;
    this.tuyapi.disconnect();
  }

  connectedNotify(stat) {
    super.connectedNotify(stat);
    if (!('connected' in this)) {
      this.connected = stat;
      return;
    }
    if (this.connected !== stat) {
      if (stat) {
        console.log(this.id, 'Connected!');
      } else {
        console.log(this.id, 'Disconnected!');
      }
      this.connected = stat;
    }
  }
}

module.exports = GenericDevice;
