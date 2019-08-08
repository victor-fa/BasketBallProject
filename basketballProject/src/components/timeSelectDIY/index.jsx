//有按钮的时间选择组件，用于筛选框
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import {regNumber} from '../../common/js/reg'


class TimeSelectDIY extends Component {
  constructor (props) {
    super(props)
    this.state = {
      optionList: [],
      DIY: false
    }
  }

  componentDidMount() {
    this.updata(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.updata(nextProps)
    }
  }

  updata = (props) => {
    if (props.value) {
      if (props.optionList.filter(item => item.value === props.value).length === 0) {
        this.setState({
          inputValue: props.value,
          DIY: true,
        })
      } else {
        this.setState({
          diyValue: props.value ? props.value : 0
        })
      }
    } else {
      this.setState({
        diyValue: 0,
        inputValue: ''
      })
    }
  }
 
  render () {
    const { diyValue = 0, inputValue = '', DIY } = this.state
    const { onChange, optionList } = this.props
    return (
      <div className='m-diyselect-time'>
        {optionList.map(item => (
          <span 
            key={item.value}
            onClick={() => {
              let _value = 0
              if (diyValue === item.value) {
                _value = 0
              } else {
                _value = item.value
              }
              this.setState({
                diyValue: _value,
                DIY: false,
              })
              onChange(_value)
            }}
            className={`btn ${diyValue === item.value ? 'primary' : 'default'}`}
          >
            {item.label}
          </span>
        ))
        }
        <React.Fragment>
          <input 
            className={`diy-text ${DIY ? 'active' : ''}`}
            type='text' 
            value={inputValue}
            onClick={() => {
              onChange(0)
              this.setState({
                diyValue: 0,
                DIY: true,
              })
            }}
            onChange={(e) => {
              const value = Number(e.target.value.replace(regNumber, ''))
              this.setState({
                inputValue: value,
                diyValue: 0,
              })
              onChange(value)
            }}
          />
          天
        </React.Fragment>
        <span className='text-btn' 
          onClick={() => {
          this.setState({
            DIY: true
          })
        }}>自定义</span>
      </div>
     )
  }
}
TimeSelectDIY.propTypes = {
  optionList: PropTypes.array
}

export default TimeSelectDIY