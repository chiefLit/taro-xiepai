import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtButton } from 'taro-ui'

import api from '../../api/index'
import { element } from 'prop-types'

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
    chooseList: []
  }

  componentWillMount() {
    this.pullData()
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  async pullData() {
    let data = await api.washServiceList();
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
    console.log(12312)
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


  render() {
    let { wayList, productList, chooseList } = this.state
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
        <View className="module-contianer wash-product">
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
        <View className="module-contianer wash-photo">
          <View className="module-title">
            <Text className="title">拍摄球鞋照片</Text>
            <Text className="subTitle">便于我们确认您爱鞋的情况</Text>
          </View>
        </View>
        <View className="footer-contianer">
          <View className="priceSum">￥{this.mathSum(this.state.chooseList)}</View>
          <AtButton full className="addInCart">加入购物车</AtButton>
          <AtButton full className="submit">提交订单</AtButton>
        </View>
      </View>
    )
  }
}
