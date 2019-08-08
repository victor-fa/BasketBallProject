import React, {Component} from "react";
import regs from "../../common/js/reg";
import { Button, message, Breadcrumb, Input, Select } from "antd";
import {Link} from 'react-router-dom'
import Api from '../../server'
import myTool from '../../common/js/tool'

class EditWorker extends Component {
  state = {
    perm: {
      key: '',
      label: '',
      binding: '',
    },
    stadium: {
      key: '',
      label: '',
    }
  }

  componentWillMount() {
    const workerId = this.props.match.params.id
    const isBinding = false
    let permList = [];
    
    const data = this.props.location.query

    if (workerId !== 'add' && !data) {
      this.props.history.push('/authManage/workerList')
      return false
    }

    this.setState({
      workerId,
      isBinding,
    })

    // 下拉权限
    Api.getAuthRoleList().then(res => {
      myTool.getApiData(res, () => {
        permList = res.data.data.map(item => {
          let obj = {}
          obj.key = item.id
          obj.label = item.name
          obj.binding = item.binding
          return obj
        })
        this.setState({
          permList: res.data.data.map(item => {
            let obj = {}
            obj.key = item.id
            obj.label = item.name
            obj.binding = item.binding
            return obj
          })
        })
      })
    })
    
    // 下拉球场
    Api.querySponsorPull().then(res => {
      myTool.getApiData(res, () => {
        this.setState({
          courtList: res.data.ext.stadiumList.map(item => {
            let obj = {}
            obj.key = item.id
            obj.label = item.name
            return obj
          })
        })
      })
    })

    if (workerId !== 'add' && data) {
      this.setState({
        ...data,
        initPassword: data.password,
        perm: {
          key: data.permId,
          label: data.permName,
        },
        stadium: {
          key: data.stadiumId,
          label: '',
        },
      })

      permList.forEach(item => {
        if (item.key === data.permId) {
          const result = item.binding === 'Y' ? true : false;
          this.setState({isBinding: result})  // 设置是否选中绑定
        }
      });

      setTimeout(() => {
        this.handleChangePerm(this.state.perm);
      }, 500);
      
    } 

  }

  submitForm = () => {
    const {
      name,
      password,
      initPassword,
      position,
      workerId,
      perm = {
        key: '',
        label: '',
        binding: ''
      },
      stadium = {
        key: '',
        label: ''
      },
      isAdmin,
    } = this.state
    if (!name) {
      message.info('请输入账户名称')
      return false
    }
    if (!password) {
      message.info('请输入账户密码')
      return false
    }

    if (!regs.regPassword.test(password)) {
      if (workerId !== 'add' && initPassword === password) {
      } else {
        message.info('登录密码必须为8-16位数字与字母的组合')
        return false
      }
    }

    if (!position) {
      message.info('请输入职位名称')
      return false
    }
    if (isAdmin !== 'Y' && (!perm.key || !perm.label)) {
      message.info('请选择职位权限')
      return false
    }
    
    if (this.state.isBinding) {
      if (isAdmin !== 'Y' && (!stadium.key)) {
        message.info('请选择要绑定的球场')
        return false
      }
    }

    let isBinding = false;
    this.state.permList.forEach(item => {
      if (perm.key === item.key && item.binding === 'Y') {
        isBinding = true;
      }
    })

    let param = {
      name,
      password: initPassword === password ? '' : password,
      position,
      permid: perm.key,
      permName: perm.label,
      stadiumId: (isBinding ? this.state.stadiumId : ''),
    }
    
    param = myTool.delObjVoidKey(param)
    this.setState({submitLoading: true})
    const submitApi = (apiName, arg) => {
      this.setState({submitLoading: false})
      Api[apiName](arg)
      .then(res => {
        myTool.getApiData(res, () => {
          message.success(res.data.rtnMsg)
          this.props.history.push('/authManage/workerList')
        })
      })
    }
    
    if (this.state.workerId === 'add') {
      submitApi('createWorker', param)
    } else {
      delete param.name
      submitApi('editWorker', {
        ...param,
        id: this.state.workerId
      })
    }
  }

  handleChangePerm(perm) {
    this.state.permList.forEach(item => {
      if (item.key === perm.key) {
        const result = item.binding === 'Y' ? true : false;
        this.setState({isBinding: result})  // 设置是否选中绑定
      }
    });
    this.setState({perm}) // 设置当前选项
  }

  handleChangeStadium(stadium) {
    console.log(stadium);
    
    this.state.courtList.forEach(item => {
      if (item.key === stadium.key) {
        this.setState({stadiumId: stadium.key})
      }
    });
    this.setState({stadium}) // 设置当前选项
  }

  render() {
    const {
      name,
      password,
      position,
      perm,
      permList = [],
      stadium,
      courtList,
      workerId,
      submitLoading = false,
      isAdmin,
      isBinding,
    } = this.state
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/authManage/workerList'>人员列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{`${workerId === 'add' ? '创建' : '编辑'}`}人员</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap'>
          <div className="m-form-wrap pt30" style={{maxWidth: 1000}}>
            <div className="item-box">
              <div className="left-box">
                <span className="label">账户名称</span>
                <Input
                  size='large'
                  className='input'
                  disabled={workerId !== 'add'}
                  value={name}
                  onChange={e => this.setState({name: e.target.value.replace(regs.regLetterAndNumber, '')})}
                />
              </div>
              <div className="right-box">
                <span className="label">账户密码</span>
                <Input
                  size='large'
                  type='password'
                  maxLength={16}
                  className='input'
                  value={password}
                  onChange={e => this.setState({password: e.target.value.replace(regs.regLetterAndNumber, '')})}
                />
              </div>
            </div>
            <div className="item-box">
              <div className="left-box">
                <span className="label">职位名称</span>
                <Input
                  size='large'
                  className='input'
                  autoComplete='off'
                  value={position}
                  onChange={e => this.setState({position: e.target.value.replace(regs.regNoSpace, '')})}
                  style={{width: 260}}
                />
              </div>
              <div className="left-box">
                <span className="label">职位权限</span>
                <Select
                  size='large'
                  className='select'
                  value={perm}
                  onChange={perm => this.handleChangePerm(perm)}
                  placeholder='未选择'
                  disabled={isAdmin === 'Y'}
                  labelInValue
                  style={{width: 260}}
                >
                  {permList.map(item => (
                    <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
                  ))}
                </Select>
              </div>
              <div className="left-box">
                <span className="label">&nbsp;</span>
              </div>
              <div className="left-box" style={{marginTop: '15px'}}>
                <span className="label">&nbsp;</span>
                {isBinding ? 
                  <Select
                    size='large'
                    className='select'
                    value={stadium}
                    onChange={stadium => this.handleChangeStadium(stadium)}
                    placeholder='未选择'
                    disabled={isAdmin === 'Y'}
                    labelInValue
                    style={{width: 260}}
                  >
                    {courtList.map(item => (
                      <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
                    ))}
                  </Select> : ''}
              </div>
            </div>
            
            
            <div className="btn-box">
              <Button 
                onClick={this.submitForm} 
                type='primary'
                loading={submitLoading}
              >{`${workerId === 'add' ? '确定' : '保存'}`}</Button>
              <Link to='/authManage/workerList' className='cancel-text'>取消</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default EditWorker