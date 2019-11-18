// src/reducers/index.js
import { combineReducers } from 'redux'
import counter from './counter'
import orderToCashier from './orderToCashier'
import selectedAddress from './selectedAddress'
import selectedCoupon from './selectedCoupon'

export default combineReducers({
  counter,
  orderToCashier,
  selectedAddress,
  selectedCoupon
})
