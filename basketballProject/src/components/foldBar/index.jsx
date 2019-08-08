import React, { PureComponent} from 'react'
import './index.scss'

class FoldBar extends PureComponent  {
  
  handleClick = () => {
    this.props.handleFold()
  }

  render() {
    const { fold } = this.props
    return (
      <div className='fold-search-box'>
        {fold ?
          <span className='btn-open-up' onClick={this.handleClick} title='隐藏筛选框'>
            <i className='iconfont'>&#xe621;</i>
          </span> :
          <span className='btn-open-down' onClick={this.handleClick} title='展开筛选框'>
            <i className='iconfont'>&#xe620;</i>
          </span>
        }
      </div>
    )
  }
}

export default FoldBar