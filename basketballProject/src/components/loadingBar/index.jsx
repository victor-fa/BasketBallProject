import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import './index.scss'

export class LoadingBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class: ''
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loadingBar) {
      this.setState({
        class: 'show'
      })
      setTimeout(() => {
        this.setState({
          class: ''
        });
      }, 1000)
    } else {
      setTimeout(() => {
        this.setState({
          class: ''
        });
      }, 1000)
    }
  }
  render() {
    return (
      <div className={'loading-bar ' + this.state.class} />
    )
  }
}
 
LoadingBar.propTypes = {
  loadingBar: PropTypes.bool,
}
 
export default connect(state => ({
  loadingBar: state.loadingBar
}))(LoadingBar)
