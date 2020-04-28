import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'

import './index.less'

import * as cartApi from '../../api/cart'
import { toCashierByCart } from '../../api/order'
import { checkPhoneLogin } from '../../api/user'

import noDataImage from '../../assets/images/no-data-cart.png'
import { addOrderToCashier } from '../../reducers/actions/orderToCashier'
import PopupAuthorization from '../../components/PopupAuthorization'

@connect(
  state => state,
  { addOrderToCashier }
)

export default class Cart extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  constructor(props) {
    super(props)
  }

  state = {
    cartList: [],
    selectedList: [],
    isSelectAll: false,
    showPopupAuthorization: false
  }

  config = {
    navigationBarTitleText: '购物车'
  }

  componentDidShow() {
    this.pullData()
  }

  async pullData() {
    let data = await cartApi.getCartList(null);
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.setState({
        cartList: data.object
      })
    }
  }

  deleteItem(id) {
    let { cartList, selectedList } = this.state
    Taro.showModal({
      // title: '提示',
      content: '确定删除？',
      success: async (res) => {
        if (res.confirm) {
          let data = await cartApi.deleteCart({ id })
          if (data.code !== 1) {
            Taro.showToast({
              title: data.message,
              icon: 'none'
            })
          } else {
            let currCartList = cartList.filter((ele) => ele.id !== id);
            let currSelectedList = selectedList.filter((ele) => ele.id !== id);
            this.setState({
              cartList: currCartList,
              selectedList: currSelectedList
            })
          }
        }
      }
    })
  }

  tapItem(item) {
    let selectedList = [...this.state.selectedList]
    let isSelectAll;
    let exisiIndex = selectedList.findIndex((ele) => ele.id === item.id);
    if (exisiIndex === -1) {
      selectedList.push(item)
    } else {
      selectedList = selectedList.filter((ele, index) => index !== exisiIndex)
    }
    isSelectAll = selectedList.length === this.state.cartList.length
    this.setState({
      isSelectAll,
      selectedList
    })
  }

  randerIcon(item) {
    let { selectedList } = this.state
    let isActive = selectedList.some((ele) => ele.id === item.id)
    return (
      !isActive ? <View className='iconfont iconweigouxuan1'></View> : <View className='iconfont icongouxuan'></View>
    )
  }

  calcTotalPrice(list) {
    let sum = 0;
    list.map((ele) => {
      sum += ele.totalPrice
    })
    return sum.toFixed(2)
  }

  // 结算
  async settlement(e) {
    e.stopPropagation()
    let { selectedList } = this.state
    if (!selectedList.length) return
    let cartIds = selectedList.map((ele) => ele.id)
    let data = await toCashierByCart({ cartIds })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.props.addOrderToCashier(data.object)
      // 添加成功
      Taro.navigateTo({
        url: `/pages/cashier/index?cartIds=${cartIds}`
      })
    }
  }

  renderNoData() {
    return (
      <View className='no-data-container'>
        <Image src={noDataImage}></Image>
        <View className='value'>还没有任何订单呢</View>
        <AtButton type='primary' size='small' circle onClick={async () => {
          const isLogin = await checkPhoneLogin()
          if (isLogin) {
            Taro.navigateTo({
              url: '/pages/productWash/index'
            })
          } else {
            this.handlePopupAuthorization(true)
          }
        }}
        >立即下单</AtButton>
      </View>
    )
  }

  handlePopupAuthorization(state) {
    this.setState({
      showPopupAuthorization: state
    })
  }

  renderCartItem(ele, index) {
    return (
      <View className='cart-item' onClick={this.tapItem.bind(this, ele, index)}>
        <View className='item-header'>
          <View className='info-name'>
            <Text>{ele.goodzTitle}</Text>
          </View>
          <View className='info-right'>快递配送</View>
        </View>
        <View className='item-content'>
          <View className='icon-box'>{this.randerIcon(ele)}</View>
          <View className='image-box'>
            {
              ele.cartServiceImageList.map((imgItem) => {
                return (
                  imgItem.aspect === 2 ? <Image mode='aspectFill' src={imgItem.url} key={imgItem.id}></Image> : null
                )
              })
            }
          </View>
          <View className='cart-info'>
            <View className='info-labels'>
              {
                ele.cartServiceDetailList.map((sub) => {
                  return (
                    <View className='label-item' key={sub.id}>{sub.serviceName}</View>
                  )
                })
              }
            </View>
            <View className='info-price'>￥{ele.totalPrice.toFixed(2)}</View>
          </View>
          <View className='delete-btn' onClick={this.deleteItem.bind(this, ele.id)}>删除</View>
        </View>
      </View>
    )
  }

  render() {
    let { cartList, selectedList, isSelectAll, showPopupAuthorization } = this.state;
    return (
      <View className='cart-wrapper'>
        {
          cartList.length ?
            <View>
              {
                cartList.map((ele, index) => {
                  return (
                    <View key={ele.id}>
                      {this.renderCartItem(ele, index)}
                    </View>
                  )
                })
              }
              <View className='footer-cover'></View>
              <View className='footer-container'>
                <View className='select-all'
                  onClick={() => {
                    this.setState((preState) => {
                      return {
                        selectedList: preState.isSelectAll ? [] : [...preState.cartList],
                        isSelectAll: !preState.isSelectAll
                      }
                    })
                  }}
                >
                  <View className={isSelectAll ? 'iconfont icongouxuan' : 'iconfont iconweigouxuan1'}></View>
                  <Text>全选</Text>
                </View>
                <View className='sum-price'>合计：<Text>￥{this.calcTotalPrice(selectedList)}</Text></View>
                <AtButton disabled={!selectedList.length} full onClick={this.settlement.bind(this)}>结算</AtButton>
              </View>
            </View> :
            this.renderNoData()
        }
        {showPopupAuthorization ? <PopupAuthorization
          changeValue={res => {
            this.handlePopupAuthorization(res)
          }}
        /> : null}
      </View>
    )
  }
}
