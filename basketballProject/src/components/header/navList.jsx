/**
 * @file    index.jsx
 * @desc    头部导航
 * @author  易梦蝶
 * @update  20180326 
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { showCustomerserviceAction } from '../../reducers/actions/common'

const navList = [
  {
    key: 1,
    name: '店铺管理',
    path: '/shopManage',
  },
  {
    key: 2,
    name: '用户管理',
    path: '/usersManage',
  },
  {
    key: 3,
    name: '玩具管理',
    path: '/toysManage',
  },
  {
    key: 4,
    name: 'app管理',
    path: '/appManage',
  },
  {
    key: 5,
    name: '商品单位',
    path: '/goods/meterageUnit',
  }
]

class NavList extends Component {
  constructor() {
    super()
    this.state = {
      activePath: ''
    }
  }
  changeUrl = (activePath) => {
    this.setState({
      activePath
    })
    this.props.dispatch(showCustomerserviceAction(false))
  }

  render() {
    return (
      <div className='list'>
        {navList.map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={this.state.activePath === item.path ? 'active' : ''}
            onClick={() => this.changeUrl(item.path)}
          >
            {item.name}
          </Link>
        ))
        }
      </div>
    )
  }
}

NavList.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(NavList)
