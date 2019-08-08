// import React from 'react'
// import { Route } from 'react-router-dom'
import SignIn from '../view/login/signIn'
// import NoMatch from '../components/noMatch'
import UsersManage from  '../view/usersManage'
import UsersList from  '../view/usersManage/UsersList'
import UserDetail from  '../view/usersManage/UserDetail'

import AppManage from '../view/appManage'
import AdManage from '../view/appManage/adManage'
import EditAdvertisement from '../view/appManage/editAdvertisement'
import Feedback from '../view/appManage/feedback'

import AuthManage from '../view/authManage'
import AuthRoleList from '../view/authManage/authRoleList'
import EditAuthRole from '../view/authManage/editAuthRole'
import WorkerList from '../view/authManage/workerList'
import EditWorker from '../view/authManage/editWorker'

import CapitalRecord from '../view/capitalRecord'
import FundInfo from '../view/capitalRecord/FundInfo'

import CourtManage from '../view/courtManage'
import CourtList from '../view/courtManage/CourtList'
import EditCourt from '../view/courtManage/EditCourt'
import CourtSetup from '../view/courtManage/CourtSetup'

import OrderManage from '../view/orderManage'
import OrderList from '../view/orderManage/OrderList'
import OrderDetail from '../view/orderManage/OrderDetail'

import SponsorManage from '../view/sponsorManage'
import SponsorList from '../view/sponsorManage/SponsorList'
import EditSponsor from '../view/sponsorManage/EditSponsor'
import SponsorDetail from '../view/sponsorManage/SponsorDetail'
import LaunchSponsor from '../view/sponsorManage/LaunchSponsor'
import EditLaunchSponsor from '../view/sponsorManage/EditLaunchSponsor'

