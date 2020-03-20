'use strict';

const {Adapter, Database, _Device, _Property} = require('gateway-addon');
const manifest = require('../manifest.json');
const LampDevice = require('./lamp-device');

class TuyaAdapter extends Adapter {
  constructor(addonManager) {
    super(addonManager, 'TuyaAdapter', manifest.id);
    addonManager.addAdapter(this);
    this.devices_by_ip = {};

    this.db = new Database(this.packageName);
    this.db.open().then((() => {
      return this.db.loadConfig();
    }).bind(this)).then(((config) => {
      this.config = config;
      return Promise.resolve();
    }).bind(this)).then((() => {
      for (const conf of this.config.devices) {
        let d;
        switch (conf.type) {
          case 'Lamp':
            d = new LampDevice(this, conf.id, conf.key);
            break;
        }
        this.handleDeviceAdded(d);
        d.connectedNotify(false);
      }
    }).bind(this)).catch(console.error);
  }

  handleDeviceAdded(device) {
    super.handleDeviceAdded(device);
    console.log('Thing added', device.id);
  }

  handleDeviceSaved(deviceId) {
    super.handleDeviceSaved(deviceId);
    if (this.devices[deviceId]) {
      console.log('Thing saved', deviceId);
      this.devices[deviceId].run();
    }
  }

  handleDeviceRemoved(device) {
    super.handleDeviceRemoved(device);
    console.log('Thing removed', device.id);
  }

  startPairing(_timeoutSeconds) {
    console.log('pairing started');
  }

  cancelPairing() {
    console.log('pairing cancelled');
  }

  removeThing(device) {
    console.log('removeThing(', device.id, ')');

    this.handleDeviceRemoved(device);
    device.stop();
    const newdevice = new device.__proto__.constructor(this, device.tid, device.key);
    this.handleDeviceAdded(newdevice);
  }

  cancelRemoveThing(device) {
    console.log('cancelRemoveThing(', device.id, ')');
  }
}

module.exports = TuyaAdapter;
