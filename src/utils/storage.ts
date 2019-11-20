import Taro from '@tarojs/taro'
export default {
  /**
   * 设置本地存储数据
   * @param key  关键key
   * @param obj  存储的数据
   */
  setStorage(key: any, obj: any) {
    var oStore = {
      time: +new Date(),
      // validDate: +new Date + (storeTime || 10000000) * 1000 * 60,
      data: obj
    };

    try {
      Taro.setStorageSync(key, JSON.stringify(oStore))
    } catch (e) {
    }
  },

  /**
   * 获取本地存储数据
   * @param key
   * @param storeTime 不必填
   */
  getStorage(key: any, storeTime) {
    if (!key) {
      return null;
    }
    var oStore;
    try {
      oStore = Taro.getStorageSync(key);
    } catch (e) {
    }
    if (oStore) {
      oStore = JSON.parse(oStore);
    }

    if (!oStore) {
      return null;
    } else if (storeTime && (!oStore.time || +new Date > oStore.time + storeTime * 60 * 1000)) {
      this.removeStorage(key);
      return null;
    } else {
      return oStore.data;
    }
  },

  /**
   * 删除本地存储数据
   * @param key
   */
  removeStorage(key: any) {
    try {
      Taro.removeStorageSync(key)
    } catch (e) {
    }
  }
}
