import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './index.less'
import * as couponApi from '../../api/coupon'
import { addSelectedCoupon } from '../../reducers/actions/selectedCoupon'

const noDataImage = 'https://dev-file.sneakerpai.com/assets/images/no-data-coupon.png'

@connect(
  state => state,
  { addSelectedCoupon }
)

export default class CouponList extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  constructor(props) {
    super(props)
  }
  state = {
    // current: 0,
    dataList: [],
    pageInfo: {
      totalPages: 0
    },
    selectedCouponId: null
  }

  componentWillMount() {
    this.pullData(null);

    this.setState({
      selectedCouponId: Number(this.$router.params.selectedId) || null
    })
  }

  config = {
    navigationBarTitleText: '优惠券',
    enablePullDownRefresh: true
  }

  params = {
    status: 0,
    currentPage: 1,
    pageSize: 20
  }



  /**
   * 
   * @param page 当前页对象
   * @param index 页索引
   * @param callBack 回调
   */
  async pullData(callBack) {
    let { dataList } = this.state
    let data = await couponApi.getCouponList(this.params)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      let list;
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

  selectCoupon(item) {
    this.props.addSelectedCoupon(item)
    Taro.navigateBack()
  }

  randerItem(item, isActive) {
    return (
      <View className='coupon-item'>
        <View className='name'>
          <Text className='num'>{item.type === 1 ? item.discountRate : item.faceAmount}</Text>
          <Text className='unit'> {item.type === 1 ? '%' : '元'}</Text>
        </View>
        <View className='info'>
          <View className='line1'>{item.title}</View>
          <View className='line2'>{item.describe}</View>
        </View>
        <View className={isActive ? 'iconfont icongouxuan' : 'iconfont iconweigouxuan1'}></View>
        <View className='left-icon circle-icon'></View>
        <View className='right-icon circle-icon'></View>
        {/* {item.status === 1 ? <Image src={iconYsy} className='state-icons'></Image> : null}
        {item.status === 2 ? <Image src={iconYsx} className='state-icons'></Image> : null} */}
      </View>
    )
  }

  renderNoData() {
    return (
      <View className='no-data-container'>
        <Image src={noDataImage}></Image>
        <View className='value'>还没有任何优惠劵呢</View>
      </View>
    );
  }


  render() {
    let { dataList, selectedCouponId } = this.state;
    return (
      <View className='coupon-select-wrapper'>
        {
          dataList.length > 0 ?
            dataList.map((ele) => {
              let isActive = ele.id === selectedCouponId
              return <View key={ele.id} onClick={this.selectCoupon.bind(this, ele)}> {this.randerItem(ele, isActive)} </View>
            }) :
            this.renderNoData()
        }
        {/* {dataList.length > 0 ? <AtDivider content='没有更多了' /> : null} */}
      </View>
    )
  }
}
