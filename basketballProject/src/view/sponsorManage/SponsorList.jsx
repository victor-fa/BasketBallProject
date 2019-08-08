import React from "react";
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
import moment from 'moment'


class SponsorList extends React.Component {
  state = {
    selectedRowKeys: [],
    pageCurrent: 1,
    pageSize: 20,
    name: ''
  }
  columns = [
    {
      title: '创建时间',
      dataIndex: 'createTime', 
      width: 160,
      render: text => moment(text, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm')
    },
    {
      title: '赞助商名称',
      dataIndex: 'name',
      width: 120,
      render: text => text ? text : '--'
    },
    {
      title: '赞助总场地数',
      dataIndex: 'tolStadium',
      width: 120,
      render: text => text ? text : '--'
    },
    {
      title: '赞助总费用',
      dataIndex: 'tolAmount',
      width: 120,
      render: text => text ? text : '--'
    },
    {
      title: '赞助总场次',
      dataIndex: 'tolNum',
      width: 120,
      render: text => text ? text : '--'
    },
    {
      title: '成功场次数',
      dataIndex: 'sucNum',
      width: 120,
      render: text => text ? text : '--'
    },
    {
      title: '参与总人数',
      dataIndex: 'tolPerson',
      width: 120,
      render: text => text ? text : '0'
    },
    {
      title: '点击数量',
      dataIndex: 'clickNum',
      width: 120,
      render: text => text ? text : '--'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 240,
      render: (text, record) => <span className='btn-text'>
          <Link to={`/sponsorManage/launchSponsor/${record.key}`}>发起赞助</Link>&nbsp;&nbsp;
          <Link to={`/sponsorManage/sponsorDetail/${record.key}`}>查看详情</Link>
        </span>
      // onClick={() => this.returnMoney(record)}
    },
  ]

  componentWillMount() {
    this.setState({
      tableScroll: myTool.tableScrollTool() - 50,
      statusList: allStatusList,
    })
  }

  componentDidMount() {
    this.querySponsorListApi()   
    // this.getAllNameApi() 
  }  

  // 查询赞助商
  querySponsorListApi = async(arg) => {
    const {
      pageCurrent,
      pageSize,
      name,
    } = this.state
    this.setState({sponsorListLoading: true})
    const param = {
      pageCurrent,
      pageSize,
      name,
      ...arg
    }
    const res = await Api.querySponsors(myTool.delObjVoidKey(param))
    this.setState({sponsorListLoading: false})
    myTool.getApiData(res, () => {
      // console.log(res.data);
      this.setState({
        sponsorList: myTool.arrAddKey(res.data.data),
        totalRow: Number(res.data.totalCount),
      })
    })
   
  }

  // getAllNameApi = async() => {
  //   const res = await Api.queryAllNames()
  //   myTool.getApiData(res, () => {
  //     console.log(res.data.data);
  //     this.setState({
  //       sponsorList: res.data.data
  //     })
  //   })
  // }

  clickSearch = () => {
    this.querySponsorListApi({pageCurrent: 1})
    this.setState({pageCurrent: 1})
  }

  // 换页
  changePage = (pageCurrent, pageSize) => {
    this.setState({
      pageCurrent,
      pageSize,
    })
    this.querySponsorListApi({
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
    this.querySponsorListApi({
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
    // this.props.history.push(`/sponsorManage/sponsorDetail/${record.key}`)
  }

  handleOperate = (e, record) => {
    const  {
      selectedRowKeys,
    } = this.state

    if (e.key === 'add') {
      this.props.history.push('/sponsorManage/editSponsor/add')
      return false
    }

    if (e.uiType === 'btn' && e.key !== 'add') {
      if (selectedRowKeys.length === 0) {
        message.info(`请选择您要${e.sName}的赞助商`)
        return false
      }
    }

    if (selectedRowKeys.length > 1 && e.key !== 'del') {
      message.info(`一次只能${e.sName}一个赞助商`)
      return false
    }

    if (e.key === 'setup') {
      this.props.history.push({
        pathname: `/sponsorManage/sponsorSetup/${selectedRowKeys[0]}`,
        query: {name: record[0].name}
      })
      return false
    }

    if (e.key === 'edit') {
      this.props.history.push({
        pathname: `/sponsorManage/editSponsor/${selectedRowKeys[0]}`,
        query: record[0]
    })
      return false
    }
   
    const {clearTableSelect, delSponsorApi} = this
    if (e.needConfirm) {
      Modal.confirm({
        title: `您是否确认${e.sName}赞助商？`,
        onOk() {
          e.key === 'del' && delSponsorApi()
        },
        onCancel() {
          clearTableSelect()
        },
      });
    }
  }

  // 删除
  delSponsorApi = async() => {
    const res = await Api.delSponsor({idList: this.state.selectedRowKeys.toString()})
    // console.log(this.state.selectedRowKeys);
    myTool.getApiData(res, () => {
      // console.log(res);
      message.success(res.data.rtnMsg)
      this.delRefreshList()
    })
  }

  // 删除并刷新
  delRefreshList = () => {
    if (this.state.pageCurrent === Math.ceil(this.state.totalRow / this.state.pageSize)) {
      if (this.state.pageCurrent === 1) {
        this.querySponsorListApi({pageCurrent: 1})
        this.setState({pageCurrent: 1})
      } else {
        this.querySponsorListApi({pageCurrent: this.state.pageCurrent - 1})
        this.setState({pageCurrent: this.state.pageCurrent - 1})
      }
    } else {
      this.querySponsorListApi()
    }
    this.setState({selectedRowKeys: []})
  }

  // 清空多选
  clearTableSelect = () => {
    this.setState({selectedRowKeys: []})
  }

  // 刷新列表
  refreshList = () => {
    this.setState({selectedRowKeys: []})
    this.queryCourtListApi()
  }
  
  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  
  render() {
    const {
      selectedRowKeys,
      sponsorList = [],
      sponsorListLoading = false,
      pageCurrent,
      pageSize,
      totalRow,
      tableScroll,
      name,
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
          <Breadcrumb.Item>赞助商管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="u-page-wrap">
          <div className="m-search-wrap">
            <Input 
              size='large'
              className="input" 
              placeholder='赞助商名称'
              style={{width: 220}}
              value={name}
              allowClear
              onChange={(e) => {
                this.setState({name: e.target.value.replace(regs.regNoSpace, '')})
              }}
            />
           
            <Button type='primary' size='large' loading={sponsorListLoading} className='btn-search' onClick={this.clickSearch}>搜索</Button>
          </div>
          <div
            className="m-table-wrap"
            style={{marginTop: '26px'}}
          >
            <div className="table-top-btn">
              {topBtnList.map((item, i) => (
                <Button type={`${i === 0 ? 'primary' : ''}`} key={item.key}  onClick={() => this.handleOperate(item, myTool.selectedData(sponsorList, selectedRowKeys))} >{item.name}</Button>
              ))}
              <Button icon='reload' loading={sponsorListLoading} onClick={() => this.querySponsorListApi()}>刷新</Button>
            </div>
            <Table
              rowSelection={rowSelection}
              scroll={{y: tableScroll }}
              columns={this.columns}
              dataSource={sponsorList}
              loading={sponsorListLoading}
              onRow={record => ({
                onClick: () => {
                  this.selectRow(record);
                },
              })}
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

export default SponsorList;

const allStatusList = [
  {key: 'succeed', name: '已成功'},
  {key: 'matching', name: '拼场中'},
  {key: 'failed', name: '已失败'},
  {key: 'finished', name: '已完成'},
]

const topBtnList = [
  {
    key: 'add',
    name: '新建赞助商',
    sName: '添加',
    uiType: 'btn',
    needConfirm: false,
    param: '',
  },
  {
    key: 'edit',
    name: '修改资料',
    sName: '编辑',
    uiType: 'btn',
    needConfirm: false,
    param: '',
  },
  {
    key: 'del',
    name: '删除赞助商',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    param: 'D',
  },
]
