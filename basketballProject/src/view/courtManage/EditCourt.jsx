import React, {Component} from "react";
import regs from "../../common/js/reg";
import { Button, message, Breadcrumb, Input, Cascader, Select } from "antd";
import {Link} from 'react-router-dom'
import Api from "../../server";
import myTool from '../../common/js/tool'
import UploadImg from '../../components/upLoadImg'
import { Map, Marker } from 'react-amap'
// import SearchMap from '../../components/searchMap'

const prevPage = '/courtManage/courtList'

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    window.AMap.plugin('AMap.PlaceSearch', function(){
      let autoOptions = {
        city: '全国',
        citylimit: true,
        pageSize: 50,
        children: 0,
        pageIndex: 1,
      }
    let autoComplete = new window.AMap.PlaceSearch(autoOptions);
    autoComplete.search(value, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        if (currentValue === value) {
          let list = result.poiList.pois
          callback && callback(list)
        }
      }
    })
  })
  }

  timeout = setTimeout(fake, 300);
}


class EditCourt extends Component {
  state = {
    editType: '',
    openTime: null,
    closeTime: null,
    addressValue: undefined,
  }

  async componentWillMount() {
    const courtId = this.props.match.params.id
    const data = this.props.location.query

    if (courtId !== 'add' && !data) {
      this.props.history.push(prevPage)
      return false
    }

    if (courtId === 'add') {
      this.setState({editType: courtId})
      this.getAddressApi('province', null, false, (addressOptions) => {
        this.setState({
          addressOptions
        })
      })
    } 

    this.setState({
      courtId,
    })
    if (data && courtId !== 'add') {
      let addressOptions = []
      const addressArrValue = [data.province, data.city, data.area]
      await this.getAddressApi('province', null, false, (data) => {
        addressOptions = data
      })

      if (addressArrValue.length > 0 && addressArrValue[0]) {
        await this.getAddressApi('city', {
          provinceid: addressArrValue[0]
        }, false, (data) => {
          addressOptions[addressOptions.findIndex(item => item.value === addressArrValue[0])].children = data 
        })
      }
      if (addressArrValue.length > 1 && addressArrValue[1]) {
        await this.getAddressApi('area', {
          citiesId:  addressArrValue[1]
        }, true, (data) => {
          const index1 = addressOptions.findIndex(item => item.value === addressArrValue[0])
          const index2 = addressOptions[index1].children.findIndex(item => item.value === addressArrValue[1])
          addressOptions[index1].children[index2].children = data
        })
      }

      this.setState({
        ...data,
        courtImgList: data.image ? [{url: data.image}] : [],
        addressOptions,
        addressArrValue,
      })
    }
  }



  loadAddress = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const updata = (data) => {
      targetOption.loading = false
      targetOption.children =  data.length === 0 ? null : data
      this.setState({
        addressOptions: [...this.state.addressOptions],
      });
    }

    if (selectedOptions.length === 1) {
      this.getAddressApi('city', {
        provinceid: selectedOptions[0].value
      }, false, (data) => {
        updata(data)
      })
    }

