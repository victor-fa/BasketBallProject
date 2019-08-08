/**
 * @file    index.jsx
 * @desc    促销
 * @author  易梦蝶
 * @update  20180326 
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'

class SearchMap extends Component {
  constructor() {
    super();
    this.state = {
      city: '深圳',
    }
  }
  componentWillMount() {
    this.setState({
      city: this.props.city,
      initPoint: this.props.initPoint
    })
  }

  componentDidMount() {
    this.createBMap(this.props)
  }

  setPoint = (point) => {
    this.setState({
      point
    })
  }

  componentWillReceiveProps(nextProp) {
    if (this.props.initPoint !== nextProp.initPoint) {
      this.setState({
        city: nextProp.city,   
        initPoint: nextProp.initPoint
      })
     this.createBMap(nextProp)
    }
  }

  createBMap = (prop) => {
    const sendPoint = prop.sendPoint
    function G(id) {
      return document.getElementById(id);
    }
   
    const setPoint = this.setPoint
    
    let BMap = window.BMap
    let map = new BMap.Map("l-map");
    map.enableScrollWheelZoom()
    let thePoint
    if (prop.initPoint) {
      thePoint = new BMap.Point(prop.initPoint.lng, prop.initPoint.lat)
    } else if (prop.city) {
      thePoint = prop.city
    } else {
      thePoint = '深圳'
    }
    map.centerAndZoom(thePoint, 12)

    const createMarker = (e) => {
      map.clearOverlays();  
      map.addOverlay(new BMap.Marker(e.point))
      this.setState({
        point: e.point
      })
      sendPoint(e.point)
    }    
    if (prop.initPoint) {
      map.addOverlay(new BMap.Marker(new BMap.Point(prop.initPoint.lng, prop.initPoint.lat)))
    }

    map.addEventListener("click", createMarker)

    let ac = new BMap.Autocomplete({"input": "suggestId", "location": map});
    ac.addEventListener("onhighlight", function(e) { 
    let str = "";
      let _value = e.fromitem.value;
      let value = "";
      if (e.fromitem.index > -1) {
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      }    
      str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
      
      value = "";
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      }    
      str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
      G("searchResultPanel").innerHTML = str;
    });

    let myValue;
    ac.addEventListener("onconfirm", function(e) {  
    let _value = e.item.value;
      myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
      setPlace();
    });
    function setPlace() {
      map.clearOverlays();
      function myFun() {
        let pp = local.getResults().getPoi(0).point; 
        sendPoint(pp)
        setPoint(pp)
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp)); 
      }
      let local = new BMap.LocalSearch(map, { 
        onSearchComplete: myFun
      });
      local.search(myValue);
    }
  }

  render() {
    const  { point, initPoint } = this.state
    const { style } = this.props
    return (
      <div className='m-searchmap'>
        <div 
          id="r-result"
          style={{margin: '6px 0 6px 0'}}
        >
          搜索地址：
          <input type="text" id="suggestId" size="20" style={{width: '150px', marginRight: '20px' }} />
          坐标：{point ? `${point.lng}  ${point.lat}` : initPoint ? `${initPoint.lng}  ${initPoint.lat}` : ''}
        </div>
        <div 
          id="searchResultPanel" 
          style={{border: '1px solid #C0C0C0', width: '150px', height: 'auto', display: 'none'}} 
        />
        <div id="l-map" style={style} />
      </div>
    )
  }
}
SearchMap.propTypes = {
  city: PropTypes.string,
  sendPoint: PropTypes.func,
  mapStyle: PropTypes.objectOf(PropTypes.any)
}

export default SearchMap
