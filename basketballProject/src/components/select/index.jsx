import React, {Component} from 'react'
import './index.scss'
import PropTypes from 'prop-types'

class Select extends Component {
  state = {
  }

  componentWillMount() {
    this.upData(this.props)
  }

  upData = (props) => {
    const {
      optionList,
      initValue,
      placeholder,
    } = props   
    if (initValue && optionList && optionList.length !== 0) {
      const arr = optionList.filter(item => item.id === initValue),
        name = arr.length === 0 ? initValue : arr[0].name
      this.setState({name, isPlaceholder:false})
    }
    if (!initValue && placeholder) {
      this.setState({
        name: placeholder,
        isPlaceholder: true,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initValue !== nextProps.initValue) {
      this.upData(nextProps)
    }
  }
  
  render() {
    const {
      isOpen = false,
      name = '',
      isPlaceholder = false,
      value,
    } = this.state
    const {
      style,
      optionList = [],
      showArrow = true,
      noDataText = '',
      onChange = '',
      className,
      dropdownStyle,
      bottomNode
    } = this.props
    return (
      <div 
        tabIndex="0" 
        hidefocus="true"
        className={`m-select ${className} ${isOpen ? 'm-select-open' : ''}`} style={style}
        onBlur={() => {
          this.setState({
            isOpen: false
          })
        }}
      >
        <div 
          className="select-selection"
          onClick={() => {
            this.setState({
              isOpen: true
            })
          }}
        >
          <span className={`select-value ${isPlaceholder ? 'placeholder' : ''}`}>{name}</span>
          {showArrow && <i className='select-arrow iconfont'>&#xe600;</i>}
        </div> 
        <div 
          className='m-select-dropdown'
          style={dropdownStyle}
        >
          {noDataText &&
            <div className='nodata'>{noDataText}</div>
          }
          <ul className='option-list'>
            {optionList.map((item, index) => (
              <li 
                key={item.id} 
                className={`${value === item.id ? 'active' : ''}${item.disabled ? 'disabled' : ''}`}
                onClick={() => {
                  if (!item.disabled) {
                    onChange(item.id)
                    this.setState({
                      name: optionList.filter(i => i.id === item.id)[0].name,
                      isOpen: false,
                      isPlaceholder: false,
                    })
                  }
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
          {bottomNode}
        </div>
      </div>
    )
  }
}

Select.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  optionList: PropTypes.arrayOf(PropTypes.object),
  showArrow: PropTypes.bool,
  noDataText: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  dropdownStyle: PropTypes.objectOf(PropTypes.object),
  value: PropTypes.string,
  bottomNode: PropTypes.node,
  placeholder: PropTypes.string
}

export default Select