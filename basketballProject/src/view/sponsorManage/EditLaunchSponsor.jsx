import { Button, message, Breadcrumb, Input, Select, Modal, Table, TimePicker } from "antd";
import {Link} from 'react-router-dom'
import React, { Component } from "react";
import { DatePicker } from 'antd';
import myTool from '../../common/js/tool';
import EnlargeImgModal from '../../components/EnlargeImgModal';
import HasReturnTitle from '../../components/hasReturnTitle';
import Api from '../../server';
import './index.scss';
import moment from 'moment'

const dateFormat = 'YYYY-MM-DD'
const prevPage = `/sponsorManage/sponsorDetail/`

class EditLaunchSponsor extends Component {
  state = {
    selectedRowKeys: [],
    stadiumId: '',
    sponsorId: '',
    court: {
      key: '',
      label: '',
    },
    sponsor: {
      key: '',
      label: '',
    },
    sponsorArr: [], // 全局数组
    timeList: [{key: '', label: '', quantity: '', soldQuantity: ''}],
    courtList: [],
    sponsorList: [],
  }
  // 发起赞助
  sponsorColumns = [
    {
      title: '',
      dataIndex: 'createTime', 
      width: 60,
      render: (text, record, index) => 
        <div style={{fontWeight: 'bold', width: '90%'}}>
          {record.delSpoDetail === 'Y' ? <a 
          style={{ fontSize: '24px', fontWeight: 'bolder' }}
          onClick={() => {
            const sponsorIndex = record.parIndex;
            console.log(record);
            if (record.delSpoDetail === 'Y') {
              this.deleteSponDetailData(record);
            } else {
              message.info(`不可删除当前场次时间`)
            }
          }
          }>-</a> : ''}
        </div>
    },
    {
      title: '场次时间',
      dataIndex: 'name',
      width: 120,
      render: (text, record, index) => record.time
    },
    {
      title: '补贴价格(元/场)',
      dataIndex: 'price',
      width: 80,
      render: (text, record, index) => 
        <div>
          ￥ {record.price}
        </div>
    },
    {
      title: '补贴场次数(半场)',
      dataIndex: 'number',
      width: 80,
      render: (text, record, index) => 
        <div>
          <span>&nbsp;<a
            style={Number(record.remaining) === 0 ? {color: 'gray', fontSize: '24px', fontWeight: 'bolder'} : {color: '#03b4c8', fontSize: '24px', fontWeight: 'bolder'}}
            onClick={() => {
              console.log(record);
              const number = Number(record.number);
              const remaining = Number(record.remaining);
              if (remaining === 0) {
                message.info(`无法删除更多场次`)
              } else {
                const num = Number(record.number)-1;
                const lev = Number(record.leveNum)+1;
                const rem = Number(record.remaining)-1;
                this.state.sponsorArr[0].list[index].number = num.toString();
                this.state.sponsorArr[0].list[index].leveNum = lev.toString();
                this.state.sponsorArr[0].list[index].remaining = rem.toString();
                this.setState({sponsorArr: this.state.sponsorArr})
              }
              console.log(record);
          }}>-</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {record.number}
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
            style={Number(record.leveNum) === 0 ? {color: 'gray', fontSize: '24px', fontWeight: 'bolder'} : {color: '#03b4c8', fontSize: '24px', fontWeight: 'bolder'}}
            onClick={() => {
              console.log(record);
              const leveNum = Number(record.leveNum);
              if (leveNum === 0) {
                message.info(`已达到场次最大上限`)
              } else {
                const num = (Number(record.number)+1).toString();
                const lev = Number(record.leveNum)-1;
                const rem = Number(record.remaining)+1;
                this.state.sponsorArr[0].list[index].number = num.toString();
                this.state.sponsorArr[0].list[index].leveNum = lev.toString();
                this.state.sponsorArr[0].list[index].remaining = rem.toString();
                this.setState({sponsorArr: this.state.sponsorArr})
              }
              console.log(record);
          }}>+</a></span>
        </div>
    },
    {
      title: '允许参与的人数',
      dataIndex: 'xxx',
      width: 80,
      render: (text, record, index) => record.memberSize
    },
  ]

  componentWillMount() {
    const currentId = this.props.match.params.id
    let data = this.props.location.query
    if (data) {
      localStorage.setItem('editLaunchSponsor', JSON.stringify(data));
    } else {
      data = JSON.parse(localStorage.getItem('editLaunchSponsor'));
    }
    
    this.setState({
      currentId: currentId,
      sponsor: {
        key: currentId,
        label: '',
      },
      tableScroll: myTool.tableScrollTool() - 120,
    })
    Api.querySponsorPull().then(res => {
      myTool.getApiData(res, () => {
        // console.log(res);
        this.setState({
          courtList: res.data.ext.stadiumList.map(item => {
            let obj = {}
            obj.key = item.id
            obj.label = item.name
            return obj
          }),
          sponsorList: res.data.ext.sponsorList.map(item => {
            let obj = {}
            obj.key = item.id
            obj.label = item.name
            return obj
          })
        })
        
      })
    })
    console.log(data);
    
    this.getSponsorDetailData(data)
  }

