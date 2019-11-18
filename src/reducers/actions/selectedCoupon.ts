// src/actions/counter.js
import {
  ADD,
  DELETE
} from '../constants/selectedCoupon'

export const addAction = () => {
  return {
    type: ADD
  }
}
export const deleteAction = () => {
  return {
    type: DELETE
  }
}