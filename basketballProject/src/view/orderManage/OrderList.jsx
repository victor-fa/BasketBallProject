import React from "react";
import './index.scss'
import {Link} from 'react-router-dom'
// import regs from '../../common/js/reg'
import myTool from '../../common/js/tool'
import Api from '../../server'
import { 
  Table,
  Button, 
  Breadcrumb,
  Select,
  message,
  Modal,
} from 'antd'
import moment from 'moment'


class OrderList extends React.Component {
  state = {
    selectedRowKeys: [],
    pageCurrent: 1,
    pageSize: 20,
  }
  columns = [
    {
      title: '下单时间',
      dataIndex: 'orderTime', 
      width: 140,
      render: text => moment(text, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm')
    },
    {
      title: '球场名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'orderClass',
      width: 80,
      render: (text) => text === '包场' ? '包场' : (text === '拼场' ? '拼场' : '赞助场')
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80
    },
    {
      title: '场次日期',
      dataIndex: 'day',
      width: 100,
    },
    {
      title: '场次时间',
      dataIndex: 'time',
      width: 100,
    },
    {
      title: '参加人数',
      dataIndex: 'actualSize',
      width: 90,
      render: (text, record) => `${text}/${record.memberSize}`
    },
    {
      title: '收入金额(元)',
      dataIndex: 'orderAmt',
      width: 100,
    },
    {
      title: '应退金额(元)',
      dataIndex: 'refundAmt',
      width: 100,
    },
    {
      title: '场地金额(元)',
      dataIndex: 'price',
      width: 100,
    },
    {
      title: '下单人昵称',
      dataIndex: 'nickName',
      width: 120,
    },
    {
      title: '下单人手机号',
      dataIndex: 'mobilePhone',
      width: 100,
      render: text => text ? text : '--',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      width: 60,
      render: (text, record) => <Link to={`/orderManage/orderDetail/${record.key}`}>详情</Link>
    },
  ]

  componentWillMount() {
    const isBinding = myTool.sesStorGetItem('shareToysAdminUserInfo').isBinding
    this.setState({
      tableScroll: myTool.tableScrollTool() - 50,
      statusList: allStatusList,
      isBinding,
    })
  }

  componentDidMount() {
    this.queryOrderListApi()   
    this.getAllNameApi() 
  }  

  queryOrderListApi = async(arg) => {
    const {
      name,
      orderClass,
      status,
      pageCurrent,
      pageSize,
    } = this.state
    this.setState({orderListLoading: true})
    const param = {
      pfUserId: myTool.sesStorGetItem('shareToysAdminUserInfo').userid,
      pageCurrent,
      pageSize,
      name,
      status,
      orderClass,
      ...arg
    }
    const res = await Api.queryOrders(myTool.delObjVoidKey(param))
    this.setState({orderListLoading: false})
    myTool.getApiData(res, () => {
      console.log(res);
      this.setState({
        orderList: myTool.arrAddKey(res.data.data),
        totalRow: Number(res.data.totalCount),
      })
    })
   
  }

  handleOperate = (e, record) => {
    const  {
      selectedRowKeys,
    } = this.state

    if (e.uiType === 'btn') {
      if (selectedRowKeys.length === 0) {
        message.info(`请选择您要${e.sName}的订单`)
        return false
      }
    }

    if (selectedRowKeys.length > 1 && e.key !== 'del') {
      message.info(`一次只能${e.sName}一个订单`)
      return false
    }

    const {clearTableSelect, delOrderListApi, statusOrderApi} = this
    if (e.needConfirm) {
      Modal.confirm({
        title: `您是否确认${e.sName}以下订单？`,
        onOk() {
          e.key === 'del' && delOrderListApi()
          if (e.key === 'open' || e.key === 'close'){
            // statusOrderApi(e)  // 根据状态进行处理  statusAdvertApi
          }  
        },
        onCancel() {
          clearTableSelect()
        },
      });
    } 

  }

  delOrderListApi = async() => {
    const res = await Api.delOrder({id: this.state.selectedRowKeys.toString()})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.delRefreshList(this.state.selectedRowKeys.length, this.state.adList.length)
    })
  }

  // 删除后刷新
  delRefreshList = (selectedLength, dataListLength) => {
    if (selectedLength === dataListLength && this.state.pageCurrent === Math.ceil(this.state.totalRow / this.state.pageSize)) {
      if (this.state.pageCurrent === 1) {
        this.queryOrderListApi({pageCurrent: 1})
        this.setState({pageCurrent: 1})
      } else {
        this.queryOrderListApi({pageCurrent: this.state.pageCurrent - 1})
        this.setState({pageCurrent: this.state.pageCurrent - 1})
      }
    } else {
      this.queryOrderListApi()
    }
    this.setState({selectedRowKeys: []})
  }

  // 清空所有多选
  clearTableSelect = () => {
    this.setState({selectedRowKeys: []})
  }

  getAllNameApi = async() => {
    const res = await Api.queryAllNames()
    myTool.getApiData(res, () => {
      this.setState({
        courtList: res.data.data
      })
    })
  }

  changeOrderClass = orderClass => {
    this.setState({
      orderClass,
      statusList: orderClass === 'group' ? allStatusList.filter(i => i.key !== 'matching') : allStatusList
    })
  }


  clickSearch = () => {
    this.queryOrderListApi({pageCurrent: 1})
    this.setState({pageCurrent: 1})
  }

  // 换页
  changePage = (pageCurrent, pageSize) => {
    this.setState({
      pageCurrent,
      pageSize,
    })
    this.queryOrderListApi({
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
    this.queryOrderListApi({
      pageCurrent: 1,
      pageSize,
    })
  }

  selectRow = (record) => {
   this.props.history.push(`/orderManage/orderDetail/${record.key}`)
  }

  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  
  render() {
    const {
      selectedRowKeys,
      orderList = [],
      orderListLoading = false,
      pageCurrent,
      pageSize,
      totalRow,
      tableScroll,
      courtList = [],
      name,
      orderClass,
      status,
      statusList = [],
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
          <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="u-page-wrap">
          <div className="m-search-wrap">
          {isBinding ? '' : 
            <Select
              value={name}
              onChange={name => this.setState({name})}
              placeholder='球场名称'
              className='select'
              allowClear
              size='large'
            >
              {courtList.map(item => (
                <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
              ))}
            </Select>}
            <Select
              value={orderClass}
              onChange={this.changeOrderClass}
              style={{width: 120}}
              placeholder='类型'
              className='select'
              allowClear
              size='large'
            >
              {orderClassList.map(item => (
                <Select.Option value={item.key} key={item.key}>{item.name}</Select.Option>
              ))}
            </Select>
            <Select
              value={status}
              onChange={status => this.setState({status})}
              placeholder='状态'
              style={{width: 120}}
              className='select'
              allowClear
              size='large'
            >
              {statusList.map(item => (
                <Select.Option value={item.key} key={item.key}>{item.name}</Select.Option>
              ))}
            </Select>
           
            <Button type='primary' size='large' loading={orderListLoading} className='btn-search' onClick={this.clickSearch}>搜索</Button>
            {/* <Button 
              type='primary' 
              size='large'
              className='btn-export' 
              disabled={orderList.length === 0 }
              href={orderList.length === 0 ? '#' : `${Api.exportCustomerList}?shopid=${shopid}&orderid=${orderid}&mobilephone=${orderid}&starttime=${starttime}&endtime=${endtime}&pageCurrent=${pageCurrent}&pageSize=${pageSize}`}
            >导出表格</Button> */}
          </div>
          <div
            className="m-table-wrap"
            style={{marginTop: '26px'}}
          >
            <div className="table-top-btn">
              {/* {topBtnList.map((item, i) => (
                <Button type={`${i === 0 ? 'primary' : ''}`} key={item.key}  onClick={() => this.handleOperate(item, myTool.selectedData(orderList, selectedRowKeys))} >{item.name}</Button>
              ))} */}
              <Button icon='reload' loading={orderListLoading} onClick={() => this.queryOrderListApi()}>刷新</Button>
              <div className="right-box" style={{paddingTop: 15}}>订单总数量：<span className='red' style={{fontWeight: 'bold'}}>{totalRow}</span></div>
            </div>
            <Table
              rowSelection={rowSelection}
              // rowClassName={record => record.status === 'Y' ? '' : 'gray'}
              scroll={{x: 1500, y: tableScroll }}
              columns={this.columns}
              dataSource={orderList}
              loading={orderListLoading}
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

export default OrderList;

export const orderClassList = [
  {key: 'group', name: '包场'},
  {key: 'match', name: '拼场'},
  {key: 'sponsorMatch', name: '赞助场'},
]

const allStatusList = [
  {key: 'succeed', name: '已成功'},
  {key: 'matching', name: '拼场中'},
  {key: 'failed', name: '已失败'},
  {key: 'finished', name: '已完成'},
]

const topBtnList = [
  {
    key: 'del',
    name: '删除订单',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    param: 'D',
  },
]
