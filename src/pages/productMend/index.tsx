import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class ProductMend extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '修鞋修复'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='product-mend-wrapper'>
        <View className="tips">
          <Text>系统加紧开发中，有鞋子修复需求请电话联系：</Text>
          <Text className="phone" onClick={() => {
            Taro.makePhoneCall({
              phoneNumber: '9876 9344'
            })
          }}>9876 9344</Text>
        </View>
      </View>
    )
  }
}
