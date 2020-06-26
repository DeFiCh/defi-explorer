import { CACHE_CLEAR_INTERVAL } from '../constants/config';
import { CacheItem } from '../CacheItem';

const schedular = () => {
  CacheItem.cacheMap.clear();
};

export let cacheClearTimerID: NodeJS.Timer;

export const cacheClearTimer = () => {
  cacheClearTimerID = setInterval(schedular, CACHE_CLEAR_INTERVAL);
};
