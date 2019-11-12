import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton } from 'taro-ui'
import './index.less'

import { getCouponList } from '../../api/coupon'

export default class OrderList extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  constructor() {
    super()
  }

  config: Config = {
    navigationBarTitleText: '我的订单',
    enablePullDownRefresh: true
  }

  state = {
    current: 0,
    page0: {
      isActive: false,
      params: {
        status: 0,
        currentPage: 1,
        pageSize: 20
      },
      dataList: [],
      pageInfo: {}
    },
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
    }
  }

  componentWillMount() {
    this.pullData(this.state.page0, 0, null)
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  /**
   * 
   * @param page 当前页对象
   * @param index 页索引
   * @param callBack 回调
   */
  async pullData(page: any, index: Number, callBack: any) {
    let data = await getCouponList(page.params)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let dataList: Array<any> = [];
      if (page.params.currentPage === 1) {
        dataList = [...data.object];
      } else {
        dataList = [...page.dataList, ...data.object];
      }
      this.setState({
        [`page${index}`]: {
          ...page,
          dataList,
          pageInfo: data.page,
          isActive: true
        }
      })
      callBack && callBack()
    }
  }


  handleClick(index: Number) {
    let currPageObj = this.state[`page${index}`]
    this.setState({
      current: index,
      [`page${index}`]: {
        ...currPageObj,
        params: {
          ...currPageObj.params,
          currentPage: 1
        }
      }
    })
    if (!currPageObj.isActive) {
      this.pullData(currPageObj, index, null)
    }
  }

  onPullDownRefresh() {
    let { current } = this.state
    let currPageObj = this.state[`page${current}`]
    this.setState({
      [`page${current}`]: {
        ...currPageObj,
        params: {
          ...currPageObj.params,
          currentPage: 1
        }
      }
    })
    this.pullData(currPageObj, current, Taro.stopPullDownRefresh)
  }

  onReachBottom() {
    let { current } = this.state
    let currPageObj = this.state[`page${current}`]
    if (currPageObj.params.currentPage < currPageObj.pageInfo.totalPages) {
      this.setState({
        [`page${current}`]: {
          ...currPageObj,
          params: {
            ...currPageObj.params,
            currentPage: currPageObj.params.currentPage++
          }
        }
      })
      this.pullData(currPageObj, current, null)
    }
  }

  randerItem(item: any) {
    return (
      <View className="order-item">
        <View className="item-title">
          <Text>订单编号:3123123123123</Text>
          <Text>订单关闭</Text>
        </View>
        <View className="item-content">
          {
            [1, 2].map(ele => {
              return <View className="produce-item">
                <Image src={123}></Image>
                <View className="info">
                  <View className="name">高级清洗</View>
                  <View className="product-list">
                    {
                      [1, 2, 3].map(ele => {
                        return (
                          <View className="product-item" key={ele}>防水</View>
                        )
                      })
                    }
                  </View>
                </View>
                <View className="order-price">￥ 109.5</View>
              </View>
            })
          }
        </View>
        <View className="item-footer">
          <AtButton>去支付</AtButton>
        </View>
      </View>
    )
  }

  render() {
    const tabList = [{ title: '待支付' }, { title: '进行中' }, { title: '全部' }]
    let { current, page0, page1, page2 } = this.state;
    return (
      <View className='order-list-wrapper'>
        <AtTabs height="87" current={current} swipeable={false} animated={true} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            {
              page0.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>)
            }
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            {
              page1.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>)
            }
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            {
              page2.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>)
            }
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
