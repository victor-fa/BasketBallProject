import React from 'react'
import { Breadcrumb } from "antd";
import {Link} from 'react-router-dom'
import BaseData from './BaseData'
import HasReturnTitle from '../../components/hasReturnTitle'
import moment from 'moment'

const prevPage = '/courtManage/courtList'

class CourtSetup extends React.Component {
  state = {
    monthList: [],
    activeIndex: 0,
    activeBaseDataList: [],
    updateDetialFlag: 0
  }

  componentWillMount() {
    const data = this.props.location.query
    if (!data) {
      this.props.history.push(prevPage)
      return false
    }
    const courtId = this.props.match.params.id
    this.setState({
      courtId,
      courtName: data.name
    })
  }

  componentDidMount() {
    const monthList = [moment().format('YYYYMM'), moment().add(1, 'months').format('YYYYMM'), moment().add(2, 'months').format('YYYYMM')]
    this.setState({
      monthList,
    })
  }



  moveMonth = isPrev => {
    const {
      monthList = [],
    } = this.state
    let newList = [...monthList]
    let activeIndex = 0
    if (isPrev) {
      newList.pop()
      newList = [moment(newList[0], 'YYYYMM').add(-1, 'months').format('YYYYMM'), ...newList]
      activeIndex = 0
    } else {
      newList.shift()
      newList = [ ...newList, moment(newList[1], 'YYYYMM').add(1, 'months').format('YYYYMM')]
      activeIndex = 2
    }
    this.setState({
      activeIndex,
      monthList: newList
    })
  }

  changeActive = index => {
    if (this.state.activeIndex === index) {
      return false
    }
    this.setState({
      activeIndex: index
    })
  }
  render() {
    const {
      courtName = '球场名称',
      monthList = [],
      activeIndex,
      courtId = '',
    } = this.state
    return (
      <React.Fragment>
         <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={prevPage}>球场管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>场地设置</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap m-courtSetup'>
          <div className='baseData-wrap'>
            <div className="movebtn">
              <HasReturnTitle 
                returnPath={prevPage}
                title={courtName}
              />
              <span className='btn-text' onClick={() => this.moveMonth(true)}>前移一月</span>
              <span className='btn-text' onClick={() => this.moveMonth()}>后移一月</span>
            </div>
            <div className='baseData-box'>
              {monthList.map((item, index) => (
                <BaseData 
                  key={item}
                  isActive={activeIndex === index}
                  activeIndex={activeIndex}
                  yearMonth={item}
                  courtId={courtId}
                  onClick={() => this.changeActive(index)}
                  updateDetial={this.updateDetial}
                />
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default CourtSetup
