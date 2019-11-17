export const STORAGE_NAME = {
  // 用户信息
  userInfo: "__USER_INFO__",

  // 已选择的优惠券
  selectedCoupon: "__COUPON_SELECTED__",

  // 已选择的地址信息
  selectedAddress: "__ADDRESS_SELECTED__",

  // 提交到 /pages/orderEdit/index 页面的参数
  orderToCashier: "__ORDER_TO_CASHIER__",
}

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