import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import './index.less'

import { getAddressList } from '../../api/user'

export default class MyAddr extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  constructor() {
    super()
  }

  config: Config = {
    navigationBarTitleText: '我的地址'
  }

  state = {
    addressList: [],
    selectedAddressId: null
  }

  async pullData() {
    let data: any = await getAddressList(null)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.setState({
        addressList: data.object || []
      })
    }
  }

  componentWillMount() {
    // this.pullData()
  }

  componentDidShow() {
    this.pullData()
  }

  renderItem(item: any) {
    let { selectedAddressId } = this.state;
    return (
      <View className="list-item" onClick={() => {
        this.setState({
          selectedAddressId: item.id
        })
      }}>
        <View className={selectedAddressId === item.id ? "iconfont icongouxuan" : "iconfont iconweigouxuan1"}></View>
        <View className="info">
          <View className="line-first">
            <Text style={{ paddingRight: '60rpx' }}>{item.linkName}</Text>
            <Text>{item.phone}</Text>
          </View>
          <View className="line-second">
            <Text>{item.provinceName}{item.cityName}{item.countyName}{item.address}</Text>
          </View>
        </View>
        <AtIcon value="edit" size="15" color="#999"></AtIcon>
      </View>
    )
  }

  render() {
    let { addressList, selectedAddressId } = this.state;
    return (
      <View className='my-address-wrapper'>
        <View className="module-list">
          {
            addressList.map((ele: any) => {
              return (
                <View key={ele.id} className="list-item">
                  <View style={{ display: 'flex', flex: 1, alignItems: 'center' }} onClick={() => {
                    if (selectedAddressId === ele.id) return
                    this.setState({
                      selectedAddressId: ele.id
                    })
                  }}>
                    <View className={selectedAddressId === ele.id ? "iconfont icongouxuan" : "iconfont iconweigouxuan1"}></View>
                    <View className="info">
                      <View className="line-first">
                        <Text style={{ paddingRight: '60rpx' }}>{ele.linkName}</Text>
                        <Text>{ele.phone}</Text>
                      </View>
                      <View className="line-second">
                        <Text>{ele.provinceName}{ele.cityName}{ele.countyName}{ele.address}</Text>
                      </View>
                    </View>
                  </View>
                  <AtIcon value="edit" size="15" color="#999" onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/myAddressEdit/index?id=${ele.id}`
                    })
                  }}></AtIcon>
                </View>
              )
            })
          }
        </View>
        <View className="footer-cover"></View>
        <View className="footer-contianer">
          <AtButton
            className="add-button"
            type='primary'
            circle={true}
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/myAddressEdit/index'
              })
            }}
          >
            <AtIcon value='add' size='14' color='#fff'></AtIcon>
            添加地址
          </AtButton>
        </View>
      </View>
    )
  }
}
