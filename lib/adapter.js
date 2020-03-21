'use strict';

const {Adapter, Database, _Device, _Property} = require('gateway-addon');
const manifest = require('../manifest.json');
const LampDevice = require('./lamp-device');
const GenericDevice = require('./generic-device');

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
          default:
            d = new GenericDevice(this, conf.id, conf.key);
            break;
        }
        this.handleDeviceAdded(d);
      }
    }).bind(this)).catch(console.error);
  }

  handleDeviceAdded(device, reload = false) {
    super.handleDeviceAdded(device);
    console.log('Thing added', device.id);
    if (reload) return;
    device.connectedNotify(false);
  }

  handleDeviceUpdated(device) {
    super.handleDeviceAdded(device, true);
    console.log('Thing updated', device.id);
  }

  handleDeviceSaved(deviceId) {
    super.handleDeviceSaved(deviceId);
    if (this.devices[deviceId]) {
      const device = this.devices[deviceId];
      console.log('Thing saved', deviceId);
      device.connectedNotify(false);
      device.run();
    }
  }

  startPairing(_timeoutSeconds) {
    console.log('pairing started');
  }

  cancelPairing() {
    console.log('pairing cancelled');
  }

  handleDeviceRemoved(device) {
    super.handleDeviceRemoved(device);
    device.stop();
    console.log('Thing removed', device.id);
  }

  removeThing(device) {
    console.log('removeThing(', device.id, ')');

    this.handleDeviceRemoved(device);
    const newdevice = new device.__proto__.constructor(this, device.tid, device.key);
    this.handleDeviceAdded(newdevice);
  }

  cancelRemoveThing(device) {
    console.log('cancelRemoveThing(', device.id, ')');
  }
}

module.exports = TuyaAdapter;
