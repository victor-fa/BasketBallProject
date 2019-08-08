import React from 'react'
import moment from 'moment'
import Api from '../../server';
import myTool from '../../common/js/tool'
import {isSaleDate} from './common'
import DayData from './DayData'

class Calendar extends React.Component {

  state = {
    dateList : []
  }

  componentDidMount() {
    const {
      yearMonth = ''
    } = this.props
   this.getDateList(yearMonth)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.yearMonth !== nextProps.yearMonth) {
      this.getDateList(nextProps.yearMonth)
    }
  }

  //根据props.yerarMonth获取化日历列表
  getDateList = async(yearMonth,) => {

    const {
      courtId,
    } = this.props

    const dayNum = moment(yearMonth, 'YYYYMM').daysInMonth()
    
    let dateList = []

    //当前月
    for (let i = 0; i < dayNum; i++) {
      const date = `${yearMonth}${i < 9 ? '0' : ''}${i + 1}`
      dateList.push({
        num: (i + 1).toString(),
        date,
        key: Math.random() + date,
        isSaleDay: isSaleDate(date),
        isCurrentMonth: true,
      })
    }

    //上个月日期补位
    const getPrevDateList = (yearMonth) => {
      const prevDateList = []
      let prevAddNum = moment(`${yearMonth}01`, 'YYYYMMDD').weekday() 
      if (prevAddNum > 0) {
        const startDay = moment(`${yearMonth}01`, 'YYYYMMDD').subtract(prevAddNum, 'days')
        const endDay = moment(`${yearMonth}01`, 'YYYYMMDD').subtract(1, 'days')
        const startDayNum = moment(startDay).format('D')
        const endDayNum = moment(endDay).format('D')
  
        for (let i = startDayNum; i <= endDayNum; i++) {
          const date = `${startDay.format('YYYYMM')}${i}`
          prevDateList.push({
            num: i.toString(),
            date,
            key: Math.random() + date,
            isSaleDay: isSaleDate(date),
            isCurrentMonth: false,
          })
        }
      }
     
      return prevDateList
    }

    const prevDateList = getPrevDateList(yearMonth)
    dateList = [...prevDateList, ...dateList]

    //下个月日期补位
    const getNextDateList = (yearMonth) => {
      let nextDateList = []
      const nextAddNum = 42 - dateList.length
      for (let i = 1; i <= nextAddNum; i++) {
        const date = `${moment(yearMonth, 'YYYYMM').add(1, 'months').format('YYYYMM')}${i < 10 ? '0' : ''}${i}`
        nextDateList.push({
          num: i.toString(),
          date,
          key: Math.random() + date,
          isSaleDay: isSaleDate(date),
          isCurrentMonth: false,
        })
      }
      return nextDateList
    }

    const nextDateList = getNextDateList(yearMonth)
    dateList = [...dateList, ...nextDateList]
    let activeDate = dateList.some(item => item.date === moment().format('YYYYMMDD')) ? moment().format('YYYYMMDD') : `${yearMonth}01`
    activeDate = dateList.filter(i => i.date === activeDate)[0].isCurrentMonth ? activeDate : `${yearMonth}01`

    //订单情况
    const res = await Api.getMonthStadiumDetail({
      stadiumId: courtId,
      month: yearMonth,
    })
    myTool.getApiData(res, () => {
      const orderList = res.data.data.map(item => {
        let o = {}
        o.date = moment(item.day, 'YYYY-MM-DD').format('YYYYMMDD')
        o.hasOrder = item.type
        return o
      })

      dateList = dateList.map(item => {
        let o = {}
        o = item
        orderList.forEach(itemO => {
          if(o.date === itemO.date && moment(o.date, 'YYYYMMDD').isBefore(moment().add(31, 'days'))) {
            o.hasOrder = itemO.hasOrder
          }
        })
        return o
      })
      this.setState({
        dateList,
        activeDate,
      })
    })
  }

  changeActiveDate = (activeDate, isCurrentMonth) => {
    if (!isCurrentMonth) {
      return false
    }
    if (activeDate === this.state.activeDate) {
      return false
    }
    this.setState({
      activeDate
    })
  }

  render() {
   
    const {
      showCalendarClass = false,
      courtId = '',
      activeBaseDataList = []
    } = this.props
    const {
      dateList = [],
      activeDate,
    } = this.state
    return (
      <div 
        className={`m-Calendar-card ${showCalendarClass ? 'show' : ''}`}
      >
        {weekList.map(item => (
          <div 
            className='date-box cal-head'
            key={item.key}
          >
            {item.name}
          </div>
        ))}
        {dateList.map(item => (
          <div
            className={`date-box cal-item 
              ${item.isSaleDay && item.date !== moment().format('YYYYMMDD') ? 'isSaleDay' : ''} 
              ${item.isCurrentMonth ? 'isCurrentMonth' : ''} 
              ${(!item.isCurrentMonth && item.isSaleDay) ? 'isOtherMonthSaleDay' : ''}
              ${item.date === activeDate ? 'active' : ''}`
            }
            onClick={() => this.changeActiveDate(item.date, item.isCurrentMonth)}
            key={item.key}
          >
            <span className='num'>{item.date === moment().format('YYYYMMDD') ? '今天' : item.num}</span>
            {item.date === activeDate &&
              <div className="active"></div>
            }
            {item.hasOrder === 'N' && item.isSaleDay &&
              <div className="min-iocn noOrder"></div>
            }
            {item.hasOrder === 'Y' && item.isSaleDay &&
              <div className="min-iocn partNoOrder"></div>
            }
          </div>
        ))}
         <DayData 
          activeDay={activeDate}
          courtId={courtId}
          activeBaseDataList={activeBaseDataList}
        />
      </div>
    )
  }
}

const weekList = [
  {key: '1', name: '一'},
  {key: '2', name: '二'},
  {key: '3', name: '三'},
  {key: '4', name: '四'},
  {key: '5', name: '五'},
  {key: '6', name: '六'},
  {key: '7', name: '日'},
]

export default Calendar