import axios from '../utils/axios'

// 首页
export function getIndex(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/index',
    // mockData: require('../../mock/getIndex.json'),
    data: data
  }
  return axios(config);
}

// 快递公司列表
export function getExpressCompanyList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/express_company/list',
    // mockData: require('../../mock/getExpressCompanyList.json'),
    data: data
  }
  return axios(config);
}

// 常见问题列表
export function getFaqlist() {
  const config = {
    method: 'post',
    url: '/api/wxmp/article/listByType',
    // mockData: require('../../mock/getFaqlist.json'),
    data: { type: 1 }
  }
  return axios(config);
}


// 订单-支付-确认支付结果上报
export function userPayResult(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/pay/user-pay-result',
    // mockData: require('../../mock/getFaqlist.json'),
    data
  }
  return axios(config);
}


// 第三方快递信息
export function getKdInfo(data) {
  const config = {
    method: 'get',
    url: 'https://www.kdniao.com/JSInvoke/MSearchResult.aspx?expCode=YTO&expNo=YT4065793763601&sortType=DESC&color=rgb(46,114,251)',
    // mockData: require('../../mock/getFaqlist.json'),
    data
  }
  return axios(config);
}
