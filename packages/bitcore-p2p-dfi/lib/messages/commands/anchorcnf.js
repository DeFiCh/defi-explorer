'use strict';

var Message = require('../message');
var inherits = require('util').inherits;

function AnchorConformation() {}
inherits(AnchorConformation, Message);

AnchorConformation.prototype.setPayload = function() {};

AnchorConformation.prototype.getPayload = function() {
  return Buffer.from([]);
};

module.exports = AnchorConformation;
