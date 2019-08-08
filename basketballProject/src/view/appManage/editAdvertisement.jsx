import React, {Component} from "react";
import regs from "../../common/js/reg";
import { Button, message, Breadcrumb, Input, DatePicker, Radio, Select} from "antd";
import {Link} from 'react-router-dom'
import Editor from 'braft-editor'
import 'braft-editor/dist/index.css'
import axios from 'axios'
import Api from "../../server";
import myTool from '../../common/js/tool'
import moment from 'moment'
import UploadImg from '../../components/upLoadImg'

const dateFormat = 'YYYY-MM-DD'

class EditAdvertisement extends Component {
  state = {
    adType: '0',
    editorState: Editor.createEditorState(null),
  }

  async componentWillMount() {
    
    this.setState({
      userId: myTool.sesStorGetItem('shareToysAdminUserInfo').userid
    })

    const editType = this.props.match.params.id
    const data = this.props.location.query

    if (editType !== 'add' && !data) {
      this.props.history.push('/appManage/adManage')
      return false
    }  

    this.queryAdvertColumnsApi()

    if (editType === 'add') {
      this.setState({editType})
     
    } 
    if (data && editType !== 'add') {
      this.setState({
        ...data,
        picpath: data.picpath ? [{url: data.picpath}] : [],
        startTime: data.publishTime ? moment(data.publishTime, 'YYYY-MM-DD') : null,
        endTime: data.effectiveTime ? moment(data.effectiveTime, 'YYYY-MM-DD') : null,
        adName: data.name,
        editorState:  Editor.createEditorState(data.imgPath),
        adType: data.type,
      })
    }

  }


  queryAdvertColumnsApi = async() => {
    const res = await Api.queryAdvertColumns()
    myTool.getApiData(res, () => {
      this.setState({
        advertColumns: res.data.data
      })
    })
  }

