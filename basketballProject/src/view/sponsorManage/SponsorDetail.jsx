import { Button, message, Modal, Select, Table } from 'antd';
import React, { Component } from "react";
// import {Link} from 'react-router-dom'
// import regs from '../../common/js/reg'
import myTool from '../../common/js/tool';
import EnlargeImgModal from '../../components/EnlargeImgModal';
// import moment from 'moment'
import HasReturnTitle from '../../components/hasReturnTitle';
import Api from '../../server';
import './index.scss';

const prevPage = '/sponsorManage/sponsorList'

class SponsorDetail extends Component {
  state = {
    selectedRowKeys: [],
  }
  columns = [
    {
      title: '创建时间',
      dataIndex: 'createTime', 
      width: 160,
    },
    {
      title: '球场名称',
      dataIndex: 'name',
      width: 140,
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
      title: '剩余场次',
      dataIndex: 'remanentStadium',
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
      width: 80,
      render: (text, record) => <span className={`btn-text ${record.status === 'Y' ? '' : 'red'}`} onClick={() => this.handleOperate(
        {key: 'changeShelf', sName: record.status === 'Y' ? '下架' : '上架', uiType: 'text', needConfirm: true},
        record)
        }>
        {record.status === 'Y' ? '下架' : '上架'}
        </span>
    },
  ]

