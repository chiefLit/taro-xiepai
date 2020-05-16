import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
// import { AtActionSheet, AtActionSheetItem } from "taro-ui";
import "./index.less";
import "taro-ui/dist/style/components/icon.scss";

import * as storeApi from "../../api/store";

const mapPinImage = 'https://dev-file.sneakerpai.com/assets/images/map-pin.png'

interface IProps {
  onChange?: Function
}

export default class storeChange extends Component<IProps> {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  constructor(props: IProps) {
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

  renderStoreList() {
    const { storeList, currStore } = this.state;
    return (
      <View className="store-list-wrapper">
        {
          storeList.map((item: any) => <div key={item.id}>

            <View
              className={item.id === currStore.id ? 'store-item-wrapper active' : 'store-item-wrapper'}
              onClick={() => {
                if (currStore.id !== item.id) {
                  this.setCurrStore(item);
                }
                this.setState({
                  isAction: false
                })
              }}
            >
              <View className="title">{item.name}</View>
              <View className="address desc">
                <View className="at-icon at-icon-map-pin"></View>
                <Text>{item.provinceName}{item.cityName}{item.countyName}{item.describe}</Text>
              </View>
              <View className="business-hours desc">
                <View className="at-icon at-icon-phone"></View>
                <Text>{item.phone}</Text>
              </View>
            </View>
          </div>)
        }
      </View>
    )
  }

  render() {
    const { currStore, isAction } = this.state;
    return (
      <View className="store-change-wrapper">
        <View className="address-box" onClick={() => {
          this.setState({
            isAction: true
          })
        }}>
          <Image src={mapPinImage}></Image>
          <Text>{currStore.name}</Text>
          <View className='at-icon at-icon-chevron-right'></View>
        </View>
        {isAction ?
          <View>
            <View className="mask" onClick={() => {
              this.setState({
                isAction: false
              })
            }}></View>
            {this.renderStoreList()}
          </View>
          : null}
      </View>
    );
  }
}