  // 删除场次时间
  deleteSponDetailData = async(record) => {
    this.setState({dataListLoading: true})
    const res = await Api.deleteSponDetailData({
      sponsorId: record.sponsorId,
      sponsorDetailId: record.id,
    })
    this.setState({dataListLoading: false})
    myTool.getApiData(res, () => {
      console.log(res);
    })
    message.info(`删除成功！`)
    let count = 0;
    this.state.sponsorArr.forEach(item => {
      item.list.forEach(cell => {
        if (cell.delSpoDetail === 'Y') {
          count++;
        }
      })
    })
    if (count > 1) {
      window.location.reload();
    } else {
      this.props.history.push(prevPage + this.state.currentId)
    }
  }

  //根据年月查对应月的基础数据
  getDataList = async(yearMonth, date, index) => {
    this.setState({dataListLoading: true })
    const res = await Api.getStadiumDetail({
      stadiumId: this.state.court.key,
      sponsorId: this.state.currentId,
      month: yearMonth,
      day: date
    })
    this.setState({dataListLoading: false})
    myTool.getApiData(res, () => {
      // console.log(res);
      this.state.sponsorArr[index].timeList = res.data.data.map(item => {
        let obj = {}
        obj.key = item.id
        obj.label = item.time
        obj.quantity = item.quantity
        obj.soldQuantity = item.soldQuantity
        obj.price = item.price
        return obj
      })
      this.setState({
        timeList: res.data.data.map(item => {
          let obj = {}
          obj.key = item.id
          obj.label = item.time
          obj.quantity = item.quantity
          obj.soldQuantity = item.soldQuantity
          obj.price = item.price
          return obj
        }),
        sponsorArr: this.state.sponsorArr,
      })
    })
  }

  // 获取赞助商详情
  getSponsorDetailData = async(data) => {
    this.setState({userListLoading: true})
    const param = {
      sponsorId: data.sponsorId,
      stadiumId: data.stadiumId,
      day: data.startDate
    }
    const res = await Api.getSponsorDetailData(myTool.delObjVoidKey(param))
    this.setState({userListLoading: false})
    myTool.getApiData(res, () => {
      let tempArr = [];
      let timeArr = [];
      // console.log(res.data.ext.delTime);
      console.log(res.data.data);
      res.data.data.forEach(item => {
        tempArr.push({
          id: item.id,
          time: item.time,
          costPrice: item.costPrice,
          memberSize: item.memberSize,
          number: item.number,
          price: item.price,
          stadiumDetailId: item.stadiumDetailId,
          startDate: item.startDate,
          remaining: item.remaining,
          leveNum: item.leveNum,
          delSpoDetail: item.delSpoDetail,
          delTime: res.data.ext.delTime,
          sponsorId: item.sponsorId,
        })
      })
      // console.log(tempArr);
      
      tempArr.forEach((item, index) => {
        timeArr.push(item.startDate);
        item.parIndex = index;
      })

			const startDateArr = [];
			const finalArr = [];
			tempArr.forEach(item => {
				startDateArr.push(item.startDate);
      })
      // console.log(Array.from(new Set(startDateArr)));
			Array.from(new Set(startDateArr)).forEach(item => {
				const cellArr = [];
				tempArr.forEach(cell => {
					if (cell.startDate === item) {
						cellArr.push(cell);
					}
				})
				finalArr.push(cellArr);
      })
      // console.log(finalArr);
      this.state.sponsorArr[0] = {
        stadiumId: res.data.data[0].stadiumId,
        sponsorId: res.data.data[0].sponsorId,
        list: tempArr, // 全局数组
        timeList: finalArr,
      };
      // console.log(this.state.sponsorArr);
      
      // 注意，sponsorArr是个数组，以‘天’为单位
      this.setState({
        court: {
          key: res.data.data[0].stadiumId,
          label: '',
        },
        sponsor: {
          key: res.data.data[0].sponsorId,
          label: '',
        },
        sponsorArr: this.state.sponsorArr
      })
      
    })
   
  }

  componentDidMount() {
    const sponsorId = this.props.match.params.id
    this.setState({sponsorId})
  }  

