import React, {Component} from "react";
import regs from "../../common/js/reg";
import { Button, message, Breadcrumb, Input, Checkbox } from "antd";
import {Link} from 'react-router-dom'
import Api from '../../server'
import myTool from '../../common/js/tool'

class EditAuthRole extends Component {
  state = {}

  componentWillMount() {
    const authRoleId = this.props.match.params.id
    const isBinding = myTool.sesStorGetItem('shareToysAdminUserInfo').isBinding
    const checkSponsor = myTool.sesStorGetItem('shareToysAdminUserInfo').isBinding
    const data = this.props.location.query
    console.log(data);
    
    if (authRoleId !== 'add' && !data) {
      this.props.history.push('/authManage/authRoleList')
      return false
    }

    this.setState({
      firstAdd: true,
      authRoleId,
      checkSponsor: false,
      isBinding,
    })

    if (authRoleId !== 'add' && data) {
      this.setState({
        ...data,        
      })
    }

    this.getAllAuthListApi(authRoleId !== 'add' && data && data.menuIds)
  }

  getAllAuthListApi = (propsMenuIds) => {
    Api.getAllAuthList().then(res => {
      myTool.getApiData(res, () => {
        const dataArr = res.data.data

        let allAuthList = []
        if (propsMenuIds) { // 修改
          
          const menuIdArr = propsMenuIds.split(',').filter(item => item)
          allAuthList = dataArr.map(item => {
            
            let obj = item
            obj.checkAll = menuIdArr.some(i => i === item.id)
            obj.checkIdList = []
            item.sonPfMenuList.forEach(s => {
              menuIdArr.some(i => i === s.id) && obj.checkIdList.push(s.id)
            })
            if (item.name === '是否绑定球场') {
              this.setState({checkSponsor: item.checkAll})
            }
            obj.optionList = item.sonPfMenuList.map(s => {
              let obj = {}
              obj.label = s.name
              obj.value = s.id
              return obj
            })
            return obj
          })
        } else {  // 新增
          console.log(this.state.firstAdd);
          allAuthList = dataArr.map(item => {
            let obj = {}
            obj = item
            obj.checkAll = item.id === 'A008' ? false : true
            this.setState({checkSponsor: false})
            obj.optionList = item.sonPfMenuList.map(item => {
              console.log(item);
              
              let obj = {}
              obj.label = item.name
              obj.value = item.id
              return obj
            })
            obj.checkIdList = item.sonPfMenuList.map(item => {
              let id = []
              id = item.id
              return id
            })
            return obj
          })
        }

        this.setState({allAuthList})
        console.log(this.state.checkSponsor);
        
      })
    })
  }

  submitForm = () => {
    if (!this.state.name) {
      message.info('请输入权限名称')
      return false
    }
    const menuIds = []
    for (let i of this.state.allAuthList) {
      i.checkAll && menuIds.push(i.id)
      menuIds.push(...i.checkIdList)
    }

    if (menuIds.length === 0) {
      message.info(`权限不能为空`)
      return false
    }

    const params = {
      name: this.state.name,
      menuIds: menuIds.toString(),
      binding: menuIds.toString().indexOf('A008') > -1 ? 'Y' : 'N',
    }

    const submitApi = (apiName, arg) => {
      Api[apiName](arg)
      .then(res => {
      this.setState({submitLoading: false})
        myTool.getApiData(res, () => {
          message.success(res.data.rtnMsg)
          this.props.history.push('/authManage/authRoleList')
        })
      })
    }

    this.setState({submitLoading: true})

    if (this.state.authRoleId === 'add') {
      submitApi('createAuthRole', params)
    } else {
      submitApi('editAuthRole', {
        ...params,
        id: this.state.authRoleId
      })
    }
  }

  // 点击子集
  changeMenuIds = (e, index) => {
    const newAllAuthList = [...this.state.allAuthList]
    newAllAuthList[index].checkIdList = e
    newAllAuthList[index].checkAll = e.length !== 0
    this.setState({allAuthList: newAllAuthList})
  }

  // 点击父级
  checkAllChange = (e, index, data) => {
    
    let checkSponsor = false;
    if (data.id === 'A008') {
      
      checkSponsor = data.checkAll;
      this.state.allAuthList.forEach(item => {
        if (item.name === '球场管理' || item.name === '订单管理' || item.name === '资金管理') {
          item.checkAll = data.checkAll === true ? true : true;
        } else {
          item.checkAll = data.checkAll === true ? true : false;
        }
      })
      
      const checked = e.target.checked
      this.state.allAuthList[5].checkIdList = checked ? []
         : this.state.allAuthList[5].optionList.map(item => {
          let id = ''
          id = item.value
          return id
        })
      this.setState({allAuthList: this.state.allAuthList, checkSponsor: checkSponsor})
    }
    
    const checked = e.target.checked
    const newAllAuthList = [...this.state.allAuthList]
    newAllAuthList[index].checkAll = checked
    newAllAuthList[index].checkIdList = checked ? 
      this.state.allAuthList[index].optionList.map(item => {
        let id = ''
        id = item.value
        return id
      }) : []
    this.setState({allAuthList: newAllAuthList, firstAdd: false})
  }

  render() {
    const {
      name,
      authRoleId,
      allAuthList = [],
      checkSponsor,
      submitLoading = false,
      firstAdd,
    } = this.state
    
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/authManage/authRoleList'>权限列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{`${authRoleId === 'add' ? '创建' : '编辑'}权限`}</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap'>
          <div className="m-form-wrap pt30">
            <div className="item-box">
              <span className="label">权限名称</span>
              <Input 
                className='input'
                size='large'
                disabled={authRoleId !== 'add'}
                value={name}
                maxLength={30}
                onChange={(e) => {
                  this.setState({name: e.target.value.replace(regs.regNoSpace, '')})
                }}
              />
            </div>
            <table className='p-table-authlist'>
              <tbody>
                {allAuthList.map((item, index) => (
                  <tr key={item.id}>
                    <th width={120}>{item.name}</th>
                    <td>
                      <Checkbox
                        onChange={(e) => this.checkAllChange(e, index, item)}
                        checked={item.checkAll}
                        disabled={(authRoleId !== 'add' ?
                            (checkSponsor ?
                              (item.name === '球场管理' || item.name === '订单管理' || item.name === '资金管理' ?
                                false
                                : true)
                              : (item.name === '是否绑定球场' ?  true : false )) 
                            : (checkSponsor || firstAdd ?
                                false
                                : (item.name === '球场管理' || item.name === '订单管理' || item.name === '资金管理' || item.name === '是否绑定球场' ? false : true)
                                ))
                          }>
                        {item.name}
                      </Checkbox>
                      <Checkbox.Group options={item.optionList} disabled={(authRoleId !== 'add' ? 
                            (checkSponsor ?
                              true
                              : (item.name === '是否绑定球场' ?  true : false ))
                              // item.name === '会员管理' || item.name === '广告管理' || item.name === '权限管理' || item.name === '赞助商管理'
                            : (checkSponsor || firstAdd ?
                              ''
                              : (item.name === '球场管理' || item.name === '订单管理' || item.name === '资金管理' || item.name === '是否绑定球场' ? false : true)))
                          } value={item.checkIdList} onChange={(e) => this.changeMenuIds(e, index)}
                        />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="btn-box">
              <Button onClick={this.submitForm} type='primary' loading={submitLoading}>{`${authRoleId === 'add' ? '确定' : '保存'}`}</Button>
              <Link to='/authManage/authRoleList' className='cancel-text'>取消</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default EditAuthRole