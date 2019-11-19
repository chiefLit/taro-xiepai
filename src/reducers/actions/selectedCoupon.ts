// src/actions/counter.js
import {
  ADD,
  DELETE
} from '../constants/selectedCoupon'

export const addSelectedCoupon = (data) => {
  return {
    type: ADD,
    data
  }
}
export const deleteSelectedCoupon = () => {
  return {
    type: DELETE
  }
}