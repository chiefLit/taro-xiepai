import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'

import './index.less'
import qxImage from '../../assets/images/qx.png'
import xfImage from '../../assets/images/xf.png'
import PopupAuthorization from '../../components/PopupAuthorization'


import { getIndex } from '../../api/common'
import { checkPhoneLogin } from '../../api/user'


export default class Home extends Component {
  constructor() {
    super()
    this.pullData = this.pullData.bind(this)
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  state = {
    bannerIndex: 0,

    articleList: [],
    bannerList: [],
    couponList: [],
    faqList: [],
    showPopupAuthorization: false
  }

  componentWillMount() {
    this.pullData()
  }

  async pullData() {
    let data: any = await getIndex(null)
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      data.object = data.object || {}
      this.setState({
        articleList: data.object.articleList || [],
        bannerList: data.object.bannerList || [],
        couponList: data.object.couponList || [],
        faqList: data.object.faqList || []
      })
    }
  }

  dailyServices = [
    { name: '清洗球鞋', price: '49', imageUrl: qxImage, url: '/pages/productWash/index' },
    { name: '修复球鞋', price: '64', imageUrl: xfImage, url: '/pages/productMend/index' }
  ]

  processList = [
    { iconName: 'iconfont iconxuanzefuwu', line2: '选择服务', line3: '第01步' },
    { iconName: 'iconfont iconzaixianzhifu', line2: '在线支付', line3: '第02步' },
    { iconName: 'iconfont iconfahuodaopingtai', line2: '发货到平台', line3: '第03步' },
    { iconName: 'iconfont iconkaishixihu', line2: '开始洗护', line3: '第04步' },
    { iconName: 'iconfont iconwanchengbingjichu', line2: '完成并寄出', line3: '第05步' },
    { iconName: 'iconfont iconquerenshouhuo', line2: '确认收货', line3: '第06步' }
  ]

  renderFaq() {
    let { faqList } = this.state;
    return (
      <View className="module-container">
        <View className="module-title">
          <Text className="line1">常见问题</Text>
          <Text className="line2">Q&A</Text>
          <View className="title-right-btn" onClick={() => {
            Taro.navigateTo({
              url: '/pages/faqList/index'
            })
          }}>
            <Text>全部</Text>
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className="qa">
          {
            faqList.map((ele: any) => {
              return (
                <View className="qa-item" key={ele.id}>
                  <View className="item-q">{ele.title}</View>
                  <View className="item-a">{ele.content}</View>
                </View>
              )
            })
          }
        </View>
      </View>
    );
  }

  handlePopupAuthorization(state: boolean) {
    this.setState({
      showPopupAuthorization: state
    })
  }

  render() {
    let { articleList, bannerIndex, faqList, showPopupAuthorization } = this.state;
    return (
      <View className='home-wrapper'>
        {/* swiper */}
        <View className='swiper-container'>
          <Swiper
            className='swiper-box bannerBox'
            circular
            onChange={(e) => {
              bannerIndex = e.detail.current
              this.setState({ bannerIndex })
            }}
            autoplay>
            {
              articleList.map((ele: any, index: Number) => {
                return (
                  <SwiperItem className="swiper-item" key={ele.id} onClick={() => {
                    ele.linkUrl && Taro.navigateTo({
                      url: `/pages/wechatWebView/index?title=${ele.title}&url=${ele.linkUrl}`
                    })
                  }}>
                    <View className={bannerIndex === index ? 'banner active' : 'banner'} style={{ 'background': '#ccc' }}>
                      <Image style={{ minWidth: '100%' }} mode="aspectFill" src={ele.imageUrl}></Image>
                    </View>
                  </SwiperItem>
                )
              })
            }
          </Swiper>
          <View className="dots">
            {
              articleList.map((ele: any, index: Number) => {
                return (
                  <View className={index == bannerIndex ? 'curr dot-item' : 'dot-item'} key={ele.id}></View>
                )
              })
            }
          </View>
        </View>
        {/* 日常服务 */}
        <View className="module-container">
          {/* <View className="module-title">
            <Text className="line1">日常服务</Text>
            <Text className="line2">DAILY SERVICE</Text>
          </View> */}
          <View className="daily-service">
            {
              this.dailyServices.map((ele) => {
                return (
                  <View className="daily-item" key={ele.name} onClick={async () => {
                    const res = await checkPhoneLogin();
                    if (res) {
                      Taro.navigateTo({
                        url: ele.url
                      })
                    } else {
                      this.handlePopupAuthorization(true)
                    }
                  }}>
                    <View className="name">{ele.name}</View>
                    <View className="price">￥ <Text>{ele.price}</Text></View>
                    <View className="desc">最低</View>
                    <Image className="" src={ele.imageUrl} mode="aspectFit"></Image>
                  </View>
                )
              })
            }
          </View>
        </View>
        {/* 服务价目 */}
        <View className="module-container">
          <View className="module-title">
            <Text className="line1">服务价格</Text>
            <Text className="line2">SERVICE PRICE</Text>
            <View className="title-right-btn" onClick={() => {
              Taro.navigateTo({
                url: '/pages/servicePrice/index'
              })
            }}>
              <Text>查看明细</Text>
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>
          <View className="serivce-price">
            <View className="t-header">
              <View>服务类型</View>
              <View>价格</View>
              <View>备注</View>
            </View>
            <View className="t-body-row">
              <View>球鞋清洗</View>
              <View>49-129RMB</View>
              <View>普通/中级/高级</View>
            </View>
            <View className="t-body-row">
              <View>球鞋护理</View>
              <View>15/129RMB</View>
              <View>去氧化/贴底/防水</View>
            </View>
          </View>
        </View>
        {/* 服务流程 */}
        <View className="module-container">
          <View className="module-title">
            <Text className="line1">服务流程</Text>
            <Text className="line2">SERVICE PROCESS</Text>
          </View>
          <View className="service-process">
            {
              this.processList.map((ele) => {
                return (
                  <View className="process-item" key={ele.iconName}>
                    <View className={ele.iconName}></View>
                    <View className="line2">{ele.line2}</View>
                    <View className="line3">{ele.line3}</View>
                  </View>
                )
              })
            }
          </View>
        </View>
        {/* 常见问题 */}
        {faqList && faqList.length ? this.renderFaq() : null}
        {showPopupAuthorization ? <PopupAuthorization changeValue={res => {
          this.handlePopupAuthorization(res)
        }} /> : null}
      </View>
    )
  }
}
