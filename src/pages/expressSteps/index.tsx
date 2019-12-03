import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

export default class ExpressSteps extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '物流信息'
  }

  state = {
    expressSteps: [1, 2, 3, 4, 5]
  }

  componentWillMount() { }

  render() {
    const { expressSteps } = this.state
    return (
      <View className='express-steps-wrapper'>
        {
          expressSteps.map((ele: any, index: Number) => {
            return (
              <View className={ index < 2 ? 'active step-item' : "step-item"} key={ele}>
                <View className="item-date">
                  <View className="line1">10-24</View>
                  <View className="line2">10-24</View>
                </View>
                <View className="item-point">
                  { index < 2 ? <View className="iconfont icongouxuan"></View> : <View className="circle"></View> }
                  
                  { index !== expressSteps.length - 1 ? <View className='line'></View> : null }
                </View>
                <View className="item-express">
                  <View className="title">鞋子寄回中</View>
                  <View className="desc">信息信息信息信息信息信息信息信息信息信息信息信息信息信息信息</View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
