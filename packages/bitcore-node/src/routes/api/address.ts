import express = require('express');
const router = express.Router({ mergeParams: true });
import { ChainStateProvider } from '../../providers/chain-state';
import queue from '../../worker/queue';

router.get('/:address/txs', function(req, res) {
  let { address, chain, network } = req.params;
  let { unspent, limit = 10 } = req.query;
  let payload = {
    chain,
    network,
    address,
    req,
    res,
    args: { unspent, limit }
  };
  ChainStateProvider.streamAddressTransactions(payload);
});

router.get('/:address', function(req, res) {
  let { address, chain, network } = req.params;
  let { unspent, limit = 10 } = req.query;
  let payload = {
    chain,
    network,
    address,
    req,
    res,
    args: { unspent, limit }
  };
  ChainStateProvider.streamAddressUtxos(payload);
});

router.get('/:address/balance', async function(req, res) {
  let { address, chain, network } = req.params;
  try {
    let result = await ChainStateProvider.getBalanceForAddress({
      chain,
      network,
      address
    });
    return res.send(result || { confirmed: 0, unconfirmed: 0, balance: 0 });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/stats/rich-list', async function(req, res) {
  const { chain, network } = req.params;
  let { pageno, pagesize } = req.query;
  try {
    if (pageno) {
      pageno = parseInt(pageno);
      pagesize = parseInt(pagesize);
    }

    queue.push(
      {
        methodName: ChainStateProvider.getRichList.bind(ChainStateProvider),
        params: [{ chain, network, pageNo: pageno, pageSize: pagesize }]
      },
      (err, result) => {
        if (err) {
          throw new Error(err.message);
        }
        res.send(result || []);
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = {
  router: router,
  path: '/address'
};
