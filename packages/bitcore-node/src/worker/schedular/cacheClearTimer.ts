import { CACHE_CLEAR_INTERVAL } from '../../constants/config';
import { richListCache } from '../../models/coin';

const schedular = () => {
  richListCache.clear();
};

export let cacheClearTimerID: NodeJS.Timer;

export const cacheClearTimer = () => {
  cacheClearTimerID = setInterval(schedular, CACHE_CLEAR_INTERVAL);
};
