import React, { Component } from 'react'
import { Route } from "react-router-dom"
import { subRoute } from '../../routes'
import './index.scss'

class UsersManage extends Component {
  render() {
    return (
      subRoute('usersManage').map(item => (
        <Route key={item.key} path={item.path} exact={item.exact} component={item.component} />
      ))
    )
  }
}

export default UsersManage