import axios from '../utils/axios'

// 洗鞋-服务项目
export function washServiceList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/service/wash/service_item_list',
    mockData: require('../../mock/washServiceList.json'),
    data: data
  }
  return axios(config);
}
