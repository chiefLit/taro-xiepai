import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

import { storeInfo } from '../../config'

export default class Aboutus extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  componentWillMount() { }

  config = {
    navigationBarTitleText: '关于我们'
  }


  render() {
    return (
      <View className='aboutus-wrapper'>
        <View className='store-item'>
          <View className='title'>{storeInfo.storeName}</View>
          <View className='content'>
            <Text>{storeInfo.provinceName} {storeInfo.cityName} {storeInfo.countyName} {storeInfo.address}</Text>
            <View>联系方式: <Text className='phone'
              onClick={() => {
                Taro.makePhoneCall({
                  phoneNumber: String(storeInfo.phone)
                })
              }}
            >{storeInfo.phone}</Text></View>
          </View>
        </View>
        <View className='footer-container'>
          {/* <View> */}
          <Text>杭州丝内刻科技有限公司</Text>
          <Text>享有本服务最终解释权</Text>
          {/* </View> */}
        </View>
      </View>
    )
  }
}
