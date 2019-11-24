// 服务接口层封装
import Taro from '@tarojs/taro'
import { axios } from 'taro-axios';
import { logout } from '../api/user'
import storage from '../utils/storage'

import { STORAGE_NAME, DEFAULT_CONFIG } from '../config'

axios.defaults.headers['accessToken'] = storage.getStorage(STORAGE_NAME.token, null) || ''
axios.defaults.baseURL = DEFAULT_CONFIG.baseURL
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers['Content-Type'] = 'multipart/form-data';


// Add a request interceptor
axios.interceptors.request.use(

  async (config: any) => {

    axios.defaults.headers['accessToken'] = storage.getStorage(STORAGE_NAME.token, null) || ''

    //时间戳
    if (config.url.indexOf("bust=") === -1) {
      if (config.url.indexOf("?") === -1) {
        config.url += "?";
      } else {
        config.url += "&";
      }
      config.url += "bust=" + new Date().getTime();
    }

    // 移除空数据
    if (config.data) {
      for (const key in config.data) {
        if (
          config.data[key] === null ||
          config.data[key] === undefined ||
          config.data[key] === ''
        ) {
          delete config.data[key];
        }
      }
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  async response => {
    if (response.status === 402 || response.status === 401) {
      await logout()
      Taro.switchTab({ url: '/pages/mine/index' })
      return
    }
    if (response.status === 200 || response.status === 304) {
      const res = response.data;
      if (res.code === 401 || res.code === 402) {
        await logout()
        Taro.switchTab({ url: '/pages/mine/index' })
        // return response.data;
      } else {
        return response.data;
      }
    } else {
      return {
        code: 0,
        message: '异常'
      };
    }
  },
  error => {
    console.log(error)
    return {
      code: 0,
      message: 'error'
    };
  }
);

export default function (config: any) {
  config.data = config.data || {};
  // if (true && config.mockData) {
  //   // 骚操作
  //   return Promise.resolve(config.mockData)
  // } else {
  // config.url = `${config.url}`;
  // }
  if (config.method === 'get') {
    config.params = config.data;
    delete config['data'];
  }
  // console.log(config);
  return axios(config);
}
