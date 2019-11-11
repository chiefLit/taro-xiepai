import axios from '../utils/axios'

// 补充微信用户手机号码
export function improvePhone(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/improve_phone',
    mockData: require('../../mock/improvePhone.json'),
    data: data
  }
  return axios(config);
}
// 补充微信用户手机号码
export function improveInfo(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/improve_info',
    mockData: require('../../mock/improveInfo.json'),
    data: data
  }
  return axios(config);
}

// 登录/注册
export function login(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/login',
    mockData: require('../../mock/login.json'),
    data: data
  }
  return axios(config);
}

// 我-我的地址-列表
export function addressList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/address/list',
    mockData: require('../../mock/addressList.json'),
    data: data
  }
  return axios(config);
}
// 我-我的地址-新增
export function addAddress(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/address/add',
    mockData: require('../../mock/addAddress.json'),
    data: data
  }
  return axios(config);
}
// 我-我的地址-编辑
export function editAddress(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/address/edit',
    mockData: require('../../mock/editAddress.json'),
    data: data
  }
  return axios(config);
}
// 我的
export function getMine(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/user/home',
    mockData: require('../../mock/getMine.json'),
    data: data
  }
  return axios(config);
}
