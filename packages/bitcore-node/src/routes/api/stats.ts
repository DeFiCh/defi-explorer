import { Request, Response } from 'express';
import { ChainStateProvider } from '../../providers/chain-state';
const router = require('express').Router({ mergeParams: true });

router.get('/', async function(req: Request, res: Response) {
  try {
    const { chain, network } = req.params;
    const { network_type } = req.query;
    const result = await ChainStateProvider.getStats({ chain, network, network_type });
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

let cacheThroughTruncatedDate;
let cachedDailyTransactions;
router.get('/daily-transactions', async function(req: Request, res: Response) {
  const { chain, network } = req.params;
  const truncatedUTC = new Date().toISOString().split('T')[0];
  if (truncatedUTC === cacheThroughTruncatedDate) {
    return res.json(cachedDailyTransactions);
  }
  try {
    cachedDailyTransactions = await ChainStateProvider.getDailyTransactions({ chain, network });
    if (!cachedDailyTransactions) {
      return res.send(500);
    }
    cacheThroughTruncatedDate = truncatedUTC;
    return res.json(cachedDailyTransactions);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = {
  router: router,
  path: '/stats'
};
