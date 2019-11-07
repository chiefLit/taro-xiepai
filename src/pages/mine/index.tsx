import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './index.less'

export default class Mine extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  orderContentList = [
    { iconClassName: 'iconfont icondaizhifu', name: '待支付' },
    { iconClassName: 'iconfont iconjinhangzhong', name: '进行中' },
    { iconClassName: 'iconfont iconyiwancheng', name: '已完成' },
  ]

  mineList1 = [
    { iconClassName: 'iconfont icondaizhifu', name: '优惠券', value: '0 张', color: 'rgba(48, 39, 39, 0.6)' },
    { iconClassName: 'iconfont icondizhiguanli', name: '地址管理', value: '' },
  ]

  mineList2 = [
    { iconClassName: 'iconfont iconchangjianwenti', name: '常见问题' },
    { iconClassName: 'iconfont iconlianxiwomen', name: '联系我们', value: '187 5825 5201', color: '#4A90E2' },
    { iconClassName: 'iconfont iconguanyuwomen', name: '关于我们' },
  ]

  render() {
    return (
      <View className='mine-wrapper'>
        <View className="user-contianer">
          <Image className="head-portrait"></Image>
          <View className="username">登录/注册</View>
        </View>
        <View className="order-contianer">
          <View className="order-header">
            <View className="title">我的订单</View>
            <View className="header-right-btn">
              <Text>查看全部</Text>
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>
          <View className="content-list">
            {
              this.orderContentList.map((ele,index) => {
                return (
                  <View className="list-item" onClick={()=> {
                    console.log(index)
                  }} key={ele.name}>
                    <View className={ele.iconClassName}></View>
                    <View className="name">{ele.name}</View>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className="list-module">
          {
            this.mineList1.map((ele, index) => {
              return(
                <View className="module-item" key="ele.name" onClick={() => {
                  console.log(index)
                }}>
                  <View className={ele.iconClassName}></View>
                  <View className="name">{ele.name}</View>
                  <View className="right-value" style={{color: ele.color}}>{ele.value}</View>
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              )
            })
          }
        </View>
        <View className="list-module">
          {
            this.mineList2.map((ele, index) => {
              return(
                <View className="module-item" key="ele.name" onClick={() => {
                  console.log(index)
                }}>
                  <View className={ele.iconClassName}></View>
                  <View className="name">{ele.name}</View>
                  <View className="right-value" style={{color: ele.color}}>{ele.value}</View>
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
