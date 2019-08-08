
import React from 'react'
import { Route } from "react-router-dom"
import { subRoute } from '../../routes'
import './index.scss'

class CourtManage extends React.Component {
  render() {
    return (
      subRoute('CourtManage').map(item => (
        <Route key={item.key} path={item.path} exact={item.exact} component={item.component} />
      ))
    )
  }
}

export default CourtManage