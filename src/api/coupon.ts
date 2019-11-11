import axios from '../utils/axios'

// 优惠券-获取某张
export function getCoupon(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/coupon/get',
    mockData: require('../../mock/getCoupon.json'),
    data: data
  }
  return axios(config);
}
// 优惠券-领取
export function drawCoupon(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/coupon/draw',
    mockData: require('../../mock/drawCoupon.json'),
    data: data
  }
  return axios(config);
}
// 我-优惠券-列表
export function getCouponList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/coupon/list',
    mockData: require('../../mock/getCouponList.json'),
    data: data
  }
  return axios(config);
}
