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
  DatePicker,
  Breadcrumb,
  Input,
} from 'antd'
import moment from 'moment'

const dateFormat = 'YYYY-MM-DD'

class AdManage extends Component {
  state = {
    selectedRowKeys: [],
    pageCurrent: 1,
    pageSize: 20,
  }
  columns = [
    {
      title: '序号',
      dataIndex: 'num',
      width: 50,
      render: (text, record, index) => index + 1 + (this.state.pageCurrent === 1 ? '' : (this.state.pageCurrent - 1 ) * this.state.pageSize),
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: '有效时间',
      dataIndex: 'effectiveTime',
      width: 200,
      render: (text, record) => `${record.publishTime}至${record.effectiveTime}`
    },
    {
      title: '广告栏目',
      dataIndex: 'advertColumn',
      width: 120,
    },
    {
      title: '广告名称',
      dataIndex: 'name',
      width: 140,
    },
    {
      title: '广告类型',
      dataIndex: 'type',
      width: 80,
      render: text => text === '0' ? '图文' : '链接'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: text => text === 'Y' ? <span className='green'>正常</span> : <span className='red'>禁用</span>
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 80,
      render: (text, record) => <span className='btn-text' onClick={() => this.handleOperate({key: 'edit', uiType: 'text'}, record)}>编辑</span>
    },
  ]

