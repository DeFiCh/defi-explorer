export default class LruCache {
  private static cachingMap: Map<number, any> = new Map<number, any>();
  private static maxEntries: number = 2000;

  public static get(key: number): any {
    const hasKey = LruCache.cachingMap.has(key);
    let entry: any = null;
    if (hasKey) {
      // peek the entry, re-insert for LRU strategy
      entry = LruCache.cachingMap.get(key);
      LruCache.cachingMap.delete(key);
      LruCache.cachingMap.set(key, entry);
    }

    return entry;
  }

  public static put(key: number, value: any) {
    if (LruCache.cachingMap.size >= LruCache.maxEntries) {
      // delete least recently used key from cache
      const keyToDelete = LruCache.cachingMap.keys().next().value;

      LruCache.cachingMap.delete(keyToDelete);
    }

    LruCache.cachingMap.set(key, value);
  }

  public static clear() {
    LruCache.cachingMap.clear();
  }
}
