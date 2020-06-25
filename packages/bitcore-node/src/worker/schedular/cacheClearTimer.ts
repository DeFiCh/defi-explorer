import LruCache from '../../LruCache';
import { CACHE_TTL } from '../../constants/config';

const schedular = () => {
  LruCache.clear();
};

export let cacheClearTimerID: NodeJS.Timer;

export const cacheClearTimer = () => {
  cacheClearTimerID = setInterval(schedular, CACHE_TTL);
};
