import Taro, { Component, Config } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
// import './index.less'

export default class WeChatWebView extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    // navigationBarTitleText: '首页'
  }

  componentWillMount () { 
    let params: any = this.$router.params;
    Taro.setNavigationBarTitle({
      title: params.title
    })
  }

  url = "https://mp.weixin.qq.com/s?__biz=MzI4NDUxNzQzMA==&mid=2247483665&idx=1&sn=7e522636cb9910d18332a416b42cae13&chksm=ebfb7448dc8cfd5eaa16114fe5f1b5822076bdcecf49f1fa7e0d87b603b666f03f019d0ec87e&token=566012935&lang=zh_CN#rd"

  render () {
    return (
      <View className='web-view-wrapper'>
        <WebView src={this.url}></WebView>
      </View>
    )
  }
}
