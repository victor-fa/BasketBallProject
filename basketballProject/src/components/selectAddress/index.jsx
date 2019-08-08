/**
 * @file    index.jsx
 * @desc    订单
 * @author  易梦蝶
 * @update  20180326 
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import {
  fecthProvinces,
  fecthCities,
  fecthAreas,
  fecthSmallsAreas,
} from '../../service'
import './index.scss'

const SelectOption = Select.Option

export const defaultAddress = {
  provinceid: 'no',
  cityid: 'no',
  areaid: 'no',
  smallareaid: 'no',
}

class SelectAddress extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  componentWillMount() {
    this.updata(this.props)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextprops) {
    if (this.props.defaultSelect !== nextprops.defaultSelect || this.props.updataFlag !== nextprops.updataFlag) {
      this.updata(nextprops)
    }
  }
  
  updata = (props) => {
    this.provincesApi()
    if (props.defaultSelect) {
      const { defaultSelect } = props
      this.setState({
        provinceid: defaultSelect.provinceid ? defaultSelect.provinceid : 'no',
        cityid: defaultSelect.cityid ? defaultSelect.cityid : 'no',
        areaid: defaultSelect.areaid ? defaultSelect.areaid : 'no',
        smallareaid: defaultSelect.smallareaid ? defaultSelect.smallareaid : 'no',
        disabled: props.disabled
      })
      if (defaultSelect.provinceid) {
        this.citiesApi(defaultSelect.provinceid)
      }
      if (defaultSelect.cityid) {
        this.areasApi(defaultSelect.cityid)
      }
      if (defaultSelect.areaid) {
        this.smallsAreasApi(defaultSelect.areaid)
      }
    }
  }

  provincesApi = () => {
    fecthProvinces().then(res => {
      if (res.data.retCode === '000') {
        this.setState({
          provinceList: res.data.data
        })
      } else {
        console.log(res.data.rtnMsg)
      }
    })
  }

  citiesApi = (provinceid) => {
    fecthCities({
      provinceid
    }).then(res => {
      if (res.data.retCode === '000') {
        this.setState({
          cityList: res.data.data
        })
      } else {
        console.log(res.data.rtnMsg)
      }
    })
  }

  areasApi = (cityid) => {
    fecthAreas({
      cityid
    }).then(res => {
      if (res.data.retCode === '000') {
        this.setState({
          areaList: res.data.data
        })
      } else {
        console.log(res.data.rtnMsg)
      }
    })
  }

  smallsAreasApi = (areaid) => {
    fecthSmallsAreas({
      areaid
    }).then(res => {
      if (res.data.retCode === '000') {
        this.setState({
          smallareaList: res.data.data
        })
      } else {
        console.log(res.data.rtnMsg)
      }
    })
  }

  changeProvince = (provinceid) => {
    this.setState({
      provinceid: provinceid === 'no' ? '' : provinceid,
      cityid: 'no',
      areaid: 'no',
      smallareaid: 'no',
    })
    this.citiesApi(provinceid)
    this.props.selected({
      provinceid,
      cityid: '',
      areaid: '',
      smallareaid: '',
      cityID: '',
      areaID: '',
    })
  }

  changeCity = (cityid) => {
    const city = this.state.cityList.filter(item => item.cityid === cityid)
    const cityID = city.length !== 0 ? city[0].id : ''
    this.setState({
      cityid,
      areaid: 'no',
      smallareaid: 'no',
    })
    this.areasApi(cityid)
    this.props.selected({
      provinceid: this.state.provinceid,
      cityid: cityid === 'no' ? '' : cityid,
      areaid: '',
      smallareaid: '',
      cityID,
    })
  }

  changeArea = (areaid) => {
    const area = this.state.areaList.filter(item => item.areaid === areaid)
    const areaID = area.length !== 0 ? area[0].id : ''
    this.setState({
      areaid,
      smallareaid: 'no',
    })
    this.smallsAreasApi(areaid)
    this.props.selected({
      provinceid: this.state.provinceid,
      cityid: this.state.cityid,
      areaid: areaid === 'no' ? '' : areaid,
      smallareaid: '',
      areaID
    })
  }

  changeSmallArea = (smallareaid) => {
    this.setState({
      smallareaid,
    })
    this.props.selected({
      provinceid: this.state.provinceid,
      cityid: this.state.cityid,
      areaid: this.state.areaid,
      smallareaid: smallareaid === 'no' ? '' : smallareaid,
    })
  }
 
  render() {
    const {
      provinceList = [],
      cityList = [],
      areaList = [],
      smallareaList = [],
      provinceid = 'no',
      cityid = 'no',
      areaid = 'no',
      smallareaid = 'no',
      disabled = false,
    } = this.state
    const {
      className,
      noSmallarea = false,
      search = false,
    } = this.props
    return (
      <div className={`m-selectaddress ${className ? className : ''}`}>
        <Select  
          value={provinceid}
          onChange={this.changeProvince}
          disabled={disabled}
          style={{width: 140}}
        >
          <SelectOption value='no'>{search ? '全部省' : '--省--'}</SelectOption>
          {provinceList.map((item, index) => (
            <SelectOption 
              key={item.id}
              value={item.provinceid}
            >
              {item.province}
            </SelectOption>
          ))  
          }
        </Select>
        <Select 
          value={cityid}
          onChange={this.changeCity}
          disabled={disabled}
          style={{width: 140}}
        >
          <SelectOption value='no'>{search ? '全部市' : '--市--'}</SelectOption>
          {cityList.map((item) => (
            <SelectOption 
              key={item.id}
              value={item.cityid}
            >
              {item.city}
            </SelectOption>
          ))  
          }
        </Select>
        <Select 
          value={areaid}
          onChange={this.changeArea}
          disabled={disabled}
          style={{width: 140}}
        >
          <SelectOption value='no'>{search ? '全部区' : '--区--'}</SelectOption>
          {areaList.map((item) => (
            <SelectOption 
              key={item.id}
              value={item.areaid}
            >
              {item.area}
            </SelectOption>
          ))  
          }
        </Select>
        {!noSmallarea &&
          <Select 
            value={smallareaid}
            onChange={this.changeSmallArea}
            disabled={disabled}
            style={{width: 160}}
          >
            <SelectOption value='no'>{search ? '全部小区' : '--小区--'}</SelectOption>
            {smallareaList.map((item) => (
              <SelectOption 
                key={item.id}
                value={item.id}
              >
                {item.name}
              </SelectOption>
            ))  
            }
          </Select>
        }
      </div>
    )
  }
}
SelectAddress.propTypes = {
  selected: PropTypes.func,
  noSmallarea: PropTypes.bool,
  defaultAddress: PropTypes.objectOf(PropTypes.any),
}

export default SelectAddress