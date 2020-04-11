'use strict';

const TuyaProperty = require('../tuya-property');
const hsl2rgb = require('../../helpers').hsl2rgb;
const rgb2hsl = require('../../helpers').rgb2hsl;
const pad = require('../../helpers').pad;
const rgb2hex = require('../../helpers').rgb2hex;
const hex2rgb = require('../../helpers').hex2rgb;

// HSL: [4x hue 0-1000 hex][4x saturation 0-1000 hex][4x lightness 0-1000 hex]
// HEXHLS: [6x color code hex][4x hue 0-360 hex][2x lightness 0-255 hex][2x saturation 0-255 hex]

function lamp2hue(v, format) {
  switch (format) {
    case 'HSL':
      return parseInt(v.substring(0, 4), 16);
    case 'HEXHLS':
      return parseInt(v.substring(6, 10), 16);
  }
  throw 'Unknown colour format!';
}

function lamp2saturation(v, format) {
  switch (format) {
    case 'HSL':
      return parseInt(v.substring(4, 8), 16)/10.0;
    case 'HEXHLS':
      return parseInt(v.substring(12, 14), 16)/255.0*100;
  }
  throw 'Unknown colour format!';
}

function lamp2lightness(v, format) {
  switch (format) {
    case 'HSL':
      return parseInt(v.substring(8, 12), 16)/10.0;
    case 'HEXHLS':
      return parseInt(v.substring(10, 12), 16)/255.0*100;
  }
  throw 'Unknown colour format!';
}

function hsl2lamp(hsl, format) {
  switch (format) {
    case 'HSL':
      return `${pad(4, Math.round(hsl[0]).toString(16))}${pad(4, Math.round(hsl[1]*10).toString(16))}${pad(4, Math.round(hsl[2]*10).toString(16))}`;
    case 'HEXHLS':
      return `${rgb2hex(hsl2rgb([hsl[0], hsl[1], hsl[2]/2]))}${pad(4, Math.round(hsl[0]).toString(16))}${pad(2, Math.round(hsl[2]*255/100).toString(16))}${pad(2, Math.round(hsl[1]*255/100).toString(16))}`;
  }
  throw 'Unknown colour format!';
}

class ColourProperty extends TuyaProperty {
  constructor(device, cnf) {
    super(device, 'colour', {
      label: 'Colour',
      type: 'string',
      '@type': 'ColorProperty',
      value: '#FF0000',
    }, cnf);

    this.hue = 0;        // 0 ... 360
    this.saturation = 0; // 0.0 ... 100.0
    this.lightness = 0;  // 0.0 ... 100.0
  }

  update(value) {
    super.update(value);
    if (!this.device.ownconf.format) {
      if (value.length == 12) {
        this.device.ownconf.format = 'HSL';
      } else if (value.length == 14) {
        this.device.ownconf.format = 'HEXHLS';
      } else {
        this.device.ownconf.format = 'Unknown';
      }
      console.info(this.id, 'Autodetect colour format', this.device.ownconf.format);
      this.device.saveOwnConfig();
    }
    try {
      this.hue = lamp2hue(value, this.device.ownconf.format);
      this.saturation = lamp2saturation(value, this.device.ownconf.format);
      this.lightness = lamp2lightness(value, this.device.ownconf.format);
      this.device.properties.get('hue').setCachedValueAndNotify(this.hue);
      this.device.properties.get('saturation').setCachedValueAndNotify(this.saturation);
      this.device.properties.get('lightness').setCachedValueAndNotify(this.lightness);
      this.setCachedValueAndNotify(rgb2hex(hsl2rgb([this.hue, this.saturation, 50])));
    } catch (ex) {
      console.error(this.id, 'Error during update', ex);
    }
  }

  updateHue(value) {
    console.debug(this.id, 'updateHue(', value, ')');
    this.hue = value;
    this.setValue(rgb2hex(hsl2rgb([this.hue, this.saturation, 50])));
  }

  updateSaturation(value) {
    console.debug(this.id, 'updateSaturation(', value, ')');
    this.saturation = value;
    this.setValue(rgb2hex(hsl2rgb([this.hue, this.saturation, 50])));
  }

  updateLightness(value) {
    console.debug(this.id, 'updateLightness(', value, ')');
    this.lightness = value;
    if (!this.dps) {
      console.debug(this.id, 'Set missing dps value', this.dps);
      this.dps = this.default_dps;
      this.device.ownconf.dps[this.name] = this.dps;
      this.device.saveOwnConfig();
    }
    this.setTuyapi();
  }

  setTuyapi() {
    try {
      const cmd = {dps: this.dps, set: hsl2lamp([this.hue, this.saturation, this.lightness], this.device.ownconf.format)};
      console.debug(this.id, 'Execute tuyapi command', cmd);
      this.device.tuyapi.set(cmd);
    } catch (ex) {
      console.error(this.id, 'Error during setTuyapi', ex);
    }
  }

  setValue(value) {
    return new Promise(((resolve) => {
      super.setValue(value).then(((updatedValue) => {
        this.hue = rgb2hsl(hex2rgb(value))[0];
        this.saturation = rgb2hsl(hex2rgb(value))[1];
        this.device.properties.get('hue').setCachedValueAndNotify(this.hue);
        this.device.properties.get('saturation').setCachedValueAndNotify(this.saturation);
        this.setTuyapi();
        resolve(updatedValue);
      }).bind(this)).catch(((err) => {
        console.error(this.id, 'Error during setValue', err);
      }).bind(this));
    }).bind(this));
  }

  autodps(obj) {
    return Object.keys(obj).find((x) => (typeof (obj[x]) === 'string'));
  }
}

module.exports = ColourProperty;
