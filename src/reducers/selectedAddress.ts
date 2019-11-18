// 已选择地址
import { ADD, DELETE } from './constants/selectedAddress'

const INITIAL_STATE = {
  data: {}
}

export default function selectedAddress (state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        data: action.data
      }
    case DELETE:
      return {
        ...state,
        data: {}
      }
    default:
      return state
  }
}