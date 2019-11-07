import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import './index.less'
import { AtButton } from 'taro-ui'

export default class Cart extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '购物车',
    backgroundColor: '#fafafa'
  }

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    let cartList = [1, 2,3,4,5,6,7];
    return (
      <View className='cart-wrapper'>
        {
          cartList.map(ele => {
            return (
              <View className="cart-item">
                <View className="iconfont iconweigouxuan1 icongouxuan"></View>
                <View className="image-box">
                  {/* <Image src={}></Image> */}
                </View>
                <View className="cart-info">
                  <View className="info-name">普通清洗</View>
                  <View className="info-labels">
                    {
                      [1, 2, 3].map(ele => {
                        return (
                          <View className="label-item">防水</View>
                        )
                      })
                    }
                  </View>
                  <View className="info-price">￥49</View>
                </View>
                <View className="info-right">快递配送</View>
              </View>
            )
          })
        }
        <View className="footer-cover"></View>
        <View className="footer-contianer">
          <View className="select-all">
            <View className="iconfont iconweigouxuan1 icongouxuan"></View>
            <Text>全选</Text>
          </View>
          <View className="sum-price">合计：<Text>￥49</Text></View>
          <AtButton full className="">结算</AtButton>
        </View>
      </View>
    )
  }
}
