const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const env = process.env.IONIC_ENV;

useDefaultConfig[env].resolve.symlinks = true;
delete useDefaultConfig[env].resolve.modules;

module.exports = function () {
  'use strict';
  return useDefaultConfig;
};
