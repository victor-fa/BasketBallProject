import React, {Component} from "react";
import {Breadcrumb, Table, Button, message, Modal} from 'antd'
import {Link} from 'react-router-dom'
import myTool from '../../common/js/tool'
import Api from '../../server'

class WorderList extends Component {
  constructor() {
    super()
    this.state = {
      selectedRowKeys: [],
    }
    this.columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 50,
        render: (text, record, index) => index + 1
      },
      {
        title: '创建时间',
        width: 180,
        dataIndex: 'createTime',
      },
      {
        title: '账户名称',
        width: 200,
        dataIndex: 'name',
      },
      {
        title: '职位名称',
        width: 180,
        dataIndex: 'position',
      },
      {
        title: '职位权限',
        width: 180,
        dataIndex: 'permName',
      },
    ]
  }

  componentWillMount() {
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120,
    })
  }

  componentDidMount() {
    this.getWorkerListApi()
  }

  getWorkerListApi = () => {
    this.setState({loading: true})
    Api.getWorkerList().then(res => {
      console.log(res);
      this.setState({loading: false})
      if (res.data.retCode === '000') {
        this.setState({
          tableData: res.data.data.map(item => {
            let obj = {}
            obj = item
            obj.key = item.id
            return obj
          })
        })
      }
    })
  }

  handleOperate = (e, record, index) => {
    if (e.key === 'add') {
      this.setState({
        editType: e.key
      })
      return false
    }
    if (e.uiType === 'btn') {
      if (this.state.selectedRowKeys.length === 0) {
        message.info(`请选择您要${e.sName}的人员`)
        return false
      }
      if (e.key === 'edit') {
        if (this.state.selectedRowKeys.length > 1) {
          message.info(`一次只能${e.sName}一个人员`)
          return false
        }
        this.props.history.push({
          pathname: `/authManage/editWorker/${this.state.selectedRowKeys[0]}`, 
          query: this.state.tableData.filter(item => item.id === this.state.selectedRowKeys[0])[0]
        })
      }
      
      const {
        clearTableSelect,
        delWorkerApi
      } = this
      if (e.key === 'del') {
        Modal.confirm({
          title: `您是否确定${e.sName}所选人员？`,
          onOk() {
            delWorkerApi()
          },
          onCancel() {
            clearTableSelect()
          },
        })
      }
    }
  }

  delWorkerApi = () => {
    Api.delWorder({
      idList: this.state.selectedRowKeys.toString()
    }).then(res => {
      if (res.data.retCode === '000') {
        message.success(res.data.rtnMsg)
        this.refreshList()
      } else {
        message.error(res.data.rtnMsg)
      }
    })
  }
  

  refreshList = () => {
    this.setState({selectedRowKeys: []})
    this.getWorkerListApi()
  }
  


  clearTableSelect = () => {
    this.setState({
      selectedRowKeys: []
    })
  }

  clickSearch = () => {

  }

  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }

  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  
  render() {
    const {
      selectedRowKeys = [],
      tableScroll,
      loading = false,
      tableData = [],
    } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      hideDefaultSelections: true
    }
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>人员列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className={`u-page-wrap`}>
          <div className="m-table-wrap" style={{maxWidth: 800}}>
            <div className="table-top-btn">
              <Link to='/authManage/editWorker/add'><Button type='primary'>创建人员</Button></Link>
              {topBtnList.map(item => (
                <Button 
                  key={item.key} 
                  onClick={() => this.handleOperate(item)}
                  type={item.key === 'add' ? 'primary' : ''}
                >{item.name}</Button>
              ))}
              <Button icon='reload' loading={loading} onClick={this.getWorkerListApi}>刷新</Button>
            </div>
            <Table
              scroll={{y: tableScroll}}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={tableData}
              loading={loading}
              onRow={record => ({
                onClick: () => {
                  this.selectRow(record);
                },
              })}
              pagination={false}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default WorderList;

const topBtnList = [
  {
    key: 'del',
    name: '删除人员',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    operateParam: '',
  },
  {
    key: 'edit',
    name: '编辑人员',
    sName: '编辑',
    uiType: 'btn',
    needConfirm: false,
    operateParam: '',
  },
]