const authentication = c => c
export let routes = [
  {
    key: 'home',
    path: '/',
    exact: true,
    component: authentication(CourtList),
    breadcrumbName: "首页",
    authId: 'A001'
  },
  {
    key: 'usersManage',
    path: '/usersManage',
    component: authentication(UsersManage),
    breadcrumbName: "用户管理",
    authId: 'A002',
    routes: [
      {
        key: 'usersList',
        path: '/usersManage/usersList',
        exact: true,
        component: authentication(UsersList),
        breadcrumbName: "用户列表",
        authId: 'A002',
      },
      {
        key: 'UserDetail',
        path: '/usersManage/userDetail/:id',
        exact: true,
        component: authentication(UserDetail),
        breadcrumbName: "用户列表",
        authId: 'A002',
      }
    ]
  },
  {
    key: 'OrderManage',
    path: '/orderManage',
    component: authentication(OrderManage),
    breadcrumbName: "订单管理",
    authId: 'A003',
    routes: [
      {
        key: 'orderList',
        path: '/orderManage/orderList',
        exact: true,
        component: authentication(OrderList),
        breadcrumbName: "订单列表",
        authId: 'A003',
      },
      {
        key: 'orderDetail',
        path: '/orderManage/orderDetail/:id',
        exact: true,
        component: authentication(OrderDetail),
        breadcrumbName: "订单详情",
        authId: 'A003',
      }
    ]
  },
  {
    key: 'CapitalRecord',
    path: '/CapitalRecord',
    component: authentication(CapitalRecord),
    breadcrumbName: "资金管理",
    authId: 'A004',
    routes: [
      {
        key: 'FundInfo',
        path: '/CapitalRecord/FundInfo',
        exact: true,
        component: authentication(FundInfo),
        breadcrumbName: "资金信息",
        authId: 'A004',
      },
    ]
  },
  {
    key: 'CourtManage',
    path: '/courtManage',
    component: authentication(CourtManage),
    breadcrumbName: "球场管理",
    authId: 'A001',
    routes: [
      {
        key: 'CourtList',
        path: '/courtManage/courtList',
        exact: true,
        component: authentication(CourtList),
        breadcrumbName: "球场列表",
        authId: 'A001',
      },
      {
        key: 'EditCourt',
        path: '/courtManage/editCourt/:id',
        exact: true,
        component: authentication(EditCourt),
        breadcrumbName: "编辑球场",
        authId: 'A001',
      },
      {
        key: 'CourtSetup',
        path: '/courtManage/courtSetup/:id',
        exact: true,
        component: authentication(CourtSetup),
        breadcrumbName: "场地设置",
        authId: 'A001',
      },
    ]
  },
  {
    key: 'appManage',
    path: '/appManage',
    component: authentication(AppManage),
    breadcrumbName: "app管理",
    authId: 'A005',
    routes: [
      { 
        key: 'adManage',
        path: '/appManage/adManage',
        exact: true,
        component: authentication(AdManage),
        breadcrumbName: "广告管理",
        authId: 'A005',
      },
      { 
        key: 'feedback',
        path: '/appManage/feedback',
        exact: true,
        component: authentication(Feedback),
        breadcrumbName: "意见反馈",
        authId: 'A005',
      },
      {
        key: 'editAdvertisement',
        path: '/appManage/editAdvertisement/:id',
        exact: true,
        component: authentication(EditAdvertisement),
        breadcrumbName: "编辑广告",
        authId: 'A005',
      }
    ]
  }, 
  {
    key: 'authManage',
    path: '/authManage',
    component: authentication(AuthManage),
    breadcrumbName: "权限管理",
    authId: 'A006',
    routes: [
      {
        key: 'authRoleList',
        path: '/authManage/authRoleList',
        exact: true,
        component: authentication(AuthRoleList),
        breadcrumbName: "权限列表",
        authId: 'B002_A006',
      },
      {
        key: 'editAuthRole',
        path: '/authManage/editAuthRole/:id',
        exact: true,
        component: authentication(EditAuthRole),
        breadcrumbName: "创建权限",
        authId: 'B002_A006',
      },
      {
        key: 'workerList',
        path: '/authManage/workerList',
        exact: true,
        component: authentication(WorkerList),
        breadcrumbName: "人员列表",
        authId: 'B001_A006',
      },
      {
        key: 'editWorker',
        path: '/authManage/editWorker/:id',
        exact: true,
        component: authentication(EditWorker),
        breadcrumbName: "创建人员",
        authId: 'B001_A006',
      }
    ]
  },
  {
    key: 'SponsorManage',
    path: '/sponsorManage',
    component: authentication(SponsorManage),
    breadcrumbName: "赞助商管理",
    authId: 'A007',
    routes: [
      {
        key: 'SponsorList',
        path: '/sponsorManage/sponsorList',
        exact: true,
        component: authentication(SponsorList),
        breadcrumbName: "赞助商列表",
        authId: 'A007',
      },
      {
        key: 'EditSponsor',
        path: '/sponsorManage/editSponsor/:id',
        exact: true,
        component: authentication(EditSponsor),
        breadcrumbName: "编辑赞助商",
        authId: 'A007',
      },
      {
        key: 'SponsorDetail',
        path: '/sponsorManage/sponsorDetail/:id',
        exact: true,
        component: authentication(SponsorDetail),
        breadcrumbName: "赞助商详情",
        authId: 'A007',
      },
      {
        key: 'LaunchSponsor',
        path: '/sponsorManage/launchSponsor/:id',
        exact: true,
        component: authentication(LaunchSponsor),
        breadcrumbName: "发起赞助",
        authId: 'A007',
      },
      {
        key: 'EditLaunchSponsor',
        path: '/sponsorManage/editLaunchSponsor/:id',
        exact: true,
        component: authentication(EditLaunchSponsor),
        breadcrumbName: "修改赞助",
        authId: 'A007',
      },
    ]
  },
  // {
  //   key: 'noMatch',
  //   path: '',
  //   component: NoMatch
  // },
]
export const unSigninRoute = [
  {
    key: 'home',
    path: '/',
    exact: true,
    component: SignIn
  },
  {
    key: 'signIn',
    path: '/signin',
    exact: true,
    component: SignIn
  },
  // {
  //   key: 'noMatch',
  //   path: '',
  //   component: SignIn
  // },
]

export const subRoute = key => routes.filter(item => item.key === key)[0].routes