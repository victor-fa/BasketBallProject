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
  Empty,
  Modal
} from 'antd'
import {canEditDay, isSaleDate, getErrTImeIndex} from './common'
import Api from '../../server'


const timeFormat = 'HH:mm'

class DayData extends React.Component {
  state = {
    isEdit: false,
    canEdit: false
  }

  componentDidMount() {
    this.getDataList(this.props)
    this.setState({
      canEdit: canEditDay(this.props.activeDay)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeDay !== nextProps.activeDay || this.props.activeBaseDataList !== nextProps.activeBaseDataList) {
      this.getDataList(nextProps)
      this.setState({
        canEdit: canEditDay(nextProps.activeDay),
        isEdit: false
      })
    }
  }

  //根据年月查对应月的基础数据
  getDataList = async(props) => {
    const {
      activeDay,
      activeBaseDataList = []
    } = props
    if (!props.activeDay) {
      return false
    }
    const getList = arr => {
      const resList = this.formatApiDataList(arr)
      let baseList = []
      baseList = activeBaseDataList.map(item => {
        let o = {}
        o = {...item}
        resList.forEach(itemR => {
          if (itemR.time === item.time) {
            o.id = itemR.id
            o.quantity = itemR.quantity
            o.price = itemR.price
            o.soldQuantity = itemR.soldQuantity
            o.noOrder = itemR.type === 'N'
            o.isBe = true
          }
        })
        return o
      })
      let newList = []
    
      newList = resList.filter(item => !baseList.some(i => i.time === item.time))

      newList = newList.map(item => {
        let o = {}
        o = item
        o.noOrder = item.type === 'N'
        return o
      })
      list = [...baseList, ...newList]                                                                                                                                                  
      list = list.map(item => {
        let o = {}
        o = item
        if (o.isBaseData && !o.isBe) {
          o.isDel = true
        }
        return o
      })


      return list
    }
    let list = []
    this.setState({dataListLoading: true })
    const res = await Api.getMonthDay({
      stadiumId: this.props.courtId,
      month: moment(activeDay, 'YYYYMMDD').format('YYYYMM'),
      day: moment(activeDay, 'YYYYMMDD').format('YYYY-MM-DD')
    })
    this.setState({dataListLoading: false })
    myTool.getApiData(res, () => {
      list = getList(res.data.data)
    })
    this.setState({
      dataList: myTool.deepCopy(list),
      initDataList: myTool.deepCopy(list),
      errTImeIndex: getErrTImeIndex(myTool.deepCopy(list))
    })
  }

  formatApiDataList = arr => {
    let list = []
    list = myTool.arrAddKey(arr.map(item => {
      let o = {}
      o = {...item}
      const arr = o.time ? o.time.split('-') : false
      o.start = arr ? arr[0] : ''
      o.end = arr ? arr[1] : ''
      return o
    }))
    return list
  }

  handleEdit = async() => {
    const {
      activeDay = ''
    } = this.props
    this.setState({
      delList: []
    })
    const offApi = () => {
      this.changeStatusApi(false, () => {
        this.setState({
          isEdit: true
        })
      })
    }
    if (isSaleDate(activeDay)) {
      Modal.confirm({
        title: '提示',
        content: <p style={{fontSize: '16px'}}>上架状态的场次编辑需先下架，您是否确认下架编辑？</p>,
        onOk: () => offApi()
      })
    } else {
      this.setState({
        isEdit: true
      })
    }
  }

  changeStatusApi = async(isOn, callback) => {
    this.setState({dataListLoading: true})
    const {
      activeDay = '',
      courtId = ''
    } = this.props
    const res = await Api.setStadiumDetailStatus({
      stadiumId: courtId,
      month: moment(activeDay, 'YYYYMMDD').format('YYYYMM'),
      day: moment(activeDay, 'YYYYMMDD').format('YYYY-MM-DD'),
      status: isOn ? 'Y' : 'N'
    })
    this.setState({dataListLoading: false})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      callback()
    })
  }

  handleCancelEdit = () => {
    const {
      activeDay = ''
    } = this.props
    if (isSaleDate(activeDay)) {
      this.changeStatusApi(true, () => {
        this.setState({
          isEdit: false,
          dataList: myTool.deepCopy(this.state.initDataList)
        })
      })
    } else {
      this.setState({
        isEdit: false,
        dataList: myTool.deepCopy(this.state.initDataList)
      })
    }
    
  }

  handleSaveEdit = async() => {
    const {
      dataList = [],
      delList = []
    } = this.state
    const {
      activeDay = '',
      courtId
    } = this.props
 
    let newList = this.delEmptyDataList(dataList)
    newList = newList.filter(item => !item.isDel)
    const hasEmpty = newList.some(item => !item.start || !item.end || !item.quantity || !item.price)
    if (hasEmpty) {
      message.info(`场次时间、数量、价格不能为空！`)
      return false
    }
    
    const errTImeIndex = getErrTImeIndex(dataList)

    if (errTImeIndex.length !== 0) {
      message.info(`开始时间必须小于结束时间`)
      this.setState({
        errTImeIndex,
      })
      return false
    }
    newList = newList.map(item => {
      let o = {}
      o.time = `${item.start}-${item.end}`
      o.quantity = item.quantity
      o.price = item.price
      o.status = 'Y'
      o.stadiumId = courtId
      o.month = moment(activeDay, 'YYYYMMDD').format('YYYYMM')
      o.day = moment(activeDay, 'YYYYMMDD').format('YYYY-MM-DD')
      if (!item.isAdd) {
        o.id = item.id
      }

      return o
    })
    const newDelList = delList.map(item => {
      let o = {}
      o.id = item.id
      o.time = `${item.start}-${item.end}`
      o.quantity = item.quantity
      o.price = item.price
      o.stadiumId = courtId
      o.month = moment(activeDay, 'YYYYMMDD').format('YYYYMM')
      o.day = moment(activeDay, 'YYYYMMDD').format('YYYY-MM-DD')
      o.status = 'D'
      return o
    })
    newList = [...newList, ...newDelList]
    this.setState({dataListLoading: true})
    const res = await Api.updateStadiumDetail({list: JSON.stringify(newList)})
    this.setState({dataListLoading: false})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.getDataList(this.props)
      this.setState({
        errTImeIndex: [],
        isEdit: false
      })
    })
    
  }

  delEmptyDataList = (dataList) => {
    return dataList.filter(item => !(!item.start && !item.end && !item.quantity && !item.price))
  }



  handleDelItme = index => {
    const {
      dataList = [],
      delList = []
    } = this.state
    let newList = [...dataList]
    let newDelList = []
    if (dataList[index].isBaseData) {
      newList[index].isDel = true
    } else {
      newList = newList.filter((item, i) => i !== index)
    }
    if (!dataList[index].isAdd) {
      newDelList = [...delList, dataList.filter((item, i) => i === index)[0]]
      this.setState({
        delList: newDelList
      })
    }
    this.setState({
      dataList: newList
    })
  }

  handleAddItme = index => {
    const newList = [...this.state.dataList]
    newList.splice(index + 1, 0, {
      key: Math.random(),
      start: null,
      end: null,
      isAdd: true,
      soldQuantity: ' ',
      noOrder: true
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

  changeQuantity = (value, index) => {
    const newList = [...this.state.dataList]
    newList[index].quantity = value.toString()
    this.setState({
      dataList: newList
    })
  }

  changePrice = (value, index) => {
    const newList = [...this.state.dataList]
    newList[index].price = value.toString()
    this.setState({
      dataList: newList
    })
  }

  releasePlan = () => {
    this.setState({
      isEdit: true,
      dataList: [
        {key: '1', isAdd: true, soldQuantity: ' '},
        {key: '2', isAdd: true, soldQuantity: ' '},
        {key: '3', isAdd: true, soldQuantity: ' '},
        {key: '4', isAdd: true, soldQuantity: ' '},
        {key: '5', isAdd: true, soldQuantity: ' '},
      ]
    })
  }

  render() {
    const {
      dataList = [],
      isEdit,
      errTImeIndex = [],
      canEdit,
      dataListLoading = false,
    } = this.state
    const {
      activeDay = moment().format('YYYYMMDD'),
      isActive = false,
    } = this.props
    return (
      <div 
        className={`m-dayData ${isActive ? 'active' : ''}`}
        onClick={this.props.onClick}
      >
        <div className="topBox">
          <span className='data'>{moment(activeDay, 'YYYYMMDD').format('YYYY/MM/DD')}</span>
          {canEdit &&
            <div className='btnBox'>
              {isEdit ?
                <React.Fragment>
                  <span className="btn-text gray" onClick={this.handleCancelEdit}>取消</span>
                  <span className="btn-text" onClick={this.handleSaveEdit}>保存</span>
                </React.Fragment> :
                <React.Fragment>
                  {dataList.length > 0 && 
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
            <div className="td td4">已售场次数量</div>
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
                </div> : 
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </React.Fragment>
            }
          </React.Fragment>
           :
          <React.Fragment>
          {dataList.map((item, index) => {
            const soldQuantity = Number(dataList[index].soldQuantity)
            const minQuantity = item.noOrder || item.isAdd ? 1 : soldQuantity === 0 ? 1 : soldQuantity
            let hasTimeErr = (item.start || item.end) && (item.start === item.end)
            if (errTImeIndex.indexOf(index) !== -1) {
              hasTimeErr = true
            }
            return (
            <div
              className={`tr ${item.isDel ? 'del' : ''} ${(!item.isBaseData || item.isActive) ? 'newData' : ''}`}
              key={item.key}
            >
              {item.isDel &&
                <div className='delLine'></div>
              }
              <div className="td td1">
                {isEdit && (item.isAdd || item.noOrder) && !item.isDel ?
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
                  <span className='t-text'>{item.start} - {item.end}</span>
                }
                {item.noOrder && !item.isAdd &&
                  <div className='noOrderIcon'></div>
                }
              </div>
              <div className="td td4">{item.soldQuantity}</div>
              <div className={`td td2 ${item.isBaseData && item.baseQuantity !== item.quantity ? 'red' : ''}`}>
                {isEdit && (!item.isDel || !item.isBaseData) &&
                  <InputNumber
                    value={item.quantity}
                    size='large'
                    min={minQuantity}
                    precision={0}
                    onChange={v => this.changeQuantity(v, index)}
                  />
                }
                {(!isEdit || item.isDel) &&
                 <span className='t-text'>{item.quantity}</span>
                }
              </div>
              <div className={`td td3 ${item.isBaseData && item.basePrice !== item.price ? 'red' : ''}`}>
                {isEdit && (!item.isDel || !item.isBaseData) && item.noOrder &&
                  <InputNumber
                    value={item.price}
                    size='large'
                    min={0.1}
                    precision={1}
                    step={0.5}
                    onChange={v => this.changePrice(v, index)}
                  />
                }
                {(!isEdit || item.isDel || !item.noOrder) &&
                 <span className='t-text'>{item.price}</span>
                }
              </div>
              {isEdit &&
                <div className='btnBox'>
                  <div>
                    <i
                      onClick={() => this.handleAddItme(index)}
                      className='iconfont green'
                    >&#xe632;</i>
                    {(!item.isDel || item.isAdd) && item.noOrder &&
                      <React.Fragment><i 
                        className='iconfont red'
                        onClick={() => this.handleDelItme(index)}
                      >&#xe633;</i> <br /></React.Fragment>
                    }
                    
                  </div>
                </div>
              }
            </div>
          )})}
          </React.Fragment>
          }
        </Spin>
        </div>
      </div>
    )
  }
}

export default DayData
