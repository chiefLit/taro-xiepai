import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtButton } from 'taro-ui'

import { washServiceList, toCartByWash, toCashierByWash } from '../../api/service'
import { DEFAULT_CONFIG } from '../../config'

import { connect } from '@tarojs/redux'
import { addOrderToCashier } from '../../reducers/actions/orderToCashier'

@connect(
  state => state,
  { addOrderToCashier }
)

export default class productWash extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '球鞋清洗'
  }

  constructor(props) {
    super(props)
    this.operateData = this.operateData.bind(this)
    this.handleChoose = this.handleChoose.bind(this)
    this.chooseImage = this.chooseImage.bind(this)
  }

  state = {
    // 清洗方式（也属于产品）
    wayList: [],
    // 产品列表
    productList: [],
    // 已选择产品
    chosenList: [],
    // 弹窗显示-已选产品
    showSelectedProduct: false,
    // 图片列表 球鞋展示面 鞋子展示面：0：正面 1：背后 2：侧面
    image0Url: '',
    image1Url: '',
    image2Url: ''
  }

  defaultImg0Url = require('../../assets/images/photo-zm.png')
  defaultImg1Url = require('../../assets/images/photo-cm.png')
  defaultImg2Url = require('../../assets/images/photo-bm.png')

  componentWillMount() {
    this.pullData()
  }

  initData() {
    this.setState((preState: any) => ({
      chosenList: [preState.wayList[0]],
      image0Url: '',
      image1Url: '',
      image2Url: ''
    }))
  }

  async pullData() {
    let data: any = await washServiceList(null);
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message
      })
    } else {
      this.operateData(data.object || [])
    }
  }

  // 获取数据之后操作数据
  operateData(List: any) {
    let wayList = List.filter(ele => {
      return ele.classifyCode === '000001'
    })
    let chosenList = [wayList[0]];
    let productList = List.filter(ele => {
      return ele.classifyCode === '000002'
    })
    this.setState({
      wayList,
      productList,
      chosenList
    })
  }

  // 生成已选中数据
  handleChoose(type: Number, item: any) {
    if (!item) {
      this.setState((preState: any) => {
        let chosenList = [...preState.chosenList]
        chosenList = chosenList.filter((ele: any) => ele.classifyCode === '000001')
        return { chosenList }
      })
      return
    }
    // 删除
    let index1 = this.state.chosenList.findIndex((ele: any) => {
      return ele.id === item.id
    })
    if (type === 2 && index1 !== -1) {
      this.setState((preState: any) => {
        let chosenList = [...preState.chosenList]
        chosenList = chosenList.filter((ele, index) => index !== index1)
        return { chosenList }
      })
      return
    }
    // 修改/添加
    let index2 = this.state.chosenList.findIndex((ele: any) => {
      return ele.group === item.group
    })
    this.setState((preState: any) => {
      let chosenList = [...preState.chosenList]
      index2 === -1 ? chosenList.push(item) : chosenList[index2] = item;
      return { chosenList }
    })
  }

  // 计算总价
  mathSum(list: any) {
    let sum = 0;
    list.map(ele => {
      sum += ele.price
    })
    return sum
  }

  async chooseImage(index: Number) {
    // 选择图片
    let { tempFilePaths } = await Taro.chooseImage({
      count: 1
    })

    if (!tempFilePaths.length) return

    let uploadRes = await Taro.uploadFile({
      url: DEFAULT_CONFIG.fileBaseURL,
      filePath: tempFilePaths[0],
      name: 'file'
    })

    if (!uploadRes) return

    this.setState({
      [`image${index}Url`]: JSON.parse(uploadRes.data).object.viewPath
    })
    
    Taro.showToast({
      title: '上传成功',
      icon: 'none'
    })
  }

  checkImageUpload() {
    if (!this.state.image0Url) {
      Taro.showToast({
        title: '请先上传球鞋正面照片',
        icon: 'none'
      })
      return false
    }
    if (!this.state.image1Url) {
      Taro.showToast({
        title: '请先上传球鞋侧面面照片',
        icon: 'none'
      })
      return false
    }
    if (!this.state.image2Url) {
      Taro.showToast({
        title: '请先上传球鞋背面照片',
        icon: 'none'
      })
      return false
    }
    return true
  }

  // 添加到购物车
  async addCart() {
    this.setState({ showSelectedProduct: false })
    if (!this.checkImageUpload()) return
    let { chosenList, image0Url, image1Url, image2Url } = this.state;
    let serviceItemIds: Array<any> = chosenList.map((ele: any) => ele.id)
    let data: any = await toCartByWash({
      serviceItemIds, image0Url, image1Url, image2Url
    })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      Taro.showToast({
        title: '添加购物车成功',
        icon: 'success'
      })
      this.initData();
    }
  }

  async submitOrder() {
    this.setState({ showSelectedProduct: false })
    if (!this.checkImageUpload()) return
    let { chosenList, image0Url, image1Url, image2Url } = this.state;
    let serviceItemIds: Array<any> = chosenList.map((ele: any) => ele.id)
    let data: any = await toCashierByWash({
      serviceItemIds, image0Url, image1Url, image2Url
    })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.props.addOrderToCashier(data.object)
      this.initData()
      // 添加成功
      Taro.navigateTo({
        url: `/pages/orderEdit/index?serviceItemIds=${serviceItemIds}&image0Url=${image0Url}&image1Url=${image1Url}&image2Url=${image2Url}`
      })
    }
  }

  randerSelectedProduct() {
    const { chosenList } = this.state
    return (
      <View className="popup-contianer">
        <View className="popup-mask" onClick={() => {
          this.setState({
            showSelectedProduct: false
          })
        }}></View>
        <View className="popup-content">
          <View className="content-title">
            <Text>已选择项目</Text>
            <View className="iconfont iconshanchu" onClick={() => {
              this.setState({
                showSelectedProduct: false
              })
            }}></View>
          </View>
          <View className="select-popup-list">
            {
              chosenList.map((ele: any) => {
                return (
                  <View className="list-item" key={ele.id}>
                    <View className="name">{ele.name}</View>
                    <View className="price">￥{ele.price}</View>
                  </View>
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }


  render() {
    let { wayList, productList, chosenList, showSelectedProduct, image0Url, image1Url, image2Url } = this.state
    return (
      <View className='product-wash-wrapper'>
        <View className="module-contianer">
          <View className="module-title">
            <Text className="title">选择清洗方式</Text>
          </View>
          <View className="wash-way">
            {
              wayList.map((ele: any) => {
                let isActive = chosenList.some((item: any) => item.id === ele.id)
                return (
                  <View className={isActive ? 'way-item active' : 'way-item'} key={ele.id} onClick={this.handleChoose.bind(this, 1, ele)}>{`${ele.name} ￥${ele.price}`}</View>
                )
              })
            }
          </View>
          <View className="way-tips">注:普通清洗-仅清洗皮质球鞋,中级清洗-仅清洗反皮/麂皮/绒皮,高级清洗-仅清洗特殊面料/ow系列</View>
        </View>
        <View className="module-contianer">
          <View className="module-title">
            <Text className="title">选择护理项目</Text>
          </View>
          <View className="product-list">
            <View className={chosenList.some((ele:any) => ele.classifyCode === '000002') ? 'product-item' : 'product-item active'}  onClick={this.handleChoose.bind(this, 2, null)}>无需护理</View>
            {
              productList.map((ele: any) => {
                let isActive = chosenList.some((item: any) => item.id === ele.id)
                return (
                  <View className={isActive ? 'product-item active' : 'product-item'} key={ele.id} onClick={this.handleChoose.bind(this, 2, ele)}>{`${ele.name} ￥${ele.price}`}</View>
                )
              })
            }
          </View>
        </View>
        <View className="module-contianer">
          <View className="module-title">
            <Text className="title">拍摄球鞋照片</Text>
            <Text className="subTitle">便于我们确认您爱鞋的情况</Text>
          </View>
          <View className="wash-photo">
            <View className="photo-item" onClick={this.chooseImage.bind(this, 0)}>
              <Image mode="aspectFill" src={image0Url ? image0Url : this.defaultImg0Url}></Image>
            </View>
            <View className="photo-item" onClick={this.chooseImage.bind(this, 1)}>
              <Image mode="aspectFill" src={image1Url ? image1Url : this.defaultImg1Url}></Image>
            </View>
            <View className="photo-item" onClick={this.chooseImage.bind(this, 2)}>
              <Image mode="aspectFill" src={image2Url ? image2Url : this.defaultImg2Url}></Image>
            </View>
          </View>
        </View>
        <View className="footer-cover"></View>
        <View className="footer-contianer">
          <View className="priceSum" onClick={() => {
            this.setState({
              showSelectedProduct: !showSelectedProduct
            })
          }}>
            <View className="iconfont iconxihuxiangmu">
              <View className="spot">{this.state.chosenList.length}</View>
            </View>
            <Text>￥{this.mathSum(this.state.chosenList)}</Text>
          </View>
          <AtButton full className="addInCart" onClick={this.addCart.bind(this)}>加入购物车</AtButton>
          <AtButton full className="submit" onClick={this.submitOrder.bind(this)}>提交订单</AtButton>
        </View>
        {showSelectedProduct ? this.randerSelectedProduct() : ''}
      </View>
    )
  }
}
