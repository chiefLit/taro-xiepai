import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

import {DEFAULT_CONFIG} from '../../config'

export default class ProductMend extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  componentWillMount() { }

  config = {
    navigationBarTitleText: '修鞋修复'
  }


  render() {
    return (
      <View className='product-mend-wrapper'>
        <View className='tips'>
          <Text>系统加紧开发中，有鞋子修复需求请电话联系：</Text>
          <Text className='phone' onClick={() => {
            Taro.makePhoneCall({
              phoneNumber: String(DEFAULT_CONFIG.customerServicePhone)
            })
          }}
          >{DEFAULT_CONFIG.customerServicePhone}</Text>
        </View>
      </View>
    )
  }
}
