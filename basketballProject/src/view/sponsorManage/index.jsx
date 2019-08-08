
import React from 'react'
import { Route } from "react-router-dom"
import { subRoute } from '../../routes'
import './index.scss'


class SponsorManage extends React.Component {
  render() {
    return (
      subRoute('SponsorManage').map(item => (
        <Route key={item.key} path={item.path} exact={item.exact} component={item.component} />
      ))
    )
  }
}

export default SponsorManage