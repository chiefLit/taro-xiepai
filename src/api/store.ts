import axios from '../utils/axios'

import { STORAGE_NAME } from "../config";
import storage from '../utils/storage'

import * as goodzApi from "./goodz";

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}

// 获取门店列表
export async function getStoreList(data: any) {
  const storeList = storage.getStorage(STORAGE_NAME.storeList, null);
  if (storeList) {
    return Promise.resolve(storeList)
  } else {
    const config = {
      method: 'post',
      url: '/api/wxmp/store/list',
      data: data
    }
    const res = await axios(config)
    res.code === 1 && storage.setStorage(STORAGE_NAME.storeList, res.object);
    return Promise.resolve(res.object)
  }
}

// 获取当前门店
export async function getCurrStore() {
  const currStore = storage.getStorage(STORAGE_NAME.currStore, null);
  if (currStore) {
    return Promise.resolve(currStore)
  } else {
    const data = await getStoreList({})
    setCurrStore(data[0])
    return Promise.resolve(data[0])
  }
}

// 设置当前门店列表
export async function setCurrStore(data: any) {
  storage.setStorage(STORAGE_NAME.currStore, data);
  const GoodzListData = await goodzApi.getGoodzList({ storeId: data.id })
  // console.log(GoodzListData)
  if (GoodzListData.code === 1) {
    // console.log('setGoodzId: ' + data.id + ',' + GoodzListData.object[0].id)
    storage.setStorage(STORAGE_NAME.currGoodz, GoodzListData.object[0]);
  }
  return Promise.resolve()
}