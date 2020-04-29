import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './index.less'

export default class nursingEffect extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config = {
    navigationBarTitleText: '护理效果'
  }
  
  effectList = [
    {
      id: 1,
      title: 'Air Jodran 1 Retro High Bred Toe 黑红脚趾',
      goodzName: '中级清洗',
      image: require('../../assets/images/wash-result1.png')
    },
    {
      id: 2,
      title: '匡威 低帮 白色',
      goodzName: '中级清洗',
      image: require('../../assets/images/wash-result2.png')
    }
  ]

  render() {
    return (
      <View className='nursing-effect-wrapper'>
        {
          this.effectList.map(ele => {
            return (
              <View className="item" key={ele.id}>
                <View className="title">{ele.title}</View>
                <View className="name">{ele.goodzName}</View>
                <View className="image-box">
                  <Image src={ele.image}></Image>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
