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


class CourtList extends Component {
  state = {
    selectedRowKeys: [],
    pageCurrent: 1,
    pageSize: 20,
    courtName: '',
    startTime: '',
    endTime: '',
  }
  columns = [
    {
      title: '添加时间',
      dataIndex: 'createTime',
      width: 100,
    },
    {
      title: '球场名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '明日未预定球场数量',
      dataIndex: 'soldQuantity',
      width: 160,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 140,
      render: text => text ? text : '--'
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: text => text ? text : '--'
    },
    {
      title: '坐标',
      dataIndex: 'coordinate',
      width: 160,
      render: (text, record) => (record.longitude || record.latitude) ? `${record.longitude},${record.latitude}` : '--'

    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 100,
      render: (text, record, index) => {
        let newBtnList = btnList.filter(i => i.param !== text)
        // if (this.state.pageCurrent === 1 && index === 0) {
        //   newBtnList = newBtnList.filter(i => i.key !== 'up')
        // }
        // if (this.state.pageCurrent === Math.ceil(this.state.totalRow / this.state.pageSize) && (index + 1) === this.state.courtList.length){
        //   newBtnList = newBtnList.filter(i => i.key !== 'down')
        // }
        return (
          <div className='operate primary'>
            {newBtnList.map(item => (
              <span 
                className={`table-text-btn ${item.key === 'on' ? 'red' : ''}`} 
                key={item.key} onClick={() => this.handleOperate(item, record)}>{item.name}
              </span>
            ))}
          </div>
        )
      } 
    }
  ]

  componentWillMount() {
    const isBinding = myTool.sesStorGetItem('shareToysAdminUserInfo').isBinding
    // const userInfo = myTool.sesStorGetItem('shareToysAdminUserInfo')
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120,
      isBinding,
      // canOpenCourt: userInfo.isAdmin === 'Y' || userInfo.menuIds.split(',').some(i => i === 'B006_A003')
    })
  }

  componentDidMount() {
    this.queryCourtListApi()    
  }  

  queryCourtListApi = (arg) => {
    this.setState({loading: true})
    const {
      courtName,
      pageCurrent,
      pageSize,
    } = this.state
    const param = {
      pfUserId: myTool.sesStorGetItem('shareToysAdminUserInfo').userid,
      name: courtName,
      pageCurrent,
      pageSize,
      ...arg
    }
    Api.getStadiumList(myTool.delObjVoidKey(param))
    .then(res => {
      this.setState({loading: false})
      myTool.getApiData(res, () => {
        this.setState({
          courtList: res.data.data.map(item => {
            let obj = {}
            obj = item
            obj.key = item.id
            return obj
          }),
          totalRow: Number(res.data.totalCount)
        })
      })
    })
  }

  handleOperate = (e, record) => {
    const  {
      selectedRowKeys,
    } = this.state

    if (e.key === 'add') {
      this.props.history.push('/courtManage/editCourt/add')
      return false
    }

    if (e.uiType === 'btn' && e.key !== 'add') {
      if (selectedRowKeys.length === 0) {
        message.info(`请选择您要${e.sName}的球场`)
        return false
      }
    }

    if (selectedRowKeys.length > 1 && e.key !== 'del') {
      message.info(`一次只能${e.sName}一个球场`)
      return false
    }

    if (e.key === 'setup') {
      this.props.history.push({
        pathname: `/courtManage/courtSetup/${selectedRowKeys[0]}`,
        query: {name: record[0].name}
      })
      return false
    }

    if (e.key === 'edit') {
      this.props.history.push({
        pathname: `/courtManage/editCourt/${selectedRowKeys[0]}`,
        query: record[0]
    })
      return false
    }
   
    //上下架
    const changeStateApi = () => {
      Api.setStadiumStatus({
        id: e.uiType === 'btn' ? selectedRowKeys.toString() : record.id,
        status: e.param
      }).then(res => {
        myTool.getApiData(res, () => {
          message.success(res.data.rtnMsg)
          this.refreshList()
        })
      })
    }

    if (e.needConfirm) {
      Modal.confirm({
        title: `您是否确认${e.sName}球场？`,
        onOk: changeStateApi
      });
    }
  }

  refreshList = () => {
    this.setState({selectedRowKeys: []})
    this.queryCourtListApi()
  }

  clickSearch = () => {
    this.setState({pageCurrent: 1})
    this.queryCourtListApi({pageCurrent: 1})
  }

  // 换页
  changePage = (pageCurrent, pageSize) => {
    this.setState({
      pageCurrent,
      pageSize,
    })
    this.queryCourtListApi({
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
    this.queryCourtListApi({
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
      courtName,
      tableScroll,
      courtList = [],
      loading = false,
      pageCurrent,
      pageSize,
      totalRow,
      isBinding,
    } = this.state
    
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      hideDefaultSelections: true
    }
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>球场管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="u-page-wrap">
        {!isBinding ? 
          <div className="m-search-wrap">
            <Input 
              size='large'
              className="input" 
              placeholder='球场名称'
              style={{width: '220px'}}
              value={courtName}
              onChange={(e) => {
                this.setState({courtName: e.target.value.replace(regs.regNoSpace, '')})
              }}
            />
            <Button type='primary' size='large' className='btn-search' onClick={this.clickSearch}>搜索</Button>
          </div> : ''}
          <div
            className="m-table-wrap"
            style={{marginTop: '26px', maxWidth: 1320}}
          >
            <div className="table-top-btn">
              {topBtnList.map((item, i) => (
                item.canBinding || !isBinding ? <Button type={`${i === 0 ? 'primary' : ''}`} key={item.key} onClick={() => this.handleOperate(item, myTool.selectedData(courtList, selectedRowKeys))} >{item.name}</Button> : ''
              ))}
              <Button icon='reload' onClick={() => this.queryCourtListApi()}>刷新</Button>
            </div>
            <Table
              scroll={{ y: tableScroll}}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={courtList}
              loading={loading}
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
      </React.Fragment>
    )
  }
}

export default CourtList;


const topBtnList = [
  {
    key: 'add',
    name: '添加球场',
    sName: '添加',
    uiType: 'btn',
    needConfirm: false,
    param: '',
    canBinding: false
  },
  {
    key: 'del',
    name: '删除球场',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    param: 'D',
    canBinding: false
  },
  {
    key: 'edit',
    name: '编辑球场',
    sName: '编辑',
    uiType: 'btn',
    needConfirm: false,
    param: '',
    canBinding: false
  },
  {
    key: 'setup',
    name: '场地设置',
    sName: '设置',
    uiType: 'btn',
    needConfirm: false,
    param: '',
    canBinding: true
  },
]

const btnList = [
  {
    key: 'on',
    name: '上架',
    sName: '上架',
    uiType: 'text',
    needConfirm: true,
    param: 'Y',
  },
  {
    key: 'off',
    name: '下架',
    sName: '下架',
    uiType: 'text',
    needConfirm: true,
    param: 'N',
  },
  // {
  //   key: 'up',
  //   name: '上移',
  //   sName: '上移',
  //   uiType: 'text',
  //   needConfirm: false,
  //   param: 'up',
  // },
  // {
  //   key: 'down',
  //   name: '下移',
  //   sName: '下移',
  //   uiType: 'text',
  //   needConfirm: false,
  //   param: 'down',
  // }
]