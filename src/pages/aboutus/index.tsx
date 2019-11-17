import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Aboutus extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '关于我们'
  }

  componentWillMount() { }

  render() {
    return (
      <View className='aboutus-wrapper'>
        <View className="store-item">
          <View className="title">鞋π(三宝文化店)</View>
          <View className="content">
            <Text>浙江省 杭州市 下城区 体育场路406号</Text>
            <Text>联系方式:18758255201</Text>
          </View>
        </View>
        <View className="footer-contianer">
          {/* <View> */}
          <Text>杭州丝内刻科技有限公司</Text>
          <Text>享有本服务最终解释权</Text>

          {/* </View> */}
        </View>
      </View>
    )
  }
}