  // 保存
  submitForm = async() => {
    const {
      stadiumId,
      sponsorId,
    } = this.state

    const tempObj = [];
    this.state.sponsorArr.forEach((item, itemIndex) => {
      item.list.forEach((cell, cellIndex) => {
        tempObj.push({
          'id': this.state.sponsorArr[itemIndex].list[cellIndex].id,
          'time': this.state.sponsorArr[itemIndex].list[cellIndex].time,
          'costPrice': this.state.sponsorArr[itemIndex].list[cellIndex].costPrice,  // 最高补贴（单位元）
          'memberSize': this.state.sponsorArr[itemIndex].list[cellIndex].memberSize,
          'number': this.state.sponsorArr[itemIndex].list[cellIndex].number, // 最高场数
          'price': this.state.sponsorArr[itemIndex].list[cellIndex].price,  // 最高补贴
          'remaining': this.state.sponsorArr[itemIndex].list[cellIndex].remaining,  // 补贴场次
          'startDate': this.state.sponsorArr[itemIndex].list[cellIndex].startDate,
          'stadiumDetailId': this.state.sponsorArr[itemIndex].list[cellIndex].stadiumDetailId,
        });
      });
    });
    let param = {
      stadiumId: this.state.court.key,
      sponsorId: this.state.sponsor.key,
      list: JSON.stringify(tempObj)
    }
    // console.log(tempObj);
    // console.log(param);
    // console.log(this.state.sponsorArr);
    
    this.setState({submitLoading: true})
    const res = await Api.editSponsorDetailData(myTool.delObjVoidKey(param))
    this.setState({submitLoading: false})
    myTool.getApiData(res, () => {
      console.log(res);
      message.success(res.data.rtnMsg)
      this.props.history.push('/sponsorManage/sponsorList')
    })
  }

  cancelReturn = () => {
    this.setState({
      showReturnModal: false,
      returnName: '',
      returnPayNum: '',
      refund_fee: null,
      returnSponsorId: '',
    })
  }

  confirmReturn = async() => {
    const {
      returnSponsorId,
      actualAmt,
      prepayAmt,
    } = this.state

    this.setState({userListLoading: true})
    const res = await Api.refund({
      sponsorId: returnSponsorId,
      total_fee: prepayAmt,
      refund_fee: prepayAmt,
    })
    this.setState({userListLoading: false})
    myTool.getApiData(res, () => {
      message.info(res.data.rtnMsg)
      this.setState({showReturnModal: false})
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
      court,
      sponsor,
      submitLoading = false,
      showReturnModal = false,
      returnName = '',
      actualAmt = '',
      prepayAmt = '',
      selectedRowKeys,
      workerId,
    } = this.state
    
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      hideDefaultSelections: true
    }

    return (
      <React.Fragment>
        {/* <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={prevPage}>订单管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>订单详情</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className='p-sponsorDetail-wrap'>
          <HasReturnTitle 
            returnPath={`${prevPage}${this.state.currentId}`}
            title='修改赞助'
          />
       
        <div className="u-page-wrap">
          <div className="m-form-wrap pt30" style={{maxWidth: 1000}}>
            <div className="item-box">
              <div className="left-box">
                <span className="label">选择球场</span>
                <Select
                  size='large'
                  className='select'
                  value={court}
                  placeholder='未选择'
                  disabled={true}
                  labelInValue={true}
                  style={{width: 260}}
                >
                  {this.state.courtList.map(item => (
                    <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="item-box">
              <div className="left-box">
                <span className="label">赞助商</span>
                <Select
                  size='large'
                  className='select'
                  value={sponsor}
                  placeholder='未选择'
                  disabled={true}
                  labelInValue={true}
                  style={{width: 260}}
                >
                  {this.state.sponsorList.map(item => (
                    <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="item-box">
              <div className="left-box">
                <span className="label">设置场次</span>
              </div>
            </div>
            {this.state.sponsorArr.length > 0 ? this.state.sponsorArr.map((item, index) => (
              <div className="item-box" style={{paddingLeft: 40}}>
                <div className="left-box">
                  <DatePicker 
                    size='large'
                    placeholder={this.state.sponsorArr[0].list[0].startDate}
                    disabled={true}
                    />
                </div>
              </div>
            )) : ''}
            {this.state.sponsorArr.length > 0 ? this.state.sponsorArr.map((item, index) => (
              <div style={{paddingLeft: 40}}>
                <a className="label">{this.state.sponsorArr.length > 0 ? this.state.sponsorArr[index].list[0].startDate : ''}</a>
                <Table
                  scroll={{y: tableScroll }}
                  columns={this.sponsorColumns}
                  dataSource={this.state.sponsorArr[index].list}
                  pagination={false}
                />
              </div>
            )) : ''}
            <div className="btn-box">
              <Button 
                onClick={this.submitForm} 
                type='primary'
                loading={submitLoading}
                style={{marginBottom: '45px'}}
              >{`${workerId === 'add' ? '确定' : '保存'}`}</Button>
              <Link to='/sponsorManage/sponsorList' className='cancel-text'>取消</Link>
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
          title='退款'
          onCancel={this.cancelReturn}
          onOk={this.confirmReturn}
          visible={showReturnModal}
          width={420}

        >
          <div className='sponsorDetail-return'>
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
                <span className="red">￥{prepayAmt}</span>
              </div>
            </div>
          </div>
        </Modal>
        </div>
      </React.Fragment>
    )
  }
}

const topBtnList = [
  {
    key: 'edit',
    name: '修改',
    sName: '修改',
    uiType: 'btn',
    needConfirm: false,
    param: '',
  },
  {
    key: 'off',
    name: '下架',
    sName: '下架',
    uiType: 'btn',
    needConfirm: false,
    param: '',
  },
  {
    key: 'del',
    name: '删除场次',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    param: 'D',
  },
]

export default EditLaunchSponsor;
