import { Breadcrumb, Button, Col, Input, message, Row } from "antd";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import regs from "../../common/js/reg";
import myTool from '../../common/js/tool';
import UploadImg from '../../components/upLoadImg';
import Api from "../../server";
// import SearchMap from '../../components/searchMap'

const prevPage = '/sponsorManage/sponsorList'


class EditSponsor extends Component {
  state = {
    editType: '',
    openTime: null,
    closeTime: null,
    addressValue: undefined,
  }

  async componentWillMount() {
    const sponsorId = this.props.match.params.id
    const data = this.props.location.query
    
    if (sponsorId !== 'add' && !data) {
      this.props.history.push(prevPage)
      return false
    }

    if (sponsorId === 'add') {
      this.setState({editType: sponsorId})
    } 

    this.setState({
      sponsorId: sponsorId,
      userId: myTool.sesStorGetItem('shareToysAdminUserInfo').userid,
    })
    if (data && sponsorId !== 'add') {
      this.setState({
        sponsorLogoImgList: data.logoImg ? [{url: data.logoImg}] : [],
        sponsorAdsImgList: data.advertImg ? [{url: data.advertImg}] : [],
        sponsorSpecialImgList: data.specialImg ? [{url: data.specialImg}] : [],
        sponsorMiniImgList: data.routineImg ? [{url: data.routineImg}] : [],
        ...data,
        sponsorId: sponsorId,
      })
    }
    
  }

  submitForm = async() => {
    const {
      name,
      content,
      sponsorId,
      // sponsorImgList = [],
      sponsorLogoImgList = [],
      sponsorAdsImgList = [],
      sponsorSpecialImgList = [],
      sponsorMiniImgList = [],
    } = this.state

    if (!name) {
      message.info('请输入赞助商名称')
      return false
    }

    if (!content) {
      message.info('请填写小程序分享文案')
      return false
    }

    if (content.length > 12) {
      message.info(`小程序分享文案不得超过12个字`)
      return false
    }
    let param = {
      name,
      content,
      logo_img: sponsorLogoImgList.length > 0 ? sponsorLogoImgList[0].url : '',
      advert_img: sponsorAdsImgList.length > 0 ? sponsorAdsImgList[0].url : '',
      special_img: sponsorSpecialImgList.length > 0 ? sponsorSpecialImgList[0].url : '',
      routine_img: sponsorMiniImgList.length > 0 ? sponsorMiniImgList[0].url : '',
      sponsorId: sponsorId,
    }
    if (sponsorId !== 'add') {
      param = {...param, id: sponsorId}
    }
    this.setState({submitLoading: true})
    const res = await Api.updateSponsors(myTool.delObjVoidKey(param))
    this.setState({submitLoading: false})
    myTool.getApiData(res, () => {
      message.success(res.data.rtnMsg)
      this.props.history.push('/sponsorManage/sponsorList')
    })
  }

  render() {
    const {
      name,
      editType,
      content,
      submitLoading = false,
      sponsorLogoImgList = [],
      sponsorAdsImgList = [],
      sponsorSpecialImgList = [],
      sponsorMiniImgList = [],
      userId = '',
    } = this.state
    return (
      <React.Fragment>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/sponsorManage/sponsorList'>赞助商管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{`${editType === 'add' ? '创建' : '修改'}赞助商`}</Breadcrumb.Item>
        </Breadcrumb>
        <div className='u-page-wrap'>
          <div className="m-form-wrap pt30">
            <div className="item-box">
              <span className="label">赞助商名称</span>
              <Input 
                className='input'
                size='large'
                value={name}
                maxLength={30}
                onChange={(e) => {
                  this.setState({name: e.target.value.replace(regs.regNoSpace, '')})
                }}
              />
            </div>
            
            <div className="item-box">
              <span className="label">小程序分享文案</span>
              <Input 
                value={content}
                style={{width: 500}}
                maxLength={12}
                onChange={e => this.setState({content: e.target.value})}
                className='input'
                size='large'
              />
            </div>
           
            <div className="item-box">
              <Row>
                <Col span={1}></Col>
                <Col span={3}>赞助商logo</Col>
                <Col span={7}>赞助商广告</Col>
                <Col span={4}>专场图</Col>
                <Col span={4}>小程序分享图</Col>
              </Row>
            </div>
        
            <div className="item-box">
              <Row>
                <Col span={1}></Col>
                <Col span={3}>
                  <UploadImg
                    maxUpImg={1}
                    imgList={sponsorLogoImgList}
                    maxSize={209715200}
                    hasWH
                    actionUrl={`${Api.upLoadSponsorFile}`}
                    imgBasicUrl={Api.IMG_BASIC_URL}
                    changeImgList={(sponsorLogoImgList) => {
                      this.setState({sponsorLogoImgList})
                    }}
                  />
                  <span className="text-s">80*80</span>
                </Col>
                <Col span={7}>
                  <UploadImg
                    maxUpImg={1}
                    imgList={sponsorAdsImgList}
                    maxSize={209715200}
                    imgBasicUrl={Api.IMG_BASIC_URL}
                    hasWH
                    actionUrl={`${Api.upLoadSponsorFile}`}
                    changeImgList={(sponsorAdsImgList) => {
                      this.setState({sponsorAdsImgList})
                    }}
                  />
                  <span className="text-s">690*135 小于100kb</span>
                </Col>
                <Col span={4}>
                  <UploadImg
                    maxUpImg={1}
                    imgList={sponsorSpecialImgList}
                    maxSize={209715200}
                    hasWH
                    actionUrl={`${Api.upLoadSponsorFile}`}
                    imgBasicUrl={Api.IMG_BASIC_URL}
                    changeImgList={(sponsorSpecialImgList) => {
                      this.setState({sponsorSpecialImgList})
                    }}
                  />
                  <span className="text-s">220*146</span>
                </Col>
                <Col span={4}>
                  <UploadImg
                    maxUpImg={1}
                    imgList={sponsorMiniImgList}
                    maxSize={209715200}
                    hasWH
                    actionUrl={`${Api.upLoadSponsorFile}`}
                    imgBasicUrl={Api.IMG_BASIC_URL}
                    changeImgList={(sponsorMiniImgList) => {
                      this.setState({sponsorMiniImgList})
                    }}
                  />
                  <span className="text-s">420*336</span>
                </Col>
              </Row>
            </div>
        
            <div className="btn-box">
              <Link to={prevPage} className='cancel-text'>取消</Link>
              <Button 
                onClick={this.submitForm} 
                loading={submitLoading}
                type='primary'
              >{`${editType === 'add' ? '确认创建' : '保存'}`}</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default EditSponsor