'use strict';

var Message = require('../message');
var inherits = require('util').inherits;

function AnchorAuth() {}
inherits(AnchorAuth, Message);

AnchorAuth.prototype.setPayload = function() {};

AnchorAuth.prototype.getPayload = function() {
  return Buffer.from([]);
};

module.exports = AnchorAuth;
