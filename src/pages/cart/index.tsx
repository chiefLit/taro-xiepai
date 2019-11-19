import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, } from '@tarojs/components'
import './index.less'
import { AtButton, AtSwipeAction } from 'taro-ui'

import { getCartList, deleteCart } from '../../api/cart'
import { toCashierByCart } from '../../api/order'
import { STORAGE_NAME } from '../../config'

import noDataImage from '../../assets/images/no-data-cart.png'

import { connect } from '@tarojs/redux'
import { addOrderToCashier } from '../../reducers/actions/orderToCashier'

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
  config: Config = {
    navigationBarTitleText: '购物车'
  }

  constructor(props) {
    super(props)
  }

  state = {
    cartList: [],
    selectedList: [],
    isSelectAll: false
  }

  componentWillMount() {
    this.pullData()
  }

  async pullData() {
    let data = await getCartList(null);
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

  deleteItem(id: Number) {
    let { cartList, selectedList } = this.state
    Taro.showModal({
      // title: '提示',
      content: '确定删除？',
      success: async (res) => {
        if (res.confirm) {
          let data = await deleteCart({ id })
          if (data.code !== 1) {
            Taro.showToast({
              title: data.message,
              icon: 'none'
            })
          } else {
            let currCartList = cartList.filter((ele: any) => ele.id !== id);
            let currSelectedList = selectedList.filter((ele: any) => ele.id !== id);
            this.setState({
              cartList: currCartList,
              selectedList: currSelectedList
            })
          }
        }
      }
    })
  }

  tapItem(item: any) {
    let selectedList: Array<any> = [...this.state.selectedList]
    let isSelectAll: Boolean;
    let exisiIndex: Number = selectedList.findIndex((ele: any) => ele.id === item.id);
    if (exisiIndex === -1) {
      selectedList.push(item)
    } else {
      selectedList = selectedList.filter((ele: any, index) => index !== exisiIndex)
    }
    isSelectAll = selectedList.length === this.state.cartList.length
    this.setState({
      isSelectAll,
      selectedList
    })
  }

  randerIcon(item: any) {
    let { selectedList } = this.state
    let isActive = selectedList.some((ele: any) => ele.id === item.id)
    return (
      !isActive ? <View className="iconfont iconweigouxuan1"></View> : <View className="iconfont icongouxuan"></View>
    )
  }

  calcTotalPrice(list: any) {
    let sum = 0;
    list.map((ele: any) => {
      sum += ele.totalPrice
    })
    return sum
  }

  // 结算
  async settlement() {
    let { selectedList } = this.state
    if (!selectedList.length) return
    let cartIds: Array<any> = selectedList.map((ele: any) => ele.id)
    let data: any = await toCashierByCart({ cartIds })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.props.addOrderToCashier(data.object)
      // 添加成功
      Taro.navigateTo({
        url: `/pages/orderEdit/index?cartIds=${cartIds}`
      })
    }
  }

  renderNoData() {
    return (
      <View className="no-data-contianer">
        <Image src={noDataImage}></Image>
        <View className="value">还没有任何优惠劵呢</View>
        <AtButton type="primary" size="small" circle onClick={() => {
          Taro.navigateTo({
            url: '/pages/productWash/index'
          })
        }}>立即下单</AtButton>
      </View>
    )
  }

  renderCartItem(ele: any, index: Number) {
    return (

      <AtSwipeAction className="scroll-view"
        options={[{ text: "删除", style: { backgroundColor: '#FF3939' } }]}
        onClick={this.deleteItem.bind(this, ele.id, index)}
        key={ele.id}
      >
        <View className='cart-item' onClick={this.tapItem.bind(this, ele, index)}>
          {this.randerIcon(ele)}
          <View className="image-box">
            {
              ele.cartServiceImageList.map((imgItem: any) => {
                return (
                  imgItem.aspect === 2 ? <Image mode="aspectFill" src={imgItem.url} key={imgItem.id}></Image> : null
                )
              })
            }
          </View>
          <View className="cart-info">
            <View className="info-name">{ele.goodzTitle}</View>
            <View className="info-labels">
              {
                ele.cartServiceDetailList.map((sub: any) => {
                  return (
                    <View className="label-item" key={sub.id}>{sub.serviceName}</View>
                  )
                })
              }
            </View>
            <View className="info-price">￥ {ele.totalPrice}</View>
          </View>
          <View className="info-right">快递配送</View>
        </View>
      </AtSwipeAction>
    )
  }

  render() {
    let { cartList, selectedList, isSelectAll } = this.state;
    return (
      <View className='cart-wrapper'>
        {
          cartList.length ?
            <View>
              {
                cartList.map((ele: any, index: Number) => {
                  return (
                    <View key={ele.id}>
                      {this.renderCartItem(ele, index)}
                    </View>
                  )
                })
              }
              <View className="footer-cover"></View>
              <View className="footer-contianer">
                <View className="select-all" onClick={() => {
                  this.setState((preState: any) => {
                    return {
                      selectedList: preState.isSelectAll ? [] : [...preState.cartList],
                      isSelectAll: !preState.isSelectAll
                    }
                  })
                }}>
                  <View className={isSelectAll ? "iconfont icongouxuan" : "iconfont iconweigouxuan1"}></View>
                  <Text>全选</Text>
                </View>
                <View className="sum-price">合计：<Text>￥ {this.calcTotalPrice(selectedList)}</Text></View>
                <AtButton disabled={!selectedList.length} full onClick={this.settlement.bind(this)}>结算</AtButton>
              </View>
            </View> :
            this.renderNoData()
        }
      </View>
    )
  }
}
