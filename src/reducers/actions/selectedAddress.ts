// src/actions/counter.js
import {
  ADD,
  DELETE
} from '../constants/selectedAddress'

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