import React, { Component } from 'react'
import { 
  Menu, 
  // Badge 
} from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './index.scss'
import { showCustomerserviceAction } from '../../reducers/actions/common'
import myTool from '../../common/js/tool'

const { SubMenu } = Menu;

const homePath = '/courtManage/courtList'

class LeftMenu extends Component {
  constructor() {
    super();
    this.state = {
      userid: '',
      collapsed: false,
      unReadMsgCount: 0,
      selectedKeys: ['/usersManage/usersList'],
      openKeys: [],
    }
  }
  componentWillMount() {
    const pathname = this.props.location.pathname
    const userInfo = myTool.sesStorGetItem('shareToysAdminUserInfo')
    const menuIds = userInfo.menuIds.split(',').filter(item => item)

    const meunList = allMeunList.filter(o => {
      let isInclude = o.authId === 'noAuthId' || menuIds.includes(o.authId);
      if (isInclude && o.subMeun) {
        let subArrResult = o.subMeun.filter(subO => subO.authId === 'noAuthId' || menuIds.includes(subO.authId));
        o.subMeun = subArrResult; 
      } 
      return isInclude ;
    });

    this.setState({
      userid: userInfo.userid,
      collapsed: this.props.hideLeftMenu,
      unReadMsgCount: this.props.unReadMsgCount,
      selectedKeys: [pathname === '/' ? homePath : pathname],
      meunList 
    })
  }
  
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      collapsed: nextProps.hideLeftMenu,
      orderMsgCount: nextProps.orderMsgCount,
      unReadMsgCount: nextProps.unReadMsgCount,
    })
    if (this.props.headerNavActive !== nextProps.headerNavActive) {
      this.setState({
        selectedKeys: [nextProps.headerNavActive === '/' ? homePath : nextProps.headerNavActive]
      })
    }
  } 

  handleClickMenu = e => {
    if (e.key === '/customerservice') {
      this.props.dispatch(showCustomerserviceAction(true))
    } else {
      this.props.dispatch(showCustomerserviceAction(false))
      this.props.history.push(e.key)
    }
    const parentArr = allMeunList.filter(item => item.subMeun && item.subMeun.some(i => i.key === e.key))
    const parentKey = parentArr.length !== 0 ? parentArr[0].key : ''
    this.setState({
      selectedKeys: [e.key],
      parentKey,
    })
  }
  
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (allMeunList.some(i => i.key === latestOpenKey)) {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    } else {
      this.setState({ openKeys });
    }
  }

  render() { 
    const  { 
      collapsed, 
      selectedKeys,
      meunList = [],
      parentKey = '',
      openKeys = []
      // unReadMsgCount 
    } = this.state
    return  (
      <div className={`m-leftmenu ${collapsed ? 'collapsed' : ''}`}>
        <Menu
          selectedKeys={selectedKeys}
          mode='inline'
          inlineIndent='15'
          inlineCollapsed={collapsed}
          onClick={this.handleClickMenu}
          openKeys={openKeys}
          onOpenChange={this.onOpenChange}
        >
          {meunList.map(item => {
            let Item
            if (item.subMeun) {
              Item = <SubMenu 
                key={item.key}
                className={item.key === parentKey ? 'active' : ''}
                title={
                  <span>
                    <i className='iconfont anticon'>{item.icon}</i>
                    <span className='name'>{item.name}</span>
                  </span>
                }>
                  {item.subMeun.map(subItme => (
                    <Menu.Item key={subItme.key}>
                      <span><i className='subpoint' />{subItme.name}</span>
                    </Menu.Item>
                  ))}
                </SubMenu>
              } else {
                Item = <Menu.Item key={item.key}>
                  <i className='iconfont anticon'>{item.icon}</i>
                  <span className='name'>{item.name}</span>
                </Menu.Item>
              }
            return Item
          })}
        </Menu>    
      </div>
    )
  }
}

LeftMenu.propTypes = {

}

export default withRouter(connect(state => ({
  hideLeftMenu: state.hideLeftMenu,
  orderMsgCount: state.orderMsgCount,
  unReadMsgCount: state.unReadMsgCount,
  headerNavActive: state.headerNavActive,
}))(LeftMenu));


const allMeunList = [
  {
    key: '/courtManage/courtList',
    name: '球场管理',
    icon: '\ue614',
    authId: 'A001',
  },
  {
    key: '/usersManage/usersList',
    name: '会员管理',
    icon: '\ue6b0',
    authId: 'A002',
  },
  {
    key: '/orderManage/orderList',
    name: '订单管理',
    icon: '\ue62b',
    authId: 'A003',
  },
  {
    key: '/CapitalRecord/FundInfo',
    name: '资金管理',
    icon: '\ue60c',
    authId: 'A004',
  },
  {
    key: '/appManage/adManage',
    name: '广告管理',
    icon: '\ue617',
    authId: 'A005',
  },
  {
    key: '/authManage/workerList',
    name: '权限管理',
    icon: '\ue748',
    authId: 'A006',
    subMeun: [
      {
        key: '/authManage/workerList',
        name: '人员列表',
        authId: 'B001_A006',
      },
      {
        key: '/authManage/authRoleList',
        name: '权限列表',
        authId: 'B002_A006',
      },
    ]
  },
  {
    key: '/sponsorManage/sponsorList',
    name: '赞助商管理',
    icon: '\ue748',
    authId: 'A007',
  }
]