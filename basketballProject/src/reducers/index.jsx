import { combineReducers } from 'redux'
import { test } from './test'
import { 
  hideLeftMenu, 
  showCustomerService, 
  orderMsgCount, 
  unReadMsgCount,
  loadingBar,
  headerNavActive
} from './common'

export default combineReducers({
  test,
  hideLeftMenu, //左边菜单折叠bool
  showCustomerService, //客服display bool
  orderMsgCount, //未读订单 number
  unReadMsgCount, //未读客服消息 number
  loadingBar, //头部加载条
  headerNavActive, //当前导航
})