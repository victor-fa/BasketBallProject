import React, { Component } from 'react'
import { connect } from 'react-redux'

import { testAction } from '../../../actions/test'

class SignIn extends Component {
  click = () => {
    this.props.dispatch(testAction('dfefe'))
    this.props.dispatch({
      type: 'TEST',
      text: 'sefeefe'
    })
  }
  render() {
    return (
      <div className="p-signIn">
        SignIn,{this.props.test}<br />
        <span onClick={this.click}>fefwefw</span>
      </div>
    );
  }
}


export default connect(state => ({
  test: state.test,
}))(SignIn)