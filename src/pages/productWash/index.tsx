import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtButton } from 'taro-ui'

import { washServiceList } from '../../api/service'

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

  constructor() {
    super()
    this.operateData = this.operateData.bind(this)
    this.handleChoose = this.handleChoose.bind(this)
  }

  state = {
    wayList: [],
    productList: [],
    chooseList: [],
    showSelectedProduct: false
  }

  componentWillMount() {
    this.pullData()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  async pullData() {
    let data = await washServiceList();
    if (data.code !== 1) {
      Taro.showToast({
        title: data.message
      })
    } else {
      this.operateData(data.object || [])
    }
  }
  // 获取数据之后操作数据
  operateData(List: Array) {
    let wayList = List.filter(ele => {
      return ele.classify_code === '000001'
    })
    let chooseList = [wayList[0]];
    let productList = List.filter(ele => {
      return ele.classify_code === '000002'
    })
    this.setState({
      wayList,
      productList,
      chooseList
    })
  }

  // 生成已选中数据
  handleChoose(type: Number, item: Object) {
    // 删除
    let index1 = this.state.chooseList.findIndex((ele) => {
      return ele.id === item.id
    })
    if (type === 2 && index1 !== -1) {
      this.setState(preState => {
        let chooseList = [...preState.chooseList]
        chooseList = chooseList.filter((ele, index) => index !== index1)
        return { chooseList }
      })
      return
    }
    // 修改/添加
    let index2 = this.state.chooseList.findIndex((ele) => {
      return ele.group === item.group
    })
    this.setState(preState => {
      let chooseList = [...preState.chooseList]
      index2 === -1 ? chooseList.push(item) : chooseList[index2] = item;
      return { chooseList }
    })
  }

  mathSum(list: Array) {
    let sum = 0;
    list.map(ele => {
      sum += ele.price
    })
    return sum
  }

  photoList = [
    {
      id: 1,
      src: require('../../assets/images/photo-cm.png'),
      name: '侧面',
    },
    {
      id: 2,
      src: require('../../assets/images/photo-bm.png'),
      name: '背面',
    },
    {
      id: 3,
      src: require('../../assets/images/photo-zm.png'),
      name: '正面',
    }
  ]

  randerSelectedProduct() {
    const { chooseList } = this.state
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
              chooseList.map(ele => {
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
    let { wayList, productList, chooseList, showSelectedProduct } = this.state
    return (
      <View className='product-wash-wrapper'>
        <View className="module-contianer">
          <View className="module-title">
            <Text className="title">选择清洗方式</Text>
          </View>
          <View className="wash-way">
            {
              wayList.map(ele => {
                let isActive = chooseList.some(item => item.id === ele.id)
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
            {
              productList.map(ele => {
                let isActive = chooseList.some(item => item.id === ele.id)
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
            {
              this.photoList.map(ele => {
                return (
                  <View className="photo-item" key={ele.id} onClick={() => {
                    Taro.chooseImage({
                      count: 1,
                      success({ tempFilePaths }) {
                        Taro.showToast({
                          title: '暂未上传',
                          icon: 'none'
                        })
                        return
                        Taro.uploadFile({
                          url: '',
                          filePath: tempFilePaths[0],
                          name: 'file',
                          formData: {
                            'user': 'test'
                          },
                          success(res) {
                            const data = res.data
                            //do something
                          }
                        })
                      }
                    })
                  }}>
                    <Image src={ele.src}></Image>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className="footer-cover"></View>
        <View className="footer-contianer">
          <View className="priceSum" onClick={() => {
            this.setState({
              showSelectedProduct: !showSelectedProduct
            })
          }}>
            <View className="iconfont iconxihuxiangmu"></View>
            <Text>￥{this.mathSum(this.state.chooseList)}</Text>
          </View>
          <AtButton full className="addInCart">加入购物车</AtButton>
          <AtButton full className="submit">提交订单</AtButton>
        </View>
        {showSelectedProduct ? this.randerSelectedProduct() : ''}
      </View>
    )
  }
}
