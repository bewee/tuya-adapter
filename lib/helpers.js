'use strict';

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

function hsl2rgb(hsl) {
  hsl[0] /= 360.0; hsl[1] /= 100.0; hsl[2] /= 100.0;
  let r, g, b;

  if (hsl[1] == 0) {
    r = g = b = hsl[2]; // achromatic
  } else {
    const q = hsl[2] < 0.5 ? hsl[2] * (1 + hsl[1]) : hsl[2] + hsl[1] - hsl[2] * hsl[1];
    const p = 2 * hsl[2] - q;
    r = hue2rgb(p, q, hsl[0] + 1/3);
    g = hue2rgb(p, q, hsl[0]);
    b = hue2rgb(p, q, hsl[0] - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgb2hsl(rgb) {
  rgb[0] /= 255.0; rgb[1] /= 255.0; rgb[2] /= 255.0;
  const max = Math.max(rgb[0], rgb[1], rgb[2]), min = Math.min(rgb[0], rgb[1], rgb[2]);
  let h, s;
  const l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rgb[0]: h = (rgb[1] - rgb[2]) / d + (rgb[1] < rgb[2] ? 6 : 0); break;
      case rgb[1]: h = (rgb[2] - rgb[0]) / d + 2; break;
      case rgb[2]: h = (rgb[0] - rgb[1]) / d + 4; break;
    }
    h /= 6;
  }

  return [h*360, s*100, l*100];
}

function pad(n, h) {
  if (n == 2) {
    if (parseInt(h, 16) <= 0xf)
      return `0${h}`;
    return h;
  }
  return '0'.repeat(n - h.length) + h;
}

module.exports = {hsl2rgb: hsl2rgb, rgb2hsl: rgb2hsl, pad: pad};
