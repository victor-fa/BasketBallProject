import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { Button } from 'antd';

class RadioButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() {
    this.updata(this.props)
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.defaultActivekey !== nextprops.defaultActivekey) {
      this.updata(nextprops)
    }
  }

  updata = (prop) => {
    this.setState({
      activeKey: prop.defaultActivekey
    })
  }
  
  click = (key) => {
    this.setState({
      activeKey: key
    })
    this.props.onClick(key)
  } 

  render() {
    const { list = [{key: '', name: ''}]} = this.props
    const { activeKey } = this.state
    return (
      <div className='m-radiobutton'>
        {list.map(item => (
          <Button 
            key={item.key}
            type={activeKey === item.key ? 'primary' : 'default'}
            onClick={() => this.click(item.key)}
          >
            {item.name}
          </Button>
        ))
        }
      </div>
    )
  }
}

RadioButton.propTypes = {

  onClick: PropTypes.func,
  list: PropTypes.arrayOf(PropTypes.object)
}

export default RadioButton