  componentWillMount() {
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120
    })
  }

  componentDidMount() {
    this.queryAdvertList()    
  }  

  queryAdvertList = async(arg) => {
    const {
      adName,
      startTime,
      endTime,
      pageCurrent,
      pageSize,
    } = this.state
    this.setState({adListLoading: true})
    const param = {
      name: adName,
      startTime: startTime ? startTime.format(dateFormat) : '',
      endTime: endTime ? endTime.format(dateFormat) : '',
      pageCurrent,
      pageSize,
    }
    const res = await Api.advertHome({
      ...myTool.delObjVoidKey(param),
      ...arg,
    })
    this.setState({adListLoading: false})

    myTool.getApiData(res, () => {
      this.setState({
        totalRow: Number(res.data.totalCount),
        adList: myTool.arrAddKey(res.data.data)
      })
    })
  }

  handleOperate = (e, record) => {
    const  {
      selectedRowKeys,
      adList
    } = this.state

    if (e.radio && selectedRowKeys.length > 1) {
      message.info(`一次只能${e.sName}一个广告`)
      return false
    }

    if (e.uiType === 'btn' && selectedRowKeys.length === 0) {
        message.info(`请选择您要${e.sName}的广告`)
        return false
    }

    const selectObj = adList.filter(item => item.key === selectedRowKeys[0])[0]
    const hasOpen = e.uiType === 'btn' ? myTool.selectedData(adList, selectedRowKeys).some(item => item.status === '0') : record.status === '0'
    if (e.key === 'del' && hasOpen) {
      message.info(`您要${e.sName}的广告有开启状态，请关闭后再${e.sName}!`)
      return false
    }

    if (e.key === 'edit') {
      this.props.history.push({
        pathname: `/appManage/editAdvertisement/${e.uiType === 'text' ? record.key : selectedRowKeys[0]}`,
        query: e.uiType === 'text' ? record : selectObj
      })
    }

    const {clearTableSelect, delAdvertApi, statusAdvertApi} = this
    if (e.needConfirm) {
      Modal.confirm({
        title: `您是否确认${e.sName}以下广告？`,
        onOk() {
          e.key === 'del' && delAdvertApi()
          if (e.key === 'open' || e.key === 'close'){
            statusAdvertApi(e)
          }  
        },
        onCancel() {
          clearTableSelect()
        },
      });
    } 
  }
  clearTableSelect = () => {
    this.setState({selectedRowKeys: []})
  }

  statusAdvertApi = async(e) => {
    const status = e.key === 'open' ? 'Y' : 'N'
    const data = myTool.selectedData(this.state.adList, this.state.selectedRowKeys).filter(item => item.status !== status)
    if (data.length === 0) {
      message.info(`您选择的广告已经是${e.sName}状态`)
      return false
    }
    const ids = data.map(item => {
      let id = ''
      id = item.id
      return id
    })
    const res = await Api.statusAdvert({
      id: ids.toString(),
      status
    })
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.refreshList()
    })
  }

  delAdvertApi = async() => {
    const res = await Api.delAdvert({id: this.state.selectedRowKeys.toString()})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.delRefreshList(this.state.selectedRowKeys.length, this.state.adList.length)
    })
  }

  delRefreshList = (selectedLength, dataListLength) => {
    if (selectedLength === dataListLength && this.state.pageCurrent === Math.ceil(this.state.totalRow / this.state.pageSize)) {
      if (this.state.pageCurrent === 1) {
        this.queryAdvertList({pageCurrent: 1})
        this.setState({pageCurrent: 1})
      } else {
        this.queryAdvertList({pageCurrent: this.state.pageCurrent - 1})
        this.setState({pageCurrent: this.state.pageCurrent - 1})
      }
    } else {
      this.queryAdvertList()
    }
    this.setState({selectedRowKeys: []})
  }

  refreshList = () => {
    this.setState({selectedRowKeys: []})
    this.queryAdvertList()
  }

  clickSearch = () => {
    this.setState({
      selectedRowKeys: [],
      pageCurrent: 1
    })
    this.queryAdvertList({pageCurrent: 1})
  }

  // 换页
  changePage = (pageCurrent, pageSize) => {
    this.setState({
      pageCurrent,
      pageSize,
    })
    this.queryAdvertList({
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
    this.queryAdvertList({
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
      adName,
      startTime,
      endTime,
      adList = [],
      adListLoading = false,
      pageCurrent,
      pageSize,
      totalRow,
      tableScroll,
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
          <Breadcrumb.Item>广告管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="u-page-wrap p-admanage">
          <div className="m-search-wrap">
            <Input 
              size='large'
              className="input" 
              placeholder='广告名称'
              style={{width: '220px'}}
              value={adName}
              onChange={(e) => {
                this.setState({adName: e.target.value.replace(regs.regNoSpace, '')})
              }}
            />
            <span className="label-s">发布时间</span>
            <DatePicker.RangePicker
              size='large'
              format={dateFormat}
              value={[startTime, endTime]}
              onChange={(value) => {
                const isVoid = value.length === 0
                this.setState({
                  startTime: isVoid ? null : value[0].startOf('d'),
                  endTime: isVoid ? null : value[1].endOf('d')
                })
              }}
            />
            <Button type='primary' size='large' className='btn-search' onClick={this.clickSearch}>搜索</Button>
          </div>
          <div
            className="m-table-wrap"
            style={{marginTop: '26px'}}
          >
            <div className="table-top-btn">
              <div className="left-box">
                <Link to='/appManage/editAdvertisement/add'><Button type='primary'>发布广告</Button></Link>
                {topBtnList.map((item, index) => (
                  <Button 
                    key={item.key} 
                    onClick={() => this.handleOperate(item)} 
                  >{item.name}</Button>
                ))}
                <Button icon='reload' onClick={() => this.queryAdvertList()}>刷新</Button>
              </div>
            </div>
            <Table
              scroll={{y: tableScroll }}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={adList}
              loading={adListLoading}
              rowClassName={record => moment(record.effective_time).endOf('d').isBefore(moment()) ? 'gray' : ''}
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

export default AdManage;

const topBtnList = [
  {
    key: 'del',
    name: '删除广告',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
  },
  {
    key: 'edit',
    name: '编辑广告',
    sName: '编辑',
    uiType: 'btn',
    radio: true,
  },
  {
    key: 'open',
    name: '开启',
    sName: '开启',
    uiType: 'btn',
    needConfirm: true,
    param: 'Y',
  },
  {
    key: 'close',
    name: '关闭',
    sName: '关闭',
    uiType: 'btn',
    needConfirm: true,
    param: 'N',
  },
]