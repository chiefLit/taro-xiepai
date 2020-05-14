import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'

import './index.less'
import StoreCurrent from "../../components/storeCurrent";

import * as serviceApi from '../../api/service'
import * as storeApi from "../../api/store";
import * as commonApi from "../../api/common";
import { DEFAULT_CONFIG } from '../../config'

import { addOrderToCashier } from '../../reducers/actions/orderToCashier'

const defaultImg0Url = 'https://dev-file.sneakerpai.com/assets/images/photo-zm.png'
const defaultImg1Url = 'https://dev-file.sneakerpai.com/assets/images/photo-cm.png'
const defaultImg2Url = 'https://dev-file.sneakerpai.com/assets/images/photo-bm.png'

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

  constructor(props) {
    super(props)
    this.operateData = this.operateData.bind(this)
    this.handleChoose = this.handleChoose.bind(this)
    this.chooseImage = this.chooseImage.bind(this)
  }

  state = {
    currStore: {},
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
  
  async componentWillMount() {
    const currStore = await storeApi.getCurrStore()
    this.setState({ currStore })
    this.pullData()
  }

  config = {
    navigationBarTitleText: '球鞋清洗'
  }

  initData() {
    this.setState((preState) => ({
      chosenList: [preState.wayList[0]],
      image0Url: '',
      image1Url: '',
      image2Url: ''
    }))
  }

  async pullData() {
    const params = commonApi.getCurrentStoreIdAndGoodzId()
    const data = await serviceApi.washServiceList(params);
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      this.operateData(data.object || [])
    }
  }

  // 获取数据之后操作数据
  operateData(List) {
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
  handleChoose(type, item) {
    if (!item) {
      this.setState((preState) => {
        let chosenList = [...preState.chosenList]
        chosenList = chosenList.filter((ele) => ele.classifyCode === '000001')
        return { chosenList }
      })
      return
    }
    // 删除
    let index1 = this.state.chosenList.findIndex((ele) => {
      return ele.id === item.id
    })
    if (type === 2 && index1 !== -1) {
      this.setState((preState) => {
        let chosenList = [...preState.chosenList]
        chosenList = chosenList.filter((ele, index) => index !== index1)
        return { chosenList }
      })
      return
    }
    // 修改/添加
    let index2 = this.state.chosenList.findIndex((ele) => {
      return ele.group === item.group
    })
    this.setState((preState) => {
      let chosenList = [...preState.chosenList]
      index2 === -1 ? chosenList.push(item) : chosenList[index2] = item;
      return { chosenList }
    })
  }

  // 计算总价
  mathSum(list) {
    let sum = 0;
    list.map(ele => {
      sum += ele.price
    })
    return sum
  }

  async chooseImage(index) {
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
    const goodzInfo = commonApi.getCurrentStoreIdAndGoodzId()
    this.setState({ showSelectedProduct: false })
    if (!this.checkImageUpload()) return
    let { chosenList, image0Url, image1Url, image2Url } = this.state;
    let serviceItemIds = chosenList.map((ele) => ele.id)
    const data = await serviceApi.toCartByWash({
      serviceItemIds, image0Url, image1Url, image2Url, ...goodzInfo
    })
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message,
        icon: 'none'
      })
    } else {
      Taro.showModal({
        title: '添加成功',
        content: '已添加进购物车，是否继续添加订单？',
        cancelText: '返回首页',
        confirmText: '继续添加',
        success: (res) => { 
          if (res.cancel) {
            Taro.switchTab({
              url: '/pages/home/index'
            })
          } else {
            this.initData();
          }
        }
      })
    }
  }

  async submitOrder() {
    const goodzInfo = commonApi.getCurrentStoreIdAndGoodzId()
    this.setState({ showSelectedProduct: false })
    if (!this.checkImageUpload()) return
    const { chosenList, image0Url, image1Url, image2Url } = this.state;
    const serviceItemIds = chosenList.map((ele) => ele.id)
    const data = await serviceApi.toCashierByWash({
      serviceItemIds, image0Url, image1Url, image2Url, ...goodzInfo
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
      Taro.redirectTo({
        url: `/pages/cashier/index?serviceItemIds=${serviceItemIds}&image0Url=${image0Url}&image1Url=${image1Url}&image2Url=${image2Url}`
      })
    }
  }

  randerSelectedProduct() {
    const { chosenList } = this.state
    return (
      <View className='popup-container'>
        <View className='popup-mask' onClick={() => {
          this.setState({
            showSelectedProduct: false
          })
        }}
        ></View>
        <View className='popup-content'>
          <View className='content-title'>
            <Text>已选择项目</Text>
            <View className='iconfont iconshanchu' onClick={() => {
              this.setState({
                showSelectedProduct: false
              })
            }}
            ></View>
          </View>
          <View className='select-popup-list'>
            {
              chosenList.map((ele) => {
                return (
                  <View className='list-item' key={ele.id}>
                    <View className='name'>{ele.name}</View>
                    <View className='price'>￥{ele.price}</View>
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
        <StoreCurrent editable={false} onChange={this.pullData.bind(this)}/>
        <View className='module-container'>
          <View className='module-title'>
            <Text className='title'>选择清洗方式</Text>
          </View>
          <View className='wash-way'>
            {
              wayList.map((ele) => {
                let isActive = chosenList.some((item) => item.id === ele.id)
                return (
                  <View className={isActive ? 'way-item active' : 'way-item'} key={ele.id} onClick={this.handleChoose.bind(this, 1, ele)}>{`${ele.name} ￥${ele.price}`}</View>
                )
              })
            }
          </View>
          <View className='way-tips'>注:普通清洗-仅清洗皮质球鞋,中级清洗-仅清洗反皮/麂皮/绒皮,高级清洗-仅清洗特殊面料/ow系列</View>
        </View>
        <View className='module-container'>
          <View className='module-title'>
            <Text className='title'>选择护理项目</Text>
          </View>
          <View className='product-list'>
            <View className={chosenList.some((ele) => ele.classifyCode === '000002') ? 'product-item' : 'product-item active'}  onClick={this.handleChoose.bind(this, 2, null)}>无需护理</View>
            {
              productList.map((ele) => {
                let isActive = chosenList.some((item) => item.id === ele.id)
                return (
                  <View className={isActive ? 'product-item active' : 'product-item'} key={ele.id} onClick={this.handleChoose.bind(this, 2, ele)}>{`${ele.name} ￥${ele.price}`}</View>
                )
              })
            }
          </View>
        </View>
        <View className='module-container'>
          <View className='module-title'>
            <Text className='title'>拍摄球鞋照片</Text>
            <Text className='subTitle'>便于我们确认您爱鞋的情况</Text>
          </View>
          <View className='wash-photo'>
            <View className='photo-item' onClick={this.chooseImage.bind(this, 0)}>
              <Image mode='aspectFill' src={image0Url ? image0Url : defaultImg0Url}></Image>
            </View>
            <View className='photo-item' onClick={this.chooseImage.bind(this, 1)}>
              <Image mode='aspectFill' src={image1Url ? image1Url : defaultImg1Url}></Image>
            </View>
            <View className='photo-item' onClick={this.chooseImage.bind(this, 2)}>
              <Image mode='aspectFill' src={image2Url ? image2Url : defaultImg2Url}></Image>
            </View>
          </View>
        </View>
        <View className='footer-cover'></View>
        <View className='footer-container'>
          <View className='priceSum' 
            onClick={() => {
              this.setState({
                showSelectedProduct: !showSelectedProduct
              })
            }}
          >
            <View className='iconfont iconxihuxiangmu'>
              <View className='spot'>{this.state.chosenList.length}</View>
            </View>
            <Text>￥{this.mathSum(this.state.chosenList)}</Text>
          </View>
          <AtButton full className='addInCart' onClick={this.addCart.bind(this)}>加入购物车</AtButton>
          <AtButton full className='submit' onClick={this.submitOrder.bind(this)}>提交订单</AtButton>
        </View>
        {showSelectedProduct ? this.randerSelectedProduct() : ''}
      </View>
    )
  }
}
