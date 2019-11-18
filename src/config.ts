// 本地存储
export const STORAGE_NAME: any = {
  // 用户信息
  userInfo: "__USER_INFO__",

  // 用户信息
  token: "__USER_TOKEN__",

  // 已选择的优惠券
  selectedCoupon: "__COUPON_SELECTED__",

  // 已选择的地址信息
  selectedAddress: "__ADDRESS_SELECTED__",

  // 提交到 /pages/orderEdit/index 页面的参数
  orderToCashier: "__ORDER_TO_CASHIER__",
}

// 订单状态管理
export const orderStatusToValue = (status: any, type: Number) => {
  if (status === undefined || status === null) {
    return "无状态"
  }
  let statusVo = {
    0: ["待支付", '24小时未支付订单将关闭'],
    1: ["已下单", "等待补充物流信息>"],
    2: ["鞋子运输中", "快递到店途中"],
    3: ["鞋子已到店", "工作人员核验中"],
    4: ["鞋子清洗中", ""],
    5: ["鞋子清洗完成", ""],
    6: ["鞋子寄回中", "正在到家途中"],
    7: ["订单完成", "鞋子已寄到"],
    8: ["退款中", ""],
    9: ["已退款", ""],
    "-1": ["已取消", ''],
    "-2": ["已关闭", ""]
  }

  return statusVo[status][type]

}

// 默认店铺信息
export const storeInfo: any = {
  storeName: '鞋π(三宝文化店)',
  phone: 18758255201,
  provinceName: "浙江省",
  cityName: "杭州市",
  countyName: "下城区",
  address: "体育场路406号",
}

// 客服电话
export const customerServicePhone: Number = 18668223132
