import React, { PureComponent} from 'react'
import {Link} from 'react-router-dom'
import './index.scss'

class HasReturnTitle extends PureComponent  {
  
  clickCancel = () => {
    this.props.clickReturn()
  }

  render() {
    const {title, returnPath, clickReturn} = this.props
    return (
      <div className='m-top-title'>
        {clickReturn &&
          <span 
           onClick={this.clickCancel}
           className='return-btn'
          >
           <i className='iconfont'>&#xe697;</i>返回
          </span>
        }
       
        {returnPath &&
          <Link className='return-btn' to={returnPath}><i className='iconfont'>&#xe697;</i>返回</Link>
        }
        <h2>{title}</h2>
      </div>
    )
  }
}

export default HasReturnTitle