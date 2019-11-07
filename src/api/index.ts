import axios from '../utils/axios'

export default {
  test(data) {
    const config = {
      method: 'post',
      url: '/h5/user/apply',
      mockData: require('../../mock/test.json'),
      data: data
    };
    return axios(config);
  },
  // 门店列表
  storeList(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/store/list',
      mockData: require('../../mock/storeList.json'),
      data: data
    }
    return axios(config);
  },

  // 优惠券-获取某张
  getCoupon(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/coupon/get',
      mockData: require('../../mock/getCoupon.json'),
      data: data
    }
    return axios(config);
  },
  // 优惠券-领取
  drawCoupon(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/coupon/draw',
      mockData: require('../../mock/drawCoupon.json'),
      data: data
    }
    return axios(config);
  },

  // 补充微信用户手机号码
  improvePhone(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/user/improve_phone',
      mockData: require('../../mock/improvePhone.json'),
      data: data
    }
    return axios(config);
  },
  // 补充微信用户手机号码
  improveInfo(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/coupon/improve_info',
      mockData: require('../../mock/improveInfo.json'),
      data: data
    }
    return axios(config);
  },

  // 洗鞋-服务项目
  washServiceList(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/service/wash/service_item_list',
      mockData: require('../../mock/washServiceList.json'),
      data: data
    }
    return axios(config);
  },

  // 首页
  getIndex(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/index',
      mockData: require('../../mock/getIndex.json'),
      data: data
    }
    return axios(config);
  },

  // 登录/注册
  login(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/user/login',
      mockData: require('../../mock/login.json'),
      data: data
    }
    return axios(config);
  },

  // 我-我的地址-列表
  addressList(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/user/address/list',
      mockData: require('../../mock/addressList.json'),
      data: data
    }
    return axios(config);
  },
  // 我-我的地址-新增
  addAddress(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/user/address/add',
      mockData: require('../../mock/addAddress.json'),
      data: data
    }
    return axios(config);
  },
  // 我-我的地址-新增
  editAddress(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/user/address/edit',
      mockData: require('../../mock/editAddress.json'),
      data: data
    }
    return axios(config);
  },
  // 我的
  getMine(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/user/home',
      mockData: require('../../mock/getMine.json'),
      data: data
    }
    return axios(config);
  },
  // 我-优惠券-列表
  getCouponList(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/coupon/list',
      mockData: require('../../mock/getCouponList.json'),
      data: data
    }
    return axios(config);
  },
  // 快递公司列表
  getExpressCompanyList(data) {
    const config = {
      method: 'post',
      url: '/api/wxmp/express_company/list',
      mockData: require('../../mock/getExpressCompanyList.json'),
      data: data
    }
    return axios(config);
  }
}
