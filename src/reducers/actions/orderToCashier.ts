// src/actions/counter.js
import {
  ADD,
  DELETE
} from '../constants/orderToCashier'

export const addOrderToCashier = (data: any) => {
  return {
    type: ADD,
    data
  }
}
export const deleteOrderToCashier = () => {
  return {
    type: DELETE
  }
}