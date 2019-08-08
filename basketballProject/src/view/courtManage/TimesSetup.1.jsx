import React from 'react'
import {Input, Icon} from 'antd'
import Calendar from './Calendar'

class CalendarInput extends React.Component {
  state = {
    showCalendar: false,
    showCalendarClass: false
  }

  changeShowCard = () => {
    this.setState({
      showCalendar: !this.state.showCalendar
    })
    this.timer(!this.state.showCalendar)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  timer = (isShow) => {
    setTimeout(() => {
      this.setState({
        showCalendarClass: isShow
      })
    }, 5);
  }

  closeCard = () => {
    this.setState({
      showCalendarClass: false,
      showCalendar: false
    })
  }

  render() {
    const {
      showCalendar,
      showCalendarClass
    } = this.state
    return (
      <div className='m-Calendar'>
        <Input 
          className='m-CalendarInput'
          placeholder='选择关闭日期'
          suffix={<Icon type="calendar" className='input-icon' />}
          onClick={this.changeShowCard}
        />
        {showCalendar &&
          <React.Fragment>
            <div className='mark'
              onClick={this.closeCard}
            >
            </div>
            <Calendar 
              showCalendarClass={showCalendarClass}
            />
          </React.Fragment>
        }
      </div>
    )
  }
}

export default CalendarInput
