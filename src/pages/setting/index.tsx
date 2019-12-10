import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"
import './index.less'

export default class Setting extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '设置'
  }

  render() {
    return (
      <View className='setting-wrapper'>
        <AtList hasBorder={true}>
          <AtListItem
            title='我的地址'
            thumb="http://img3.imgtn.bdimg.com/it/u=2790496995,1710929494&fm=15&gp=0.jpg"
            arrow='right'
            onClick={this.handleClick} />
          <AtListItem
            title='关于我们'
            thumb="http://img3.imgtn.bdimg.com/it/u=2790496995,1710929494&fm=15&gp=0.jpg"
            arrow='right'
            onClick={this.handleClick} />
          <AtListItem
            title='联系客服'
            thumb="http://img3.imgtn.bdimg.com/it/u=2790496995,1710929494&fm=15&gp=0.jpg"
            arrow='right'
            extraText="18815288276"
            onClick={this.handleClick} />
        </AtList>
      </View>
    )
  }
}
