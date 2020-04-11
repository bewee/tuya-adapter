'use strict';

const TuyaDevice = require('./tuya-device');
const PowerProperty = require('../properties/power-property');
const ModeProperty = require('../properties/mode-property');
const BrightnessProperty = require('../properties/brightness-property');
const LighttemperatureProperty = require('../properties/lighttemperature-property');
const ColourProperty = require('../properties/colourlamp/colour-property');
const HueProperty = require('../properties/colourlamp/hue-property');
const SaturationProperty = require('../properties/colourlamp/saturation-property');
const LightnessProperty = require('../properties/colourlamp/lightness-property');

class ColourLampDevice extends TuyaDevice {
  constructor(adapter, cnf, cid) {
    super(adapter, cnf, cid);

    this.name = cnf.name&&cnf.name!='' ? cnf.name : 'Lamp';
    this['@type'] = ['Light', 'OnOffSwitch'];

    if (!this.ownconf.maxbrightness) {
      console.info(this.id, 'Set maxbrightness to default 1000');
      this.ownconf.maxbrightness = 1000;
      this.saveOwnConfig();
    }
    if (!this.ownconf.maxlighttemperature) {
      console.info(this.id, 'Set maxbrightness to default 1000');
      this.ownconf.maxlighttemperature = 1000;
      this.saveOwnConfig();
    }

    this.addProperty(new PowerProperty(this, {dps: this.ownconf.dps.on, default_dps: 1}));

    const modecb = ((mode) => {
      switch (mode) {
        case 'white':
          this.setVisibility(['on', 'mode', 'brightness', 'lighttemperature']);
          break;
        case 'colour':
          this.setVisibility(['on', 'mode', 'colour', 'hue', 'saturation', 'lightness']);
          break;
      }
      this.adapter.handleDeviceUpdated(this);
    }).bind(this);
    this.addProperty(new ModeProperty(this, {dps: this.ownconf.dps.mode, default_dps: 2, modes: ['white', 'colour'], modestxt: ['White', 'Colour'], setcb: modecb, updatecb: modecb}));

    this.addProperty(new BrightnessProperty(this, {dps: this.ownconf.dps.brightness, default_dps: 3}));
    this.addProperty(new LighttemperatureProperty(this, {dps: this.ownconf.dps.lighttemperature, default_dps: 4}));
    this.addProperty(new ColourProperty(this, {dps: this.ownconf.dps.colour, default_dps: 5}));
    this.addProperty(new HueProperty(this));
    this.addProperty(new SaturationProperty(this));
    this.addProperty(new LightnessProperty(this));
  }
}

module.exports = ColourLampDevice;
