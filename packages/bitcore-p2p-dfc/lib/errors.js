'use strict';

var spec = {
  name: 'P2P',
  message: 'Internal Error on bitcore-p2p-dfc Module {0}'
};

module.exports = require('bitcore-lib-dfc').errors.extend(spec);
