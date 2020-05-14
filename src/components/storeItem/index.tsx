import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.less";
import "taro-ui/dist/style/components/icon.scss";

interface storeVo{
  address: string,
  baiduGpsLocation: string,
  businessHour: string,
  cityName: string,
  countyName: string,
  describe: string,
  gpsLocation: null,
  id: number,
  linkMan: string,
  name: string,
  phone: string,
  pictureUrl: string,
  provinceName: string,
  status: number
}

export default class storeItem extends Component {
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

  render() {
    const { storeVo } = this.props
    return (
      <View className="store-item-wrapper">
        <View className="title">{storeVo.name}</View>
        <View className="address desc">
          <View className="at-icon at-icon-map-pin"></View>
          <Text>{storeVo.provinceName}{storeVo.cityName}{storeVo.countyName}{storeVo.describe}</Text>
        </View>
        {/* <View className="business-hours desc">
          <View className="at-icon at-icon-clock"></View>
          <Text>{storeVo.businessHour}</Text>
        </View> */}
        <View className="business-hours desc">
          <View className="at-icon at-icon-phone"></View>
          <Text>{storeVo.phone}</Text>
        </View>
      </View>
    );
  }
}
