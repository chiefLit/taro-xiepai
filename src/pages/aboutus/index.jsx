import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

import * as storeApi from "../../api/store";

export default class Aboutus extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  config = {
    navigationBarTitleText: '关于我们'
  }

  state = {
    storeList: []
  }

  async getStoreList() {
    const data = await storeApi.getStoreList();
    this.setState({
      storeList: data
    })
  }

  componentDidMount() {
    this.getStoreList()
  }


  render() {
    const { storeList } = this.state
    return (
      <View className='aboutus-wrapper'>
        {
          storeList.map((storeItem) => {
            return (
              <View className='store-item' key={storeItem.id}>
                <View className='title'>{storeItem.name}</View>
                <View className='content'>
                  <Text>{storeItem.provinceName} {storeItem.cityName} {storeItem.countyName} {storeItem.address}</Text>
                  <View>联系方式: <Text className='phone'
                    onClick={() => {
                      Taro.makePhoneCall({
                        phoneNumber: String(storeItem.phone)
                      })
                    }}
                  >{storeItem.phone}</Text></View>
                </View>
              </View>
            )
          })
        }
        <View className='footer-container'>
          <Text>杭州丝内刻科技有限公司</Text>
          <Text>享有本服务最终解释权</Text>
        </View>
      </View>
    )
  }
}
