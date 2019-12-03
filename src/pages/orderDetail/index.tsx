import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtButton, AtIcon } from 'taro-ui'

import * as orderApi from '../../api/order'
import * as commonApi from '../../api/common'
import { DEFAULT_CONFIG, orderStatusToValue } from '../../config'
import * as utils from '../../utils/index'

export default class OrderDetail extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单详情'
  }

  state = {
    orderDetail: {
      id: null,
      number: null,
      userId: null,
      deliverMode: "",
      channel: "",
      orderSubVoList: [],
      totalPrice: 0,
      couponId: null,
      couponAmount: 0,
      realPayAmount: 0,
      realPayPrice: 0,
      storeVo: {},
      toStoreId: null,
      toStoreExpressId: null,
      toStoreExpressName: "",
      toStoreExpressNumber: null,
      toUserAddressId: null,
      userAddressVo: {},
      toUserExpressId: null,
      toUserExpressName: "",
      toUserExpressNumber: null,
      status: null,
      applyTime: null,
      payChannel: null,
      payTime: null,
      endTime: null,
      closeReason: ""
    }
  }

  componentDidShow() {
    let params: any = this.$router.params
    // if (params.id) {
    this.pullData(params.id)
    // }
  }



  async pullData(orderId: any) {
    let data: any = await orderApi.getOrderDetail({ orderId });
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.setState({
        orderDetail: data.object
      })
    }
  }
  // { getOrderDetail, orderCancel, toOrderById }
  async orderCancel() {
    Taro.showModal({
      // title: '提示',
      content: '确定取消订单？',
      success: async (res: any) => {
        if (res.confirm) {
          let data: any = await orderApi.orderCancel({
            orderId: this.state.orderDetail.id
          });
          if (data.code !== 1) {
            Taro.showToast({
              title: data.message,
              icon: 'none'
            })
          } else {
            Taro.showToast({
              title: '订单已取消',
              icon: 'none'
            }).then(() => {
              Taro.navigateBack();
            })
          }
        }
      }
    })
  }

  async toOrderById() {
    let data: any = await orderApi.toOrderById({
      orderId: this.state.orderDetail.id
    });
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      Taro.requestPayment({
        timeStamp: data.object.clientPayMap.timeStamp,
        nonceStr: data.object.clientPayMap.nonceStr,
        package: data.object.clientPayMap.package,
        signType: data.object.clientPayMap.signType,
        paySign: data.object.clientPayMap.paySign,
        success: (res) => {
          this.userPayResult({
            payOrderId: this.state.orderDetail.id,
            result: 'SUCCESS',
            resultDesc: res
          }, Taro.showToast({
            title: "支付成功",
            icon: "none"
          }).then(() => {
            this.pullData(this.$router.params.id)
          }))
        },
        fail: (res) => {
          this.userPayResult({
            payOrderId: this.state.orderDetail.id,
            result: 'FAIL',
            resultDesc: res
          }, Taro.showToast({
            title: "支付失败",
            icon: "none"
          }))
        }
      })
    }
  }

  async userPayResult(params: any, callBack) {
    const data: any = await commonApi.userPayResult(params);
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      callBack && callBack()
    }
  }



  render() {
    let { orderDetail } = this.state
    return (
      <View className='order-detail-wrapper'>
        <View className="order-status" onClick={() => {
          if (orderDetail.status != 1) return
          Taro.navigateTo({
            url: `/pages/expressInfoEdit/index?id=${orderDetail.id}`
          })
        }}>
          <View className="status-value">{orderStatusToValue(orderDetail.status, 0)}</View>
          {
            orderStatusToValue(orderDetail.status, 1) ?
              <View className="status-desc">
                {
                  orderDetail.status === -2 ?
                    orderDetail.closeReason :
                    orderStatusToValue(orderDetail.status, 1)
                }
              </View> :
              null
          }
        </View>

        <View className="order-address">
          <View className="title">收货地址</View>
          <View className="address-info">
            <View className="left-box">
              <View className="name">{orderDetail.userAddressVo.linkName}  {orderDetail.userAddressVo.phone}</View>
              <View className="address">{orderDetail.userAddressVo.provinceName} {orderDetail.userAddressVo.cityName} {orderDetail.userAddressVo.countyName} {orderDetail.userAddressVo.address}</View>
            </View>
            {/* {orderDetail.status === 1 ? <AtIcon value="chevron-right" size="15" color="#999"></AtIcon> : null} */}
          </View>
          <View className="dist-mode">
            <View className="mode-left">
              <View className="line1">配送方式</View>
              <View className="line2">请在支付后寄出鞋子，并补全快递信息</View>
            </View>
            <View className="mode-right">自己快递</View>
          </View>
        </View>

        <View className="order-service">
          <View className="service-list">
            {
              orderDetail.orderSubVoList.map((ele: any) => {
                return (
                  <View className="service-item" key={ele}>
                    {
                      ele.serviceImageList.map((imageItem: any) => {
                        return imageItem.aspect === 0 ? <Image className="item-image" mode="aspectFill" key={imageItem.aspect} src={imageItem.url}></Image> : null
                      })
                    }
                    <View className="item-info">
                      <View className="name">{ele.goodzTitle}</View>
                      <View className="product-list">
                        {
                          ele.serviceDetailList.map((serviceItem: any) => {
                            return (
                              <View className="product-item" key={serviceItem.serviceId}>{serviceItem.serviceName}</View>
                            )
                          })
                        }
                      </View>
                    </View>

                    <View className="product-price">￥{ele.totalPrice.toFixed(2)}</View>
                  </View>
                )
              })
            }
          </View>
          {/* <View className="module-list">
            <View className="key">运费</View>
            <View className="value">￥ 6.00</View>
          </View> */}
          <View className="module-list">
            <View className="key">优惠券</View>
            <View className="value">
              {orderDetail.couponId ? <Text>-￥{orderDetail.couponAmount}</Text> : '未使用'}
              {/* <Text>暂无可用</Text> */}
            </View>
            {orderDetail.status === undefined ? <AtIcon value="chevron-right" size="15" color="#999"></AtIcon> : null}
          </View>
        </View>

        <View className="order-price">
          <View className="module-list">
            <View className="key">商品总额</View>
            <View className="value">￥{orderDetail.totalPrice.toFixed(2)}</View>
          </View>
          {/* <View className="module-list">
            <View className="key">运费</View>
            <View className="value">￥ 6.5</View>
          </View> */}
          <View className="module-list">
            <View className="key">优惠券</View>
            <View className="value">{orderDetail.couponId ? `-￥${orderDetail.couponAmount.toFixed(2)}` : `未使用`}</View>
          </View>
          {
            orderDetail.status !== 0 ?
              <View className="module-list">
                <View className="key">实际支付</View>
                <View className="value red">￥{orderDetail.realPayAmount.toFixed(2)}</View>
              </View> :
              null
          }
        </View>

        <View className="order-infomation">
          <View className="module-list">
            <View className="key">订单编号</View>
            <View className="value">{orderDetail.number}</View>
          </View>
          <View className="module-list">
            <View className="key">订单日期</View>
            <View className="value">{utils.parseTime(orderDetail.applyTime, null)}</View>
          </View>
          {
            orderDetail.status !== 0 ?
              <View className="module-list">
                <View className="key">支付方式</View>
                <View className="value">{orderDetail.payChannel === 0 ? "微信支付" : ""}</View>
              </View> :
              null
          }
        </View>

        <View className="footer-cover"></View>

        <View className="order-footer">
          {orderDetail.status === 0 || orderDetail.status === 1 ? <AtButton className="type1" full onClick={this.orderCancel.bind(this)}>取消订单</AtButton> : null}
          {orderDetail.status === 0 ? <AtButton className="type2" full onClick={this.toOrderById.bind(this)}>立即支付</AtButton> : null}
          {orderDetail.status === 1 ? <AtButton className="type2" full onClick={() => {
            Taro.navigateTo({
              url: `/pages/expressInfoEdit/index?id=${orderDetail.id}`
            })
          }}>填写快递信息</AtButton> : null}
          {orderDetail.status !== 0 && orderDetail.status !== 1 ? <AtButton className="type2" full onClick={() => {
            Taro.makePhoneCall({
              phoneNumber: String(DEFAULT_CONFIG.customerServicePhone)
            })
          }}>联系客服</AtButton> : null}
        </View>
      </View >
    )
  }
}