  submitForm = async() => {
    const {
      adName,
      startTime,
      endTime,
      editType, 
      id,
      advertColumnId,
      referUrl,
      adType,
      editorState,
      status,
      defaultContent,
      picpath = [],
      changeContent = false,
    } = this.state
    if (!adName) {
      message.info('请输入广告名称')
      return false
    }
    if (!startTime || !endTime) {
      message.info('请选择有效时间')
      return false
    }

    if (!moment().isBefore(endTime)) {
      message.info('结束时间不能晚于当前时间')
      return false
    }

    if (!advertColumnId) {
      message.info('请选择广告栏目')
      return false
    }

    if (picpath.length === 0) {
      message.info(`请上传头图`)
      return false
    }
    const isAdd = editType === 'add'
    // const isVoidContent = content === '<p></p>' || !content

    // if (adType === '0' && isAdd && isVoidContent) {
    //   message.info(`请填写广告图文`)
    //   return false
    // }

    // if (adType === '0' && !isAdd && isVoidContent && changeContent) {
    //   message.info(`请填写广告图文`)
    //   return false
    // }

    // if (adType === '1' && !referUrl) {
    //   message.info(`请填写广告链接`)
    //   return false
    // }

    let contentA = editorState === '<p></p>' ? null : editorState.toHTML()
    let contentParam = isAdd ? contentA : contentA ? contentA : changeContent ? null : defaultContent
    contentParam = contentParam === '<p></p>' ? null : contentParam
    let param = {
      name: adName,
      publishTime: startTime ? startTime.format(dateFormat) : null,
      effectiveTime: endTime ? endTime.format(dateFormat) : null,
      advertColumnId,
      referUrl: adType === '1' ? referUrl : null,
      type: adType,
      imgPath: adType === '0' ? contentParam : null,
      picpath: myTool.formatImgArrToStr(picpath),
      status,
    }
    param = isAdd ? param : {...param, id}
    this.setState({submitLoading: true})
    const res = await Api.editAdvert(param)
    this.setState({submitLoading: false})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.props.history.push('/appManage/adManage')
    })
  }

  render() {
    const {
      adName,
      editType,
      submitLoading = false,
      startTime = null,
      endTime = null,
      adType,
      advertColumnId,
      advertColumns = [],
      referUrl,
      picpath = [],
      userId = '',
      editorState,
    } = this.state

    const actionUrl = `${Api.upLoadFile}?type=image&classify=advert&userId=${userId}`
    const imgBasicUrl= Api.IMG_BASIC_URL

    const myUploadFn = (param) => {
      const fd = new FormData()
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data', 
          // 'Access-Control-Allow-Origin': '*'
        },
        // onUploadProgress: e => param.progress(e.loaded / e.total * 100),
      }
      fd.append('file', param.file);
      axios.post(actionUrl, fd, config)
      .then(res => {
        if (res.data.retCode === '000') {
          param.success({
            url: res.data.data.map(item => {
              return `${imgBasicUrl}${item.url}`
            }),
            meta: {
              id: 'xxx',
              title: 'xxx',
              alt: 'xxx',
            }
          })
        } else {
          message.error(`上传图片错误`)
        }
      })
      .catch(() => {
        message.error(`上传图片错误`)
      })
    }

    const editorProps = {
      value: editorState,
      height: 500,
      onChange: editorState => this.setState({editorState}),
      contentFormat: 'html',
      excludeControls: ['fullscreen', 'emoji'],
      media: {
        accepts: {'video': false, 'audio': false,},
        externals: {'video': false, 'audio': false, 'embed': false},
        validateFn: file => file.size < 1024 * 20000,
        uploadFn: myUploadFn
      },
    }

    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/appManage/adManage'>广告管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{`${editType === 'add' ? '发布' : '编辑'}广告`}</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap p-editadmanage'>
          <div className="m-form-wrap pt30">
            <div className="item-box">
              <span className="label">广告名称</span>
              <Input                 
                className='input'
                size='large'
                value={adName}
                maxLength={30}
                onChange={(e) => {
                  this.setState({adName: e.target.value.replace(regs.regNoSpace, '')})
                }}
              />
            </div>
            <div className="item-box">
              <span className="label">有效时间</span>
              <DatePicker.RangePicker
                size='large'
                format={dateFormat}
                value={[startTime, endTime]}
                onChange={(value) => {
                  const isVoid = value.length === 0
                  this.setState({
                    startTime: isVoid ? null : value[0].startOf('d'),
                    endTime: isVoid ? null : value[1].endOf('d')
                  })
                }}
              />
            </div>
            <div className="item-box">
              <span className="label">广告栏目</span>
              <Select
                value={advertColumnId}
                className='select'
                size='large'
                placeholder='请选择'
                onChange={(advertColumnId) => this.setState({advertColumnId})}
              >
                {advertColumns.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </div>
           
            <div className="item-box">
              <span className="label">头图</span>
              <UploadImg 
                maxUpImg={1}
                imgList={picpath}
                maxSize={10485760}
                imgBasicUrl={Api.IMG_BASIC_URL}
                hasWH
                actionUrl={`${Api.upLoadFile}?type=image&classify=advert&userId=${userId}`}
                changeImgList={(picpath) => {
                  this.setState({picpath})
                }}
              />
              <span className="text-s">图片不大于10MB</span>
            </div>

            <div className="item-box">
              <span className="label">广告类型</span>
              <div className="info-box">
                <Radio.Group 
                  onChange={e => this.setState({adType: e.target.value})} 
                  value={adType}
                  style={{marginBottom: 15}}
                >
                  <Radio value={'0'}>图文</Radio>
                  <Radio value={'1'}>链接</Radio>
                </Radio.Group> <br />
                {adType === '0' &&
                  <Editor {...editorProps} />
                }
                {adType === '1' &&
                  <Input
                    placeholder='输入链接地址'
                    className='input'
                    style={{width: 800}}
                    size='large'
                    value={referUrl}
                    onChange={e => this.setState({referUrl: e.target.value.replace(regs.regNoSpace, '')})}
                  />
                }
              </div>
            </div>
            <div className="btn-box">
              <Button 
                onClick={this.submitForm} 
                loading={submitLoading}
                type='primary'
              >{editType === 'add' ? '确定' : '保存'}</Button>
              <Link to='/appManage/adManage' className='cancel-text'>取消</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default EditAdvertisement
