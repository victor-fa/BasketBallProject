import React, {PureComponent} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import './index.scss'
import myTool from '../../common/js/tool'
import { hideLeftMenuAction } from '../../reducers/actions/common'

class Header extends PureComponent {
  signOut = () => {
    myTool.sesStorRemoveItem('shareToysAdminUserInfo');
    this.props.history.push('/signin')
  }
  clickMenuFold = () => {
    this.props.dispatch(hideLeftMenuAction(!this.props.hideLeftMenu))
  }
  render() {
    const { hideLeftMenu } = this.props
    const shareToysAdminUserInfo = myTool.sesStorGetItem('shareToysAdminUserInfo')
    return (
      <header className='m-header'>
        <h1><Link to='/'>街头篮球后台</Link></h1>
        <Icon 
          className='menu-fold' 
          onClick={this.clickMenuFold}
          title={hideLeftMenu ? "展开菜单" : "折叠菜单"}
          type={hideLeftMenu ? "menu-unfold" : "menu-fold"} 
        />
        {shareToysAdminUserInfo &&
          <div className='user-r'>
            <i className='iconfont icon-user'>&#xe66a;</i>
            {shareToysAdminUserInfo.username}
            <span className='sign-out' onClick={this.signOut}>退出</span>
          </div>
        }
      </header>
    )
  }
}

Header.propTypes = {
  dispatch: PropTypes.func,
  hideLeftMenu: PropTypes.bool 
}
export default withRouter(connect(state => ({
  hideLeftMenu: state.hideLeftMenu,
}))(Header));