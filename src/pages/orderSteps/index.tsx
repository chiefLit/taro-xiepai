import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

import * as orderApi from '../../api/order'
import * as utils from '../../utils/index'

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
    if (params.id) {
      this.pullData(params.id)
    } else {
      Taro.showToast({
        title: "无订单ID",
        icon: "none"
      })
    }
  }

  async pullData(orderId: string) {
    let data: any = await orderApi.findOrderLog({ orderId })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: "none"
      })
    } else {
      this.setState({
        stepList: [...data.object].reverse()
      })
    }
  }

  render() {
    let { stepList } = this.state;
    return (
      <View className='order-steps-wrapper'>
        {
          stepList.map((ele: any, index: Number) => {
            return (
              <View className={index === 0 ? 'active step-item' : "step-item"} key={ele}>
                <View className="item-date">
                  <View className="line1">{utils.parseTime(ele.operateTime, '{m}-{d}')}</View>
                  <View className="line2">{utils.parseTime(ele.operateTime, '{h}:{i}')}</View>
                </View>
                <View className="item-point">
                  {index === 0 ? <View className="circle"></View> : <View className="iconfont icongouxuan"></View>}
                  {index !== stepList.length - 1 ? <View className='line'></View> : null}
                </View>
                <View className="item-express">
                  <View className="title">{ele.operate}</View>
                  <View className="desc" onClick={() => {
                    // if (ele.status === 2 || ele.status === 6) {
                    //   const url = 'https://www.kdniao.com/JSInvoke/MSearchResult.aspx?expCode=YTO&expNo=YT4065793763601&sortType=DESC&color=rgb(46,114,251)'
                    //   const title = '快递详情'
                    //   Taro.navigateTo({
                    //     url: `/pages/wechatWebView/index?url=${url}&title=${title}`
                    //   })
                    // }
                    // }}>{ele.remark}</View>
                  }}>{ele.remark} {ele.status === 2 || ele.status === 6 ? '>' : null}</View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
