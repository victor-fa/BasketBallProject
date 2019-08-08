import React from 'react'
import Api from '../../server'
import {Modal, Button, Table, Transfer} from 'antd'
import myTool from '../../common/js/tool'

class SelectShop extends React.Component {
  state = {
    selectedShopKeys: [],
    shopList: []
  }

  render() {
    const {
      selectedShopList = [],
      showModal = false,
      shopList = [],
      selectedShopKeys = [],
      shopListLoading = false
    } = this.state
    return (
      <React.Fragment>
        <div className='item-box'>
          <span className='label'>分配店铺</span>
          <div className="info-box">
            <Button type='primary' loading={shopListLoading} onClick={() => {this.setState({showModal: true})}}>操作</Button>
            <div className="m-table-wrap" style={{padding: 0, width: 320}}>
              <Table 
                scroll={{y: 400}}
                columns={this.columns}
                dataSource={selectedShopList}
                loading={shopListLoading}
                pagination={false}
              />
            </div>
          </div>
        </div>
        <Modal
          visible={showModal}
          title='选择店铺'
          onCancel={this.cancelSelect}
          width={700}
          onOk={this.confirmSelect}
        >
          <Transfer
            className='u-transfer'
            dataSource={shopList}
            showSearch
            filterOption={this.filterOption}
            targetKeys={selectedShopKeys}
            onChange={this.handleChange}
            render={item => item.shopName}
            listStyle={{
              width: 286,
              height: 500,
            }}
            operations={['选择', '移除']}
          />
        </Modal>
      </React.Fragment>
    )
  }

  componentWillMount() {
    this.getShopListApi(() => {
      this.updataProps(this.props)
    })
  }

  updataProps = (props) => {
    const {
      shopIdList = []
    } = props
    this.setState({
      selectedShopKeys: shopIdList,
      selectedShopList: myTool.selectedData(this.state.shopList.map(item => {
        const obj = {...item}
        obj.key = item.id
        return obj
      }), shopIdList)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.shopIdList !== nextProps.shopIdList) {
      this.updataProps(nextProps)
    }
  }

  getShopListApi = async(callback) => {
    this.setState({shopListLoading: true})
    const res = await Api.getAllShop()
    this.setState({shopListLoading: false})
    myTool.getApiData(res, async() => {
       await this.setState({
        shopList: res.data.data.map(item => {
          let obj = {...item}
          obj.key = item.id
          return obj
        })
      })
      callback && callback()
    })
  }

  cancelSelect = () => {
    this.setState({
      showModal: false,
      selectedShopKeys: this.state.selectedShopList.map(item => {
        let key = ''
        key = item.id
        return key
      })
    })
  }

  filterOption = (inputValue, option) => option.shopName.indexOf(inputValue) > -1

  handleChange = (selectedShopKeys) => {
    this.setState({selectedShopKeys});
  }

  confirmSelect = () => {
    this.setState({
      showModal: false,
      selectedShopList:  myTool.selectedData(this.state.shopList.map(item => {
        const obj = {...item}
        obj.key = item.id
        return obj
      }), this.state.selectedShopKeys)
    })
    this.props.onChange(this.state.selectedShopKeys)
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => index + 1
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      width: 200,
    },
  ]
}

export default SelectShop


