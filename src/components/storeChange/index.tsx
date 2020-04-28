import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtActionSheet, AtActionSheetItem } from "taro-ui";
import "./index.less";
import "taro-ui/dist/style/components/icon.scss";

import mapPinImage from "../../assets/images/map-pin.png";

import * as storeApi from "../../api/store";

export default class storeItem extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  constructor(props: any) {
    super(props)
  }

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
    const currStore = await storeApi.getCurrStore()
    this.setState({
      currStore
    });
  }

  async setCurrStore(data: any) {
    await storeApi.setCurrStore(data);
    const currStore = await storeApi.getCurrStore()
    this.setState({
      currStore
    });
    return Promise.resolve()
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
    const { onChange } = this.props
    return (
      <View className="store-item-wrapper">
        <View className="address-box" onClick={() => {
          this.setState({
            isAction: true
          })
        }}>
          <Image src={mapPinImage}></Image>
          <Text>{currStore.name}</Text>
        </View>

        <AtActionSheet isOpened={isAction}>
          {storeList.map((item: any) => {
            return (
              <AtActionSheetItem key={item.id}
                onClick={() => {
                  if (currStore.id !== item.id) {
                    this.setCurrStore(item).then(() => {
                      onChange && onChange()
                    });
                  }
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
