import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

import { findOrderLog } from '../../api/order'

export default class OrderSteps extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '订单跟踪'
  }

  state = {
    stepList: []
  }

  componentWillMount() {
    let params: any = this.$router.params;
    // if (params.id) {
      this.pullData(params.id)
    // } else {
    //   Taro.showToast({
    //     title: "无订单ID",
    //     icon: "none"
    //   })
    // }
  }

  async pullData(orderId: string) {
    let data: any = await findOrderLog({ orderId })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: "none"
      })
    } else {
      this.setState({
        stepList: data.object
      })
    }
  }

  render() {
    let { stepList } = this.state;
    return (
      <View className='order-steps-wrapper'>
        {
          stepList.map((ele: any) => {
            return (
              <View className={ele.status === 1 ? "steps-item active" : "steps-item"} key={ele.orderId}>
                <View className="dots">
                  {
                    ele.status === 1 ?
                      <View className="iconfont icongouxuan"></View> :
                      <View className="circle"></View>
                  }
                </View>
                <View className="item-content">
                  <View className="title">{ele.operate}</View>
                  <View className="desc">{ele.remark}</View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