    if (selectedOptions.length === 2) {
      this.getAddressApi('area', {
        citiesId: selectedOptions[1].value
      }, true, (data) => {
        updata(data)
      })
    }
  }


  changePoint = e => {
    this.setState({
      longitude: e.lnglat.lng,
      latitude: e.lnglat.lat,
    })
  }

  getAddressApi = async(name, arg, isLeaf, callback) => {
    const res = await Api[`find${name}`]({...arg})
    myTool.getApiData(res, () => {
      let arr = res.data.data.map(item => {
        let obj = {}
        obj.value = item[`${name}id`]
        obj.label = item[name]
        obj.isLeaf = isLeaf
        return obj
      })
      callback(arr)
    })
  }

  fetchAddressList = (address, city, callback) => {
    
    window.AMap.plugin('AMap.PlaceSearch', function(){
      let autoOptions = {
        city,
        citylimit: true,
        pageSize: 50,
        children: 0,
        pageIndex: 1,
      }
      let autoComplete = new window.AMap.PlaceSearch(autoOptions);
      autoComplete.search(address, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          let list = result.poiList.pois
          callback && callback(list)
        }
      })
    })
  }

  getAddressList = async(value, city) => {
   this.fetchAddressList(value, city, (list) => {
    this.setState({
      addressList: list
    })
   })
  }

  searchAddress = value => {
    fetch(value, list => {
      this.setState({
        addressList: list
      })
    })
  }

  changeAddress = addressValue => {
    const obj = this.state.addressList.filter(item => item.id === addressValue)[0]
    this.setState({
      addressValue,
      longitude: obj.location.lng,
      latitude: obj.location.lat,
      address: obj.address
    })
  }


  submitForm = async() => {
    const {
      name,
      addressArrValue = [],
      address,
      longitude,
      latitude,
      courtId,
      courtImgList = [],
      phone,
      status,
    } = this.state

    if (!name) {
      message.info('请输入球场名称')
      return false
    }

    // if (addressArrValue.length !== 3) {
    //   message.info('请选择完整的球场范围')
    //   return false
    // }

    // if (!address) {
    //   message.info('请填写球场的详细地址')
    // }

    // if (!longitude || !latitude) {
    //   message.info('请填写经纬度')
    //   return false
    // }
    let param = {
      name,
      province: addressArrValue[0],
      city: addressArrValue[1],
      area: addressArrValue[2],
      address,
      longitude,
      latitude,
      image: courtImgList.length > 0 ? courtImgList[0].url : '',
      phone,
      status,
    }
    if (courtId !== 'add') {
      param = {...param, id: courtId}
    }
    this.setState({submitLoading: true})
    const res = await Api.updateStadium(myTool.delObjVoidKey(param))
    this.setState({submitLoading: false})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.props.history.push('/courtManage/courtList')
    })
  }

  render() {
    const {
      name,
      editType,
      submitLoading = false,
      addressArrValue = [],
      addressOptions = [],
      address,
      longitude = 113.91595,
      latitude = 22.490649,
      phone,
      courtImgList = [],
      addressList = [],
      addressValue
    } = this.state
    const position ={longitude: Number(longitude), latitude: Number(latitude)}
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/courtManage/courtList'>球场管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{`${editType === 'add' ? '创建' : '修改'}球场`}</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap'>
          <div className="m-form-wrap pt30">
            <div className="item-box">
              <span className="label">球场名称</span>
              <Input 
                className='input'
                size='large'
                value={name}
                maxLength={30}
                onChange={(e) => {
                  this.setState({name: e.target.value.replace(regs.regNoSpace, '')})
                }}
              />
            </div>
            <div className="item-box">
              <span className="label">球场图片</span>
              <UploadImg 
                maxUpImg={1}
                imgList={courtImgList}
                maxSize={209715200}
                hasWH
                actionUrl={`${Api.upLoadFile}?type=image&classify=court`}
                imgBasicUrl={Api.IMG_BASIC_URL}
                changeImgList={(courtImgList) => {
                  this.setState({courtImgList})
                }}
              />
              <span className="text-s upimgtext">图片尺寸750*300，不大于200M</span>
            </div>
            <div className="item-box">
              <span className="label">联系电话</span>
              <Input 
                className='input'
                maxLength={11}
                size='large'
                value={phone}
                onChange={(e) => {
                  this.setState({phone: e.target.value.replace(regs.regNumber, '')})
                }}
              />
            </div>
        
            <div className="item-box">
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
            </div>
            <div className="item-box">
              <span className="label">详细地址</span>
              <Input 
                value={address}
                style={{width: 500}}
                onChange={e => this.setState({address: e.target.value})}
                className='input'
                size='large'
              />
            </div>
            <div className="item-box">
              <span className="label">球场坐标</span>
              <Input 
                size='large'
                className='input'
                addonBefore='经度'
                value={longitude}
                onChange={e => this.setState({longitude: e.target.value.replace(regs.regNumberDot, '')})}
              />
              <Input 
                size='large'
                className='input'
                addonBefore='纬度'
                value={latitude}
                onChange={e => this.setState({latitude: e.target.value.replace(regs.regNumberDot, '')})}
              />
            </div>
            <div className="item-box">
              <span className="label">地址搜索</span>
              <Select 
                showSearch
                className='input'
                maxLength={100}
                size='large'
                style={{width: 500}}
                value={addressValue}
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={this.searchAddress}
                onChange={this.changeAddress}
                notFoundContent='未搜索到相关信息'
              >
                {addressList.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.name}{item.address}</Select.Option>
                ))}
              </Select>
            </div>
            <div className="item-box">
              <span className="label">球场定位</span>
              <div className="info-box" style={{width: 1000, height: 600}}>
                <Map 
                  amapkey={'746ffc3fe07804538f84482f40484b60'} 
                  zoom={12} 
                  center={position} 
                  plugins={['ToolBar']}
                  events={{
                    click: this.changePoint
                  }}
                >
                  <Marker position={position}>
                    <div className='map-point-icon'></div>
                  </Marker>
                </Map>
              </div>
            </div>
           
            <div className="btn-box">
              <Button 
                onClick={this.submitForm} 
                loading={submitLoading}
                type='primary'
              >确定</Button>
              <Link to={prevPage} className='cancel-text'>取消</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default EditCourt