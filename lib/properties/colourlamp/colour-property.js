'use strict';

const Property = require('gateway-addon').Property;
const hsl2rgb = require('../../helpers').hsl2rgb;
const rgb2hsl = require('../../helpers').rgb2hsl;
const pad = require('../../helpers').pad;

function lamp2hue(v) {
  return parseInt(v.substring(0, 4), 16);
}

function lamp2saturation(v) {
  return parseInt(v.substring(4, 8), 16)/10.0;
}

function lamp2lightness(v) {
  return parseInt(v.substring(8, 12), 16)/10.0;
}

function hsl2lamp(hsl) {
  return `${pad(4, Math.round(hsl[0]).toString(16))}${pad(4, Math.round(hsl[1]*10).toString(16))}${pad(4, Math.round(hsl[2]*10).toString(16))}`;
}

function rgb2hex(rgb) {
  return `#${pad(2, Math.round(rgb[0]).toString(16))}${pad(2, Math.round(rgb[1]).toString(16))}${pad(2, Math.round(rgb[2]).toString(16))}`;
}

function hex2rgb(hex) {
  return [parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3, 5), 16), parseInt(hex.substring(5, 7), 16)];
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
  }

  update(value) {
    this.hue = lamp2hue(value);
    this.saturation = lamp2saturation(value);
    this.lightness = lamp2lightness(value);
    this.device.properties.get('hue').setCachedValueAndNotify(this.hue);
    this.device.properties.get('saturation').setCachedValueAndNotify(this.saturation);
    this.device.properties.get('lightness').setCachedValueAndNotify(this.lightness);
    this.setCachedValueAndNotify(rgb2hex(hsl2rgb([this.hue, this.saturation, 50])));
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
      this.device.tuyapi.set({dps: this.dps, set: hsl2lamp([this.hue, this.saturation, this.lightness])});
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
