import React from 'react'
import './index.scss'
import { Button } from 'antd';

class DataBtnSelect extends React.Component {
  state = {
    selectedDataKeys: [],
    isAll: true,
  }

  render() {
    const {
      selectedDataKeys = [],
    } = this.state
    return (
      <React.Fragment>
        <Button.Group className='u-data-select'>
          {dataList.map(item => 
            <Button 
              className={`data-btn ${selectedDataKeys.some(i => i === item.key) ? 'act' : ''}`}
              onClick={() => this.changeSelect(item.key)}
              key={item.key} 
              value={item.key}
            >
              {item.name}
            </Button>
          )}
        </Button.Group>
      </React.Fragment>
    )
  }

  componentWillMount() {
    this.updataProps(this.props)
  }

  updataProps = (props) => {
    const {
      selectKeys = ''
    } = props
    let selectedDataKeys = []
    if (selectKeys === 'ALL') {
      selectedDataKeys = dataList.map(item => {
        let i = ''
        i = item.key
        return i
      })
    } else {
      selectedDataKeys = selectKeys.split(',')
    }
    this.setState({
      selectedDataKeys,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectKeys !== nextProps.selectKeys) {
      this.updataProps(nextProps)
    }
  }

  changeSelect = (key) => {
    const {
      selectedDataKeys = []
    } = this.state
    let newSelectKey = []
    if (key === 'ALL') {
      if (selectedDataKeys.some(item => item === 'ALL')) {
        newSelectKey = []
      } else {
        newSelectKey = dataList.map(item => {
          let i = ''
          i = item.key
          return i
        })
      }
    } else {
      if (selectedDataKeys.some(item => item === key)) {
        newSelectKey = selectedDataKeys.filter(item => item !== key)
        newSelectKey = newSelectKey.filter(item => item !== 'ALL')
      } else {
        newSelectKey = [...selectedDataKeys, key]
        if (newSelectKey.filter(item => item !== 'ALL').length === 7) {
          newSelectKey = [...newSelectKey, 'ALL']
        }
      }
    }
    newSelectKey = newSelectKey.filter(item => !!item)
    this.setState({selectedDataKeys: newSelectKey})
    this.props.onChange(newSelectKey.some(item => item === 'ALL') ? 'ALL' : newSelectKey.toString())
  }

}

export default DataBtnSelect


const dataList = [
  {key: 'ALL', name: '全天'},
  {key: '1', name: '周一'},
  {key: '2', name: '周二'},
  {key: '3', name: '周三'},
  {key: '4', name: '周四'},
  {key: '5', name: '周五'},
  {key: '6', name: '周六'},
  {key: '7', name: '周日'},
]