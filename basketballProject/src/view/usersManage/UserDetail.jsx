import React, {Component} from "react";
// import regs from "../../common/js/reg";
import { Button, message, Breadcrumb, Input, 
  // Cascader, 
  Select, InputNumber, Table} from "antd";
import {Link} from 'react-router-dom'
import Api from "../../server";
import myTool from '../../common/js/tool'
import EnlargeImgModal from '../../components/EnlargeImgModal'
import {levelList, positionList, frequencyList} from './UsersList'

const prevPage = '/usersManage/usersList'

class UserDetail extends Component {
  state = {
  }

  async componentWillMount() {
    const userId = this.props.match.params.id

    if (userId === 'add') {
      this.setState({editType: userId})
      // this.getAddressApi('province', null, false, (addressOptions) => {
      //   this.setState({
      //     addressOptions
      //   })
      // })
    } 

    this.setState({
      userId,
    })

    this.setState({
    })

    this.getUserInfo(userId, async(data) => {
        // let addressOptions = []
        // const addressArrValue = [data.province, data.city, data.area]
        // await this.getAddressApi('province', null, false, (data) => {
        //   addressOptions = data
        // })
  
        // if (addressArrValue.length > 0 && addressArrValue[0]) {
        //   await this.getAddressApi('city', {
        //     provinceid: addressArrValue[0]
        //   }, false, (data) => {
        //     addressOptions[addressOptions.findIndex(item => item.value === addressArrValue[0])].children = data 
        //   })
        // }
        // if (addressArrValue.length > 1 && addressArrValue[1]) {
        //   await this.getAddressApi('area', {
        //     citiesId:  addressArrValue[1]
        //   }, true, (data) => {
        //     const index1 = addressOptions.findIndex(item => item.value === addressArrValue[0])
        //     const index2 = addressOptions[index1].children.findIndex(item => item.value === addressArrValue[1])
        //     addressOptions[index1].children[index2].children = data
        //   })
        // }
  
        this.setState({
        ...data,

          // addressOptions,
          // addressArrValue,
        })
    })
  
  }

  getUserInfo = async(userId, callback) => {
    this.setState({userInfoLoading: true})
    const res = await Api.getUserInfo({userId})
    this.setState({userInfoLoading: false})
    myTool.getApiData(res, () => {
      this.setState({
        orderList: myTool.arrAddKey(res.data.data)
      })
      console.log(this.state.orderList);
      
      callback && callback(res.data.object)
    })
  }

  // loadAddress = (selectedOptions) => {
  //   const targetOption = selectedOptions[selectedOptions.length - 1];
  //   targetOption.loading = true;

  //   const updata = (data) => {
  //     targetOption.loading = false
  //     targetOption.children =  data.length === 0 ? null : data
  //     this.setState({
  //       addressOptions: [...this.state.addressOptions],
  //     });
  //   }

  //   if (selectedOptions.length === 1) {
  //     this.getAddressApi('city', {
  //       provinceid: selectedOptions[0].value
  //     }, false, (data) => {
  //       updata(data)
  //     })
  //   }

  //   if (selectedOptions.length === 2) {
  //     this.getAddressApi('area', {
  //       citiesId: selectedOptions[1].value
  //     }, true, (data) => {
  //       updata(data)
  //     })
  //   }
  // }


  changePoint = e => {
    this.setState({
      longitude: e.lnglat.lng,
      latitude: e.lnglat.lat,
    })
  }

  // getAddressApi = async(name, arg, isLeaf, callback) => {
  //   const res = await Api[`find${name}`]({...arg})
  //   myTool.getApiData(res, () => {
  //     let arr = res.data.data.map(item => {
  //       let obj = {}
  //       obj.value = item[`${name}id`]
  //       obj.label = item[name]
  //       obj.isLeaf = isLeaf
  //       return obj
  //     })
  //     callback(arr)
  //   })
  // }


