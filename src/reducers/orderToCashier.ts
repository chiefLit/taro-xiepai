// 提交到 /pages/orderEdit/index 页面的参数
import { ADD, DELETE } from './constants/orderToCashier'

const INITIAL_STATE = {
  data: {}
}

export default function orderToCashier (state = INITIAL_STATE, action: any) {
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