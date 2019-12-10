import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

import { AtAccordion } from 'taro-ui'

import { getFaqlist } from '../../api/common'

export default class FaqList extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '常见问题'
  }

  onShareAppMessage() {}

  state = {
    faqList: []
  }

  componentWillMount() {
    this.pullData()
  }

  handleClick(value) {
    this.setState({
      open: value
    })
  }

  async pullData() {
    let data: any = await getFaqlist(null)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let faqList: Array<any> = data.object || []
      faqList = faqList.map((ele: any) => {
        return { ...ele, open: false }
      })
      this.setState({ faqList })
    }
  }

  render() {
    let { faqList } = this.state;
    return (
      <View className='faq-list-wrapper'>
        {
          faqList.map((ele: any, index) => {
            return (
              <AtAccordion
                isAnimation={false}
                open={ele.open}
                onClick={() => {
                  this.setState((preState: any) => {
                    let list: Array<any> = [...preState.faqList]
                    list[index] = { ...ele, open: !ele.open }
                    return {
                      faqList: list
                    }
                  })
                }}
                title={ele.title}
                key={ele.id}
              >
                <View className="content">{ele.content}</View>
              </AtAccordion>
            )
          })
        }
      </View>
    )
  }
}
