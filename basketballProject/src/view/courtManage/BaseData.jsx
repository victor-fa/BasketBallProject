import React from 'react'
import moment from 'moment'
// import regs from '../../common/js/reg'
import myTool from '../../common/js/tool'
import {
  // Input, 
  Spin,
  InputNumber, 
  TimePicker,
  message,
  Button,
  Empty
} from 'antd'
import {canEditMonth, getErrTImeIndex} from './common'
import Api from '../../server'
import Calendar from './Calendar'

const timeFormat = 'HH:mm'

class BaseData extends React.Component {
  state = {
    isEdit: false,
    canEdit: false,
    delDataList: []
  }

  componentDidMount() {
    const {
      yearMonth = '', 
    } = this.props
    this.getDataList(yearMonth)
    
  }

  //根据年月查对应月的基础数据
  getDataList = async(yearMonth) => {
    this.setState({dataListLoading: true })
    const res = await Api.getMonthSetting({
      stadiumId: this.props.courtId,
      month: yearMonth
    })
    this.setState({dataListLoading: false})
    myTool.getApiData(res, () => {
      this.formatApiDataList(res.data.data, yearMonth)
    })
  }

  formatApiDataList = (arr, yearMonth) => {
    let list = []
    list = myTool.arrAddKey(arr.map(item => {
      let o = {}
      o = {...item}
      const arr = o.time ? o.time.split('-') : false
      o.start = arr ? arr[0] : ''
      o.end = arr ? arr[1] : ''
      return o
    }))
    const canEdit = canEditMonth(yearMonth) || (moment(yearMonth, 'YYYYMMDD').isAfter(moment().add(-1, 'months')) && list.length === 0)
    this.setState({
      dataList: myTool.deepCopy(list),
      initDataList: myTool.deepCopy(list),
      errTImeIndex: getErrTImeIndex(myTool.deepCopy(list)),
      canEdit,
    })
    this.getActiveBaseDataList(arr)
  }

  handleEdit = () => {
    this.setState({
      isEdit: true
    })
  }

  
  getActiveBaseDataList = async(baseList) => {
    let list = []
    const arr = baseList
    list = myTool.arrAddKey(arr.map(item => {
      let o = {}
      const arr = item.time ? item.time.split('-') : false
      o.time = item.time
      o.start = arr ? arr[0] : ''
      o.end = arr ? arr[1] : ''
      o.isBaseData = true
      o.baseQuantity = item.quantity
      o.quantity = item.quantity
      o.price = item.price
      o.id = item.id
      o.basePrice= item.price
      o.soldQuantity = '0'
      return o
    }))
    await this.setState({
      activeBaseDataList: list
    })
    this.setState({
      isShowCalendar: true
    })
  }

  handleCancelEdit = () => {
    if (this.state.dataListLoading) {
      return false
    }
    this.setState({
      isEdit: false,
      dataList: myTool.deepCopy(this.state.initDataList)
    })
  }

  handleSaveEdit = async() => {
    const {
      dataList = [],
      dataListLoading,
      delDataList = [],
    } = this.state
    const {
      yearMonth = '',
      courtId = ''
    } = this.props
    if (dataListLoading) {
      return false
    }
   
    let newList = this.delEmptyDataList(dataList)
    const hasEmpty = newList.some(item => !item.start || !item.end || !item.quantity || !item.price)
    if (hasEmpty) {
      message.info(`场次时间、数量、价格不能为空！`)
      return false
    }
    
    const errTImeIndex = getErrTImeIndex(dataList)

    if (errTImeIndex.length !== 0) {
      message.info(`开始时间必须小于结束时间！`)
      this.setState({
        errTImeIndex,
      })
      return false
    }

    const getParamList = arr => {
      let list = []
      list = arr.map(item => {
        let o = {}
        o.id = item.id
        o.quantity = item.quantity
        o.price = item.price
        o.time = `${item.start}-${item.end}`
        o.status = item.status
        return myTool.delObjVoidKey(o)
      })
      return list
    }

    newList = [...getParamList(newList), ...getParamList(delDataList)]
    this.setState({dataListLoading: true})
    const res = await Api.updateSetting({
      stadiumId: courtId,
      month: yearMonth,
      list: JSON.stringify(newList)
    })
    this.setState({dataListLoading: false})
    myTool.getApiData(res, () => {
      this.getDataList(yearMonth)
      this.setState({
        isEdit: false
      })
    })
    
  }

