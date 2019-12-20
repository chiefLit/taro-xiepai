import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'
import * as orderApi from '../../api/order'

export default class ExpressSteps extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  state = {
    expressSteps: []
  }

  componentWillMount() {
    this.findOrderExpressLog({
      orderId: Number(this.$router.params.id),
      // 走向 0：用户寄给门店 1：门店寄给用户
      trend: Number(this.$router.params.trend)
    })
  }

  config = {
    navigationBarTitleText: '物流信息'
  }

  async findOrderExpressLog(params) {
    const data = await orderApi.findOrderExpressLog(params)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      const expressData = JSON.parse(data.object.content)

      const expressSteps = expressData.result.list.reverse().map((ele, index) => {
        return {
          ...ele,
          datetimeList: ele.datetime.split(' '),
          id: index + 1
        }
      })
      this.setState({
        expressSteps
      })
    }
  }

  render() {
    const { expressSteps } = this.state
    return (
      <View className='express-steps-wrapper'>
        {
          expressSteps.map((ele, index) => {
            return (
              <View className={index === 0 ? 'active step-item' : 'step-item'} key={ele.id}>
                <View className='item-date'>
                  <View className='line1'>{ele.datetimeList[0]}</View>
                  <View className='line2'>{ele.datetimeList[1]}</View>
                </View>
                <View className='item-point'>
                  {index === 0 ? <View className='circle'></View> : <View className='iconfont icongouxuan'></View>}

                  {index !== expressSteps.length - 1 ? <View className='line'></View> : null}
                </View>
                <View className='item-express'>
                  {/* <View className='title'>鞋子寄回中</View> */}
                  <View className='desc'>{ele.remark}</View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
