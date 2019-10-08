module.exports = {
  BTC: {
    lib: require('bitcore-lib'),
    p2p: require('bitcore-p2p'),
  },
  BCH: {
    lib: require('bitcore-lib-cash'),
    p2p: require('bitcore-p2p-cash'),
  },
  DFC: {
    lib: require('bitcore-lib-dfc'),
    p2p: require('bitcore-p2p-dfc'),
  },
}
