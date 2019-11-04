import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Input, Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.less'
import { AtButton, AtNoticebar, AtInput, AtForm } from 'taro-ui'

export default class EditMailInfo extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '填写邮寄信息'
  }

  constructor() {
    super();
    this.state = {
      value: ''
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChange() { }

  render() {
    return (
      <View className='edit-mail-info-wrapper'>
        <AtNoticebar>请自行邮寄鞋子，保留物流单号</AtNoticebar>
        <View className="at-input form-item">
          <View className="at-input__container">
            <Text className="at-input__title">快递公司</Text>
            <Input className="at-input__input" placeholder="地址" value={this.state.value} type='text' disabled/>
            <View className='at-icon at-icon-chevron-right' style={{ color: '#ccc' }}></View>
          </View>
        </View>
        <View className="at-input form-item">
          <View className="at-input__container">
            <Text className="at-input__title">填写单号</Text>
            <Input className="at-input__input" placeholder="地址" value={this.state.value} type='text' />
            <View className='at-icon at-icon-camera' style={{ color: '#ccc' }} onClick={() => {
              // 允许从相机和相册扫码
              Taro.scanCode({
                success(res) {
                  console.log(res)
                },
                fail(res) {
                  console.log(res)
                }
              })
            }}></View>
          </View>
        </View>
      </View>
    )
  }
}
