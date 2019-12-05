import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.less'
import bannerImage from '../../../assets/images/firstLogin/banner.png'
import dianImage from '../../../assets/images/firstLogin/dian.png'

export default class FirstOrder extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '开业大吉,首单立减20元'
  }

  articleList: Array<any> = [
    {
      title: '活动时间',
      content: [
        '2019年12月12日 00:00-2019年12月20日 24:00'
      ]
    },
    {
      title: '参与条件',
      content: [
        '活动期间,第一次下单并成功的客户都可以获得优惠'
      ]
    },
    {
      title: '规则明细',
      content: [
        '1.凡在活动期间满足参与条件的用户,都可获得减免20元的优惠,由系统自动结算.',
        '2.如用户存在弄虚作假、刷单等行为侵害平台利益,平台有权对客户进行封号等措施.',
        '3.如对活动规则有任何疑议,请在线联系客服咨询.'
      ]
    }
  ]

  render() {
    return (
      <View className='first-order-wrapper'>
        <View className="banner">
          <Image src={bannerImage}></Image>
        </View>
        <View className="coupon-card">
          <View className="circle-top circle-icon"></View>
          <View className="circle-bottom circle-icon"></View>
          <View className="card-left">
            <Image src={dianImage}></Image>
            <View className="price-box">
              <View className="unit">￥</View>
              <View className="price">20</View>
            </View>
          </View>
          <View className="card-right">
            <View className="info">
              <View className="line1">仅限洗鞋订单</View>
              <View className="line2">有效期至：2019-12-20</View>
            </View>
            <View className="button">领券</View>
          </View>
        </View>
        <View className="container">
          <View className="container-title">活动规则</View>
          {
            this.articleList.map((ele: any, index) => {
              return (
                <View className="item" key={ele.title}>
                  <View className="title">{{ 0: '一', 1: '二', 2: '三' }[index]}、{ele.title}</View>
                  <View className="content">
                    {
                      ele.content.map((subItem: any) => {
                        return <View className="p">{subItem}</View>
                      })
                    }
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
