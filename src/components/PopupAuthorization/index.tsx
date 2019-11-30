import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './index.less'

import { getUserInfo, improvePhone } from '../../api/user'

export default class PopupAuthorization extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '授权弹窗'
  }

  componentWillMount () { }

  async onGetPhoneNumber(res: any) {
    if (!res || !res.detail || !res.detail.encryptedData || !res.detail.iv) {
      this.cancel()
      return
    }
    let data: any = await improvePhone({
      encryptedData: res.detail.encryptedData,
      vi: res.detail.iv
    })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
      this.cancel()
    } else {
      await getUserInfo(true)
      this.cancel()
    }
  }

  cancel() {
    this.props.changeValue(false)
  }

  render () {
    return (
      <View className='popup-authorization-wrapper'>
        <View className="popup-mask"></View>
        <View className="popup-container">
          <View className="popup-title">提示</View>
          <View className="popup-content">请授权手机号</View>
          <View className="popup-footer">
            <Button className="no-button-style" onClick={this.cancel.bind(this)}>取消</Button>
            <Button open-type="getPhoneNumber" onGetPhoneNumber={this.onGetPhoneNumber.bind(this)} className="no-button-style">授权</Button>
          </View>
        </View>
      </View>
    )
  }
}
