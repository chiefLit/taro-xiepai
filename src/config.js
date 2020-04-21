// 本地存储
export const STORAGE_NAME = {

  // 首页优惠券是否展示
  disableShowPopupFisrtCoupon: '__DISABLE_SHOW_POPUP_FIRST_COUPON__',
  
  // 用户信息
  userInfo: '__USER_INFO__',

  // token
  token: '__USER_TOKEN__',
}

// 订单状态管理
export const orderStatusToValue = (status, type) => {
  if (status === undefined || status === null) {
    return '无状态'
  }
  let statusVo = {
    0: ['待支付', '24小时未支付订单将关闭'],
    1: ['已下单', '等待补充物流信息'],
    2: ['鞋子运输中', '快递到店途中'],
    3: ['鞋子已到店', '工作人员核验中'],
    4: ['鞋子清洗中', ''],
    5: ['鞋子清洗完成', ''],
    6: ['鞋子寄回中', '正在到家途中'],
    7: ['订单完成', '鞋子已寄到'],
    8: ['退款中', ''],
    9: ['已退款', ''],
    '-1': ['已取消', ''],
    '-2': ['已关闭', '']
  }

  return statusVo[status][type]
}

// 配送方式
export const deliveryMethods = [
  { label: '自己上门', value: 0 },
  { label: '自己快递', value: 1, desc: '请在支付后寄出鞋子，并补全快递信息' },
  { label: '快递上门取件', value: 2, desc: '顺丰快递上门取件，平台发回使用中通快递,当前仅支持江浙沪闽皖地区' }
]

// 默认店铺信息
export const storeInfo = {
  storeName: '鞋π',
  phone: '183 6701 1078',
  provinceName: '浙江省',
  cityName: '杭州市',
  countyName: '拱墅区',
  address: '学院北路50号1栋108',
}

// 客服电话
export const customerServicePhone = '183 6701 1078'

export const DEFAULT_CONFIG = {
  // 客服电话
  customerServicePhone: '183 6701 1078',
  // 文件服务
  // fileBaseURL: 'https://file.sneakerpai.com/file/upload',
  fileBaseURL: 'https://dev-file.sneakerpai.com/file/upload',
  // 普通服务
  // baseURL: 'https://wxmp-api.sneakerpai.com/',
  baseURL: 'https://dev-wxmp-api.sneakerpai.com/',
}