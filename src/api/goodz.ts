import axios from '../utils/axios'

// 门店商品列表-1.1
export function getGoodzList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/goodz/listByStore',
    data: data
  }
  return axios(config);
}