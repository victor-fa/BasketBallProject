
import React from 'react'
import { Route } from "react-router-dom"
import { subRoute } from '../../routes'
import './index.scss'

class OrderManage extends React.Component {
  render() {
    return (
      subRoute('OrderManage').map(item => (
        <Route key={item.key} path={item.path} exact={item.exact} component={item.component} />
      ))
    )
  }
}

export default OrderManage