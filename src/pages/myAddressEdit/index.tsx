import Taro, { Component, Config } from '@tarojs/taro'
// import { functionalPageNavigator } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import './index.less'
import { View, Input, Text, Picker, Button } from '@tarojs/components'

export default class MyAddrEdit extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  constructor(props) {
    super(props)
    this.state = {
      addressInfo: {
        address: '详细地址详细地址',
        name: '张三',
        phone: '18815288276'
      }
    }
  }
  config: Config = {
    navigationBarTitleText: '编辑收货地址'
  }

  componentWillMount() { }

  componentDidMount() {
    Taro.login({
      success(res) {
        console.log(res)
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onSubmit() {
    // console.log(this.state.addressInfo)
  }

  onGetRegion(region) {
    // 参数region为选择的省市区
    console.log(region);
  }

  render() {
    let { addressInfo } = this.state;
    return (
      <View className="my-address-edit-wrapper">
        <AtForm onSubmit={this.onSubmit.bind(this)} >
          <AtInput
            name='name'
            title='联系人'
            type='text'
            placeholder='请填写'
            value={addressInfo.name}
            onChange={(val) => {
              addressInfo.name = val;
              this.setState({ addressInfo })
            }}
            clear
          />
          <AtInput
            name='phone'
            title='手机号'
            type='phone'
            placeholder='请填写'
            value={addressInfo.phone}
            onChange={(val) => {
              addressInfo.phone = val;
              this.setState({ addressInfo })
            }}
            clear
          />
          <View className="at-input">
            <View className="at-input__container" onClick={() => {
              Taro.chooseAddress({
                success: (res) => {
                  addressInfo.address = `${res.provinceName} ${res.cityName} ${res.countyName}`
                  this.setState({ addressInfo })
                }
              })
            }}>
              <Text className="at-input__title">微信地址</Text>
              <Input className="at-input__input" placeholder="地址" value={addressInfo.address} type='text' disabled />
              <View className='at-icon at-icon-chevron-right' style={{ color: '#ccc' }}></View>
            </View>
          </View>
          <Picker mode='region' onChange={(res) => { console.log(res) }}>
            <Button>省市区筛选</Button>
          </Picker>
          <Button open-type="getPhoneNumber" getphonenumber={(res) => { console.log(res) }}>获取手机号码</Button>
          <View className="at-input">
            <View className="at-input__container" onClick={() => {
              Taro.chooseAddress({
                success: (res) => {
                  addressInfo.address = `${res.provinceName} ${res.cityName} ${res.countyName}`
                  this.setState({ addressInfo })
                }
              })
            }}>
              <Text className="at-input__title">地址</Text>
              <Input className="at-input__input" placeholder="地址" value={addressInfo.address} type='text' disabled />
              <View className='at-icon at-icon-chevron-right' style={{ color: '#ccc' }}></View>
            </View>
          </View>
          <AtInput
            name='address'
            title='详细地址'
            type='text'
            placeholder='请填写'
            value={addressInfo.address}
            clear
            onChange={(val) => {
              addressInfo.address = val
              this.setState({ addressInfo })
            }}
          />
          <View className=""></View>
          <AtButton className="submit-button" type="primary" formType='submit'>保存地址</AtButton>
          <AtButton className="delete-button" type="secondary">删除地址</AtButton>
        </AtForm>
      </View >
    )
  }
}
