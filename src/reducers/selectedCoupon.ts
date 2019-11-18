// 已选择优惠券
import { ADD, DELETE } from './constants/selectedCoupon'

const INITIAL_STATE = {
  data: {}
}

export default function selectedCoupon (state = INITIAL_STATE, action: any) {
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