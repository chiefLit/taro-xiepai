import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.less'
import qxImage from '../../assets/images/qx.png'
import xfImage from '../../assets/images/xf.png'
import { AtButton, AtIcon } from 'taro-ui'

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      banners: ['#f00', '#0f0', '#00f'],
      bannerIndex: 0
    }
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

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    let { banners, bannerIndex } = this.state;
    let dailyServices = [
      { name: '清洗球鞋', price: '49', imageUrl: qxImage },
      { name: '修复球鞋', price: '64', imageUrl: xfImage },
    ]
    let processList = [
      { iconName: 'iconfont iconxuanzefuwu', line2: '选择服务', line3: '第01步' },
      { iconName: 'iconfont iconzaixianzhifu', line2: '在线支付', line4: '第02步' },
      { iconName: 'iconfont iconfahuodaopingtai', line2: '发货到平台', line3: '第03步' },
      { iconName: 'iconfont iconkaishixihu', line2: '开始洗护', line3: '第04步' },
      { iconName: 'iconfont iconwanchengbingjichu', line2: '完成并寄出', line3: '第05步' },
      { iconName: 'iconfont iconquerenshouhuo', line2: '确认收货', line3: '第06步' },
    ]
    return (
      <View className='home-wrapper'>
        {/* swiper */}
        <View className='swiper-container'>
          <Swiper
            className='swiper-box'
            circular
            indicatorDots
            onChange={(e) => {
              bannerIndex = e.detail.current
              this.setState({ bannerIndex })
            }}
            autoplay>
            {
              banners.map(ele => {
                return (
                  <SwiperItem className="swiper-item" key={ele}>
                    <View className='' style={{ 'background': ele }}>{ele}</View>
                  </SwiperItem>
                )
              })
            }
          </Swiper>
          <View className="dots">
            {
              banners.map((ele, index) => {
                return (
                  <View className={index == bannerIndex ? 'curr dot-item' : 'dot-item'} key={ele}></View>
                )
              })
            }
          </View>
        </View>
        {/* 日常服务 */}
        <View className="module-contianer">
          <View className="module-title">
            <Text className="line1">日常服务</Text>
            <Text className="line2">DAILY SERVICE</Text>
          </View>
          <View className="daily-service">
            {
              dailyServices.map(ele => {
                return (
                  <View className="daily-item" key={ele.name}>
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
        <View className="module-contianer">
          <View className="module-title">
            <Text className="line1">服务价目</Text>
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
        <View className="module-contianer">
          <View className="module-title">
            <Text className="line1">服务流程</Text>
            <Text className="line2">SERVICE PROCESS</Text>
          </View>
          <View className="service-process">
            {
              processList.map((ele, index) => {
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
        {/* 服务价目 */}
        <View className="module-contianer">
          <View className="module-title">
            <Text className="line1">常见问题</Text>
            <Text className="line2">Q&A</Text>
            <View className="title-right-btn" onClick={() => { console.log('more') }}>
              <Text>更多</Text>
              <View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>
          <View className="qa">
            {
              [1,2].map(ele=> {
                return (
                  <View className="qa-item" key={ele}>
                    <View className="item-q">清洗周期是多久?</View>
                    <View className="item-a">为了保护鞋子材质,我们都选择人工清洗,自然通 风阴干,洗涤周期一般为2-3天,配送周期为4-5天,一周内可以送回.</View>
                  </View>
                )
              })
            }
          </View>
        </View>
        {/* <AtButton type='primary'>按钮文案</AtButton> */}
      </View>
    )
  }
}
