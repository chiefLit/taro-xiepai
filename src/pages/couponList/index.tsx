import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtDivider } from 'taro-ui'
import './index.less'

import { getCouponList } from '../../api/coupon'
import iconYsx from '../../assets/images/yishixiao.png'
import iconYsy from '../../assets/images/yishiyong.png'
import noDataImage from '../../assets/images/no-data-coupon.png'

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

  onShareAppMessage() {}

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

  /**
   * 
   * @param page 当前页对象
   * @param index 页索引
   * @param callBack 回调
   */
  async pullData(page: any, index: Number, callBack: any) {
    let data: any = await getCouponList(page.params)
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

  randerItem(item: any) {
    return (
      <View className="coupon-item">
        <View className="name">
          <Text className="num">{item.type === 1 ? item.discountRate : item.faceAmount}</Text>
          <Text className="unit">{item.type === 1 ? '%' : '元'}</Text>
        </View>
        <View className="info">
          <View className="line1">{item.title}</View>
          <View className="line2">{item.describe}</View>
        </View>
        <View className="left-icon circle-icon"></View>
        <View className="right-icon circle-icon"></View>
        {item.status === 1 ? <Image src={iconYsy} className="state-icons"></Image> : null}
        {item.status === 2 ? <Image src={iconYsx} className="state-icons"></Image> : null}
      </View>
    )
  }

  renderNoData() {
    return (
       <View className="no-data-container">
         <Image src={noDataImage}></Image>
         <View className="value">还没有任何优惠劵呢</View>
       </View>
    );
  }

  render() {
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已失效' }]
    let { current, page0, page1, page2 } = this.state;
    return (
      <View className='coupon-list-wrapper'>
        <AtTabs height="87" current={current} swipeable={false} animated={true} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            {
              page0.dataList.length > 0 ? 
              page0.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>) :
              this.renderNoData()
            }
            {/* { page0.dataList.length > 0 ? <AtDivider content='没有更多了' /> : null} */}
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            {
              page1.dataList.length > 0 ? 
              page1.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>) :
              this.renderNoData()
            }
            {/* { page1.dataList.length > 0 ? <AtDivider content='没有更多了' /> : null} */}
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            {
              page2.dataList.length > 0 ? 
              page2.dataList.map((ele: any) => <View key={ele.id}> {this.randerItem(ele)} </View>) :
              this.renderNoData()
            }
            {/* { page2.dataList.length > 0 ? <AtDivider content='没有更多了' /> : null} */}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
