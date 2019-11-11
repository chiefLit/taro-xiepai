import axios from '../utils/axios'

// 门店列表
export function storeList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/store/list',
    mockData: require('../../mock/storeList.json'),
    data: data
  }
  return axios(config);
}