import axios from '../utils/axios'

export function getCartList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/cart',
    mockData: require('../../mock/getCartList.json'),
    data: data
  };
  return axios(config);
}

export function deleteCart(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/cart/delete',
    mockData: require('../../mock/deleteCart.json'),
    data: data
  };
  return axios(config);
}

export function washToCart(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/service/wash/to_cart',
    mockData: require('../../mock/washToCart.json'),
    data: data
  };
  return axios(config);
}
