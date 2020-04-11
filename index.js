/**
 * index.js - Loads the tuya adapter.
 */

'use strict';

const TuyaAdapter = require('./lib/adapter');

module.exports = (addonManager) => {
  new TuyaAdapter(addonManager);
};
