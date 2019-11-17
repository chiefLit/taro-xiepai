import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtButton, AtIcon } from 'taro-ui'

import { getOrderDetail } from '../../api/order'
import { orderStatusToValue } from '../../config'

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
      totalPrice: "",
      couponId: null,
      couponAmount: null,
      realPayPrice: null,
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
    let data: any = await getOrderDetail({ orderId });
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
                  orderDetail.status === 2 ?
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

                    <View className="product-price">￥ {ele.totalPrice}</View>
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
              {orderDetail.couponId ? <Text>-￥ {orderDetail.couponAmount}</Text> : null}
              {/* <Text>暂无可用</Text> */}
            </View>
            {orderDetail.status === undefined ? <AtIcon value="chevron-right" size="15" color="#999"></AtIcon> : null}
          </View>
        </View>

        <View className="order-price">
          <View className="module-list">
            <View className="key">商品总额</View>
            <View className="value">￥ {orderDetail.totalPrice}</View>
          </View>
          {/* <View className="module-list">
            <View className="key">运费</View>
            <View className="value">￥ 6.5</View>
          </View> */}
          <View className="module-list">
            <View className="key">优惠券</View>

            <View className="value">{orderDetail.couponId ? `-￥ ${orderDetail.couponAmount}` : `未使用`}</View>
          </View>
          <View className="module-list">
            <View className="key">实际支付</View>
            <View className="value red">￥ {orderDetail.realPayPrice}</View>
          </View>
        </View>

        <View className="order-infomation">
          <View className="module-list">
            <View className="key">订单编号</View>
            <View className="value">{orderDetail.number}</View>
          </View>
          <View className="module-list">
            <View className="key">订单日期</View>
            <View className="value">{orderDetail.applyTime}</View>
          </View>
          <View className="module-list">
            <View className="key">支付方式</View>
            <View className="value">{orderDetail.payChannel === 0 ? "微信支付" : ""}</View>
          </View>
        </View>

        <View className="footer-cover"></View>

        <View className="order-footer">
          {orderDetail.status === 0 || orderDetail.status === 1 ? <AtButton className="type1" full>取消订单</AtButton> : null}
          {orderDetail.status === 0 ? <AtButton className="type2" full>立即支付</AtButton> : null}
          {orderDetail.status === 1 ? <AtButton className="type2" full>填写快递信息</AtButton> : null}
          {orderDetail.status !== 0 && orderDetail.status !== 1 ? <AtButton className="type2" full>联系客服</AtButton> : null}
        </View>
      </View >
    )
  }
}
