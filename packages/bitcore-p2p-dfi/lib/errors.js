'use strict';

var spec = {
  name: 'P2P',
  message: 'Internal Error on bitcore-p2p-dfi Module {0}'
};

module.exports = require('bitcore-lib-dfi').errors.extend(spec);
