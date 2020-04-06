'use strict';

const Property = require('gateway-addon').Property;
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

class ColourProperty extends Property {
  constructor(device, dps) {
    super(device, 'colour', {
      label: 'Colour',
      type: 'string',
      '@type': 'ColorProperty',
      value: '#FF0000',
    });
    this.dps = dps;

    this.hue = 0;        // 0...360
    this.saturation = 0; // 0...100
    this.lightness = 0;  // 0...100

    this.format = null;
  }

  update(value) {
    if (!('format' in this)) {
      if (value.length == 12) {
        this.format = 'HSL';
      } else if (value.length == 14) {
        this.format = 'HEXHLS';
      } else {
        this.format = null;
      }
      console.log(this.device.id, 'Autodetect colour format', this.format);
    }
    try {
      this.hue = lamp2hue(value, this.format);
      this.saturation = lamp2saturation(value, this.format);
      this.lightness = lamp2lightness(value, this.format);
      this.device.properties.get('hue').setCachedValueAndNotify(this.hue);
      this.device.properties.get('saturation').setCachedValueAndNotify(this.saturation);
      this.device.properties.get('lightness').setCachedValueAndNotify(this.lightness);
      this.setCachedValueAndNotify(rgb2hex(hsl2rgb([this.hue, this.saturation, 50])));
    } catch (ex) {
      console.error(this.device.id, 'Error', ex);
    }
  }

  updateHue(value) {
    this.hue = value;
    this.setValue(rgb2hex(hsl2rgb([this.hue, this.saturation, 50])));
  }

  updateSaturation(value) {
    this.saturation = value;
    this.setValue(rgb2hex(hsl2rgb([this.hue, this.saturation, 50])));
  }

  updateLightness(value) {
    this.lightness = value;
    this.setTuyapi();
  }

  setTuyapi() {
    if (this.dps)
      try {
        this.device.tuyapi.set({dps: this.dps, set: hsl2lamp([this.hue, this.saturation, this.lightness], this.format)});
      } catch (ex) {
        console.error(this.device.id, 'Error!', ex);
      }
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then(((updatedValue) => {
        this.hue = rgb2hsl(hex2rgb(value))[0];
        this.saturation = rgb2hsl(hex2rgb(value))[1];
        this.device.properties.get('hue').setCachedValueAndNotify(this.hue);
        this.device.properties.get('saturation').setCachedValueAndNotify(this.saturation);
        this.setTuyapi();
        resolve(updatedValue);
      }).bind(this)).catch(((err) => {
        reject(err);
      }).bind(this));
    }).bind(this));
  }
}

module.exports = ColourProperty;
