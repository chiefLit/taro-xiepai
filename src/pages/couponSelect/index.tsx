import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtDivider } from 'taro-ui'
import { getCouponList } from '../../api/coupon'
// import iconYsx from '../../assets/images/yishixiao.png'
// import iconYsy from '../../assets/images/yishiyong.png'
import noDataImage from '../../assets/images/no-data-coupon.png'

import { STORAGE_NAME } from '../../config'

export default class CouponList extends Component {

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
    navigationBarTitleText: '优惠券',
    enablePullDownRefresh: true
  }

  state = {
    current: 0,
    dataList: [],
    pageInfo: {
      totalPages: 0
    },
    selectedCouponId: null
  }

  params = {
    status: 0,
    currentPage: 1,
    pageSize: 20
  }

  componentWillMount() {
    this.pullData(null);
    
    // Taro.getStorage({ key: STORAGE_NAME.selectedCoupon }).then((res: any) => {
      this.setState({
        selectedCouponId: Number(this.$router.params.selectedId) || null
      })
    // })
  }

  /**
   * 
   * @param page 当前页对象
   * @param index 页索引
   * @param callBack 回调
   */
  async pullData(callBack: any) {
    let { dataList } = this.state
    let data: any = await getCouponList(this.params)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let list: Array<any>;
      data.object = data.object || []
      if (this.params.currentPage === 1) {
        list = [...data.object];
      } else {
        list = [...dataList, ...data.object];
      }
      this.setState({
        dataList: list,
        pageInfo: data.page
      })
    }
    callBack && callBack()
  }

  onPullDownRefresh() {
    this.params.currentPage = 1;
    this.pullData(Taro.stopPullDownRefresh)
  }

  onReachBottom() {
    let { pageInfo } = this.state
    if (this.params.currentPage < pageInfo.totalPages) {
      this.params.currentPage++
      this.pullData(null)
    }
  }

  randerItem(item: any, isActive: Boolean) {
    return (
      <View className="coupon-item">
        <View className="name">
          <Text className="num">{item.type === 1 ? item.discountRate : item.faceAmount}</Text>
          <Text className="unit"> {item.type === 1 ? '折' : '%'}</Text>
        </View>
        <View className="info">
          <View className="line1">{item.name}</View>
          <View className="line2">{item.describe}</View>
        </View>
        <View className={isActive ? "iconfont icongouxuan" : "iconfont iconweigouxuan1"}></View>
        <View className="left-icon circle-icon"></View>
        <View className="right-icon circle-icon"></View>
        {/* {item.status === 1 ? <Image src={iconYsy} className="state-icons"></Image> : null}
        {item.status === 2 ? <Image src={iconYsx} className="state-icons"></Image> : null} */}
      </View>
    )
  }

  renderNoData() {
    return (
      <View className="no-data-contianer">
        <Image src={noDataImage}></Image>
        <View className="value">还没有任何优惠劵呢</View>
      </View>
    );
  }


  render() {
    let { dataList, selectedCouponId } = this.state;
    return (
      <View className='coupon-select-wrapper'>
        {
          dataList.length > 0 ?
            dataList.map((ele: any) => {
              let isActive: Boolean = ele.id === selectedCouponId
              return <View key={ele.id} onClick={() => {
                Taro.setStorage({ key: STORAGE_NAME.selectedCoupon, data: ele })
                  .then(() => {
                    this.setState({
                      selectedCouponId: ele.id
                    })
                    Taro.navigateBack()
                  })
              }}> {this.randerItem(ele, isActive)} </View>
            }) :
            this.renderNoData()
        }
        {dataList.length > 0 ? <AtDivider content='没有更多了' /> : null}
      </View>
    )
  }
}
