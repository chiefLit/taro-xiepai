import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtButton, AtIcon } from 'taro-ui'
import addrLineImage from '../../assets/images/addr-line.png'
// import { getOrderDetail } from '../../api/order'
import { STORAGE_NAME } from '../../config'

import { toOrderByCart, toCashierByCart } from '../../api/order'
import { toOrderByWash, toCashierByWash } from '../../api/service'

export default class OrderEdit extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单确认'
  }

  constructor() {
    super()
    this.calcCoupon = this.calcCoupon.bind(this)
  }

  state = {
    // 订单是否已生成
    isOrderGenerated: false,
    orderDetail: {
      userId: null,
      cashierSubVoList: [],
      totalPrice: "",
      couponId: "",
      couponDiscountAmount: "",
      totalDiscountAmount: "",
      realPayPrice: ""
    },
    userAddressVo: {}
  }

  // 来自洗鞋的参数
  formWashProductParams: any = {
    serviceItemIds: [],
    image0Url: "",
    image1Url: "",
    image2Url: ""
  }

  // 来自购物车的参数
  formCartParams: any = {
    cartIds: []
  }

  // 入口页区分（单品-洗鞋、购物车）
  componentWillMount() {
    let params: any = this.$router.params
    if (params.cartIds) {
      console.log(params.cartIds)
      this.formCartParams = {
        cartIds: params.cartIds.split(",")
      }
    } else if (params.serviceItemIds) {
      console.log(params.serviceItemIds)
      this.formWashProductParams = {
        serviceItemIds: params.serviceItemIds.split(","),
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
    Taro.getStorage({ key: STORAGE_NAME.orderToCashier }).then((res: any) => {
      if (res.data) {
        this.setState({
          orderDetail: res.data
        })
        Taro.removeStorage({ key: STORAGE_NAME.orderToCashier })
      } else {
        Taro.showToast({
          title: '无订单信息',
          icon: "none"
        })
      }
    })
  }

  componentDidShow() {
    Taro.getStorage({
      key: STORAGE_NAME.selectedAddress
    }).then((res) => {
      this.setState({
        userAddressVo: res.data
      })
      Taro.removeStorage({ key: STORAGE_NAME.selectedAddress })
    })
    Taro.getStorage({
      key: STORAGE_NAME.selectedCoupon
    }).then((res) => {
      this.calcCoupon(res.data.id)
      Taro.removeStorage({ key: STORAGE_NAME.selectedCoupon })
    })
  }

  // async pullData(orderId) {
  //   let data: any = await getOrderDetail({ orderId })
  //   if (data.code !== 1) {
  //     Taro.showToast({
  //       title: data.message,
  //       icon: 'none'
  //     })
  //   } else {
  //     this.setState({
  //       orderDetail: data.object
  //     })
  //   }
  // }

  async calcCoupon(couponId: any) {
    let data: any
    if (this.formCartParams.cartIds.length) {
      data = await toCashierByCart({
        ...this.formCartParams,
        couponId
      })
    } else {
      data = await toCashierByWash({
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

  async submitOrder() {
    if (!this.state.userAddressVo || !this.state.userAddressVo.id) {
      Taro.showToast({
        title: "请先选择收货地址",
        icon: 'none'
      })
      return
    }
    let params: any;
    // 直接下单--单品洗鞋
    if (this.formCartParams.cartIds.length) {
      params = { ...this.formCartParams }
    } else {
      params = { ...this.formWashProductParams }
    }
    params.couponId = this.state.orderDetail.couponId
    params.toUserAddressId = this.state.userAddressVo.id
    params.deliverMode = 1
    console.log(params)
    let data: any;
    if (this.formCartParams.cartIds.length) {
      data = await toOrderByCart(params)
    } else {
      data = await toOrderByWash(params)
    }
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: "none"
      })
    } else {
      Taro.showToast({
        title: "下单成功",
        icon: "none"
      })
    }
  }

  render() {
    let { orderDetail, userAddressVo } = this.state;
    return (
      <View className='order-edit-wrapper'>
        <View className="address-info" onClick={() => {
          Taro.navigateTo({
            url: `/pages/myAddress/index?selectedId=${userAddressVo.id}&isSelectStatus=true`
          })
        }}>
          <View className="iconfont icondizhiguanli"></View>
          <View className="content">
            {
              !userAddressVo || !userAddressVo.id ?
                <View className="default-value">请添加收货地址</View> :
                <View className="info-box">
                  <View className="line1">{userAddressVo.linkName} {userAddressVo.phone}</View>
                  <View className="line2">{userAddressVo.provinceName} {userAddressVo.cityName} {userAddressVo.countyName} {userAddressVo.address}</View>
                </View>
            }
          </View>
          <AtIcon value="chevron-right" size="15" color="#999"></AtIcon>
          {/* {!isOrderGenerated ? <AtIcon value="chevron-right" size="15" color="#999"></AtIcon> : null} */}
        </View>
        <Image className="addr-line" mode="aspectFill" src={addrLineImage}></Image>

        <View className="dist-mode">
          <View className="mode-left">
            <View className="line1">配送方式</View>
            <View className="line2">请在支付后寄出鞋子，并补全快递信息</View>
          </View>
          <View className="mode-right">
            <Text>自己快递</Text>
            {/* <AtIcon value="chevron-right" size="15" color="#999"></AtIcon> */}
          </View>
        </View>

        <View className="order-service">
          <View className="service-list">
            {
              orderDetail.cashierSubVoList.map((ele: any) => {
                return (
                  <View className="service-item" key={ele.id}>
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
          <View className="module-list" onClick={() => {
            Taro.navigateTo({
              url: `/pages/couponSelect/index?selectedId=${orderDetail.couponId}`
            })
          }}>
            <View className="key">优惠券</View>
            <View className="value">
              {orderDetail.couponId ? <Text>-￥ {orderDetail.couponDiscountAmount}</Text> : <Text>未选择</Text>}
              <AtIcon value="chevron-right" size="14" color="#999"></AtIcon>
            </View>
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
          <View className="module-list" onClick={() => {
            Taro.navigateTo({
              url: '/pages/couponList/index'
            })
          }}>
            <View className="key">优惠券</View>
            <View className="value">-￥ {orderDetail.couponDiscountAmount}</View>
          </View>
          <View className="module-list">
            <View className="key">实际支付</View>
            <View className="value red">￥ {orderDetail.realPayPrice}</View>
          </View>
        </View>
        <View className="footer-cover"></View>
        <View className="footer-contianer">
          <View className="total-price">
            <Text>合计：</Text>
            <Text className="price">￥91.5</Text>
          </View>
          <AtButton full onClick={this.submitOrder.bind(this)}>立即下单</AtButton>
        </View>
      </View>
    )
  }
}