  delEmptyDataList = (dataList) => {
    return dataList.filter(item => !(!item.start && !item.end && !item.quantity && !item.price))
  }

  getErrTImeIndex = (dataList) => {
    const newList = dataList.filter(item => !(!item.start && !item.end && !item.quantity && !item.price))
    const timeArr = newList.map(item => {
      let i = ''
      i = `${item.start}${item.end}`
      return i
    }) 

    let errTImeIndex = [];
		timeArr.forEach((item, index) => {
      if(timeArr.indexOf(item) !== timeArr.lastIndexOf(item) && errTImeIndex.indexOf(item) === -1) {
        errTImeIndex.push(index);
      }
    })
    return errTImeIndex
  }

  handleDelItme = index => {
    const {
      dataList = [],
      delDataList = [],
      initDataList = []
    } = this.state
    this.setState({
      dataList: dataList.filter((item, i) => i !== index),
    })
    let delItme = dataList.filter((item, i) => i === index)[0]
    const isInitData = initDataList.some(item => item.id === delItme.id)
    if (isInitData) {
      this.setState({
        delDataList: [...delDataList, {...delItme, status: 'D'}] 
      })
    }
   
  }

  handleAddItme = index => {
    const newList = [...this.state.dataList]
    newList.splice(index + 1, 0, {
      key: Math.random(),
      start: null,
      end: null
    })
    this.setState({
      dataList: newList,
    })
  }

  changeTimeInput = (v, index, isStart) => {
    const newList = [...this.state.dataList]
    let time = v.format(timeFormat)
    newList[index][`${isStart ? 'start' : 'end'}`] = time
    const errTImeIndex = getErrTImeIndex(newList)
    this.setState({
      dataList: newList,
      errTImeIndex,
    })
  }

