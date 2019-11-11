import axios from '../utils/axios'

// 首页
export function getIndex(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/index',
    mockData: require('../../mock/getIndex.json'),
    data: data
  }
  return axios(config);
}

// 快递公司列表
export function getExpressCompanyList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/express_company/list',
    mockData: require('../../mock/getExpressCompanyList.json'),
    data: data
  }
  return axios(config);
}
