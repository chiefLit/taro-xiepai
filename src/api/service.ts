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

// 订单-直接下单
export function toOrderByWash(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/service/wash/to_order',
    mockData: require('../../mock/washToOrder.json'),
    data: data
  }
  return axios(config);
}

// 购物车-洗鞋-加入购物车
export function toCartByWash(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/service/wash/to_cart',
    mockData: require('../../mock/toCartByWash.json'),
    data: data
  }
  return axios(config);
}

// 订单-补充到店物流信息
export function addExpressInfo(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/service/wash/add-to-store-express-info',
    mockData: require('../../mock/addExpressInfo.json'),
    data: data
  }
  return axios(config);
}


// 收银台-from单品-洗鞋
export function toCashierByWash(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/service/wash/to_cashier',
    mockData: require('../../mock/toCashier.json'),
    data: data
  }
  return axios(config);
}
