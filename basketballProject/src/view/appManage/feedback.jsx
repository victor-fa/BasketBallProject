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

const dateFormat = 'YYYY-MM-DD'

const { confirm } = Modal
const { RangePicker } = DatePicker

class AdManage extends Component {
  state = {
    selectedRowKeys: [],
    pageCurrent: 1,
    pageSize: 20,
    adName: '',
    startTime: '',
    endTime: '',
  }
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => index + 1 + (this.state.pageCurrent === 1 ? '' : (this.state.pageCurrent - 1 ) * this.state.pageSize),
    },
    {
      title: '反馈时间',
      dataIndex: 'createtime',
      width: 120,
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      width: 400,
    },
    {
      title: '用户ID',
      dataIndex: 'userid',
      width: 140,
    },
    {
      title: '用户名称',
      dataIndex: 'mobilephone',
      width: 140,
    },
  ]

  componentWillMount() {
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120
    })
  }

  componentDidMount() {
    this.getFeedbackList()    
  }  

  getFeedbackList = async(arg) => {
    const {
      userName,
      startTime,
      endTime,
      pageCurrent,
      pageSize
    } = this.state
    this.setState({listLoading: true})
    const param = {
      username: userName,
      startTime: startTime ? startTime.format(dateFormat) : '',
      endTime: endTime ? endTime.format(dateFormat) : '',
      pageCurrent,
      pageSize,
      ...arg
    }
    const res = await Api.findFeedbackByLike(myTool.delObjVoidKey(param))
    this.setState({listLoading: false})
    myTool.getApiData(res, () => {
      this.setState({
        feedbackList: myTool.arrAddKey(res.data.data),
        totalRow: Number(res.data.totalCount)
      })
    })
    
  }

  handleOperate = async(e, record) => {
    const  {
      selectedRowKeys,
    } = this.state

    if (e.key === 'read') {
      if (selectedRowKeys.length === 0) {
        message.info(`请选择未读的反馈`)
        return false
      }
      const res = await Api.updateFeedback({
        id: selectedRowKeys.toString()
      })
      myTool.getApiData(res, () => {
        message.success(res.data.rtnMsg)
        this.refreshList()

      })
    }

    const {deleteFeedbackApi} = this
    if (e.needConfirm && e.key === 'del') {
      confirm({
        title: `您是否确认删除全部已读反馈？`,
        onOk() {
          deleteFeedbackApi()
        },
        onCancel() {
        },
      });
    } else {

    }
  }

  refreshList = () => {
    this.getFeedbackList()
    this.setState({selectedRowKeys: []})
  }

  deleteFeedbackApi = async() => {
    const res = await Api.deleteFeedback()
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.clickSearch()
    })
  }

  clickSearch = () => {
    this.getFeedbackList({pageCurrent: 1})
    this.setState({pageCurrent: 1})
  }


  // 换页
  changePage = (pageCurrent, pageSize) => {
    this.setState({
      pageCurrent,
      pageSize,
    })
    this.getFeedbackList({
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
    this.getFeedbackList({
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
      startTime,
      endTime,
      feedbackList = [],
      listLoading = false,
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
          <Breadcrumb.Item>意见反馈</Breadcrumb.Item>
        </Breadcrumb>
        <div className="u-page-wrap">
          <div className="m-search-wrap">
            <Input 
              size='large'
              className="input" 
              placeholder='用户ID/用户名称'
              style={{width: '220px'}}
              value={userName}
              onChange={(e) => {
                this.setState({userName: e.target.value.replace(regs.regNoSpace, '')})
              }}
            />
            <span className="label-s">反馈时间</span>
            <RangePicker
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
            <Button type='primary' size='large' className='btn-search' loading={listLoading} onClick={this.clickSearch}>搜索</Button>
          </div>
          <div
            className="m-table-wrap"
            style={{marginTop: '26px'}}
          >
            <div className="table-top-btn">
              {topBtnList.map((item, index) => (
                <Button 
                  key={item.key} 
                  onClick={() => this.handleOperate(item)} 
                >{item.name}</Button>
              ))}
              <Button icon='reload' loading={listLoading} onClick={() => this.getFeedbackList()}>刷新</Button>
            </div>
            <Table
              scroll={{y: tableScroll }}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={feedbackList}
              loading={listLoading}
              onRow={record => ({
                onClick: () => {
                  this.selectRow(record);
                },
              })}
              rowClassName={record => record.sort === '1' ? 'gray' : ''}
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
    key: 'read',
    name: '标记已读',
    sName: '已读',
    uiType: 'btn',
    needConfirm: false,
    operateParam: '',
  },
  {
    key: 'del',
    name: '删除已读',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    operateParam: '',
  },
]