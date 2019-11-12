import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtButton, AtIcon } from 'taro-ui'

export default class OrderDetail extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单详情'
  }

  componentWillMount() { }

  render() {
    return (
      <View className='order-detail-wrapper'>
        <View className="order-status">
          <View className="status-value">运输中</View>
          <View className="status-desc">描述描述描述描述描述描述描述</View>
        </View>

        <View className="order-address">
          <View className="title">收货地址</View>
          <View className="address-info">
            <View className="name">灰色彭于晏 18758255201</View>
            <View className="address">浙江省 杭州市 下城区 体育场路406号浙江省 杭州市 下城区 体育场路406号浙江省 杭州市 下城区 体育场路406号</View>
          </View>
          <View className="dist-mode">
            <View className="mode-left">
              <View className="line1">配送方式</View>
              <View className="line2">请在支付后寄出鞋子，并补全快递信息</View>
            </View>
            <View className="mode-right">自己快递</View>
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
                          [1,2,3].map(ele => {
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
              <AtIcon value="chevron-right" color="#999"></AtIcon>
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
          <View className="module-list">
            <View className="key">优惠券</View>
            <View className="value">￥ 6.5</View>
          </View>
          <View className="module-list">
            <View className="key">实际支付</View>
            <View className="value red">￥ 100.5</View>
          </View>
        </View>

        <View className="order-infomation">
          <View className="module-list">
            <View className="key">订单编号</View>
            <View className="value">123123123123123</View>
          </View>
          <View className="module-list">
            <View className="key">订单日期</View>
            <View className="value">123123123123123</View>
          </View>
          <View className="module-list">
            <View className="key">支付方式</View>
            <View className="value">微信支付</View>
          </View>
        </View>

        <View className="footer-cover"></View>

        <View className="order-footer">
          <AtButton className="type1" full>联系客服</AtButton>
          <AtButton className="type2" full>联系客服</AtButton>
        </View>
      </View>
    )
  }
}
