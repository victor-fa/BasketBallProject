import React from 'react'
import {Link} from 'react-router-dom'
// import regs from '../../common/js/reg'
import myTool from '../../common/js/tool'
import Api from '../../server'
import { 
  Table,
  Button, 
  DatePicker,
  Breadcrumb,
  // Input,
  Select,
} from 'antd'
import moment from 'moment'
import {orderClassList} from '../orderManage/OrderList'

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

class FundInfo extends React.Component {
  state = {
    pageCurrent: 1,
    pageSize: 20,
    statisticsList: [
      {key: 'runningWater', name: '流水', num: '0'},
      {key: 'refund', name: '结算退款', num: '0'},
      {key: 'income', name: '结算实际收入', num: '0'},
    ],
    startTime: moment().startOf('months'),
    endTime: moment(),
  } 
  render() {
    const {
      courtId,
      startTime,
      endTime,
      listLoading = false,
      statisticsList = [],
      tableScroll,
      fundList = [],
      totalRow,
      pageCurrent,
      pageSize,
      courtList = [],
      orderClass,
      isBinding,
    } = this.state
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>资金信息</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap'>
          <div className="m-search-wrap">
            <DatePicker.RangePicker
              size='large'
              format={dateFormat}
              value={[startTime, endTime]}
              allowClear={false}
              onChange={(value) => {
                const isVoid = value.length === 0
                this.setState({
                  startTime: isVoid ? null : value[0].startOf('d'),
                  endTime: isVoid ? null : value[1].endOf('d')
                })
              }}
            />
            {isBinding ? '' : 
            <Select
              size='large'
              className='select'
              value={courtId} 
              placeholder='球场名称'
              style={{ width: 180 }} 
              allowClear
              onChange={(courtId) => {this.setState({courtId})}}
            >
              {courtList.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>}
            <Select
              size='large'
              className='select'
              value={orderClass} 
              placeholder='类型'
              style={{ width: 100 }} 
              allowClear
              onChange={(orderClass) => {this.setState({orderClass})}}
            >
              {orderClassList.map(item => (
                <Select.Option key={item.key} value={item.key}>{item.name}</Select.Option>
              ))}
            </Select>
            <Button type='primary' size='large' className='btn-search' loading={listLoading} onClick={this.clickSearch}>搜索</Button>
          </div>
          <ul className="m-statistics-list">
            {statisticsList.map(item => <li key={item.key}><p>{item.number}</p>{item.name}</li>)}
          </ul>
          <div className="m-table-wrap">
            <Table
              scroll={{x: 1500, y: tableScroll}}
              columns={this.columns}
              dataSource={fundList}
              loading={listLoading}
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

  componentWillMount() {
    const isBinding = myTool.sesStorGetItem('shareToysAdminUserInfo').isBinding
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120,
      isBinding,
    })
  }

  componentDidMount() {
    this.getCourtList()
    this.getFundListApi()   
  }

  getCourtList = async() => {
    const res = await Api.queryAllNames()
    myTool.getApiData(res, () => {
      this.setState({
        courtList: res.data.data
      })
    })
  }

  getFundListApi = (arg) => {
    const {
      pageCurrent,
      pageSize,
      startTime,
      endTime,
      courtId,
      orderClass
    } = this.state
    const param = {
      pfUserId: myTool.sesStorGetItem('shareToysAdminUserInfo').userid,
      startTime: startTime ? startTime.format(dateFormat) : null,
      endTime: endTime ? endTime.format(dateFormat) : null,
      stadiumId: courtId,
      orderClass,
      pageCurrent,
      pageSize,
      ...arg,
    }

    this.setState({listLoading: true})
    Api.fundPage(myTool.delObjVoidKey(param)).then(res => {
      this.setState({listLoading: false})
      myTool.getApiData(res, () => {
        const obj = res.data.object
        const statisticsList = this.state.statisticsList.map(item => {
          let o = {}
          const i = {...item}
          o = i
          o.number = obj[i.key] ? obj[i.key] : 0
          return o
        })
        console.log(statisticsList);
        
        this.setState({
          totalRow: Number(res.data.totalCount),
          fundList: myTool.arrAddIndexKey(res.data.data),
          statisticsList,
        })
      })
    })
  }

  clickSearch = () => {
    this.getFundListApi({pageCurrent: 1})
    this.setState({pageCurrent: 1})
    console.log(this.state.fundList);
    
  }

  // 换页
  changePage = (pageCurrent, pageSize) => {
    this.setState({
      pageCurrent,
      pageSize,
    })
    this.getFundListApi({
      pageCurrent,
      pageSize,
    })
  }

  changePageSize = (page, pageSize) => {
    this.setState({
      pageCurrent: 1,
      pageSize,
    })
    this.getFundListApi({
      pageCurrent: 1,
      pageSize,
    })
  }
  
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => index + 1 + (this.state.pageCurrent === 1 ? '' : (this.state.pageCurrent - 1 ) * this.state.pageSize),
    },
    {
      title: '支付时间',
      dataIndex: 'orderTime',
      width: 160,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      width: 160,
      render: (text, record) => this.state.isBinding ? text : <Link to={{
        pathname: `/usersManage/userDetail/${record.detailUserId}`,
        query: {prevPageName: '充值列表', prevPageUrl: '/CapitalRecord/FundList'}
      }}>{text}</Link>
    },
    {
      title: '手机号码',
      dataIndex: 'mobilePhone',
      width: 120,
      render: (text, record) => this.state.isBinding ? text : <Link to={{
        pathname: `/usersManage/userDetail/${record.detailUserId}`,
        query: {prevPageName: '充值列表', prevPageUrl: '/CapitalRecord/FundList'}
      }}>{text}</Link>
    },
    {
      title: '球场名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '场次日期',
      dataIndex: 'day',
      width: 120,
    },
    {
      title: '场次时间',
      dataIndex: 'time',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'orderClass',
      width: 80,
    },
    {
      title: '支付金额',
      dataIndex: 'prepayAmt',
      width: 80,
      render: (text, record) => record.orderClass === '包场' ? record.price : record.prepayAmt
    },
    {
      title: '结算时间',
      dataIndex: 'settlementTime',
      width: 180,
      render: text => text ? text : '--'
    },
    {
      title: '结算退款',
      dataIndex: 'refund',
      width: 100,
      render: text => text ? text : '--'
    },
    {
      title: '结算实际收入',
      dataIndex: 'actualAmt',
      width: 120,
      render: (text, record) => record.actualAmt
    },
  ]

}

export default FundInfo
