import { defaultQueryOrderState } from '../view/order/orderList/config'

//保存查询订单筛选状态
export function queryOrderState(state = defaultQueryOrderState, action) {
  switch (action.type) {
    case 'QUERY_ORDER_STATE':
    { 
      return action.object;
    }
    default: 
      return state
  }
}
