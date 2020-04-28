import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton, AtActionSheet, AtActionSheetItem } from "taro-ui";
import "./index.less";
import "taro-ui/dist/style/components/icon.scss";

import * as storeApi from "../../api/store";

export default class storeItem extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  state = {
    storeList: [],
    currStore: {
      address: "",
      baiduGpsLocation: "",
      businessHour: "",
      cityName: "",
      countyName: "",
      describe: "",
      gpsLocation: null,
      id: 1,
      linkMan: "",
      name: "",
      phone: "",
      pictureUrl: null,
      provinceName: "",
      status: 0
    },
    isAction: false
  };

  async getStoreList() {
    const storeList = await storeApi.getStoreList({});
    this.setState({
      storeList
    });
  }

  async getCurrStore() {
    const currStore = await storeApi.getCurrStore({})
    this.setState({
      currStore
    });
  }

  async setCurrStore(data: any) {
    storeApi.setCurrStore(data);
    this.getCurrStore()
  }

  componentDidShow() {
    this.getStoreList();
    this.getCurrStore();
    this.setState({
      isAction: false
    });
  }

  render() {
    const { storeList, currStore, isAction } = this.state;
    const { editable } = this.props
    return (
      <View className="store-item-wrapper">
        {
          editable ? 
          <AtButton type="primary" size="small" onClick={() => {
            this.setState({
              isAction: true
            })
          }}>
            切换店铺
          </AtButton> : null
        }
        <View className="title">{currStore.name}</View>
        <View className="address desc">
          <View className="at-icon at-icon-map-pin"></View>
          <Text>{currStore.provinceName} {currStore.cityName} {currStore.countyName} {currStore.describe}</Text>
        </View>
        <View className="business-hours desc">
          <View className="at-icon at-icon-clock"></View>
          <Text>{currStore.businessHour}</Text>
        </View>
        <AtActionSheet isOpened={isAction}>
          {storeList.map((item: any) => {
            return (
              <AtActionSheetItem key={item.id}
                onClick={() => {
                  this.setCurrStore(item)
                  this.setState({
                    isAction: false
                  })
                }}>
                <View className="name">{item.name}</View>
                <View className="address">
                  {item.provinceName} {item.cityName} {item.countyName} {item.describe}
                </View>
              </AtActionSheetItem>
            );
          })}
        </AtActionSheet>
      </View>
    );
  }
}
