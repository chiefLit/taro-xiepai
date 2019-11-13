import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtButton, AtIcon } from 'taro-ui'

export default class OrderEdit extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单确认'
  }

  componentWillMount() {
    console.log(this.props)
  }

  render() {
    return (
      <View className='order-edit-wrapper'>
        <View className="addressee-info" onClick={() => {
          Taro.navigateTo({
            url: '/pages/myAddress/index'
          })
        }}>
          <View className="iconfont icondizhiguanli"></View>
          <View className="content">
            {
              true ? 
              <View className="default-value">请添加收货地址</View> :
              <View className="info-box">
                <View className="line1">灰色彭于晏 1871231231</View>
                <View className="line2">浙江省 浙江省浙江省浙江省浙江省浙江省浙江省 浙江省 浙江省</View>
              </View>
            }
          </View>
            <AtIcon value="chevron-right" size="15" color="#999"></AtIcon>
        </View>
        <View className="dist-mode">
          <View className="mode-left">
            <View className="line1">配送方式</View>
            <View className="line2">请在支付后寄出鞋子，并补全快递信息</View>
          </View>
          <View className="mode-right">
            <Text>自己快递</Text>
            <AtIcon value="chevron-right" size="14" color="#999"></AtIcon>
          </View>
        </View>

        <View className="order-service">
          <View className="service-list">
            {
              [1].map(ele => {
                return (
                  <View className="service-item" key={ele}>
                    <Image className="item-image"></Image>
                    <View className="item-info">
                      <View className="name">高级清洗</View>
                      <View className="product-list">
                        {
                          [1, 2, 3].map(ele => {
                            return (
                              <View className="product-item" key={ele}>去氧化</View>
                            )
                          })
                        }
                      </View>
                    </View>
                    <View className="product-price">￥ 109.5</View>
                  </View>
                )
              })
            }
          </View>
          <View className="module-list">
            <View className="key">运费</View>
            <View className="value">￥ 6.00</View>
          </View>
          <View className="module-list">
            <View className="key">优惠券</View>
            <View className="value">
              <Text>暂无可用</Text>
              <AtIcon value="chevron-right" size="14" color="#999"></AtIcon>
            </View>
          </View>
        </View>

        <View className="order-price">
          <View className="module-list">
            <View className="key">商品总额</View>
            <View className="value">￥ 109.00</View>
          </View>
          <View className="module-list">
            <View className="key">运费</View>
            <View className="value">￥ 6.5</View>
          </View>
          <View className="module-list" onClick={() => {
            Taro.navigateTo({
              url: '/pages/couponList/index'
            })
          }}>
            <View className="key">优惠券</View>
            <View className="value">￥ 6.5</View>
          </View>
          <View className="module-list">
            <View className="key">实际支付</View>
            <View className="value red">￥ 100.5</View>
          </View>
        </View>
        <View className="footer-cover"></View>
        <View className="footer-contianer">
          <View className="total-price">
            <Text>合计：</Text>
            <Text className="price">￥91.5</Text>
          </View>
          <AtButton full>立即支付</AtButton>
        </View>
      </View>
    )
  }
}
