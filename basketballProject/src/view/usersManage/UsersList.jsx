import React, {Component} from "react";
import './index.scss'
import {Link} from 'react-router-dom'
import regs from '../../common/js/reg'
import myTool from '../../common/js/tool'
import Api from '../../server'
import { 
  Table,
  message, 
  Modal, 
  Button, 
  Breadcrumb,
  Input,
} from 'antd'
import EnlargeImgModal from '../../components/EnlargeImgModal'
import moment from 'moment'


const { confirm } = Modal

class UsersList extends Component {
  state = {
    selectedRowKeys: [],
    pageCurrent: 1,
    pageSize: 20,
    userName: '',
    startTime: '',
    endTime: '',
  }
  columns = [
    {
      title: '注册时间',
      dataIndex: 'createTime', 
      width: 100,
      fixed: 'left',
      render: text => moment(text, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
    },
    {
      title: '头像',
      dataIndex: 'photo',
      width: 80,
      render: text => text ? <img 
      className='img pointer' 
      alt='' 
      src={`${Api.IMG_BASIC_URL}${text}`} 
      width='30'
      height='30'
      onClick={() => {
        this.setState({
          showEnlargeImgModal: true,
          enlargeImg: `${Api.IMG_BASIC_URL}${text}`,
          isEnlargeImgModalVideo: false,
        })
      }} 
    /> : '--'
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '消费金额(元)',
      dataIndex: 'countMoney',
      width: 100,
      render: text => text ? text : '0'
    },
    {
      title: '参加场次',
      dataIndex: 'number',
      width: 100
    },
    {
      title: '身高(cm)',
      dataIndex: 'height',
      width: 100,
      render: text => text ? text : '--'
    },
    {
      title: '体重(kg)',
      dataIndex: 'weight',
      width: 100,
      render: text => text ? text : '--'
    },
    {
      title: '打球频率',
      dataIndex: 'frequency',
      width: 100,
      render: text => text ? text : '--'
    },
    {
      title: '技术水平',
      dataIndex: 'level',
      width: 100,
      render: text => text ? text : '--'
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 100,
      render: text => text ? text : '--'

    },
    {
      title: '手机号码',
      dataIndex: 'mobilePhone',
      width: 100,
      render: text => text ? text : '--',
    },
    // {
    //   title: '活动区域',
    //   dataIndex: 'address',
    //   render: text => text ? text : '--'
    // },
    {
      title: '会员状态',
      dataIndex: 'status',
      width: 90,
      render: text => text === 'Y' ? <span className='green'>正常</span> : <span className='red'>禁用</span>
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      width: 60,
      render: (text, record) => <Link to={{
        pathname: `/usersManage/userDetail/${record.key}`,
        query: {prevPageName: '会员列表', prevPageUrl: '/usersManage/usersList'}
      }}>详情</Link>
    },
  ]

  componentWillMount() {
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120,
    })
  }

  componentDidMount() {
    this.queryUsersListApi()    
  }  

  queryUsersListApi = async(arg) => {
    const {
      userName,
      pageCurrent,
      pageSize,
    } = this.state
    this.setState({userListLoading: true})
    const param = {
      pageCurrent,
      pageSize,
      name: userName,
      ...arg
    }
    const res = await Api.getUserList(myTool.delObjVoidKey(param))
    this.setState({userListLoading: false})
    myTool.getApiData(res, () => {
      this.setState({
        userList: myTool.arrAddKey(res.data.data),
        totalRow: Number(res.data.count),
      })
    })
   
  }

  handleOperate = (e) => {
    const  {
      selectedRowKeys,
      userList
    } = this.state

    if (e.uiType === 'btn' && selectedRowKeys.length === 0) {
      message.info(`请选择您要${e.name}的会员`)
      return false
    }

    let idArr = myTool.selectedData(userList, selectedRowKeys).filter(i => i.status !== e.param)

    if (idArr.length === 0) {
      message.info(`您要${e.sName}的会员已经是${e.sName}状态`)
      return false
    }

    idArr = myTool.getArrId(idArr).toString()

    const changeStateApi = async() => {
      this.setState({userListLoading: true})
      const res = await Api.setUserStatus({
        idArr,
        status: e.param
      })
      this.setState({userListLoading: false})
      myTool.getApiData(res, () => {
        message.success(res.data.rtnMsg)
        this.queryUsersListApi()
      })
    }

    if (e.needConfirm) {
      confirm({
        title: `您是否确认${e.sName}所选会员？`,
        onOk() {
          changeStateApi()
        },
      });
    } 
  }

  clickSearch = () => {
    this.queryUsersListApi({pageCurrent: 1})
    this.setState({pageCurrent: 1})
  }

  // 换页
  changePage = (pageCurrent, pageSize) => {
    this.setState({
      pageCurrent,
      pageSize,
    })
    this.queryUsersListApi({
      pageCurrent,
      pageSize,
    })
  }

  changePageSize = (page, pageSize) => {
    this.setState({
      pageCurrent: 1,
      pageSize,
      selectedRowKeys: []
    })
    this.queryUsersListApi({
      pageCurrent: 1,
      pageSize,
    })
  }

  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }

  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  
  render() {
    const {
      selectedRowKeys,
      userName,
      userList = [],
      userListLoading = false,
      pageCurrent,
      pageSize,
      totalRow,
      tableScroll,
      // shopId,
      showEnlargeImgModal = false,
      enlargeImg = '',
      isEnlargeImgModalVideo = false,
    } = this.state
    
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      hideDefaultSelections: true
    }
    // const shopid = shopId ? shopId : ''
    // const userid = userName ? userName : ''
    // const starttime = startTime ? startTime.format(dateFormat) : ''
    // const endtime = endTime ? endTime.format(dateFormat) : ''

    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>会员管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="u-page-wrap">
          <div className="m-search-wrap">
            <Input 
              size='large'
              className="input" 
              placeholder='会员名称'
              style={{width: 220}}
              value={userName}
              allowClear
              onChange={(e) => {
                this.setState({userName: e.target.value.replace(regs.regNoSpace, '')})
              }}
            />
           
            <Button type='primary' size='large' loading={userListLoading} className='btn-search' onClick={this.clickSearch}>搜索</Button>
            {/* <Button 
              type='primary' 
              size='large'
              className='btn-export' 
              disabled={userList.length === 0 }
              href={userList.length === 0 ? '#' : `${Api.exportCustomerList}?shopid=${shopid}&userid=${userid}&mobilephone=${userid}&starttime=${starttime}&endtime=${endtime}&pageCurrent=${pageCurrent}&pageSize=${pageSize}`}
            >导出表格</Button> */}
          </div>
          <div
            className="m-table-wrap"
            style={{marginTop: '26px', maxWidth: 1700}}
          >
            <div className="table-top-btn">
              {topBtnList.map((item, index) => (
                <Button 
                  type={index === 0 ? 'primary' : ''} 
                  loading={userListLoading}
                  key={item.key} 
                  onClick={() => this.handleOperate(item, myTool.selectedData(userList, selectedRowKeys))} 
                >{item.name}</Button>
              ))}
              <Button icon='reload' loading={userListLoading} onClick={() => this.queryUsersListApi()}>刷新</Button>
              <div className="right-box" style={{paddingTop: 15}}>会员总数量：<span className='red' style={{fontWeight: 'bold'}}>{totalRow}</span></div>
            </div>
            <Table
              scroll={{x: 1500, y: tableScroll }}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={userList}
              loading={userListLoading}
              onRow={record => ({
                onClick: () => {
                  this.selectRow(record);
                },
              })}
              rowClassName={record => record.status === 'Y' ? '' : 'gray'}
              pagination={{
                total: totalRow, 
                current: pageCurrent, 
                pageSize: pageSize,
                onChange: this.changePage,
                showQuickJumper: true,
                showSizeChanger: true,
                onShowSizeChange: this.changePageSize,
                showTotal: (total) => `共 ${total} 条`
              }}
            />
          </div>
        </div>
        <EnlargeImgModal 
          visible={showEnlargeImgModal}
          imgList={enlargeImg}
          isVideo={isEnlargeImgModalVideo}
          onCancel={() => {
            this.setState({
              showEnlargeImgModal: false,
              selectedRowKeys: [],
              isVideo: false,
            })
          }}
        />
      </React.Fragment>
    )
  }
}

export default UsersList;

const topBtnList = [
  {
    key: 'open',
    name: '批量启用',
    sName: '启用',
    uiType: 'btn',
    needConfirm: true,
    param: 'Y',
  },
  {
    key: 'close',
    name: '批量禁用',
    sName: '禁用',
    uiType: 'btn',
    needConfirm: true,
    param: 'N',
  },
]


export const levelList = [
  {key: 'junior', name: '小白'},
  {key: 'intermediate', name: '专精'},
  {key: 'senior', name: '精英'},
]

export const positionList = [
  {key: 'pointGuard', name: '控球后卫'},
  {key: 'shootingGuard', name: '得分后卫'},
  {key: 'smallForward', name: '小前锋'},
  {key: 'powerForward', name: '大前锋'},
  {key: 'center', name: '中锋'},
  {key: 'unknow', name: '不好说'},
]

export const frequencyList = [
  {key: 'occasionally', name: '偶尔打球'},
  {key: 'regularly', name: '经常打球'},
  {key: 'seldom', name: '很少打球'},
]