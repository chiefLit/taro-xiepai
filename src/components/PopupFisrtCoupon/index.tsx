import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'
import couponCardImage from '../../assets/images/coupon-card.png'

export default class FirstCoupon extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  // constructor(props) {
  //   super(props)
  // }

  componentWillMount() { }

  render() {
    const { cancel, receive } = this.props
    return (
      <View className='popup-first-coupon-wrapper'>
        <View className="mask-module"></View>
        <View className="content-module" onClick={receive}>
          <AtIcon value='close' size='20' color='#fff' onClick={cancel}></AtIcon>
          <Image className="coupon-card" src={couponCardImage}></Image>
          <View className="cover-box">
          </View>
          <View className="conpon-box">
            <View className="price-box">
              <View className="unit">￥</View>
              <View className="price">20</View>
            </View>
            <View className="desc">新人专享优惠券</View>
            <View className="button">立即领取</View>
          </View>
        </View>
      </View>
    )
  }
}
