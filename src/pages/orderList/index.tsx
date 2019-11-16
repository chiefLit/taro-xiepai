import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton, AtDivider } from 'taro-ui'
import './index.less'

import { getOrderList } from '../../api/order'
import noDataImage from '../../assets/images/no-data-order.png'

export default class OrderList extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

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
    let params: any = this.$router.params
    if (params.index) {
      this.setState({
        current: Number(params.index)
      })
      this.pullData(this.state[`page${params.index}`], params.index, null)
    } else {
      this.pullData(this.state.page0, 0, null)
    }
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
    let data = await getOrderList(page.params)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let dataList: Array<any> = [];
      if (page.params.currentPage === 1 && (!data.object || data.object.length === 0)) {
        callBack && callBack()
        return
      }
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

  orderStatusToValue(status: any) {
    return { 0: "待支付", 1: "等待物流信息", 2: "运输到店途中", 3: "到店核验中", 4: "清洗中", 5: "清洗完成", 6: "寄回中", 7: "订单完成", 8: "退款中", 9: "已退款", "-1": "已取消", "-2": "已关闭" }[status]
  }

  randerItem(item: any) {
    let orderStatusToValue = this.orderStatusToValue;
    return (
      <View className="order-item">
        <View className="item-title">
          <Text>订单编号: {item.number}</Text>
          <Text>{orderStatusToValue(item.status)}</Text>
        </View>
        <View className="item-content">
          {
            item.orderSubVoList.map((ele: any) => {
              return <View className="produce-item" key={ele.id}>
                {
                  ele.serviceImageList.map((imageItem: any) => {
                    return imageItem.aspect === 0 ? <Image mode="aspectFill" key={imageItem.aspect} src={imageItem.url}></Image> : null
                  })
                }
                <View className="info">
                  <View className="name">{ele.goodzTitle}</View>
                  <View className="product-list">
                    {
                      ele.serviceDetailList.map((serviceItem: any) => {
                        return (
                          <View className="product-item" key={serviceItem.serviceId}>{serviceItem.serviceName}</View>
                        )
                      })
                    }
                  </View>
                </View>
                <View className="order-price">￥ {item.realPayPrice}</View>
              </View>
            })
          }
        </View>
        <View className="item-footer">
          {item.status === 0 ? <AtButton onClick={() => {
            Taro.navigateTo({
              url: `/pages/orderDetail/index?id=${item.id}`
            })
          }}>去支付</AtButton> : null}
          {item.status === 1 ? <AtButton onClick={() => {
            Taro.navigateTo({
              url: `/pages/orderDetail/index?id=${item.id}`
            })
          }}>补充物流信息</AtButton> : null}
        </View>
      </View>
    )
  }

  renderNoData() {
    return (
      <View className="no-data-contianer">
        <Image src={noDataImage}></Image>
        <View className="value">暂无相关订单</View>
        <AtButton type="primary" circle size="small" onClick={() => {
          Taro.navigateTo({
            url: '/pages/productWash/index'
          })
        }}>立即下单</AtButton>
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
              page0.dataList.length > 0 ? 
              page0.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>) :
              this.renderNoData()
            }
            { page0.dataList.length > 0 ? <AtDivider content='没有更多了' /> : null}
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            {
              page1.dataList.length > 0 ? 
              page1.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>) :
              this.renderNoData()
            }
            { page1.dataList.length > 0 ? <AtDivider content='没有更多了' /> : null}
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            {
              page2.dataList.length > 0 ? 
              page2.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>) :
              this.renderNoData()
            }
            { page2.dataList.length > 0 ? <AtDivider content='没有更多了' /> : null}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
