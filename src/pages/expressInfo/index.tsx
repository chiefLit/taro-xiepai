import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtIcon } from 'taro-ui'

export default class ExpressInfo extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '填写些快递信息'
  }

  componentWillMount() { }

  render() {
    return (
      <View className='express-info-wrapper'>
        <View className="header-tips">请自行邮寄鞋子，保留物流单号</View>

        <View className="platform-address">
          <View className="module-title">平台收货地址</View>
          <View className="module-content">
            <View className="iconfont icondizhiguanli"></View>
            <View className="address-info">
              <View className="line1">鞋派 18758255201</View>
              <View className="line2">浙江省 杭州市 拱墅区 学院北路50号</View>
            </View>
            <View className="copy-btn">复制</View>
          </View>
        </View>

        <View className="module-list">
          <View className="modue-item">
            <View className="name">快递公司</View>
            <View className="value">
              <Text>请选择快递公司</Text>
            </View>
            <AtIcon value="chevron-right" size="15" color="#999"></AtIcon>
          </View>
          <View className="modue-item">
            <View className="name">填写单号</View>
            <View className="value">
              <Text>请填写单号</Text>
            </View>
            <View className="iconfont iconsaoyisao"></View>
          </View>
        </View>

        <View className="footer-tips">
          <View>注:请不要邮寄您的原装鞋盒，以免损坏。</View>
          <View>最好在快递包裹内附带纸条，写上您的平台注册手机号码，方便我们区分和联系您。如有其他要求也可以写在纸条上。</View>
        </View>
      </View>
    )
  }
}
