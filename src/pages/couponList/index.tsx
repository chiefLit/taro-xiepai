import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './index.less'

export default class CouponList extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '优惠券',
    enablePullDownRefresh: true
  }

  state = {
    current: 0
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  handleClick(value) {
    this.setState({
      current: value
    })
  }

  onPullDownRefresh() {
    console.log(1312)
    Taro.stopPullDownRefresh()
  }

  randerItem(item) {
    return (
      <View className="coupon-item">
        <View className="name">
          <Text className="num">5</Text>
          <Text className="unit"> 折</Text>
        </View>
        <View className="info">
          <View className="line1">仅限洗鞋订单</View>
          <View className="line2">有效期至：2019-11-11 23：59</View>
        </View>
        <View className="left-icon circle-icon"></View>
        <View className="right-icon circle-icon"></View>
        <View className="state-icons"></View>
      </View>
    )
  }

  render() {
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已失效' }]
    let { current } = this.state
    return (
      <View className='coupon-list-wrapper'>
        <AtTabs height="87" current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            {this.randerItem()}
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页三的内容</View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
