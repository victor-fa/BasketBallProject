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
const prevPage = '/sponsorManage/sponsorList'

class LaunchSponsor extends Component {
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
    sponsorArr: [{stadiumId: '', sponsorId: '', list: [{startDate: '', startDate: '', parIndex: 0}]}], // 全局数组
  }
  // 发起赞助
  sponsorColumns = [
    {
      title: '',
      dataIndex: 'createTime', 
      width: 60,
      render: (text, record, index) => 
        <div style={{fontWeight: 'bold', width: '90%'}}>
          <a
          style={{fontSize: '24px'}}
          onClick={() => {
            console.log(record);
            console.log(this.state.sponsorArr);
            const sponsorIndex = record.parIndex;
            this.state.sponsorArr[sponsorIndex].list.push({startDate: '', parIndex: sponsorIndex});
            // this.state.sponsorArr[sponsorIndex].timeList
            this.setState({sponsorArr: this.state.sponsorArr})
          }
          }>+</a>&nbsp;&nbsp;
          <a
          style={{fontSize: '24px'}}
          onClick={() => {
            const sponsorIndex = record.parIndex;
            if (this.state.sponsorArr[sponsorIndex].list.length === 1) { return; } // 只剩一条时不可删除
            this.state.sponsorArr[sponsorIndex].list.splice(index, 1); // 这里的 sponsorArr 不应该为index
            this.setState({sponsorArr: this.state.sponsorArr})
          }
          }>-</a>
        </div>
        
    },
    {
      title: '场次时间',
      dataIndex: 'name',
      width: 140,
      render: (text, record, index) => 
            <Select
            style={{width: '90%'}}
            className='select'
            value={{
              key: this.state.sponsorArr[record.parIndex].list[index].stadiumDetailId,
              label: this.state.sponsorArr[record.parIndex].list[index].startDate
            }}
            onChange={(cell) => {
              if (!this.state.court.key && this.state.court.key === '') {
                message.info('请先选择球场！')
                return
              }
              console.log(index);
              console.log(cell);
              this.state.sponsorArr[record.parIndex].list[index].startDate = cell.label;
              this.state.sponsorArr[record.parIndex].list[index].stadiumDetailId = cell.key;
              this.state.sponsorArr[record.parIndex].timeList.forEach((item, num) => {
                if (cell.key === item.key) {
                  this.state.sponsorArr[record.parIndex].list[index].costPrice = item.costPrice;
                  this.state.sponsorArr[record.parIndex].quantity = item.quantity;
                  this.state.sponsorArr[record.parIndex].list[index].price = item.price;
                  this.state.sponsorArr[record.parIndex].list[index].quantity = item.quantity;
                  this.state.sponsorArr[record.parIndex].list[index].startDateIndex = num;
                }
              })
              console.log(this.state.sponsorArr);
              
              this.setState({sponsorArr: this.state.sponsorArr})
            }}
            labelInValue
            disabled={this.state.isAdmin === 'Y'}
          >
            {(this.state.sponsorArr[record.parIndex].timeList ? this.state.sponsorArr[record.parIndex].timeList : [{key: '1', label: '没有场次可赞助'}]).map(item => (
              <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
            ))}
          </Select>
    },
    {
      title: '补贴价格(元/场)',
      dataIndex: 'price',
      width: 80,
      render: (text, record, index) => 
        <div>
          ￥<Input 
              style={{width: '40%'}}
              className='input'
              maxLength={30}
              value={this.state.sponsorArr[record.parIndex].list[index].price}
              disabled={!this.state.sponsorArr[record.parIndex].list[index].startDate}
              onChange={(e) => {
                const result = e.target.value;
                const num = this.state.sponsorArr[record.parIndex].list[index].startDateIndex;
                if (result > Number(this.state.sponsorArr[record.parIndex].list[index].costPrice)) {
                  message.info('补贴价格不得超过原价！')
                  return
                }
                this.state.sponsorArr[record.parIndex].list[index].price = result;
                this.state.sponsorArr[record.parIndex].list[index].costPrice = this.state.sponsorArr[record.parIndex].timeList[num].costPrice;
                this.setState({sponsorArr: this.state.sponsorArr})
              }}
            />
            <span>&nbsp; / ￥{
              this.state.sponsorArr[record.parIndex].list ? this.state.sponsorArr[record.parIndex].list[index].costPrice : ''
              }元</span>
        </div>
    },
    {
      title: '补贴场次数(半场)',
      dataIndex: 'number',
      width: 80,
      render: (text, record, index) => 
        <div>
          <Input 
              style={{width: '40%'}}
              className='input'
              maxLength={30}
              value={this.state.sponsorArr[record.parIndex].list[index].remaining}
              disabled={!this.state.sponsorArr[record.parIndex].list[index].startDate}
              onChange={(e) => {
                const result = e.target.value;
                const num = this.state.sponsorArr[record.parIndex].list[index].startDateIndex;
                if (result > Number(this.state.sponsorArr[record.parIndex].list[index].quantity)) {
                  message.info('补贴场次数不得超过原场次数！')
                  return
                }
                this.state.sponsorArr[record.parIndex].list[index].remaining = result;
                this.setState({sponsorArr: this.state.sponsorArr})
              }}
            />
            <span>场&nbsp; / {this.state.sponsorArr[record.parIndex].timeList ? this.state.sponsorArr[record.parIndex].list[index].quantity : ''}场</span>
        </div>
    },
    {
      title: '允许参与的人数',
      dataIndex: 'xxx',
      width: 80,
      render: (text, record, index) => 
        <Select
          style={{width: '80%'}}
          className='select'
          value={this.state.sponsorArr[record.parIndex].list[index].memberSize}
          onChange={item => {
            this.state.sponsorArr[record.parIndex].list[index].memberSize = item;
            this.setState({sponsorArr: this.state.sponsorArr})
          }}
        >
          {[{key: '6', label: '6'}, {key: '9', label: '9'}, {key: '12', label: '12'}].map(item => (
            <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
          ))}
        </Select>
    },
  ]

  componentWillMount() {
    const currentId = this.props.match.params.id
    // const data = this.props.location.query
    
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
      console.log(this.state.sponsorArr);
      this.state.sponsorArr[index].timeList = res.data.data.map(item => {
        let obj = {}
        obj.key = item.id
        obj.label = item.time
        obj.quantity = item.quantity
        obj.costPrice = item.price
        return obj
      })
      this.setState({
        sponsorArr: this.state.sponsorArr,
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
          'time': this.state.sponsorArr[itemIndex].list[cellIndex].startDate,
          'costPrice': this.state.sponsorArr[itemIndex].list[cellIndex].costPrice,  // 原价
          'memberSize': this.state.sponsorArr[itemIndex].list[cellIndex].memberSize,
          'number': this.state.sponsorArr[itemIndex].list[cellIndex].remaining, // 补贴场次
          'price': this.state.sponsorArr[itemIndex].list[cellIndex].price,  // 补贴金额
          'startDate': this.state.sponsorArr[itemIndex].list[0].time, // 默认第一个是有的
          'stadiumDetailId': this.state.sponsorArr[itemIndex].list[cellIndex].stadiumDetailId,
        });
      });
    });
    let param = {
      stadiumId: this.state.court.key,
      sponsorId: this.state.sponsor.key,
      list: JSON.stringify(tempObj)
    }

    console.log(this.state.sponsorArr);
    console.log(param);
    
    this.setState({submitLoading: true})
    const res = await Api.createSponsorDetail(myTool.delObjVoidKey(param))
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
  
  disabledDate(current) {
    return current && current < moment().endOf('day');
  }

  render() {
    const {
      userList = [],
      userListLoading = false,
      tableScroll,
      showEnlargeImgModal = false,
      enlargeImg = '',
      isEnlargeImgModalVideo = false,
      courtList = [],
      court = {
        key: '',
        label: ''
      },
      sponsorList = [],
      sponsor = {
        key: '',
        label: ''
      },
      isAdmin,
      submitLoading = false,
      showReturnModal = false,
      returnName = '',
      actualAmt = '',
      prepayAmt = '',
      selectedRowKeys,
      workerId,
      sponsorArr,
      startDateArr = [],
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
            returnPath={prevPage}
            title='发起赞助'
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
                  onChange={court => {
                    if (this.state.currentDataList !== undefined) {
                      const cell = this.state.currentDataList;
                      this.state.sponsorArr = [{stadiumId: '', sponsorId: '', list: [{startDate: '', startDate: '', parIndex: 0}]}];
                      this.state.startDateArr = [];
                      // this.getDataList(cell.yearMonth, cell.date, cell.index);
                      // 清空数据
                    }
                    this.state.sponsorArr[0].sponsorId = court.key;
                    this.setState({court: court, sponsorArr: this.state.sponsorArr});
                  }}
                  placeholder='未选择'
                  disabled={isAdmin === 'Y'}
                  labelInValue
                  style={{width: 260}}
                >
                  {courtList.map(item => (
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
                  onChange={sponsor => {
                    this.state.sponsorArr[0].stadiumId = sponsor.key;
                    this.setState({sponsor: sponsor, sponsorArr: this.state.sponsorArr})}
                  }
                  placeholder='未选择'
                  disabled={true}
                  labelInValue
                  style={{width: 260}}
                >
                  {sponsorList.map(item => (
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
            {sponsorArr.map((item, index) => (
              <div className="item-box" style={{paddingLeft: 40}}>
                <div className="left-box">
                  <DatePicker
                    disabledDate={this.disabledDate}
                    size='large'
                    showTime
                    placeholder="选择时间"
                    format="YYYY/MM/DD"
                    disabled={!this.state.court.key && this.state.court.key === ''}
                    value={startDateArr.length > 0 && startDateArr[index] ? moment(startDateArr[index], 'YYYY/MM/DD') : ''}
                    onChange={(value) => {
                      if (!this.state.court.key && this.state.court.key === '') {
                        message.info('请先选择球场！')
                        return false
                      }
                      console.log(value);
                      if (value !== null) {
                        const timeTemp = value._d.toLocaleDateString();
                        const year = value._d.getUTCFullYear() + '';
                        const dayTemp = value._d.getDate() + '';
                        // console.log(dayTemp);
                        const day = dayTemp.length === 1 ? '0' + dayTemp : dayTemp;
                        const monthTemp = (value._d.getUTCMonth() + (dayTemp === '1' ? 2 : 1)) + '';
                        // console.log(monthTemp);
                        const month = monthTemp.length === 1 ? '0' + monthTemp : monthTemp;
                        if (this.state.sponsorArr[0].list[0].time && this.state.sponsorArr[0].list[0].time !== '') {
                          let isRepeat = false;
                          this.state.sponsorArr.forEach(item => {
                            if (item.list[0].time === (year + '-' + month + '-' + day)) {
                              isRepeat = true;
                            }
                          })
                          if (isRepeat === true) {
                            message.info('您选择的日期有重复！请重选')
                            return false
                          }
                        }
                        startDateArr[index] = year + '/' + month + '/' + day;  // 动态获取最新的数组
                        sponsorArr[index].list[0].time =  year + '-' + month + '-' + day;
                        this.getDataList(year + month, year + '-' + month + '-' + day, index);
                        this.setState({
                          sponsorArr,
                          startDateArr: startDateArr,
                          currentDataList: {yearMonth: year + month, date: year + '-' + month + '-' + day, index: index},
                        })
                        console.log(this.state.startDateArr);
                      }
                    }} />
                    &nbsp;<a><span onClick={() => {
                        this.state.sponsorArr.push({stadiumId: '', sponsorId: '', list: [{startDate: '', parIndex: this.state.sponsorArr.length}]});
                        this.state.sponsorArr[this.state.sponsorArr.length-1].list[0].parIndex = this.state.sponsorArr.length-1;
                        this.setState({sponsorArr: this.state.sponsorArr})}
                      }>添加时间</span></a>&nbsp;&nbsp;
                    {index > 0 ? <a><span onClick={() => {
                        if (this.state.sponsorArr.length === 1) { return; }
                        this.state.sponsorArr.splice(index, 1);
                        this.setState({sponsorArr: this.state.sponsorArr})}
                      }>删除</span></a> : ''}
                </div>
              </div>
            ))}
            {sponsorArr.map((item, index) => (
              <div style={{paddingLeft: 40}}>
                <a className="label">{sponsorArr[index].list[0].time}</a>
                <Table
                  scroll={{y: tableScroll }}
                  columns={this.sponsorColumns}
                  dataSource={sponsorArr[index].list}
                  pagination={false}
                />
              </div>
            ))}
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

export default LaunchSponsor;
