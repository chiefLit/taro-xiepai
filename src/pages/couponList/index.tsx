import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './index.less'

import { getCouponList } from '../../api/coupon'

export default class CouponList extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '优惠券',
    enablePullDownRefresh: true
  }

  state = {
    current: 0,
    page1: {
      isActive: false,
      params: {
        status: 0,
        currentPage: 1,
        pageSize: 20
      },
      dataList: [],
      pageInfo: {}
    },
    page2: {
      isActive: false,
      params: {
        status: 0,
        currentPage: 1,
        pageSize: 20
      },
      dataList: [],
      pageInfo: {}
    },
    page3: {
      isActive: false,
      params: {
        status: 0,
        currentPage: 1,
        pageSize: 20
      },
      dataList: [],
      pageInfo: {}
    }
  }

  componentWillMount() {
    this.pullData(this.state.page1, 0)
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  /**
   * 
   * @param page 当前页对象
   * @param index 页索引
   * @param reStart 是否重新请求
   */
  async pullData(page, index, callBack) {
    let data = await getCouponList(page.params)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let dataList = [];
      if (page.currentPage === 1) {
        dataList = [...data.object];
      } else {
        dataList = [...page.dataList, ...data.object];
      }
      this.setState(preState => {
        switch (index) {
          case 0:
            preState.page1.dataList = dataList;
            preState.page1.pageInfo = data.page;
            preState.page1.isActive = true;
            break;
          case 1:
            preState.page2.dataList = dataList
            preState.page2.pageInfo = data.page
            preState.page2.isActive = true;
            break;
          case 2:
            preState.page3.dataList = dataList
            preState.page3.pageInfo = data.page
            preState.page3.isActive = true;
            break;
          default:
            break;
        }
      })
      callBack && callBack()
    }
  }


  handleClick(value) {
    this.setState(preState => {
      preState.current = value
      switch (value) {
        case 0:
          if (!preState.page1.isActive) {
            preState.page1.currentPage = 1
            this.pullData(preState.page1, value)
          }
          break;
        case 1:
          if (!preState.page2.isActive) {
            preState.page2.currentPage = 1
            this.pullData(preState.page2, value)
          }
          break;
        case 2:
          if (!preState.page3.isActive) {
            preState.page3.currentPage = 1
            this.pullData(preState.page3, value)
          }
          break;
        default:
          break;
      }
    })
  }

  onPullDownRefresh() {
    this.setState(preState => {
      switch (preState.current) {
        case 0:
          preState.page1.currentPage = 1
          this.pullData(preState.page1, preState.current, Taro.stopPullDownRefresh)
          break;
        case 1:
          preState.page2.currentPage = 1
          this.pullData(preState.page2, preState.current, Taro.stopPullDownRefresh)
          break;
        case 2:
          preState.page3.currentPage = 1
          this.pullData(preState.page3, preState.current, Taro.stopPullDownRefresh)
          break;
        default:
          break;
      }
    })
  }

  randerItem(item) {
    return (
      <View className="coupon-item">
        <View className="name">
          <Text className="num">5</Text>
          <Text className="unit"> 折</Text>
        </View>
        <View className="info">
          <View className="line1">仅限洗鞋订单</View>
          <View className="line2">有效期至：2019-11-11 23：59</View>
        </View>
        <View className="left-icon circle-icon"></View>
        <View className="right-icon circle-icon"></View>
        <View className="state-icons"></View>
      </View>
    )
  }

  render() {
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已失效' }]
    let { current, page1, page2, page3 } = this.state;
    return (
      <View className='coupon-list-wrapper'>
        <AtTabs height="87" current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            {
              page1.dataList.map(ele => <View key={ele.id}> {this.randerItem(ele)} </View>)
            }
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            {
              page2.dataList.map(ele => <View key={ele.id}> {this.randerItem(ele)} </View>)
            }
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            {
              page3.dataList.map(ele => <View key={ele.id}> {this.randerItem(ele)} </View>)
            }
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
