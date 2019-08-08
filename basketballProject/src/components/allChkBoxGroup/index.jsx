//带选择全部功能的多选框组件
import React, { Component } from 'react'
import { Checkbox } from 'antd'
import PropTypes from 'prop-types'

const CheckboxGroup = Checkbox.Group;

class AllChkBoxGroup extends Component {
  onChange = (checkedList) => {
    const checkAll = checkedList.length === this.props.plainOptions.length
    const indeterminate = !!checkedList.length && (checkedList.length < this.props.plainOptions.length)
    this.props.checkedListFunc(checkedList, checkAll, indeterminate)
  }
  onCheckAllChange = (e) => {
    const checkedList = e.target.checked ? this.props.plainOptions.map(item => {
      let value = 0;
      value = item.value
      return value
    }) : [];
    const checkAll = e.target.checked
    this.props.checkedListFunc(checkedList, checkAll, false)
  }
  
  render () {
    const { 
      indeterminate,
      checkAll,
      checkedList,
      plainOptions
     } = this.props
    return (
      <React.Fragment>
        <Checkbox
          indeterminate={indeterminate}
          onChange={this.onCheckAllChange}
          checked={checkAll}
        >
          全部
        </Checkbox>
        <CheckboxGroup 
          options={plainOptions} 
          value={checkedList} 
          onChange={this.onChange} 
        />
      </React.Fragment>
    )
  }
}
AllChkBoxGroup.propTypes = {
  plainOptions: PropTypes.arrayOf(PropTypes.any),
  checkedList: PropTypes.arrayOf(PropTypes.any),
  checkedListFunc: PropTypes.func,
  checkAll: PropTypes.bool,
  indeterminate: PropTypes.bool, //可不用
}

export default AllChkBoxGroup