  componentWillMount() {
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120,
    })
  }

  componentDidMount() {
    const sponsorId = this.props.match.params.id
    this.setState({sponsorId})
    this.getSponsorDetailApi(sponsorId)    
  }  

  handleOperate = (e, record) => {
    const  {
      selectedRowKeys,
    } = this.state

    if (e.uiType === 'btn' && e.key !== 'add') {
      if (selectedRowKeys.length === 0) {
        message.info(`请选择您要${e.sName}的赞助商`)
        return false
      }
    }

    if (selectedRowKeys.length > 1 && e.key !== 'del') {
      message.info(`一次只能${e.sName}一个场次`)
      return false
    }
    
    if (e.key === 'edit') {
      this.getSponsorDetailData(record[0]);
      this.setState({showChooseDayModal: true, currentParam: record[0]})
      // this.props.history.push({
      //   pathname: `/sponsorManage/editLaunchSponsor/${record[0].sponsorId}`,
      //   query: record[0]
      // })
      return false
    }
   
    const {clearTableSelect, delSponsorApi, changeShelfApi} = this
    if (e.needConfirm) {
      Modal.confirm({
        title: `您是否确认${e.sName}场次？`,
        onOk() {
          e.key === 'del' && delSponsorApi(record)
          e.key === 'changeShelf' && changeShelfApi(record)
        },
        onCancel() {
          clearTableSelect()
        },
      });
    }
  }

  // 上下架
  changeShelfApi = async(record) => {
    const changeInput = {
      sponsorId: record.sponsorId,
      idList: record.stadiumId,
      status: record.status === 'Y' ? 'N' : 'Y',
    };
    console.log(changeInput);
    
    const res = await Api.changeShelfApi(changeInput)
    myTool.getApiData(res, () => {
      console.log(res);
      message.success(res.data.rtnMsg)
      this.delRefreshList()
    })
  }

  // 删除
  delSponsorApi = async(record) => {
    const result = [];
    record.forEach(item => {
      result.push(item.stadiumId);
    })
    const delInput = {
      sponsorId: record[0].sponsorId,
      idList: result.join(','),
      status: record[0].status === 'Y' ? 'N' : 'Y',
    };
    console.log(delInput);
    
    const res = await Api.delSponsorDetail(delInput)
    myTool.getApiData(res, () => {
      console.log(res);
      message.success(res.data.rtnMsg)
      this.delRefreshList()
    })
  }

  // 删除并刷新
  delRefreshList = () => {
    if (this.state.pageCurrent === Math.ceil(this.state.totalRow / this.state.pageSize)) {
      if (this.state.pageCurrent === 1) {
        this.getSponsorDetailApi({pageCurrent: 1})
        this.setState({pageCurrent: 1})
      } else {
        this.getSponsorDetailApi({pageCurrent: this.state.pageCurrent - 1})
        this.setState({pageCurrent: this.state.pageCurrent - 1})
      }
    } else {
      this.getSponsorDetailApi()
    }
    this.setState({selectedRowKeys: []})
  }

  // 清空多选
  clearTableSelect = () => {
    this.setState({selectedRowKeys: []})
  }

  // 获取赞助商详情
  getSponsorDetailApi = async() => {
    this.setState({userListLoading: true})
    const param = {
      pageCurrent: 1,
      pageSize: 999,
      sponsorId: this.props.match.params.id
    }
    const res = await Api.querySponsorDetail(myTool.delObjVoidKey(param))
    this.setState({userListLoading: false})
    myTool.getApiData(res, () => {
      // console.log(res);
      res.data.data.forEach((item, index) => {
        item.sponsorId = item.id;
        item.id = index;
      })
      this.setState({
        ...res.data.data,
        userList: myTool.arrAddKey(res.data.data),
      })
    })
   
  }

  cancelChooseReturn = () => {
    this.setState({
      showChooseDayModal: false,
    })
  }

  confirmChooseReturn = async() => {
    let record = this.state.currentParam;
    record.startDate = this.state.curStartDate;

    if (this.state.curStartDate === '' || this.state.curStartDate === undefined) {
      message.info(`您未选中赞助场次时间`)
      return false
    }
    console.log(record);
    
    this.props.history.push({
      pathname: `/sponsorManage/editLaunchSponsor/${record.sponsorId}`,
      query: record
    })
    this.setState({showChooseDayModal: false})
  }
  
  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  
  // 获取赞助商详情
  getSponsorDetailData = async(data) => {
    this.setState({userListLoading: true})
    const param = {
      sponsorId: data.sponsorId,
      stadiumId: data.stadiumId
    }
    const res = await Api.getSponsorDetailData(myTool.delObjVoidKey(param))
    this.setState({userListLoading: false})
    myTool.getApiData(res, () => {
      let tempArr = [];
      res.data.data.forEach(item => {
        tempArr.push({
          startDate: item.startDate,
        })
      })
			const startDateArr = [];
			tempArr.forEach(item => {
				startDateArr.push(item.startDate);
      })
      console.log(Array.from(new Set(startDateArr)));
      this.setState({startDate: Array.from(new Set(startDateArr))});
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
      showChooseDayModal = false,
      selectiedRowKeys,
      selectedRowKeys,
      startDate = [],
      curStartDate,
    } = this.state
    
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      hideDefaultSelections: true
    }
    return (
      <React.Fragment>
        <div className='p-sponsorDetail-wrap'>
          <HasReturnTitle 
            returnPath={prevPage}
            title='赞助商详情'
          />
       
        <div className="u-page-wrap">
          <div className="p-sponsorDetail">
            <div className="userList">
              <div className="sponsorDetail-tit">赞助商详情</div>
              <div className="m-table-wrap">
                <div className="table-top-btn">
                  {topBtnList.map((item, i) => (
                    <Button type={`${i === 0 ? 'primary' : ''}`} key={item.key}  onClick={() => this.handleOperate(item, myTool.selectedData(userList, selectedRowKeys))} >{item.name}</Button>
                  ))}
                </div>
                <Table
                  rowSelection={rowSelection}
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
          title='请选择修改时间'
          onCancel={this.cancelChooseReturn}
          onOk={this.confirmChooseReturn}
          visible={showChooseDayModal}
          width={420}
        >
          <div className='sponsorDetail-return'>
            <div className='item-box'>
            </div>
            <div className='item-box'>
              {startDate.length > 0 ? <Select
                size='large'
                className='select'
                value={curStartDate} 
                placeholder='选择赞助场次时间'
                style={{width: 260}}
                onChange={curStartDate => this.setState({curStartDate: curStartDate})}
              >
                {startDate.length > 0 ? startDate.map(item => (
                  <Select.Option key={item} value={item}>{item}</Select.Option>
                )) : ''}
              </Select> : ''}
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
  }, {
    key: 'del',
    name: '删除场次',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    param: 'D',
  },
]

export default SponsorDetail;
