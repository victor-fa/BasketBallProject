import React, {Component} from "react";
import './index.scss'
// import {Link} from 'react-router-dom'
// import regs from '../../common/js/reg'
import myTool from '../../common/js/tool'
import Api from '../../server'
import { 
  Table, 
  Modal,
  message,
  // Breadcrumb,
} from 'antd'
import EnlargeImgModal from '../../components/EnlargeImgModal'
// import moment from 'moment'
import HasReturnTitle from '../../components/hasReturnTitle'

const prevPage = '/orderManage/orderList'

class OrderDetail extends Component {
  state = {
  }
  columns = [
    {
      title: '参加时间',
      dataIndex: 'orderTime', 
      width: 160,
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
      width: 120,
    },
    {
      title: '手机号码',
      dataIndex: 'mobilePhone',
      width: 100,
      render: text => text ? text : '--',
    },
    {
      title: '预付金额',
      dataIndex: 'prepayAmt',
      width: 100,
    },
    {
      title: '实付金额',
      dataIndex: 'actualAmt',
      width: 100,
      render: text => text ? text : '--'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 60,
      render: (text, record, index) => 
          this.state.isBinding ? '' : 
          <span className='btn-text' onClick={
            () => {this.returnMoney(record, index); console.log(record);
            }
          }>
            {
              (this.state.status === '已失败' ? '' :
                (record.orderClass === 'sponsorMatch' || record.orderClass === 'sponsorGroup' ? (index === 0 ? '取消订单' : (Number(record.prepayAmt) > 0 ? '退款' : '取消订单')) : ((record.orderClass === 'match' || record.orderClass === 'group') && index === 0) ? '退款' : (Number(record.prepayAmt) > 0 ? '退款' : '取消订单')))
              }
          </span>
    },
  ]

  componentWillMount() {
    const isBinding = myTool.sesStorGetItem('shareToysAdminUserInfo').isBinding
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120,
      isBinding,
    })
  }

  componentDidMount() {
    const orderId = this.props.match.params.id
    this.setState({orderId})
    this.getOrderDetailApi(orderId)    
  }  

  getOrderDetailApi = async(orderId) => {
    this.setState({userListLoading: true})
    const res = await Api.queryOrderDetail({orderId})
    this.setState({userListLoading: false})
    myTool.getApiData(res, () => {
      console.log(res);
      
      this.setState({
        ...res.data.object,
        userList: myTool.arrAddKey(res.data.object.userList),
        status: res.data.object.status,
      })
    })
  }

  cancelReturn = () => {
    this.setState({
      showReturnModal: false,
      returnName: '',
      returnPayNum: '',
      refund_fee: null,
      returnOrderId: '',
    })
  }

  confirmReturn = async() => {
    const {
      returnOrderId,
      actualAmt,
      isHost,
      prepayAmt,
      remark,
    } = this.state

    // this.setState({userListLoading: true})
    let params = {
      orderId: returnOrderId,
      total_fee: prepayAmt,
      refund_fee: actualAmt > 0 ? actualAmt : prepayAmt,
      flag: (isHost ? '000' : '111'),
      remark: remark,
    }

    // console.log(params.refund_fee);

    const res = await Api.refund(params)
    this.setState({userListLoading: false})
    myTool.getApiData(res, () => {
      message.info(res.data.rtnMsg)
      this.setState({showReturnModal: false})
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
  }

  returnMoney = (record, index) => {
    const userList = this.state.userList
    if (this.state.userList.length > 1) {
      // && parseInt(userList[index].prepayAmt) >= 0
      if (index === 0) {
        message.info(`只能先退款所有参与者，才能退款发起人！`)
        return false
      }
    }
    
    this.setState({
      returnName: record.nickName,
      actualAmt: record.actualAmt,
      remark: record.remark,
      prepayAmt: record.prepayAmt,
      returnOrderId: record.orderId,
      showReturnModal: true,
      isHost: index === 0
    })
  }

  
  render() {
    const {
      userList = [],
      userListLoading = false,
      tableScroll,
      showEnlargeImgModal = false,
      enlargeImg = '',
      isEnlargeImgModalVideo = false,
      orderNo = '',
      name = '',
      orderClass = '',
      status = '',
      orderTime = '',
      day = '',
      time = '',
      price = '',
      showReturnModal = false,
      returnName = '',
      actualAmt = '',
      prepayAmt = '',
      isJoin = '',
    } = this.state

    return (
      <React.Fragment>
        {/* <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={prevPage}>订单管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>订单详情</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className='p-orderDetail-wrap'>
          <HasReturnTitle 
            returnPath={prevPage}
            title='订单详情'
          />
       
        <div className="u-page-wrap">
          <div className="p-orderDetail">
            <div className="orderDetail">
              <div className="orderDetail-tit">订单信息</div>
              <div className="list">
                <div className="item">
                  <span className="label">订单编号</span>{orderNo}
                </div>
                <div className="item">
                  <span className="label">球场名称</span>{name}
                </div>
                <div className="item">
                  <span className="label">类型</span>{orderClass}
                </div>
                <div className="item">
                  <span className="label">状态</span>{status}
                </div>
                <div className="item">
                  <span className="label">下单时间</span>{orderTime}
                </div>
                <div className="item">
                  <span className="label">场次日期</span>{day}
                </div>
                <div className="item">
                  <span className="label">场次时间</span>{time}
                </div>
                <div className="item">
                  <span className="label">场次价格</span>{price}
                </div>
                <div className="item">
                  <span className="label">允许加入</span>{isJoin}
                </div>
              </div>
            </div>
            <div className="userList">
              <div className="orderDetail-tit">参与人员列表</div>
              <div
                className="m-table-wrap"
              >
                <Table
                  scroll={{y: tableScroll }}
                  columns={this.columns}
                  dataSource={userList}
                  loading={userListLoading}
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </div>
        <EnlargeImgModal 
          visible={showEnlargeImgModal}
          imgList={enlargeImg}
          isVideo={isEnlargeImgModalVideo}
          confirmLoading={userListLoading}
          onCancel={() => {
            this.setState({
              showEnlargeImgModal: false,
              selectedRowKeys: [],
              isVideo: false,
            })
          }}
        />
        <Modal
          title={prepayAmt > 0 ? '退款' : '取消订单'}
          onCancel={this.cancelReturn}
          onOk={this.confirmReturn}
          visible={showReturnModal}
          width={420}
        >
          <div className='orderDetail-return'>
            <div className='item-box'>
            </div>
            <div className='item-box'>
              <div className="halfBox">
                <span className='label'>预付金额：</span>￥{prepayAmt}
              </div>
              <div className="halfBox">
                <span className='label'>实付金额：</span>￥{actualAmt}
              </div>
            </div>
            <div className='item-box'>
              <div className="halfBox">
                <span className='label'>退款人：</span>{returnName}
              </div>
              <div className="halfBox">
                <span className='label'>退款金额：</span>
                {/* <span className="red">￥{orderClass === '拼场' && status === '已完成' ? actualAmt : prepayAmt}</span> */}
                <span className="red">￥{actualAmt > 0 ? actualAmt : prepayAmt}</span>
              </div>
            </div>
          </div>
        </Modal>
        </div>
      </React.Fragment>
    )
  }
}

export default OrderDetail;
