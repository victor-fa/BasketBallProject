import React, { Component } from 'react';
import { withRouter, Route } from "react-router-dom"
import { routes, unSigninRoute } from './routes'
import Header from './components/header'
import LeftMenu from './components/leftMenu'
import { connect } from 'react-redux'
// import CustomerService from './components/customerService'
import myTool from './common/js/tool'
import {changeHeaderNavActive} from './reducers/actions/common'
 
class App extends Component {
  state = {
    routerList: []
  }
  componentWillMount() {
    const userInfo = myTool.sesStorGetItem('shareToysAdminUserInfo')
    if (!userInfo) {
      this.props.history.push('/signin')
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props.dispatch(changeHeaderNavActive(nextProps.history.location.pathname))
  }

  render() {
    const userInfo = myTool.sesStorGetItem('shareToysAdminUserInfo')

    let routerList = []
    if (userInfo) {
      const menuIds = userInfo.menuIds.split(',').filter(item => item)
      routerList = routes.filter(o => {
        let isInclude = o.authId === 'noAuthId' || menuIds.includes(o.authId);
        if (isInclude && o.routes) {
          let subArrResult = o.routes.filter(subO => subO.authId === 'noAuthId' || menuIds.includes(subO.authId));
          o.routes = subArrResult; 
        } 
        return isInclude
      })
    } else {
      routerList = unSigninRoute
    }
    return (
      <div className="u-app-wrap">
        <Header />
        <div className='u-container'>
          {userInfo && <LeftMenu />}
          <div className={`u-container-r`}>
            {/* {shareToysAdminUserInfo && <CustomerService />} */}
            {routerList.map(item => (
              <Route key={item.key} path={item.path} exact={item.exact} component={item.component} />
            ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect()(App))

