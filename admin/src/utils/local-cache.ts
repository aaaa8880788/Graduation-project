class LocalCache {
  // 添加本地缓存
  setCache(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  // 获取本地缓存
  getCache(key: string) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  // 删除本地缓存
  deleteCache(key: string) {
    window.localStorage.removeItem(key);
  }
  // 清空本地缓存
  clearCache() {
    window.localStorage.clear();
  }
}

export default new LocalCache();
