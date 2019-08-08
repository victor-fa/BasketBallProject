export const test = (state = 'wee', action) => {
  switch (action.type) {
    case 'TEST':
      return action.text
    default:
      return state
  }
}
