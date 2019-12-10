import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtList, AtListItem } from "taro-ui"

export default class Home extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '钱包'
  }

  render() {
    return (
      <View className='wallet-wrapper'>
        <View className="money-container">
          <Text>钱包余额：</Text>
          <Text>88888</Text>
        </View>
        <AtList>
          <AtListItem title='优惠券' onClick={() => {}} arrow='right' />
          <AtListItem title='交易记录' onClick={() => {}} arrow='right' />
        </AtList>
        <View></View>
      </View>
    )
  }
}