  submitForm = async() => {
    const {
      addressArrValue = [],
      userId,
      age,
      height,
      weight,
      level,
      frequency,
      position,
    } = this.state

    // if (addressArrValue.length !== 3) {
    //   message.info('请选择完整的球场范围')
    //   return false
    // }

    let param = {
      userId,
      age,
      height,
      weight,
      level,
      frequency,
      position,
      province: addressArrValue[0],
      city: addressArrValue[1],
      area: addressArrValue[2],
    }
    this.setState({submitLoading: true})
    const res = await Api.updateTheUser(myTool.delObjVoidKey(param))
    this.setState({submitLoading: false})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.props.history.push(prevPage)
    })
  }

  render() {
    const {
      submitLoading = false,
      orderList = [],
      userInfoLoading = false,
      // addressArrValue = [],
      // addressOptions = [],
      mobilePhone,
      photo = '',
      showEnlargeImgModal = false,
      enlargeImg = '',
      isEnlargeImgModalVideo = false,
      nickName,
      gender,
      height,
      weight,
      level,
      position,
      frequency,
      countMoney,
      number,
      age,
    } = this.state
    let genderText = gender
    if (gender === 'G') {
      genderText = '女'
    }
    if (gender === 'B') {
      genderText = '男'
    }
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={prevPage}>会员管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>会员详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap p-user-detail'>
          <div className="m-title-m"><span className="tit">会员详情</span></div>
          <div className="m-form-wrap">
            <div className="item-box">
              <span className="label" style={{marginTop: 10}}>头像</span>
              <div className="info-box">
                <img 
                  className='photo' 
                  alt='' 
                  src={`${Api.IMG_BASIC_URL}${photo}`} 
                  width='50'
                  height='50'
                  onClick={() => {
                    this.setState({
                      showEnlargeImgModal: true,
                      enlargeImg: `${Api.IMG_BASIC_URL}${photo}`,
                      isEnlargeImgModalVideo: false,
                    })
                  }} 
                />
              </div>
            </div>
            <div className="item-box">
              <span className="label">昵称</span>
              <Input 
                className='input'
                size='large'
                value={nickName}
                disabled
              />
            </div>
            <div className="item-box">
              <span className="label">性别</span>
              <Input 
                className='input'
                size='large'
                value={genderText} 
                disabled
              />
            </div>
            <div className="item-box">
              <span className="label">年龄</span>
              <InputNumber 
                className='input'
                size='large'
                min={1}
                style={{width: 100, marginRight: 5}}
                value={age} 
                onChange={age => this.setState({age})}
              />
              <span className="text-s">岁</span>
            </div>
            <div className="item-box">
              <span className="label">身高</span>
              <InputNumber 
                className='input'
                size='large'
                style={{width: 100, marginRight: 5}}
                value={height}
                onChange={height => this.setState({height})}
              />
              <span className="text-s">cm</span>
            </div>
            <div className="item-box">
              <span className="label">体重</span>
              <InputNumber 
                className='input'
                size='large'
                style={{width: 100, marginRight: 5}}
                value={weight}
                onChange={weight => this.setState({weight})}
              />
              <span className="text-s">kg</span>
            </div>
            <div className="item-box">
              <span className="label">技术水平</span>
              <Select
                value={level}
                className='select'
                size='large'
                onChange={level => this.setState({level})}
              >
                {levelList.map(item => (
                  <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                ))}
              </Select>
            </div>
            <div className="item-box">
              <span className="label">频率</span>
              <Select
                value={frequency}
                className='select'
                size='large'
                onChange={frequency => this.setState({frequency})}
              >
                {frequencyList.map(item => (
                  <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                ))}
              </Select>
            </div>
            <div className="item-box">
              <span className="label">位置</span>
              <Select
                value={position}
                className='select'
                size='large'
                onChange={position => this.setState({position})}
              >
                {positionList.map(item => (
                  <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                ))}
              </Select>
            </div>
            {/* <div className="item-box">
              <span className="label">球场范围</span>
              <Cascader
                options={addressOptions}
                loadData={this.loadAddress}
                onChange={(addressArrValue) => {
                  this.setState({
                    addressArrValue
                  })
                }}
                placeholder='请选择'
                value={addressArrValue}
                changeOnSelect
                size='large'
                style={{width: 500}}
              />
            </div> */}
            <div className="item-box">
              <span className="label">电话号码</span>
              <Input 
                className='input'
                maxLength={11}
                size='large'
                value={mobilePhone}
                disabled
              />
            </div>
            <div className="btn-box">
              <Button 
                onClick={this.submitForm} 
                loading={submitLoading}
                type='primary'
              >保存</Button>
              <Link to={prevPage} className='cancel-text'>取消</Link>
            </div>
          </div>
          <div className="m-table-wrap">
            <div className="m-title-m">
              <span className="tit">订单信息</span>
              <div className="orderInfo">
                <span>消费金额(元)：{countMoney}</span>
                <span>参与场次：{number}</span>
              </div>
            </div>
            <Table
              scroll={{y: 600}}
              columns={this.columns}
              dataSource={orderList}
              loading={userInfoLoading}
              pagination={false}
            />
          </div>
        </div>
        <EnlargeImgModal 
          visible={showEnlargeImgModal}
          imgList={enlargeImg}
          isVideo={isEnlargeImgModalVideo}
          onCancel={() => {
            this.setState({
              showEnlargeImgModal: false,
              selectedRowKeys: [],
              isVideo: false,
            })
          }}
        />
      </React.Fragment>
    )
  }
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => index + 1
    },
    {
      title: '定场时间',
      dataIndex: 'orderTime',
      width: 120,
    },
    {
      title: '球场名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '场次时间',
      dataIndex: 'time',
      width: 110,
    },
    {
      title: '支付金额',
      dataIndex: 'orderAmt',
      width: 110,
    },
    {
      title: '参与人数',
      dataIndex: 'actualSize',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'orderClass',
      width: 120,
      render: text => text === 'match' ? '拼场' : text === 'group' ? '包场' : text === 'sponsorMatch' || text === 'sponsorGroup' ? '赞助场' : ''
    },
  ]
}

export default UserDetail