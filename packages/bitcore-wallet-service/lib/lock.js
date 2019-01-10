const $ = require('preconditions').singleton();
var _ = require('lodash');
var log = require('npmlog');
log.debug = log.verbose;
log.disableColor();

var Common = require('./common');
var Defaults = Common.Defaults;

var Errors = require('./errors/errordefinitions');


const ACQUIRE_RETRY_STEP = 50; //ms

function Lock(storage, opts) {
  opts = opts || {};

  this.storage = storage;
};


Lock.prototype.acquire = function(token, opts, cb, timeLeft) {
  var self = this;
  opts = opts || {};

  opts.lockTime = opts.lockTime ||  Defaults.LOCK_EXE_TIME;

  this.storage.acquireLock(token, (err) => {

    // Lock taken?
    if(err && err.message && err.message.indexOf('E11000 ') !== -1) {

      // Waiting time for lock has expired
      if (timeLeft < 0) {
        return cb('LOCKED');
      }

      
      if (!_.isUndefined(opts.waitTime)) {
        if (_.isUndefined(timeLeft)) {
          timeLeft = opts.waitTime;
        } else {
          timeLeft -= ACQUIRE_RETRY_STEP;
        }
      }
      
      return setTimeout(self.acquire.bind(self,token, opts, cb, timeLeft), ACQUIRE_RETRY_STEP);

    // Actual DB error
    } else if (err) {
      return cb(err);

    // Lock available
    } else {

      var lockTimerId;

      function release(icb) {
        if (!icb) icb = () => {};

        clearTimeout(lockTimerId);

        self.storage.releaseLock(token, icb);
      }


      lockTimerId = setTimeout(() => { 
        release(); 
      }, opts.lockTime);

      return cb(null, (icb) => {
        release(icb);
      });
    }
  });
};

Lock.prototype.runLocked = function(token, opts, cb, task) {
  $.shouldBeDefined(token);

  this.acquire(token, opts, function(err, release) {
    if (err  == 'LOCKED' ) return cb(Errors.WALLET_BUSY);
    if (err) return cb(err);


    var _cb = function() {

      cb.apply(null, arguments);
      release();
    };
    task(_cb);
  });
};


module.exports = Lock;
