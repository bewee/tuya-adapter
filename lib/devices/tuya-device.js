'use strict';

const Device = require('gateway-addon').Device;
const TuyAPI = require('tuyapi');

class TuyaDevice extends Device {
  constructor(adapter, cnf, cid) {
    super(adapter, `tuya-${cnf.id}`);

    console.debug(this.id, 'Initialize tuya device', JSON.stringify(cnf));

    this.tid = cnf.id;
    this.key = cnf.key;
    this.cid = cid;
    try {
      console.debug(this.id, 'Loading ownconf', cnf.config);
      this.ownconf = JSON.parse(cnf.config);
    } catch (ex) {
      this.ownconf = {};
    }
    if (!this.ownconf.dps) {
      console.debug(this.id, 'No dps in ownconf. Initializing to empty object');
      this.ownconf.dps = {};
    }

    const devname = this.constructor.name.substr(0, this.constructor.name.lastIndexOf('Device'));
    this.name = cnf.name&&cnf.name!='' ? cnf.name : devname;
    this.description = `Tuya ${devname}`;

    this.properties_array = [];

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
      if ('dead' in this) {
        console.debug(this.id, 'Already dead');
        return;
      }
      setTimeout((() => {
        this.tuyapi.connect().catch((err) => {
          if (oldconnected) {
            console.error(this.id, 'Error during tuyapi connect', err);
          }
        });
      }).bind(this), this.adapter.config.timeout*1000);
    });
    this.tuyapi.on('error', (err) => {
      console.error(this.id, 'Internal tuyapi error', err);
    });
    let firstdata = true;
    this.tuyapi.on('data', ((data) => {
      console.debug(this.id, 'Data', data);
      if (data && data.dps) {
        if (firstdata) {
          console.debug(this.id, 'First data');
          firstdata = false;
          const obj = JSON.parse(JSON.stringify(data.dps));
          this.properties_array.forEach((p) => {
            if ('dps' in p && !p.dps) {
              p.autodetect(obj);
            }
          });
          this.saveOwnConfig();
        }
        for (const [_key, prop] of this.properties) {
          if (prop.dps in data.dps) {
            prop.update(data.dps[prop.dps]);
            this.notifyPropertyChanged(prop);
          }
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
    }).bind(this));
  }

  saveOwnConfig() {
    console.debug(this.id, 'saveOwnConfig(', JSON.stringify(this.ownconf), ')');
    this.adapter.config.devices[this.cid].config = JSON.stringify(this.ownconf);
    this.adapter.db.saveConfig(this.adapter.config);
  }

  addProperty(p) {
    console.debug(this.id, 'addProperty(', p.name, ')');
    this.properties.set(p.name, p);
    this.properties_array.push(p);
  }

  setVisibility(list) {
    console.debug(this.id, 'setVisibility(', list, ')');
    for (const [key, prop] of this.properties) {
      if (list.includes(key))
        prop.visible = true;
      else
        prop.visible = false;
    }
  }

  run() {
    if ('dead' in this) {
      console.debug(this.id, 'Already dead!');
      return;
    }
    this.tuyapi.find({timeout: this.adapter.config.timeout}).then((() => {
      console.debug(this.id, 'Device found. Connecting...');
      this.tuyapi.connect();
    }).bind(this)).catch((() => {
      this.run();
    }).bind(this));
  }

  stop() {
    console.info(this.id, 'Stop!');
    this.dead = true;
    setTimeout(this.tuyapi.disconnect.bind(this), 0);
  }

  connectedNotify(stat) {
    super.connectedNotify(stat);
    if (!('connected' in this)) {
      this.connected = stat;
      return;
    }
    if (this.connected !== stat) {
      if (stat) {
        console.info(this.id, 'Connected!');
      } else {
        console.info(this.id, 'Disconnected!');
      }
      this.connected = stat;
    }
  }
}

module.exports = TuyaDevice;
