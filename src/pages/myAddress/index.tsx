import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import './index.less'

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
    this.state = {
      list: [
        {
          address: '详细地址详细地址',
          name: '张三',
          phone: '18815288276'
        },
        {
          address: '详细地址详细地址详细地址详细地址详细地址详细地址详细地址详细地址',
          name: '李四',
          phone: '18815288276'
        },
        {
          address: '详细地址详细地址',
          name: '王五',
          phone: '18815288276'
        }
      ]
    }
  }
  config: Config = {
    navigationBarTitleText: '我的地址'
  }

  async pullData() {

  }

  componentWillMount() { }

  componentDidMount() {
    this.pullData()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    let { list } = this.state;
    return (
      <View className='my-address-wrapper'>
        <View className="module-list">
        {
          list.map((ele, index) => {
            return (
              <View className="list-item" key={ele.name}>
                <View className="info">
                  <View className="line-first">
                    <Text>{ele.name}</Text>
                    <Text>{ele.phone}</Text>
                  </View>
                  <View className="line-second">
                    <Text>{ele.address}</Text>
                  </View>
                </View>
                <AtIcon value="edit" size="15" color="#999"></AtIcon>
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
                url: '/pages/myAddressEdit/index?id=2'
              })
            }}
          >添加地址</AtButton>
        </View>
      </View>
    )
  }
}
