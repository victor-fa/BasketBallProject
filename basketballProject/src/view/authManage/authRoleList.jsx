import React, {Component} from "react";
import {Breadcrumb, Table, Button, message, Modal} from 'antd'
import {Link} from 'react-router-dom'
import myTool from '../../common/js/tool'
import Api from '../../server'


class ToysUnit extends Component {
  constructor() {
    super()
    this.state = {
      selectedRowKeys: [],
    }
    this.columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 100,
        render: (text, record, index) => index + 1
      },
      {
        title: '创建时间',
        width: 200,
        dataIndex: 'createTime',
      },
      {
        title: '职位权限',
        width: 300,
        dataIndex: 'name',
      },
    ]
  }

  componentWillMount() {
    this.setState({
      tableScroll: myTool.tableScrollTool() - 120,
    })
  }

  componentDidMount() {
    this.getAuthRoleListApi()
  }

  getAuthRoleListApi = () => {
    this.setState({loading: true})
    Api.getAuthRoleList().then(res => {
      this.setState({loading: false})
      myTool.getApiData(res, () => {
        this.setState({
          tableData: res.data.data.map(item => {
            let obj = {}
            obj = item
            obj.key = item.id
            return obj
          })
        })
      })
    })
  }

  handleOperate = (e, record, index) => {
    const selectedData = myTool.selectedData(this.state.tableData, this.state.selectedRowKeys)
    if (e.key === 'add') {
      this.setState({
        editType: e.key
      })
      return false
    }
    if (e.uiType === 'btn') {
      if (this.state.selectedRowKeys.length === 0) {
        message.info(`请选择您要${e.sName}的权限`)
        return false
      }
      if (e.key === 'edit') {
        if (this.state.selectedRowKeys.length > 1) {
          message.info(`一次只能${e.sName}一个权限`)
          return false
        }
        this.props.history.push({pathname: `/authManage/editAuthRole/${selectedData[0].id}`, query: selectedData[0]})
      }
      const {
        clearTableSelect
      } = this
      if (e.key === 'del') {
        const {
          delAuthRoleApi
        } = this
        Modal.confirm({
          title: `您是否确定${e.sName}所选权限？`,
          onOk() {
            delAuthRoleApi()
          },
          onCancel() {
            clearTableSelect()
          },
        })
      }
    }
  }

  delAuthRoleApi = () => {
    Api.delAuthRole({
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

  clearTableSelect = () => {
    this.setState({
      selectedRowKeys: []
    })
  }


  refreshList = () => {
    this.setState({selectedRowKeys: []})
    this.getAuthRoleListApi()
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
          <Breadcrumb.Item>权限列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className={`u-page-wrap`}>
          <div className="m-table-wrap" style={{maxWidth: 800}}>
            <div className="table-top-btn">
              <Link to='/authManage/editAuthRole/add'><Button type='primary'>创建权限</Button></Link>
              {topBtnList.map(item => (
                <Button 
                  key={item.key} 
                  onClick={() => this.handleOperate(item)}
                  type={item.key === 'add' ? 'primary' : ''}
                >{item.name}</Button>
              ))}
              <Button icon='reload' loading={loading} onClick={this.getAuthRoleListApi}>刷新</Button>
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

export default ToysUnit;

const topBtnList = [
  {
    key: 'del',
    name: '删除权限',
    sName: '删除',
    uiType: 'btn',
    needConfirm: true,
    operateParam: '',
  },
  {
    key: 'edit',
    name: '编辑权限',
    sName: '编辑',
    uiType: 'btn',
    needConfirm: false,
    operateParam: '',
  },
]
