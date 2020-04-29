import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'

import './index.less'

import * as storeApi from "../../api/store";
import * as goodzApi from "../../api/goodz";
import * as serviceApi from "../../api/service";

export default class ServicePrice extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config = {
    navigationBarTitleText: '服务价格',
    backgroundColor: '#fff'
  }

  state = {
    current: 0,
    tabList: [],

    storeList: [],
    // serviceList: [],
  }

  async getStoreList() {
    const storeList = await storeApi.getStoreList({})
    this.setState({ storeList, tabList: storeList.map(ele => { return { title: ele.name } }) })
    this.getServiceList(storeList, 0)
  }

  async getServiceList(storeList, index) {
    if (storeList[index].serviceList && storeList[index].serviceList.length > 0) return
    const goodzData = await goodzApi.getGoodzList({ storeId: storeList[index].id })
    const serviceData = await serviceApi.washServiceList({ storeId: storeList[index].id, goodzId: goodzData.object[0].id })
    if (serviceData.code !== 1) {
      Taro.showToast({
        title: serviceData.message,
        icon: "none"
      })
    } else {
      console.log(this.state.storeList)
      this.setState(preState => {
        let preStoreList = preState.storeList
        preStoreList[index].serviceList = serviceData.object
        return { storeList: preStoreList }
      })
    }
  }

  handleClick(value) {
    this.getServiceList(this.state.storeList, value)
    this.setState({
      current: value
    })
  }

  componentWillMount() {
    this.getStoreList()
  }

  render() {
    const priceList = [
      { content: '普通清洗', price: '49', desc: '仅清洗皮质球鞋' },
      { content: '中级清洗', price: '69', desc: '反皮/麂皮/绒皮' },
      { content: '高级清洗', price: '109', desc: '特殊面料/OW系列' },
      { content: '防水处理', price: '29', desc: '-' },
      { content: '半掌贴底', price: '69', desc: '-' },
      { content: '全掌贴底', price: '129', desc: '-' },
      { content: '去氧化(普通底)', price: '79', desc: '-' },
      { content: '塑封', price: '15', desc: '-' },
      { content: '去霉/去色/染色处理', price: '49', desc: '-' },
      { content: '防氧化', price: '69', desc: '-' },
    ]
    const { tabList, current, storeList } = this.state
    return (
      <View className='service-price-wrapper'>
        <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          {
            storeList.map((storeItem, index) => {
              return (
                <AtTabsPane current={current} index={index} key={storeItem.id}>
                  <View className='t-header'>
                    <View>服务内容</View>
                    <View>价格</View>
                    <View>备注</View>
                  </View>
                  {
                    storeItem.serviceList.map(ele => {
                      return (
                        <View className='t-body-row' key={ele.id}>
                          <View>
                            <Text>{ele.name}</Text>
                          </View>
                          <View>
                            <Text>{ele.price} RMB</Text>
                          </View>
                          <View>
                            <Text>{ele.remark || '-'}</Text>
                          </View>
                        </View>
                      )
                    })
                  }
                </AtTabsPane>
              )
            })
          }
        </AtTabs>
      </View>
    )
  }
}
