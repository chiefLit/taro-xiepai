import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class ServicePrice extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '服务价格',
    backgroundColor: '#fff'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    let priceList = [
      { content: '普通清洗', price: '49', desc: '仅清洗皮质球鞋' },
      { content: '中级清洗', price: '69', desc: '反皮/麂皮/绒皮' },
      { content: '高级清洗', price: '69', desc: '特殊面料/OW系列' },
      { content: '防水处理', price: '29', desc: '-' },
      { content: '半掌贴底', price: '69', desc: '-' },
      { content: '全掌贴底', price: '129', desc: '-' },
      { content: '去氧化(普通底)', price: '29', desc: '-' },
      { content: '塑封', price: '15', desc: '-' },
      { content: '去霉/去色/染色处理', price: '49', desc: '-' },
      { content: '防氧化', price: '69', desc: '-' },
    ]
    return (
      <View className='service-price-wrapper'>
        <View className="t-header">
          <View>服务内容</View>
          <View>价格</View>
          <View>备注</View>
        </View>
        {
          priceList.map(ele => {
            return (
              <View className="t-body-row" key={ele.content}>
                <View>
                  <Text>{ele.content}</Text>
                </View>
                <View>
                  <Text>{ele.price} RMB</Text>
                </View>
                <View>
                  <Text>{ele.desc}</Text>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
