import React, { Component } from "react";
import { withRouter } from "react-router";
import { message, Button } from "antd";
import PropTypes from "prop-types";
import Api from "../../../server";
import "./index.scss";
import myTool from '../../../common/js/tool'

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      code: "2628",
      validatecode: ""
    };
  }

  componentDidMount() {
    this.validateCodeImg();
  }


  validateCodeImg = async() => {
    const res = await Api.loginCodeImg({
      name: this.state.username
    })
    if (res.data.retCode === '000') {
      this.setState({
        code: res.data.object
      })
    } else {
      console.error(res.data.rtnMsg)
    }
  }

  changeUsername = e => {
    this.setState({
      username: e.target.value
    });
  };
  changePassword = e => {
    this.setState({
      password: e.target.value
    });
  };
  changeValidateCode = e => {
    this.setState({
      validatecode: e.target.value
    });
  };
  blurMobilephone = () => {
    this.validateCodeImg();
  };
  submitLogin = () => {
    if (this.state.mobilephone === "") {
      message.info("请输入账号");
      return false;
    }
    if (this.state.password === "") {
      message.info("请输入密码");
      return false;
    }
    if (this.state.validateCode === "") {
      message.info("请输入验证码");
      return false;
    }
    this.checkLoginApi();
  };

  keyUp = e => {
    e.keyCode === 13 && this.checkLoginApi();
  };
  changeCodeImg = () => {
    this.validateCodeImg();
  };

  checkLoginApi = async() => {
    this.setState({submitLoading: true})

    const checkLoginApi = async(allAuthIdList) => {
      const res = await Api.checkLogin({
        name: this.state.username,
        password: this.state.password,
        validatecode: this.state.validatecode
      })
      this.setState({submitLoading: false})
      myTool.getApiData(res, () => {
        console.log(res);
        
        message.success(res.data.rtnMsg)
        const obj = res.data.object
        const shareToysAdminUserInfo = {
          username: obj.name,
          userid: obj.id,
          menuIds: obj.isAdmin === 'Y' ? allAuthIdList.toString() : obj.menuIds,
          isAdmin: obj.isAdmin,
          isBinding: obj.isBinding === 'Y',
        };
        myTool.sesStorSetItem('shareToysAdminUserInfo', shareToysAdminUserInfo)
        this.props.history.push('/')
      })
    }

    const allAuth = await Api.getAllAuthList()
    myTool.getApiData(allAuth, () => {
      let arr = []
      allAuth.data.data.forEach(item => {
        arr.push(item.id)
        item.sonPfMenuList.forEach(s => {
          arr.push(s.id)
        })
      })
      checkLoginApi(arr)
    })
  };

  render() {
    const {
      submitLoading = false
    } = this.state
    return (
      <div className="p-login-wrap">
        <h4>登录</h4>
        <form autoComplete="on">
          <div className="form-item">
            <span className="label">账号</span>
            <input
              className="ant-input"
              type="text"
              name="account"
              value={this.state.username}
              onChange={this.changeUsername}
              onBlur={this.blurMobilephone}
            />
          </div>
          <div className="form-item">
            <span className="label">密码</span>
            <input
              className="ant-input"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.changePassword}
            />
          </div>
          <div className="form-item">
            <span className="label">验证码</span>
            <input
              className="ant-input code"
              type="text"
              value={this.state.validateCode}
              onChange={this.changeValidateCode}
              onKeyUp={this.keyUp}
            />
            <span onClick={this.changeCodeImg} className="code-img">
              {this.state.code}
            </span>
          </div>
          <div className="form-item">
            <span className="label" />
            <Button
              type="primary"
              className="submit"
              onClick={this.submitLogin}
              loading={submitLoading}
            >
              登录
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

SignIn.propTypes = {
  history: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(SignIn);
