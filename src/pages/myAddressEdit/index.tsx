import Taro, { Component, Config } from '@tarojs/taro'
// import { functionalPageNavigator } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import './index.less'
import { View, Input, Text, Picker } from '@tarojs/components'

import { getAddressList, addAddress, editAddress } from '../../api/user'

import { connect } from '@tarojs/redux'
import { addSelectedAddress } from '../../reducers/actions/selectedAddress'

@connect(
  state => state,
  { addSelectedAddress }
)

export default class MyAddrEdit extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  config: Config = {
    // navigationBarTitleText: '收货地址'
  }

  state = {
    addressId: '',
    addressInfo: {
      provinceName: "",
      provinceCode: "",
      cityName: "",
      cityCode: "",
      countyName: "",
      countyCode: "",
      linkName: "",
      address: "",
      phone: "",
      describe: ""
    }
  }

  componentWillMount() {
    let params: any = this.$router.params || {}
    let title: string = params.id ? '编辑收货地址' : '新增收货地址'
    Taro.setNavigationBarTitle({ title })
    this.setState({
      addressId: Number(params.id)
    })
    if (params.id) {
      this.pullData(Number(params.id));
    }
  }

  async submitAddress() {
    let { addressId, addressInfo } = this.state
    let data: any;

    if (!addressInfo.linkName) {
      Taro.showToast({ title: '请填写联系人', icon: 'none' })
      return 
    }
    if (!(/^1[34578]\d{9}$/.test(addressInfo.phone))) {
      Taro.showToast({ title: '请填写正确的手机号', icon: 'none' })
      return 
    }
    if (!addressInfo.provinceCode) {
      Taro.showToast({ title: '请选择省市区', icon: 'none' })
      return 
    }
    if (!addressInfo.address) {
      Taro.showToast({ title: '请填写详细地址', icon: 'none' })
      return 
    }

    if (addressId) {
      data = await editAddress({ ...addressInfo })
    } else {
      data = await addAddress({ ...addressInfo })
    }
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      if (this.$router.params.isSelectStatus) {
        this.props.addSelectedAddress(data.object)
      } else {
        Taro.showToast({
          title: addressId ? '修改成功' : '新增成功',
          icon: 'none'
        })
      }
      Taro.navigateBack()
    }
  }

  async deleteAddress() {
    // let data: any = de
  }

  async pullData(id: Number) {
    let data: any = await getAddressList(null);
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let addressList: Array<any> = data.object || []
      let addressInfo: any = addressList.find((ele: any) => ele.id === id)
      this.setState({
        addressInfo: { ...addressInfo }
      })
    }
  }

  render() {
    let { addressInfo } = this.state;
    let fullAddress: string = `${addressInfo.provinceName} ${addressInfo.cityName} ${addressInfo.countyName}`;
    return (
      <View className="my-address-edit-wrapper">
        <AtForm >
          <AtInput
            name='name'
            title='联系人'
            type='text'
            placeholder='请填写'
            value={addressInfo.linkName}
            onChange={(val: String) => {
              this.setState((preState: any) => ({
                addressInfo: { ...preState.addressInfo, linkName: val }
              }))
            }}
          />
          <AtInput
            name='phone'
            title='手机号'
            type='phone'
            placeholder='请填写'
            value={addressInfo.phone}
            onChange={(val: Number) => {
              this.setState((preState: any) => ({
                addressInfo: { ...preState.addressInfo, phone: val }
              }))
            }}
          />
          <Picker mode='region' onChange={(res) => {
            this.setState({
              addressInfo: {
                ...addressInfo,
                provinceName: res.detail.value[0],
                provinceCode: res.detail.code[0],
                cityName: res.detail.value[1],
                cityCode: res.detail.code[1],
                countyName: res.detail.value[2],
                countyCode: res.detail.code[2]
              }
            })
          }}>
            <View className="at-input">
              <View className="at-input__container">
                <Text className="at-input__title">地址</Text>
                <Input className="at-input__input" placeholder="地址" value={fullAddress} type='text' disabled />
                <View className='at-icon at-icon-chevron-right' style={{ color: '#ccc' }}></View>
              </View>
            </View>
          </Picker>
          <AtInput
            name='address'
            title='详细地址'
            type='text'
            placeholder='请填写'
            value={addressInfo.address}
            onChange={(val: string) => {
              this.setState((preState: any) => ({
                addressInfo: { ...preState.addressInfo, address: val }
              }))
            }}
          />
        </AtForm>
        <View className="footer-container">
          <AtButton className="submit-button" onClick={this.submitAddress.bind(this)} type="primary">{this.$router.params.isSelectStatus ? '添加并保存' : '保存地址'}</AtButton>
          {/* <AtButton full className="delete-button" onClick={this.deleteAddress.bind(this)} type="secondary">删除地址</AtButton> */}
        </View>
      </View >
    )
  }
}
