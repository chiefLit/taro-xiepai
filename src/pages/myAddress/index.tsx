import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import './index.less'

import { getAddressList } from '../../api/user'
import noDataImage from '../../assets/images/no-data-address.png'

import { STORAGE_NAME } from '../../config'
import { connect } from '@tarojs/redux'
import { addSelectedAddress } from '../../reducers/actions/selectedAddress'

@connect(
  state => state,
  { addSelectedAddress }
)

export default class MyAddr extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  constructor(props) {
    super(props)
  }

  config: Config = {
    navigationBarTitleText: '我的地址'
  }

  state = {
    addressList: [],
    selectedAddressId: null,
    // 是否为选择状态
    isSelectStatus: false
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
    this.setState({
      isSelectStatus: this.$router.params.isSelectStatus || false,
      selectedAddressId: Number(this.$router.params.selectedId) || null
    })
  }

  componentDidShow() {
    this.pullData()
  }

  renderItem(item: any) {
    let { selectedAddressId, isSelectStatus } = this.state;
    return (
      <View className="list-item">
        <View style={{ display: "flex", alignItems: 'center' }} onClick={this.selectAddress.bind(this, item)}>
          {isSelectStatus ? <View className={selectedAddressId === item.id ? "iconfont icongouxuan" : "iconfont iconweigouxuan1"}></View> : null}
          <View className="info">
            <View className="line-first">
              <Text style={{ paddingRight: '60rpx' }}>{item.linkName}</Text>
              <Text>{item.phone}</Text>
            </View>
            <View className="line-second">
              <Text>{item.provinceName}{item.cityName}{item.countyName}{item.address}</Text>
            </View>
          </View>
        </View>
        <AtIcon value="edit" size="15" color="#999" onClick={() => {
          Taro.navigateTo({
            url: `/pages/myAddressEdit/index?id=${item.id}`
          })
        }}></AtIcon>
      </View>
    )
  }

  renderNoData() {
    return (
      <View className="no-data-contianer">
        <Image src={noDataImage}></Image>
        <View className="value">还没有收货地址呢</View>
        <AtButton type="primary" size="small" circle onClick={() => {
          Taro.navigateTo({
            url: '/pages/myAddressEdit/index'
          })
        }}>立即添加</AtButton>
      </View>
    )
  }

  selectAddress(item: any) {
    if (!this.state.isSelectStatus) return
    this.setState({
      selectedAddressId: item.id
    })
    this.props.addSelectedAddress(item)

    Taro.navigateBack()
  }

  render() {
    let { addressList } = this.state;
    return (
      <View className='my-address-wrapper'>
        {
          addressList.length > 0 ?
            <View>
              <View className="module-list">
                {
                  addressList.map((ele: any) => {
                    return (
                      <View key={ele.id}>
                        {this.renderItem(ele)}
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
                  circle
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
            </View> :
            this.renderNoData()
        }
      </View>
    )
  }
}
