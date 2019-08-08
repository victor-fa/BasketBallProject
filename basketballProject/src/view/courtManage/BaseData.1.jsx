import React from 'react'
import moment from 'moment'
import regs from '../../common/js/reg'
import {Input, InputNumber} from 'antd'

class BaseData extends React.Component {
  state = {
    isEdit: false,
  }

  componentDidMount() {
    const {
      yearMonth = ''
    } = this.props
    this.getDataList(yearMonth)
  }

  //根据年月查对应月的基础数据
  getDataList = async(data) => {
    console.log(data)
    let dataList = [
      {time: '8:00 - 10:00', start: '8:00', end: '10:00', num: '12', price: '120'},
      {time: '10:00 - 12:00', start: '10:00', end: '12:00', num: '12', price: '120'},
      {time: '13:00 - 15:00', start: '13:00', end: '15:00', num: '12', price: '120'},
      {time: '15:00 - 17:00', start: '15:00', end: '17:00', num: '12', price: '120'},
      {time: '19:00 - 21:00', start: '19:00', end: '21:00', num: '12', price: '120'},
    ]
    dataList = dataList.map(item => {
      let o = {...item}
      o.key = o.time
      return o
    })
    this.setState({
      dataList,
      initDataList: dataList,
    })
  }

  handleEdit = () => {
    this.setState({
      isEdit: true
    })
  }

  handleCancelEdit = () => {
    this.setState({
      isEdit: false,
      dataList: this.state.initDataList
    })
  }

  handleSaveEdit = async() => {
    this.setState({
      isEdit: false
    })
  }

  handleDelItme = index => {
    this.setState({
      dataList: [...this.state.dataList].filter((item, i) => i !== index)
    })
  }

  handleAddItme = index => {
    const newList = [...this.state.dataList]
    newList.splice(index + 1, 0, {key: Math.random()})
    console.log(newList)
    this.setState({
      dataList: newList,
    })
  }

  changeTimeInput = (e, index, isStart) => {
    const newList = [...this.state.dataList]
    let time = e.target.value.replace(regs.regNumber, '')
    newList[index][`${isStart ? 'start' : 'end'}`] = time
    this.setState({
      dataList: newList
    })
  }

  blurTimeInput = (e, index, isStart) => {
    let time = e.target.value.replace(regs.regNumber, '')
    const tLength = time.length
    if (tLength === 0) {
      return false
    }
    if (tLength !== 4 && tLength > 0){
      const addNum = 4 - tLength
      time = `${time}${addNum === 3 ? '000' : ''}${addNum === 2 ? '00' : ''}${addNum === 1 ? '0' : ''}`
    }
    //小时不能大于23，分钟不能大于59
    const timeArr = time.split('')
    let hh = `${timeArr[0]}${timeArr[1]}`
    let mm = `${timeArr[2]}${timeArr[3]}`
    if (Number(hh) > 23) {
      hh = '23'
    }
    if (Number(mm) > 59) {
      mm = '59'
    }
    time = `${hh}${mm}`
    time = time.split('')
    time.splice(2, 0, ':')
    time = time.join('')
    const newList = [...this.state.dataList]
    newList[index][`${isStart ? 'start' : 'end'}`] = time
    this.setState({
      dataList: newList
    })
  }

  changeNum = (value, index) => {
    const newList = [...this.state.dataList]
    newList[index].num = value
    this.setState({
      dataList: newList
    })
  }

  changePrice = (value, index) => {
    const newList = [...this.state.dataList]
    newList[index].price = value
    this.setState({
      dataList: newList
    })
  }

  render() {
    const {
      dataList = [],
      isEdit,
    } = this.state
    const {
      yearMonth,
      isActive = false,
    } = this.props
    return (
      <div className={`m-baseData ${isActive ? 'active' : ''}`}>
        <div className="topBox">
          {isEdit &&
            <div className="tip">时间输入格式如：0830、1200</div>
          }
          <span className='data'>{moment(yearMonth, 'YYYYMM').format('YYYY/MM')}</span>
          <div className='btnBox'>
            {isEdit ?
              <React.Fragment>
                <span className="btn-text gray" onClick={this.handleCancelEdit}>取消</span>
                <span className="btn-text" onClick={this.handleSaveEdit}>保存</span>
              </React.Fragment> :
              <span className='btn-text' onClick={this.handleEdit}>编辑</span>
            }
          </div>
        </div>
        <div className="thead">
          <div className="tr">
            <div className="td td1">场次时间</div>
            <div className="td td2">数量(半场)</div>
            <div className="td td3">价格(元)</div>
          </div>
        </div>
        <div className={`tbody ${isEdit ? 'isEdit' : ''}`}>
          {dataList.map((item, index) => (
            <div
              className='tr'
              key={item.key}
            >
              <div className="td td1">
                {isEdit ?
                  <React.Fragment>
                    <div 
                      className='timeInput'
                    >
                      <Input 
                        value={item.start}
                        onChange={e => this.changeTimeInput(e, index, true)}
                        maxLength={4}
                        onBlur={e => this.blurTimeInput(e, index, true)}
                      />
                      <span className='icon'>-</span>
                      <Input 
                        value={item.end}
                        onChange={e => this.changeTimeInput(e, index)}
                        maxLength={4}
                        onBlur={e => this.blurTimeInput(e, index)}
                      />
                    </div>
                  </React.Fragment> :
                  <React.Fragment>{item.time}</React.Fragment>
                }
              </div>
              <div className="td td2">
                {isEdit ?
                  <InputNumber
                    value={item.num}
                    size='large'
                    min={1}
                    precision={0}
                    onChange={v => this.changeNum(v, index)}
                  /> :
                  <React.Fragment>{item.num}</React.Fragment>
                }
              </div>
              <div className="td td3">
                {isEdit ?
                  <InputNumber
                    value={item.price}
                    size='large'
                    min={1}
                    precision={0}
                    onChange={v => this.changePrice(v, index)}
                  /> :
                  <React.Fragment>{item.price}</React.Fragment>
                }
              </div>
              {isEdit &&
                <div className='btnBox'>
                  <div>
                    <i
                      onClick={() => this.handleAddItme(index)}
                      className='iconfont green'
                    >&#xe632;</i>
                    {dataList.length !== 1 &&
                    <React.Fragment><i 
                      className='iconfont red'
                      onClick={() => this.handleDelItme(index)}
                    >&#xe633;</i> <br /></React.Fragment>
                    }
                  </div>
                </div>
              }
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default BaseData
