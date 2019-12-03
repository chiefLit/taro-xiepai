import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.less'
import { AtIcon, AtActionSheet, AtActionSheetItem, AtButton } from 'taro-ui'

import { getExpressCompanyList } from '../../api/common'
import * as orderApi from '../../api/order'
import {storeInfo} from '../../config'

export default class ExpressInfo extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '填写些快递信息'
  }

  state = {
    showExpressCompanyList: false,
    expressCompanyList: [],
    selectedExpressCompany: {
      id: null,
      name: ''
    },
    toStoreExpressNumber: ''
  }

  componentWillMount() {
    // this.$router.params.id
    this.getExpressCompanyList()
  }

  async getExpressCompanyList() {
    let data: any = await getExpressCompanyList(null)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.setState({
        expressCompanyList: data.object
      })
    }
  }

  scanBarCode() {
    Taro.scanCode().then((res: any)=>{
      this.setState({
        toStoreExpressNumber: res.result
      })
    })
  }

  async addExpressInfo() {
    if (!this.$router.params.id) {
      Taro.showToast({ title: '无订单信息', icon: 'none' })
      return
    }
    if (!this.state.selectedExpressCompany.id) {
      Taro.showToast({ title: '请选择快递公司', icon: 'none' })
      return
    }
    if (!this.state.toStoreExpressNumber) {
      Taro.showToast({ title: '请填写单号', icon: 'none' })
      return
    }
    let data: any = await orderApi.addExpressInfo({
      orderId: this.$router.params.id,
      toStoreId: 1,
      toStoreExpressId: this.state.selectedExpressCompany.id,
      toStoreExpressNumber: this.state.toStoreExpressNumber,
    })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      Taro.showToast({
        title: '提交成功',
        icon: 'none'
      }).then(() => {
        Taro.navigateBack()
      })
    }
  }

  render() {
    let { showExpressCompanyList, expressCompanyList, selectedExpressCompany, toStoreExpressNumber } = this.state
    return (
      <View className='express-info-wrapper'>
        <View className="header-tips">请自行邮寄鞋子，保留物流单号</View>

        <View className="platform-address">
          <View className="module-title">平台收货地址</View>
          <View className="module-content">
            <View className="iconfont icondizhiguanli"></View>
            <View className="address-info">
              <View className="line1">{storeInfo.storeName} {storeInfo.phone}</View>
              <View className="line2">{storeInfo.provinceName} {storeInfo.cityName} {storeInfo.countyName} {storeInfo.address}</View>
            </View>
            <View className="copy-btn" onClick={() => {
              Taro.setClipboardData({ data: `${storeInfo.provinceName} ${storeInfo.cityName} ${storeInfo.countyName} ${storeInfo.address}` })
            }}>复制</View>
          </View>
        </View>

        <View className="module-list">
          <View className="modue-item" onClick={() => {
            this.setState({
              showExpressCompanyList: true
            })
          }}>
            <View className="name">快递公司</View>
            <View className="value">
              <Text style={!selectedExpressCompany.id ? { color: "#999" } : {}}>{selectedExpressCompany.name || '请选择快递公司'}</Text>
            </View>
            <AtIcon value="chevron-right" size="15" color="#999"></AtIcon>
          </View>
          <View className="modue-item">
            <View className="name">填写单号</View>
            <View className="value">
              <Input placeholder="请填写单号" value={toStoreExpressNumber} type="text" onInput={(e) => {
                this.setState({
                  toStoreExpressNumber: e.detail.value
                })
              }}></Input>
            </View>
            <View className="iconfont iconsaoyisao" onClick={this.scanBarCode.bind(this)}></View>
          </View>
        </View>

        <View className="footer-tips">
          <View>注:请不要邮寄您的原装鞋盒，以免损坏。</View>
          <View>最好在快递包裹内附带纸条，写上您的平台注册手机号码，方便我们区分和联系您。如有其他要求也可以写在纸条上。</View>
        </View>
        <View className="footer-container" >
          <AtButton type="primary" full onClick={this.addExpressInfo.bind(this)}>确认并提交</AtButton>
        </View>
        <AtActionSheet isOpened={showExpressCompanyList} cancelText='取消'>
          {
            expressCompanyList.map((ele: any) => {
              return (
                <AtActionSheetItem key={ele.id} onClick={() => {
                  this.setState({
                    selectedExpressCompany: ele,
                    showExpressCompanyList: false
                  })
                }}>
                  {ele.name}
                </AtActionSheetItem>
              )
            })
          }
        </AtActionSheet>
      </View>
    )
  }
}
