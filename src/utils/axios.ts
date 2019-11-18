// 服务接口层封装
import { axios } from 'taro-axios';

import {STORAGE_NAME} from '../config'

// import GConfig from '../config';

// Add a request interceptor
axios.interceptors.request.use(
  async config => {
    const res: any = await Taro.getStorage({
      key: STORAGE_NAME.token
    })
    axios.defaults.headers['accessToken'] = res.data || ''

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

    if (config.params) {
      for (const key in config.params) {
        if (
          config.params[key] === null ||
          config.params[key] === undefined ||
          config.params[key] === ''
        ) {
          delete config.params[key];
        }
      }

      config.params.t = new Date().getTime();
      // config.url = config.url + '?t=' + new Date().getTime(); // 兼容ie Get请求缓存问题
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
  response => {
    if (response.status === 200 || response.status === 304) {
      const res = response.data;
      if (res.code !== 1) {
        return Promise.reject('error');
      } else {
        return response.data;
      }
    } else {
      return Promise.reject('error');
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default function (config) {
  config.data = config.data || {};
  if (true && config.mockData) {
    // 骚操作
    return Promise.resolve(config.mockData)
  } else {
    config.url = `${config.url}`;
  }
  if (config.method === 'get') {
    config.params = config.data;
    delete config['data'];
  }
  // alert(JSON.stringify(config));
  return axios(config);
}
