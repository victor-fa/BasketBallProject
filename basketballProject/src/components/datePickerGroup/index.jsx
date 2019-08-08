//有按钮的时间选择组件，用于筛选框
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Button } from 'antd'
import moment from 'moment'
import './index.scss'

const { RangePicker } = DatePicker

export const dateFormat = 'YYYY-MM-DD HH:mm'

export const defaultDateState = {
  startTime: moment().startOf('d'),
  endTime: moment().endOf('d'),
  activeBtnKey: 1,
}

const btnList = [
  {
    key: 1,
    name: '今天',
  },
  {
    key: 2,
    name: '昨天',
  },
  {
    key: 3,
    name: '最近7天',
  },
  {
    key: 4,
    name: '最近30天',
  },
]

class DatePickerGroup extends Component {

  onChange = (value) => {
    this.props.selectedDate(value[0], value[1], '',)
  }

  selectDate = (datakey) => {
    switch (datakey) {
      case 1:
        setTimeout(()=>{
          const startTime = moment().startOf('d'),
          endTime = moment().endOf('d')
          this.props.selectedDate(startTime, endTime, datakey)
        }, 0);  
      break;
      case 2:
        setTimeout(()=>{
          const startTime = moment().subtract('1','d').startOf('d'),
          endTime = moment().subtract('1','d').endOf('d')
          this.props.selectedDate(startTime, endTime, datakey)
        }, 0);  
      break;
      case 3:
        setTimeout(()=>{
          const startTime = moment().subtract('7','d').startOf('d'),
          endTime = moment().endOf('d')
          this.props.selectedDate(startTime, endTime, datakey)
        }, 0); 
      break;
      case 4:
        setTimeout(()=>{
          const startTime = moment().subtract('30','d').startOf('d'),
          endTime = moment().endOf('d')
          this.props.selectedDate(startTime, endTime, datakey)
        }, 0); 
      break;
      default:
    }
  }
  
  render () {
    return (
      <React.Fragment>
         <RangePicker
          format={dateFormat}
          value={[this.props.startTime, this.props.endTime]}
          onChange={this.onChange}
        />
        <div className='m-datapicker-btn'>
          {btnList.map(item => (
            <Button 
              key={item.key}
              onClick={() => this.selectDate(item.key)}
              type={this.props.activeBtnKey === item.key ? 'primary' : 'default'}
            >
              {item.name}
            </Button>
          ))

          }
        </div>
      </React.Fragment>
    )
  }
}
DatePickerGroup.propTypes = {
  selectedDate: PropTypes.func
}

export default DatePickerGroup