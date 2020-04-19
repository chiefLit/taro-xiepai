import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'
import './index.less'

export default class DoorDate extends Component {

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

  state = {
    dateValue: '请选择',
    multiRange: [
      [
        { label: '今天', value: '0' },
        { label: '明天', value: '1' },
        { label: '后天', value: '2' }
      ],
      []
    ]
  }

  setHourList = (value) => {
    let hourList = []
    if (value === 0) {
      const nowHour = new Date().getHours()
      const todayStartHour = nowHour < 8 ? 8 : nowHour > 21 ? null : nowHour + 1
      if (todayStartHour) {
        for (let hour = todayStartHour; hour < 22; hour++) {
          hourList.push({
            label: `${hour}:00 - ${hour + 1}:00`,
            value: hour
          })
        }
      }
    } else {
      for (let hour = 8; hour < 22; hour++) {
        hourList.push({
          label: `${hour}:00 - ${hour + 1}:00`,
          value: hour
        })
      }
    }
    this.setState(preState => {
      return { multiRange: [ preState.multiRange[0], hourList ] }
    })
  }

  componentDidShow() {
    this.setHourList(0)
  }

  render() {
    const { setDate } = this.props
    const { multiRange, dateValue } = this.state
    return (
      <View>
        <View className='door-date' >
          <Picker mode='multiSelector' range={multiRange} rangeKey="label"
            onChange={(data) => {
              const selectDay = multiRange[0][data.detail.value[0]]
              const selectHour = multiRange[1][data.detail.value[1]]
              const oneDay = 24 * 60 * 60 * 1000
              const oneHour = 60 * 60 * 1000
              const makeDoorStartTime = new Date(new Date().toLocaleDateString()).setHours(selectHour.value) + oneDay * selectDay.value
              const makeDoorEndTime = makeDoorStartTime + oneHour
              setDate(makeDoorStartTime, makeDoorEndTime)
              this.setState({
                dateValue: `${selectDay.label} ${selectHour.label}`
              })
            }} 
            onColumnchange={(data) => {
              if (data.detail.column === 0) {
                this.setHourList(data.detail.value)
              }
            }}>
            <View className='module-list'>
              <View className='key'>上门时间</View>
              <View className='value'>
                <Text>{dateValue}</Text>
                <AtIcon value='chevron-right' size='15' color='#999'></AtIcon>
              </View>
            </View>
          </Picker>
        </View>
      </View>
    )
  }
}
