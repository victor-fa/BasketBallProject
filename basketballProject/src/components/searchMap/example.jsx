/**
 * @file    index.jsx
 * @desc    促销
 * @author  易梦蝶
 * @update  20180326 
 */

import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { RouteWithSubRoutes } from '../../routes'
import SearchMap from './index'


class SearchMapExamples extends Component {
 
  sendMarkerPoint = (point) => {
    console.log('sendMarkerPoint', point)
  }
  render() {
    return (
      <div className='app-content-box'>
        <SearchMap
          city='深圳'
          suggestId='深圳'
          sendMarkerPoint={this.sendMarkerPoint}
          mapStyle={{width: '800px', height: '500px'}}
        />
      </div>
    )
  }
}
SearchMapExamples.propTypes = {
}

export default SearchMapExamples
