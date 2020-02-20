'use strict';

var Message = require('../message');
var inherits = require('util').inherits;

function AnchorConfig() {}
inherits(AnchorConfig, Message);

AnchorConfig.prototype.setPayload = function() {};

AnchorConfig.prototype.getPayload = function() {
  return Buffer.from([]);
};

module.exports = AnchorConfig;
