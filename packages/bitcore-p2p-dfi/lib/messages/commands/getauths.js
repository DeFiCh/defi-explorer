'use strict';

var Message = require('../message');
var inherits = require('util').inherits;

function GetAuths() {}
inherits(GetAuths, Message);

GetAuths.prototype.setPayload = function() {};

GetAuths.prototype.getPayload = function() {
  return Buffer.from([]);
};

module.exports = GetAuths;
