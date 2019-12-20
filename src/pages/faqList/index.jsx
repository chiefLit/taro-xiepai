import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAccordion } from 'taro-ui'

import './index.less'
import { getFaqlist } from '../../api/common'

export default class FaqList extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  state = {
    faqList: []
  }

  componentWillMount() {
    this.pullData()
  }

  config = {
    navigationBarTitleText: '常见问题'
  }

  async pullData() {
    let data = await getFaqlist(null)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let faqList = data.object || []
      faqList = faqList.map((ele) => {
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
          faqList.map((ele, index) => {
            return (
              <AtAccordion
                isAnimation={false}
                open={ele.open}
                onClick={() => {
                  this.setState((preState) => {
                    let list = [...preState.faqList]
                    list[index] = { ...ele, open: !ele.open }
                    return {
                      faqList: list
                    }
                  })
                }}
                title={ele.title}
                key={ele.id}
              >
                <View className='content'>{ele.content}</View>
              </AtAccordion>
            )
          })
        }
      </View>
    )
  }
}
