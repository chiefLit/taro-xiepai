// src/actions/counter.js
import {
  ADD,
  DELETE
} from '../constants/orderToCashier'

export const addAction = (data: any) => {
  return {
    type: ADD,
    data
  }
}
export const deleteAction = () => {
  return {
    type: DELETE
  }
}