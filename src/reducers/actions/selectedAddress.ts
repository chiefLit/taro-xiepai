// src/actions/counter.js
import {
  ADD,
  DELETE
} from '../constants/selectedAddress'

export const addSelectedAddress = (data) => {
  return {
    type: ADD,
    data
  }
}
export const deleteSelectedAddress = () => {
  return {
    type: DELETE
  }
}