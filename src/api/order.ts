import axios from '../utils/axios'

// 订单-列表
export function getOrderList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/list',
    // mockData: require('../../mock/getOrderList.json'),
    data: data
  }
  return axios(config);
}

// 订单-详情
export function getOrderDetail(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/get-order-detail',
    // mockData: require('../../mock/getOrderDetail.json'),
    data: data
  }
  return axios(config);
}

// 订单-查看订单日志
export function findOrderLog(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/find-order-log',
    // mockData: require('../../mock/findOrderLog.json'),
    data: data
  }
  return axios(config);
}

// 收银台-from购物车
export function toCashierByCart(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/to-cashier-by-cart',
    // mockData: require('../../mock/toCashierByCart.json'),
    data: data
  }
  return axios(config);
}

// 订单-购物车下单
export function toOrderByCart(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/to-order-by-cart',
    // mockData: require('../../mock/toOrderByCart.json'),
    data: data
  }
  return axios(config);
}

// 订单-订单支付
export function toOrderById(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/order-to-pay',
    // mockData: require('../../mock/toOrderByCart.json'),
    data: data
  }
  return axios(config);
}

// 订单-取消订单
export function orderCancel(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/cancel',
    // mockData: require('../../mock/toOrderByCart.json'),
    data: data
  }
  return axios(config);
}

// 订单-补充到店物流信息
export function addExpressInfo(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/add-to-store-express-info',
    // mockData: require('../../mock/addExpressInfo.json'),
    data: data
  }
  return axios(config);
}

// 订单-查看物流信息
export function findOrderExpressLog(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/find-order-express-log',
    // mockData: require('../../mock/addExpressInfo.json'),
    data: data
  }
  return axios(config);
}

// 订单-用户确认收货
export function confirmReceipt(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/order/confirm-receipt',
    // mockData: require('../../mock/addExpressInfo.json'),
    data: data
  }
  return axios(config);
}



