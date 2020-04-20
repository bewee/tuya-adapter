'use strict';

const Adapter = require('gateway-addon').Adapter;
const Database = require('gateway-addon').Database;
const manifest = require('../manifest.json');
const ColourLampDevice = require('./devices/colourlamp-device');
const DimmerDevice = require('./devices/dimmer-device');
const LampDevice = require('./devices/lamp-device');
const PlugDevice = require('./devices/plug-device');
const PlugNightlightDevice = require('./devices/plug-nightlight-device');
const SwitchDevice = require('./devices/switch-device');
const GenericDevice = require('./devices/generic-device');

class TuyaAdapter extends Adapter {
  constructor(addonManager) {
    super(addonManager, 'TuyaAdapter', manifest.id);
    addonManager.addAdapter(this);
    this.savedDevices = [];

    this.db = new Database(this.packageName);
    this.db.open().then((() => {
      return this.db.loadConfig();
    }).bind(this)).then(((config) => {
      this.config = config;
      return Promise.resolve();
    }).bind(this)).then((() => {
      if (!this.config.log || this.config.log == '') this.config.log = 'warn';
      switch (this.config.log) {
        case 'none':
          console.error = () => {};
        case 'error':
          console.warn = () => {};
        case 'warn':
          console.info = () => {};
        case 'info':
          console.debug = () => {};
          break;
      }
      for (const cid in this.config.devices) {
        const conf = this.config.devices[cid];
        let d;
        console.debug('Initialize device:', conf.id, 'type', conf.type);
        switch (conf.type) {
          case 'Colour Lamp':
            d = new ColourLampDevice(this, conf, cid);
            break;
          case 'Dimmer':
            d = new DimmerDevice(this, conf, cid);
            break;
          case 'Lamp':
            d = new LampDevice(this, conf, cid);
            break;
          case 'Plug':
            d = new PlugDevice(this, conf, cid);
            break;
          case 'Plug with night light':
            d = new PlugNightlightDevice(this, conf, cid);
            break;
          case 'Switch':
            d = new SwitchDevice(this, conf, cid);
            break;
          default:
            d = new GenericDevice(this, conf, cid);
            break;
        }
        this.handleDeviceAdded(d);
        if (this.savedDevices.includes(d.id)) {
          console.info('Thing saved later', d.id);
          d.run();
        }
      }
    }).bind(this)).catch(console.error);
  }

  handleDeviceAdded(device, reload = false) {
    super.handleDeviceAdded(device);
    if (reload) return;
    console.info('Thing added', device.id);
    device.connectedNotify(false);
  }

  handleDeviceUpdated(device) {
    super.handleDeviceAdded(device, true);
    console.info('Thing updated', device.id);
  }

  handleDeviceSaved(deviceId) {
    super.handleDeviceSaved(deviceId);
    this.savedDevices.push(deviceId);
    if (this.devices[deviceId]) {
      const device = this.devices[deviceId];
      console.info('Thing saved', deviceId);
      device.connectedNotify(false);
      device.run();
    }
  }

  startPairing(_timeoutSeconds) {
    console.info('Pairing started');
  }

  cancelPairing() {
    console.info('Pairing cancelled');
  }

  handleDeviceRemoved(device) {
    super.handleDeviceRemoved(device);
    device.stop();
    console.info('Thing removed', device.id);
  }

  removeThing(device) {
    console.info('Remove thing', device.id);

    const newdevice = new device.__proto__.constructor(this, device.tid, device.key, device.name);

    this.handleDeviceRemoved(device);
    if (this.savedDevices.includes(device.id))
      this.savedDevices.splice(this.savedDevices.indexOf(device.id), 1);

    this.handleDeviceAdded(newdevice);
  }

  cancelRemoveThing(device) {
    console.info('cancel removing thing', device.id);
  }
}

module.exports = TuyaAdapter;
