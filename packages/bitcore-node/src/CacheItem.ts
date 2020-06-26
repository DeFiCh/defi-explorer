export class CacheItem {
  value: any;
  ts: number;
  constructor(value, ts = Date.now()) {
    this.value = value;
    this.ts = ts;
  }

  isRecent(seconds: number) {
    return this.ts > new Date(Date.now() - seconds * 1000).valueOf();
  }
}
