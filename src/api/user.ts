import axios from '../utils/axios'
// import Taro from '@tarojs/taro'
import { STORAGE_NAME } from '../config'
import storage from '../utils/storage'

// 补充微信用户手机号码
export function improvePhone(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/improve_phone',
    // mockData: require('../../mock/improvePhone.json'),
    data: data
  }
  return axios(config);
}

// 补充微信用户信息
export function improveInfo(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/improve_info',
    // mockData: require('../../mock/improveInfo.json'),
    data: data
  }
  return axios(config);
}

// 登录/注册
export async function login(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/login?wxCode=0211yWHT1Hicp41heJIT10uJHT11yWHe',
    // mockData: require('../../mock/login.json'),
    data: data
  }
  let loginRes: any = await axios(config);
  return new Promise(async resolve => {
    if (loginRes.code !== 1) {
      resolve({ code: 0, message: loginRes.message })
    } else {
      if (loginRes.object && loginRes.object.accessToken) {
        storage.setStorage(STORAGE_NAME.token, loginRes.object.accessToken)
        resolve({ code: 1 })
      } else {
        resolve({ code: 0, message: '登录异常' })
      }
    }
  }).catch((e) => { })
}

// 判断登录
export async function checkLogin() {
  let userInfo: any = storage.getStorage(STORAGE_NAME.userInfo, null)
  if (userInfo && userInfo.phone) {
    return true
  } else {
    return false
  }
}

// 登出
export async function logout() {
  return new Promise(async resolve => {
    storage.removeStorage(STORAGE_NAME.userInfo)
    storage.removeStorage(STORAGE_NAME.token)
    resolve()
  })
}

// 我-我的地址-列表
export function getAddressList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/address/list',
    // mockData: require('../../mock/getAddressList.json'),
    data: data
  }
  return axios(config);
}

// 我-我的地址-新增
export function addAddress(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/address/add',
    // mockData: require('../../mock/addAddress.json'),
    data: data
  }
  return axios(config);
}

// 我-我的地址-编辑
export function editAddress(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/address/edit',
    // mockData: require('../../mock/editAddress.json'),
    data: data
  }
  return axios(config);
}

// 我的
export function getMine(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/home',
    // mockData: require('../../mock/getMine.json'),
    data: data
  }
  return axios(config);
}
