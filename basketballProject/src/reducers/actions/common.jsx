export const showCustomerserviceAction = bool => ({
  type: 'SHOW_CUSTOMERSERVICE',
  bool
})

export const hideLeftMenuAction = bool => ({
  type: 'HIDE_LEFT_MENU',
  bool
})


export const orderMsgCountAction = number => ({
  type: 'ORDER_MSG_COUNT',
  number
})

export const unReadMsgCountAction = number => ({
  type: 'UNREAD_MSG_COUNT',
  number
})

export const loadingBarAction = bool => ({
  type: 'LOADING_BAR',
  bool
})

export const userInfoAction = object => ({
  type: 'USER_INFO',
  object
})

export const changeHeaderNavActive = data => ({
  type: 'CHANGE_HEADER_NAV',
  data
})