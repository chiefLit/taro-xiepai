import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import defaultAvatarUrl from '../../assets/images/default-avatarUrl.png'

import { getMine, improvePhone } from '../../api/user'
import { storeInfo, STORAGE_NAME } from '../../config'
import storage from '../../utils/storage'

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

  constructor() {
    super()
    this.onGetPhoneNumber = this.onGetPhoneNumber.bind(this)
  }

  state = {
    userInfo: {
      id: null,
      phone: "",
      nickName: "",
      avatarUrl: "",
      waitPayOrderCount: 2,
      ongoingOrderCount: 9,
      couponCount: 2
    },
    orderContentList: [
      { iconClassName: 'iconfont icondaizhifu', name: '待支付', amount: 0 },
      { iconClassName: 'iconfont iconjinhangzhong', name: '进行中', amount: 0 },
      { iconClassName: 'iconfont iconyiwancheng', name: '已完成', amount: 0 },
    ]
  }

  componentWillMount() {
    const userInfo: any = storage.getStorage(STORAGE_NAME.userinfo, null)
    this.setState({ userInfo })
    if (userInfo && userInfo.id && userInfo.phone) return
    this.pullData()
  }

  async pullData() {
    let data: any = await getMine(null)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.setState((preState: any) => ({
        userInfo: data.object,
        orderContentList: preState.orderContentList.map((ele: any, index: Number) => {
          if (index === 0) ele.amount = data.object.waitPayOrderCount
          if (index === 1) ele.amount = data.object.ongoingOrderCount
          return ele
        })
      }))
    }
  }

  // 获取手机号码
  async onGetPhoneNumber(res: any) {
    let data: any = await improvePhone({
      encryptedData: res.detail.encryptedData,
      vi: res.detail.iv
    })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.pullData()
    }
  }

  mineList1 = [
    {
      iconClassName: 'iconfont icondaizhifu',
      name: '优惠券',
      isCoupon: true,
      color: 'rgba(48, 39, 39, 0.6)',
      skipUrl: '/pages/couponList/index'
    },
    {
      iconClassName: 'iconfont icondizhiguanli',
      name: '地址管理',
      value: '',
      skipUrl: '/pages/myAddress/index'
    },
  ]

  mineList2 = [
    {
      iconClassName: 'iconfont iconchangjianwenti',
      name: '常见问题',
      skipUrl: '/pages/faqList/index'
    },
    {
      iconClassName: 'iconfont iconlianxiwomen',
      name: '联系我们',
      value: storeInfo.phone,
      color: '#4A90E2',
      phoneNumber: String(storeInfo.phone)
    },
    {
      iconClassName: 'iconfont iconguanyuwomen',
      name: '关于我们',
      skipUrl: '/pages/aboutus/index'
    },
  ]

  renderHeader() {
    const { userInfo } = this.state
    return (
      userInfo.phone ?
        <View className="user-contianer">
          <Image className="head-portrait" mode="aspectFill" src={userInfo.avatarUrl || defaultAvatarUrl}></Image>
          <View className="username">
            <View>{userInfo.nickName}</View>
            <View className="phone">{userInfo.phone}</View>
          </View>
        </View> :
        <Button open-type="getPhoneNumber" onGetPhoneNumber={this.onGetPhoneNumber.bind(this)} className="user-contianer user-button">
          <Image className="head-portrait" mode="aspectFill" src={userInfo.avatarUrl || defaultAvatarUrl}></Image>
          <View className="username">
            <View>登录/注册</View>
          </View>
        </Button>
    )
  }

  renderOrder() {
    const { orderContentList } = this.state
    return (
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
    )
  }

  renderListModule(moduleList: Array<any>) {
    const { userInfo } = this.state
    return (
      <View className="list-module">
        {
          moduleList.map((ele) => {
            return (
              <View className="module-item" key={ele.name} onClick={() => {
                if (ele.skipUrl) {
                  Taro.navigateTo({
                    url: ele.skipUrl
                  })
                } else {
                  Taro.makePhoneCall({
                    phoneNumber: ele.phoneNumber
                  })
                }
              }}>
                <View className={ele.iconClassName}></View>
                <View className="name">{ele.name}</View>
                <View className="right-value" style={{ color: ele.color }}>{ele.isCoupon ? `${userInfo.couponCount}张` : ele.value}</View>
                <View className='at-icon at-icon-chevron-right'></View>
              </View>
            )
          })
        }
      </View>
    )
  }

  render() {
    let { userInfo } = this.state;
    return (
      <View className='mine-wrapper'>
        {this.renderHeader()}
        {userInfo.phone ? this.renderOrder() : null}
        {userInfo.phone ? this.renderListModule(this.mineList1) : null}
        {this.renderListModule(this.mineList2)}
      </View>
    )
  }
}
