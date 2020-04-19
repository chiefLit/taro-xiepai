import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await';

import './assets/iconfont/iconfont.css'
import "taro-ui/dist/style/components/icon.scss";
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import './app.scss'

import Home from './pages/home/index'
import configStore from './store'

const store = configStore()


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config = {
    pages: [
      // 'pages/orderEdit/index',
      'pages/home/index',
      'pages/aboutus/index',
      'pages/wechatWebView/index',
      'pages/orderSteps/index',
      'pages/expressInfoEdit/index',
      'pages/expressSteps/index',
      'pages/faqList/index',
      'pages/cart/index',
      'pages/productWash/index',
      'pages/orderEdit/index',
      'pages/orderDetail/index',
      'pages/activity/firstLogin/index',
      'pages/orderList/index',
      'pages/couponList/index',
      'pages/couponSelect/index',
      'pages/productMend/index',
      'pages/mine/index',
      'pages/servicePrice/index',
      'pages/myAddress/index',
      'pages/myAddressEdit/index',
      'pages/setting/index',
      'pages/wallet/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      backgroundColor: "#fafafa"
    },
    tabBar: {
      color: '#999999',
      selectedColor: '#1a1a1a',
      borderStyle: 'white',
      list: [
        {
          pagePath: 'pages/home/index',
          iconPath: 'assets/images/tabbar/home_n.png',
          selectedIconPath: 'assets/images/tabbar/home_s.png',
          text: '首页'
        },
        {
          pagePath: 'pages/cart/index',
          iconPath: 'assets/images/tabbar/cart_n.png',
          selectedIconPath: 'assets/images/tabbar/cart_s.png',
          text: '购物车'
        },
        {
          pagePath: 'pages/mine/index',
          iconPath: 'assets/images/tabbar/mine_n.png',
          selectedIconPath: 'assets/images/tabbar/mine_s.png',
          text: '我的'
        }
      ]
    }
  }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
