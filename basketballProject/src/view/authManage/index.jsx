import React, { Component } from 'react'
import { Route } from "react-router-dom"
import {subRoute} from '../../routes'
import './index.scss'

class AuthManage extends Component {
  render() {
    return (
      subRoute('authManage').map(item => (
        <Route 
          key={item.key} 
          path={item.path} 
          exact={item.exact} 
          component={item.component} 
          breadcrumbName={item.breadcrumbName} 
        />
      ))
    )
  }
}

export default AuthManage