  changeNum = (value, index) => {
    const newList = [...this.state.dataList]
    newList[index].quantity = value
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

  releasePlan = () => {
    this.setState({
      isEdit: true,
      dataList: [
        {key: '1'},
        {key: '2'},
        {key: '3'},
        {key: '4'},
        {key: '5'},
      ]
    })

  }

  copyPrevMonthData = async() => {
    const {
      yearMonth = '',
      courtId = ''
    } = this.props
    this.setState({dataListLoading: true })
    const res = await Api.copyMonthSetting({
      stadiumId: courtId,
      month: moment(yearMonth, 'YYYYMM').add(-1, 'months').format('YYYYMM')
    })
    this.setState({dataListLoading: false})
    myTool.getApiData(res, () => {
      let list = res.data.data
      if (list.length === 0) {
        message.info(`上个月没有基础数据！`)
        return false
      }
      this.formatApiDataList(list, yearMonth)
    })

  }

  render() {
    const {
      dataList = [],
      isEdit,
      errTImeIndex = [],
      canEdit,
      dataListLoading = false,
      activeBaseDataList = [],
      isShowCalendar = false,
    } = this.state
    const {
      yearMonth,
      isActive = false,
      activeIndex = 0,
      courtId
    } = this.props
    return (
      <div 
        className={`m-baseData ${isActive ? 'active' : ''}`}
        onClick={this.props.onClick}
      >
        <div className="topBox">
          <span className='data'>{moment(yearMonth, 'YYYYMM').format('YYYY/MM')}</span>
          {canEdit &&
            <div className='btnBox'>
              {isEdit ?
                <React.Fragment>
                  <span className="btn-text gray" onClick={this.handleCancelEdit}>取消</span>
                  <span className="btn-text" onClick={this.handleSaveEdit}>保存</span>
                </React.Fragment> :
                <React.Fragment>
                  {dataList.length !== 0 &&
                    <span className='btn-text' onClick={this.handleEdit}>编辑</span>
                  }
                </React.Fragment>
              }
            </div>
          }
        </div>
        <div className="thead">
          <div className="tr">
            <div className="td td1">场次时间</div>
            <div className="td td2">数量(半场)</div>
            <div className="td td3">价格(元)</div>
          </div>
        </div>
        <div className={`tbody ${isEdit ? 'isEdit' : ''}`}>
        <Spin spinning={dataListLoading}>
        {dataList.length === 0 ?
          <React.Fragment>
            {!isEdit &&
              <React.Fragment>
              {canEdit ?
                <div className='noDataBox'>
                  <Button
                    size='large'
                    onClick={this.releasePlan}
                    loading={dataListLoading}
                  >发布场地销售计划</Button>
                  {yearMonth !== moment().format('YYYYMM') &&
                    <Button 
                      type='primary' 
                      size='large'
                      loading={dataListLoading}
                      onClick={this.copyPrevMonthData}
                    >复制发布上月计划</Button>
                  }
                  
                </div> : 
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </React.Fragment>
            }
          </React.Fragment>
           :
          <React.Fragment>
          {dataList.map((item, index) => {
            let hasTimeErr = (item.start || item.end) && (item.start === item.end)
            if (errTImeIndex.indexOf(index) !== -1) {
              hasTimeErr = true
            }
            return (
            <div
              className='tr'
              key={item.key}
            >
              <div className="td td1">
                {isEdit ?
                  <React.Fragment>
                    <div 
                      className={`timeInput ${hasTimeErr ? 'hasErr' : ''}`}
                    >
                      <TimePicker 
                        className='f-left'
                        value={item.start ? moment(item.start, timeFormat) : null}
                        format={timeFormat}
                        placeholder=''
                        onChange={e => this.changeTimeInput(e, index, true)}
                        allowClear={false}
                        minuteStep={5}
                      />
                      <TimePicker 
                        className='f-right'
                        value={item.end ? moment(item.end, timeFormat) : null}
                        format={timeFormat}
                        placeholder=''
                        onChange={e => this.changeTimeInput(e, index)}
                        allowClear={false}
                        minuteStep={5}
                      />
                      <span className='icon'>-</span>
                    </div>
                  </React.Fragment> :
                  <React.Fragment>{item.start} - {item.end}</React.Fragment>
                }
              </div>
              <div className="td td2">
                {isEdit ?
                  <InputNumber
                    value={item.quantity}
                    size='large'
                    min={1}
                    precision={0}
                    onChange={v => this.changeNum(v, index)}
                  /> :
                  <React.Fragment>{item.quantity}</React.Fragment>
                }
              </div>
              <div className="td td3">
                {isEdit ?
                  <InputNumber
                    value={item.price}
                    size='large'
                    min={0.1}
                    precision={1}
                    step={0.5}
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
                    <React.Fragment><i 
                      className='iconfont red'
                      onClick={() => this.handleDelItme(index)}
                    >&#xe633;</i> <br /></React.Fragment>
                  </div>
                </div>
              }
            </div>
          )})}
          </React.Fragment>
          }
        </Spin>
        </div>
        {isActive && 
          <div className="monthDetail-wrap">
            <div className={`arrow shift${activeIndex}`}></div>
            <div className='calendar-box'>
              <div className="title">{moment(yearMonth, 'YYYYMM').format('YYYY/MM')} 详情</div>
              {isShowCalendar &&
                <Calendar 
                  yearMonth={yearMonth}
                  activeDate={this.changeAcvieDate}
                  courtId={courtId}
                  activeBaseDataList={activeBaseDataList}
                />
              }
              <div className="tips-box">
                <span className='text-l'>注：</span>
                <div className="text-list">
                  <p>
                    <span className='courtGreen'></span>
                    绿色表示全天目前无订单
                  </p>
                  <p>
                    <span className='courtOrange'></span>
                    绿色表示全天有个别场次目前无订单
                  </p>
                  <p>
                    <span className='courtCyan'></span>
                    青色表示在售日期
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default BaseData
