import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtIcon, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { connect } from '@tarojs/redux'

import './index.less'
import addrLineImage from '../../assets/images/addr-line.png'
import DoorDate from './components/door-date'
import StoreCurrent from "../../components/storeCurrent";
import { deliveryMethods } from "../../config";

import * as orderApi from '../../api/order'
import * as serviceApi from '../../api/service'
import * as commonApi from '../../api/common'
import * as userApi from '../../api/user'

import { deleteOrderToCashier } from '../../reducers/actions/orderToCashier'
import { deleteSelectedAddress } from '../../reducers/actions/selectedAddress'
import { deleteSelectedCoupon } from '../../reducers/actions/selectedCoupon'

@connect(
  state => state,
  { deleteOrderToCashier, deleteSelectedAddress, deleteSelectedCoupon }
)

export default class OrderEdit extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  constructor(props) {
    super(props)
    this.calcCoupon = this.calcCoupon.bind(this)
  }

  state = {
    // 订单是否已生成
    // isOrderGenerated: false,
    hasNoAddress: false,
    orderDetail: {
      userId: null,
      cashierSubVoList: [],
      totalPrice: 0,
      couponId: '',
      couponDiscountAmount: 0,
      totalDiscountAmount: 0,
      realPayPrice: 0,
    },
    currStore: {},
    userAddressVo: {
      id: null
    },
    showSelectAddr: false,

    deliverMode: 2,
    makeDoorStartTime: '',
    makeDoorEndTime: ''
  }
  // 入口页区分（单品-洗鞋、购物车）
  componentWillMount() {
    let params = this.$router.params
    if (params.cartIds) {
      this.formCartParams = {
        cartIds: params.cartIds.split(',')
      }
    } else if (params.serviceItemIds) {
      this.formWashProductParams = {
        serviceItemIds: params.serviceItemIds.split(','),
        image0Url: params.image0Url,
        image1Url: params.image1Url,
        image2Url: params.image2Url
      }
    } else {
      Taro.showToast({
        title: '无订单信息',
        icon: 'none'
      })
    }

    let orderDetail = this.props.orderToCashier.data || null

    if (orderDetail) {
      this.setState({
        orderDetail: {
          ...this.props.orderToCashier.data,
          // 老数据给一个默认送鞋方式
          // deliverMode: ( deliverMode !== undefined && deliverMode !== null ) ? deliverMode : 1
        }
      })
      this.props.deleteOrderToCashier()
    } else {
      Taro.showToast({
        title: '无订单信息',
        icon: 'none'
      })
    }
  }

  config = {
    navigationBarTitleText: '订单确认'
  }

  // 来自洗鞋的参数
  formWashProductParams = {
    serviceItemIds: [],
    image0Url: '',
    image1Url: '',
    image2Url: ''
  }

  // 来自购物车的参数
  formCartParams = {
    cartIds: []
  }

  componentDidShow() {
    const selectedAddressData = this.props.selectedAddress.data
    const selectedCouponData = this.props.selectedCoupon.data

    if (selectedAddressData && selectedAddressData.id) {
      this.setState({
        userAddressVo: selectedAddressData
      })
      this.props.deleteSelectedAddress()
    }

    if (selectedCouponData && selectedCouponData.id) {
      let selectedCoupon = selectedCouponData
      selectedCoupon.id && this.calcCoupon(selectedCoupon.id)
      this.props.deleteSelectedCoupon()
    }

    this.getAddressList()
  }

  // 请求接口计算价格
  async calcCoupon(couponId) {
    let data
    if (this.formCartParams.cartIds.length) {
      data = await orderApi.toCashierByCart({
        ...this.formCartParams,
        couponId
      })
    } else {
      data = await serviceApi.toCashierByWash({
        ...this.formWashProductParams,
        couponId
      })
    }
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

  // 提交订单
  async submitOrder() {
    const goodzInfo = commonApi.getCurrentStoreIdAndGoodzId()
    const { orderDetail, userAddressVo, deliverMode, makeDoorStartTime, makeDoorEndTime, currStore } = this.state
    if (!userAddressVo || !userAddressVo.id) {
      Taro.showToast({
        title: '请先选择收货地址',
        icon: 'none'
      })
      return
    }
    if ( deliverMode === 2 && !makeDoorStartTime) {
      Taro.showToast({
        title: '快递上门取件需要选择上门时间',
        icon: 'none'
      })
      return
    }
    let params;
    // 直接下单--单品洗鞋
    if (this.formCartParams.cartIds.length) {
      params = { 
        // ...goodzInfo,
        ...this.formCartParams, 
        storeId: orderDetail.storeId,
        deliverMode,
        makeDoorStartTime, 
        makeDoorEndTime
      }
    } else {
      params = { 
        ...goodzInfo, 
        ...this.formWashProductParams, 
        deliverMode, 
        makeDoorStartTime, 
        makeDoorEndTime 
      }
    }
    params.couponId = orderDetail.couponId
    params.toUserAddressId = userAddressVo.id

    let data;
    // console.log(params)
    // return
    const userPayResult = this.userPayResult.bind(this)
    Taro.showLoading()
    if (this.formCartParams.cartIds.length) {
      data = await orderApi.toOrderByCart(params)
    } else {
      data = await serviceApi.toOrderByWash(params)
    }
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
              Taro.redirectTo({ url: `/pages/orderDetail/index?id=${data.object.orderId}` })
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
            }).then(() => {
              Taro.redirectTo({ url: `/pages/orderDetail/index?id=${data.object.orderId}` })
            })
          })
        }
      })
    }
  }

  // 提交支付结果
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

  // 地址列表
  async getAddressList() {
    const data = await userApi.getAddressList(null)
    if (data.code === 1) {
      if (data.object && data.object.length > 0) {
        this.setState({ hasNoAddress: false })
      } else {
        this.setState({ hasNoAddress: true })
      }
    }
  }

  // 当前店铺
  async getCurrStore() {
    console.log('getCurrStore')
    // const currStore = await storeApi.getCurrStore({})
    // this.setState({
    //   currStore
    // });
  }

  render() {
    let { orderDetail, userAddressVo, hasNoAddress, showSelectAddr, deliverMode } = this.state;
    // console.log(orderDetail)
    return (
      <View className='order-edit-wrapper'>
        <View className='address-info'
          onClick={() => {
            if (hasNoAddress) {
              Taro.navigateTo({
                url: `/pages/myAddressEdit/index?isSelectStatus=true`
              })
            } else {
              Taro.navigateTo({
                url: `/pages/myAddress/index?selectedId=${userAddressVo.id}&isSelectStatus=true`
              })
            }
          }}
        >
          {/* <View className='iconfont icondizhiguanli'></View> */}
          {
            !userAddressVo || !userAddressVo.id ?
              <View className='at-icon at-icon-add-circle'></View> :
              null
          }
          <View className='content'>
            {
              !userAddressVo || !userAddressVo.id ?
                <View className='default-value'>请添加收货地址</View> :
                <View className='info-box'>
                  <View className='line1'>{userAddressVo.linkName} {userAddressVo.phone}</View>
                  <View className='line2'>{userAddressVo.provinceName} {userAddressVo.cityName} {userAddressVo.countyName} {userAddressVo.address}</View>
                </View>
            }
          </View>
          <AtIcon value='chevron-right' size='15' color='#999'></AtIcon>
          {/* {!isOrderGenerated ? <AtIcon value='chevron-right' size='15' color='#999'></AtIcon> : null} */}
        </View>
        <Image className='addr-line' mode='aspectFill' src={addrLineImage}></Image>

        <StoreCurrent storeId={orderDetail.storeId}/>

        <View className='dist-mode'>
          <View className='module-list' 
            // onClick={() => this.setState({ showSelectAddr: true })}
          >
            <View className='key'>送鞋方式</View>
            <View className='value'>
              <Text>{deliveryMethods[deliverMode].label} </Text>
              {/* <AtIcon value='chevron-right' size='15' color='#999'></AtIcon> */}
            </View>
          </View>
          <View className="desc">{deliveryMethods[deliverMode].desc}</View>
        </View>

        {deliverMode === 2 ?
          <DoorDate setDate={(makeDoorStartTime, makeDoorEndTime) => {
            this.setState(preState => {
              return {
                makeDoorStartTime,
                makeDoorEndTime
                // orderDetail: {
                //   ...preState.orderDetail,
                //   makeDoorStartTime, makeDoorEndTime
                // }
              }
            })
          }}></DoorDate> : null}

        <View className='order-service'>
          <View className='service-list'>
            {
              orderDetail.cashierSubVoList.map((ele) => {
                return (
                  <View className='service-item' key={ele.id}>
                    {
                      ele.serviceImageList.map((imageItem) => {
                        return imageItem.aspect === 0 ? <Image className='item-image' mode='aspectFill' key={imageItem.aspect} src={imageItem.url}></Image> : null
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
          {/* <View className='module-list'>
            <View className='key'>运费</View>
            <View className='value'>￥ 6.00</View>
          </View> */}
          <View className='module-list'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/couponSelect/index?selectedId=${orderDetail.couponId}`
              })
            }}
          >
            <View className='key'>优惠券</View>
            <View className='value'>
              {orderDetail.couponId ? <Text>-￥ {orderDetail.couponDiscountAmount}</Text> : <Text>未选择</Text>}
              <AtIcon value='chevron-right' size='14' color='#999'></AtIcon>
            </View>
          </View>
        </View>

        <View className='order-price'>
          <View className='module-list'>
            <View className='key'>商品总额</View>
            <View className='value'>￥{orderDetail.totalPrice.toFixed(2)}</View>
          </View>
          <View className='module-list'>
            <View className='key'>运费</View>
            <View className='value'>{orderDetail.expressFee ? `￥${orderDetail.expressFee.toFixed(2)}` : ''}</View>
          </View>
          <View className='module-list'
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/couponList/index'
              })
            }}
          >
            <View className='key'>优惠券</View>
            <View className='value'>-￥{orderDetail.couponDiscountAmount.toFixed(2)}</View>
          </View>
          <View className='module-list'>
            <View className='key'>实际支付</View>
            <View className='value red'>￥{orderDetail.realPayPrice.toFixed(2)}</View>
          </View>
        </View>

        <View className='footer-cover'></View>

        <View className='footer-container'>
          <View className='total-price'>
            <Text>合计：</Text>
            <Text className='price'>￥{orderDetail.realPayPrice.toFixed(2)}</Text>
          </View>
          <AtButton full onClick={this.submitOrder.bind(this)}>立即下单</AtButton>
        </View>

        <AtActionSheet isOpened={showSelectAddr}>
          {
            deliveryMethods.map((item) => {
              return (
                <AtActionSheetItem key={item.value} onClick={() => {
                  this.setState({
                    deliverMode: item.value,
                    showSelectAddr: false
                  })

                }}>{item.label}</AtActionSheetItem>
              )
            })
          }
        </AtActionSheet>
      </View>
    )
  }
}
