export const test = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_CUSTOMERSERVICE':
      return action.bool
    default:
      return state
  }
}

export const hideLeftMenu = (state = false, action) => {
  switch (action.type) {
    case 'HIDE_LEFT_MENU':
      return action.bool
    default:
      return state
  }
}


export const showCustomerService = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_CUSTOMERSERVICE':
      return action.bool
    default:
      return state
  }
}

export const orderMsgCount = (state = 0, action) => {
  switch (action.type) {
    case 'ORDER_MSG_COUNT':
      return action.number
    default:
      return state
  }
}

export const unReadMsgCount = (state = 0, action) => {
  switch (action.type) {
    case 'UNREAD_MSG_COUNT':
      return action.number
    default:
      return state
  }
}

export const loadingBar = (state = false, action) => {
  switch (action.type) {
    case 'LOADING_BAR':
      return action.bool
    default:
      return state
  }
}

export const shareToysAdminUserInfo = (state = '', action) => {
  switch (action.type) {
    case 'USER_INFO':
      return action.object
    default:
      return state
  }
}


export const headerNavActive = (state = '/home', action) => {
  switch (action.type) {
    case 'CHANGE_HEADER_NAV':
      return action.data
    default:
      return state
  }
}

