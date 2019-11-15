import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import defaultAvatarUrl from '../../assets/images/default-avatarUrl.png'

import { getMine } from '../../api/user'

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

  state = {
    nickName: '',
    phone: '',
    avatarUrl: defaultAvatarUrl,
    couponCount: '0 张',
    orderContentList: [
      { iconClassName: 'iconfont icondaizhifu', name: '待支付', amount: 0 },
      { iconClassName: 'iconfont iconjinhangzhong', name: '进行中', amount: 0 },
      { iconClassName: 'iconfont iconyiwancheng', name: '已完成', amount: 0 },
    ]
  }

  componentWillMount() {
    this.pullData()
  }

  async pullData() {
    let data = await getMine(null)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let avatarUrl = data.object.avatarUrl || this.state.avatarUrl
      this.setState((preState: any) => ({
        avatarUrl,
        phone: data.object.phone,
        nickName: data.object.nickName,
        couponCount: `${data.object.couponCount || 0} 张`,
        orderContentList: preState.orderContentList.map((ele: any, index: Number) => {
          if (index === 0) ele.amount = data.object.waitPayOrderCount
          if (index === 1) ele.amount = data.object.ongoingOrderCount
          return ele
        })
      }))
    }
  }

  // orderContentList = [
  //   { iconClassName: 'iconfont icondaizhifu', name: '待支付', },
  //   { iconClassName: 'iconfont iconjinhangzhong', name: '进行中' },
  //   { iconClassName: 'iconfont iconyiwancheng', name: '已完成' },
  // ]

  mineList1 = [
    {
      iconClassName: 'iconfont icondaizhifu',
      name: '优惠券',
      isCoupon: true,
      color: 'rgba(48, 39, 39, 0.6)',
      clickFn() {
        Taro.navigateTo({
          url: '/pages/couponList/index'
        })
      }
    },
    {
      iconClassName: 'iconfont icondizhiguanli',
      name: '地址管理',
      value: '',
      clickFn: () => {
        Taro.navigateTo({
          url: '/pages/myAddress/index'
        })
      }
    },
  ]

  mineList2 = [
    {
      iconClassName: 'iconfont iconchangjianwenti',
      name: '常见问题',
      clickFn: () => {
        Taro.navigateTo({
          url: '/pages/myAddress/index'
        })
      }
    },
    {
      iconClassName: 'iconfont iconlianxiwomen',
      name: '联系我们',
      value: '187 5825 5201',
      color: '#4A90E2',
      clickFn: () => {
        Taro.makePhoneCall({
          phoneNumber: '18758255201'
        })
      }
    },
    {
      iconClassName: 'iconfont iconguanyuwomen',
      name: '关于我们',
      clickFn: () => {
        Taro.navigateTo({
          url: '/pages/myAddress/index'
        })
      }
    },
  ]

  render() {
    let { orderContentList } = this.state;
    return (
      <View className='mine-wrapper'>
        <View className="user-contianer">
          <Image className="head-portrait" mode="aspectFill" src={this.state.avatarUrl}></Image>
          <View className="username">
            <View>{this.state.nickName}</View>
            {this.state.phone ? <View className="phone">{this.state.phone}</View> : null}
          </View>
        </View>
        <View className="order-contianer">
          <View className="order-header">
            <View className="title">我的订单</View>
            <View className="header-right-btn" onClick={() => {
              Taro.navigateTo({
                url: '/pages/orderList/index'
              })
            }}>
              <Text>查看全部</Text>
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>
          <View className="content-list">
            {
              orderContentList.map((ele, index) => {
                return (
                  <View className="list-item" onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/orderList/index?index=${index}`
                    })
                  }} key={ele.name}>
                    <View className={ele.iconClassName}>
                      {ele.amount ? <View className="spot">{ele.amount}</View> : null}
                    </View>
                    <View className="name">{ele.name}</View>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className="list-module">
          {
            this.mineList1.map((ele) => {
              return (
                <View className="module-item" key={ele.name} onClick={ele.clickFn}>
                  <View className={ele.iconClassName}></View>
                  <View className="name">{ele.name}</View>
                  <View className="right-value" style={{ color: ele.color }}>{ele.isCoupon ? this.state.couponCount : ele.value}</View>
                  <View className='at-icon at-icon-chevron-right'></View>
                </View>
              )
            })
          }
        </View>
        <View className="list-module">
          {
            this.mineList2.map((ele) => {
              return (
                <View className="module-item" key={ele.name} onClick={ele.clickFn}>
                  <View className={ele.iconClassName}></View>
                  <View className="name">{ele.name}</View>
                  <View className="right-value" style={{ color: ele.color }}>{ele.value}</View>
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
