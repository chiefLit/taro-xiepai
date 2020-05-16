import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Block } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import './index.less'
import * as orderApi from '../../api/order'
import * as commonApi from '../../api/common'
import { DEFAULT_CONFIG, orderStatusToValue, deliveryMethods } from '../../config'
import * as utils from '../../utils/index'

import StoreItem from "../../components/storeItem";

export default class OrderDetail extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  state = {
    orderDetail: {
      id: null,
      number: null,
      userId: null,
      deliverMode: '',
      channel: '',
      orderSubVoList: [],
      totalPrice: 0,
      couponId: null,
      couponAmount: 0,
      realPayAmount: 0,
      realPayPrice: 0,
      storeVo: {},
      toStoreId: null,
      toStoreExpressId: null,
      toStoreExpressName: '',
      toStoreExpressNumber: null,
      toUserAddressId: null,
      userAddressVo: {},
      toUserExpressId: null,
      toUserExpressName: '',
      toUserExpressNumber: null,
      status: null,
      applyTime: null,
      payChannel: null,
      payTime: null,
      endTime: null,
      closeReason: ''
    }
  }

  config = {
    navigationBarTitleText: '订单详情'
  }

  componentDidShow() {
    this.pullData()
  }

  async pullData() {
    let data = await orderApi.getOrderDetail({ orderId: this.$router.params.id });
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

  // 订单取消
  async orderCancel() {
    Taro.showModal({
      // title: '提示',
      content: '确定取消订单？',
      success: async (res) => {
        if (res.confirm) {
          let data = await orderApi.orderCancel({
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
              this.pullData()
            })
          }
        }
      }
    })
  }

  // 支付
  async toOrderById() {
    const userPayResult = this.userPayResult.bind(this)
    const pullData = this.pullData.bind(this)
    Taro.showLoading()
    let data = await orderApi.toOrderById({
      orderId: this.state.orderDetail.id
    });
    Taro.hideLoading()
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
          Taro.showLoading()
          userPayResult({
            payOrderId: data.object.payOrderId,
            result: 'SUCCESS',
            resultDesc: JSON.stringify(res)
          }, () => {
            Taro.hideLoading()
            Taro.showToast({
              title: '支付成功',
              icon: 'none'
            }).then(() => {
              pullData()
            })
          })
        },
        fail: (res) => {
          Taro.showLoading()
          userPayResult({
            payOrderId: data.object.payOrderId,
            result: 'FAIL',
            resultDesc: JSON.stringify(res)
          }, () => {
            Taro.hideLoading()
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            })
          })
        }
      })
    }
  }

  // 提交结果
  async userPayResult(params, callBack) {
    const data = await commonApi.userPayResult(params);
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      callBack && callBack()
    }
  }

  // 确认收货
  async confirmReceipt() {
    Taro.showModal({
      // title: '提示',
      content: '确定已收货？',
      success: async (res) => {
        if (res.confirm) {
          Taro.showLoading();
          const data = await orderApi.confirmReceipt({
            orderId: this.state.orderDetail.id
          })
          Taro.hideLoading();
          if (data.code !== 1) {
            Taro.showToast({
              title: data.message,
              icon: 'none'
            })
          } else {
            Taro.showToast({
              title: '已确认收货',
              icon: 'none'
            })
            this.pullData(this.$router.params.id)
          }
        }
      }
    })
  }

  toEditExpressInfo() {
    Taro.navigateTo({
      url: `/pages/expressInfoEdit/index?id=${this.state.orderDetail.id}`
    })
  }

  callCustomerServicePhone() {
    Taro.makePhoneCall({
      phoneNumber: String(DEFAULT_CONFIG.customerServicePhone)
    })
  }



  render() {
    let { orderDetail } = this.state
    return (
      <View className='order-detail-wrapper'>
        <View className='order-status'
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/orderSteps/index?id=${orderDetail.id}`
            })
          }}
        >
          <View className='status-value'>
            {orderStatusToValue(orderDetail.status, 0)} 
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
          <View className='status-desc'>
            {
              orderDetail.status === -2 ?
                <Text>{orderDetail.closeReason}</Text> :
                <Text>{orderStatusToValue(orderDetail.status, 1)}</Text>
            }
          </View>
        </View>

        <View className="store-box">
          <StoreItem storeVo={orderDetail.storeVo}></StoreItem>
        </View>

        <View className='order-address'>
          <View className='title'>收货地址</View>
          <View className='address-info'>
            <View className='left-box'>
              <View className='name'>{orderDetail.userAddressVo.linkName}  {orderDetail.userAddressVo.phone}</View>
              <View className='address'>{orderDetail.userAddressVo.provinceName} {orderDetail.userAddressVo.cityName} {orderDetail.userAddressVo.countyName} {orderDetail.userAddressVo.address}</View>
            </View>
            {/* {orderDetail.status === 1 ? <AtIcon value='chevron-right' size='15' color='#999'></AtIcon> : null} */}
          </View>
          <View className='dist-mode'>
            <View className='module-list'>
              <View className='key'>配送方式</View>
              <View className='value'>{deliveryMethods[orderDetail.deliverMode].label}</View>
            </View>
            <View className='desc'>{deliveryMethods[orderDetail.deliverMode].desc}</View>
          </View>
        </View>

        <View className='order-service'>
          <View className='service-list'>
            {
              orderDetail.orderSubVoList.map((ele) => {
                return (
                  <View className='service-item' key={ele.id}>
                    {
                      ele.serviceImageList.map((imageItem) => {
                        return imageItem.aspect === 0 && imageItem.step === 0 ? <Image className='item-image' mode='aspectFill' key={imageItem.aspect} src={imageItem.url}></Image> : null
                      })
                    }
                    <View className='item-info'>
                      <View className='name'>{ele.goodzTitle}</View>
                      <View className='product-list'>
                        {
                          ele.serviceDetailList.map((serviceItem) => {
                            return (
                              <View className='product-item' key={serviceItem.serviceId}>{serviceItem.serviceName}</View>
                            )
                          })
                        }
                      </View>
                    </View>

                    <View className='product-price'>￥{ele.totalPrice.toFixed(2)}</View>
                  </View>
                )
              })
            }
          </View>
        </View>

        <View className='order-price'>
          <View className='module-list'>
            <View className='key'>商品总额</View>
            <View className='value'>￥{orderDetail.totalPrice.toFixed(2)}</View>
          </View>
          <View className='module-list'>
            <View className='key'>运费(包含来回)</View>
            <View className='value'>{orderDetail.expressFee ? `￥${orderDetail.expressFee.toFixed(2)}` : ''}</View>
          </View>
          <View className='module-list'>
            <View className='key'>优惠券</View>
            <View className='value'>{orderDetail.couponId ? `-￥${orderDetail.couponAmount.toFixed(2)}` : `未使用`}</View>
          </View>
          {
            orderDetail.status !== 0 ?
              <View className='module-list'>
                <View className='key'>实际支付</View>
                <View className='value red'>￥{orderDetail.realPayAmount.toFixed(2)}</View>
              </View> :
              null
          }
        </View>

        <View className='order-infomation'>
          <View className='module-list'>
            <View className='key'>订单编号</View>
            <View className='value'>{orderDetail.number}</View>
          </View>
          <View className='module-list'>
            <View className='key'>订单日期</View>
            <View className='value'>{utils.parseTime(orderDetail.applyTime, null)}</View>
          </View>
          {
            orderDetail.status !== 0 ?
              <View className='module-list'>
                <View className='key'>支付方式</View>
                <View className='value'>{orderDetail.payChannel === 0 ? '微信支付' : ''}</View>
              </View> :
              null
          }
        </View>

        <View className='footer-cover'></View>

        <View className='order-footer'>
          {orderDetail.status === 0 ? <Block>
            <AtButton className='type1' full onClick={this.orderCancel.bind(this)}>取消订单</AtButton>
            <AtButton className='type2' full onClick={this.toOrderById.bind(this)}>立即支付</AtButton>
          </Block> : null}
          {orderDetail.status === 1 ? <Block>
            <AtButton className='type1' full onClick={this.orderCancel.bind(this)}>取消订单</AtButton>
            {/* <AtButton className='type2' full onClick={this.toEditExpressInfo.bind(this)}>填写快递信息</AtButton> */}
          </Block> : null}

          {[2, 3, 4, 5, 7, 8, 9, -1, -2].some(ele => ele === orderDetail.status) ? <Block>
            <AtButton className='type2' full onClick={this.callCustomerServicePhone.bind(this)}>联系客服</AtButton>
          </Block> : null}

          {orderDetail.status === 6 ? <Block>
            <AtButton className='type1' full onClick={this.callCustomerServicePhone.bind(this)}>联系客服</AtButton>
            <AtButton className='type2' full onClick={this.confirmReceipt.bind(this)}>确认收货</AtButton>
          </Block> : null}
        </View>
      </View >
    )
  }
}
