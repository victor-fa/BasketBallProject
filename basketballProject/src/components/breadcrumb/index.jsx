import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import './index.scss'

class Breadcrumb extends PureComponent {
 
  clickReturnBtn = () => {
    this.props.returnClick()
  } 

  render() {
    const  {
      linkList = []
    } = this.props
    return (
      <div className='breadcrumb-bar'>
        <div className='breadcrumb-box'>
          {linkList.map(item => (
            <Link 
              to={item.path}
              className='return-btn'
            >
              {item.pageName}
            </Link>
          ))
          }
          {(!this.props.returnPath && !this.props.returnClick) &&
            <Link to='/'><Icon type='home' /></Link>
          }  
          {this.props.pageName}
        </div>
        {this.props.children}
      </div>
    )
  }
}

export default Breadcrumb