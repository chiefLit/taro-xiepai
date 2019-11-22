import axios from '../utils/axios'

export function getCartList(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/cart/list',
    // mockData: require('../../mock/getCartList.json'),
    data: data
  };
  return axios(config);
}

export function deleteCart(data) {
  const config = {
    method: 'post',
    url: '/api/wxmp/cart/delete',
    // mockData: require('../../mock/deleteCart.json'),
    data: data
  };
  return axios(config);
}