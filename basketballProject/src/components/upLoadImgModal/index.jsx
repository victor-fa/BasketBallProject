/**
 * @file    index.jsx
 * @desc    上传图片
 * @author  易梦蝶
 * @update  20180326 
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { message, Button, Modal,Input} from 'antd'
import './index.scss'

class UpLoadImgModal extends Component {
  constructor() {
    super();
    this.state = {
      previewVisible: false,
      previewImgUrl: '',
      isloading: false,

      imglibList: [],
      imglibNumList: [],
      showNetworkImg: false,
    }
  }

  componentDidMount() {
    this.updataprops(this.props)
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.defaultImgList !== nextprops.defaultImgList) {
      this.updataprops(nextprops)
    }
  }

  updataprops = (props) => {
    if (props.defaultImgList) {
      this.setState({
        imglibList: props.defaultImgList,
        imglibNumList: props.defaultImgList
      })
    }
  }

  uploadpic = (e) => {
    const clearFile = () => {
      document.getElementById('imgFile').setAttribute('type', 'text')
      setTimeout( () => {
        document.getElementById('imgFile').setAttribute('type', 'file')
      }, 100)
    }
    let files = e.target.files;
    let param = new FormData() 
    let imgSize = []
    for (let i = 0; i < files.length; i++) {
      let imgName;
      imgSize[i] = files[i].size;
      imgName = `image${i}`
      param.append(`${imgName}`, files[i]);
    } 
    console.log('imgSize', imgSize)
    if (imgSize.filter(i => i > this.props.maxSize).length !== 0) {
      message.info(`图片过大，请缩小尺寸后再上传`)
      clearFile()
      return false
    }
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    }
    if (this.state.imglibList.length + files.length > this.props.maxUpImg) {
      message.info(`最多上传${this.props.maxUpImg}张图，请删除多余的图片后再上传`)
      clearFile()
      return false
    }
    // 添加请求头
    if (files.length > 0 && files.length <= this.props.maxUpImg) {
      this.setState({
        isloading: true
      }) 
      axios.post(this.props.actionUrl, param, config)
      .then(res => {
        clearFile()
        if (res.data[`${this.props.hasWH ? 'retCode' : 'code'}`] === '000') {
          let arr = []
          if (this.props.hasWH) {
            arr = res.data.data
          } else {
            arr = res.data.data.map((u, i) => {
              let a = {}
              a.url = u
              a.name = `file${i}`
              return a
            })
          }
          const newImglibList = [ ...this.state.imglibList, ...arr ]
          const newImglibNumList = [ ...this.state.imglibNumList, ...arr ]
          newImglibList.forEach((item,index) => {
            item.index = index
          })
          newImglibNumList.forEach((item,index) => {
            item.index = index
          })
          this.setState({
            imglibList: newImglibList,
            imglibNumList: newImglibNumList
          })
        } else {
          message.error(res.data[`${this.props.hasWH ? 'rtnMsg' : 'msg'}`])
        }
        this.setState({
          isloading: false
        })
      })
    }
  }


  clickDelImglib = (item) => {
    this.setState({
      imglibList: this.state.imglibList.filter((item1, index) => item1 !== item ),
      imglibNumList: this.state.imglibNumList.filter((item1, index) => item1 !== item ),
    })
  }

 
  clickSortImglib = (item, index) => {
    if (this.state.imglibNumList.indexOf(item) === -1 && this.state.imglibNumList.length >= 10) {
      message.info(`最多可选${this.props.maxUpImg}张`)
      return false
    }

    const func = async() => {

      let newList = []
      if (this.state.imglibNumList.indexOf(item) !== -1) {
        newList = this.state.imglibNumList.filter((item1, index1) => item !== item1)
      } else {
        newList = [ ...this.state.imglibNumList, item ]
      }

      await this.setState({
        imglibNumList: newList
      })

      this.changeNumList()
    }
    func()
  }

  clickClearNumList = () => {
    this.setState({
      imglibNumList: []
    })
  }

  changeEnlargeImg = type => {
    const imgSum = this.state.imglibList.length - 1
    if (type === 'prev') {
      if (this.state.activeImgIndex === 0) {
        this.setState({
          activeImgIndex: imgSum
        })
      } else {
        this.setState({
          activeImgIndex: this.state.activeImgIndex - 1
        })
      }
    }
    if (type === 'next') {
      if (this.state.activeImgIndex === imgSum) {
        this.setState({
          activeImgIndex: 0
        })
      } else {
        this.setState({
          activeImgIndex: this.state.activeImgIndex + 1
        })
      }
    }
  }

  changeNumList = () => {
    const {
      imglibList = [],
      imglibNumList = []
    } = this.state
    let noNumList = imglibList.filter(i => !imglibNumList.some(s => s.url === i.url))
    this.setState({
      imglibList: [ ...this.state.imglibNumList, ...noNumList ]
    })
  }

  render() {
    // console.log('imglibList',this.state.imglibList)
    // console.log('imglibNumList',this.state.imglibNumList)
    // console.log('imgList',this.state.imgList)
    const {
      imglibNumList = [],
      imglibList = [],
      showNetworkImg,
      networkImg,
      activeImgIndex = 'no',
    } = this.state
    const  {
      // noNetworkImg,
      visible,
      onCancel,
      onOk,
      maxUpImg,
      imgBasicUrl
    } = this.props
    const imglist = imglibList.map((item,index) => {
      let obj = {}
      obj = {...item}
      obj.key = index
      return obj
    })
    
    return (
      <div className='m-imglib-wrap'>
        <Modal
          title={`上传图片`}
          visible={visible}
          className='m-imglib-modal'
          onCancel={() => {onCancel()}}
          onOk={() => {onOk(imglist)}}
          width={800}
        >
          <div className='top-btn-box'>
            <Button type='primary' className='up-img-btn'>
              {this.state.isloading ?
                <span className='loading'>上传中...</span> :
                <span>上传本地图片</span>
              }
              <input 
                className='input-file'
                id='imgFile'
                name='file1'
                type="file" 
                multiple="multiple"
                accept="image/png,image/gif,image/jpeg"
                onChange={this.uploadpic} 
              />
            </Button>
            {/* {!noNetworkImg &&
              <p className='btn-text' 
                onClick={() => {
                  this.setState({
                    showNetworkImg: true
                  })
                }}>
                添加网络图片
              </p>
            } */}
            <p className='text-s'>点击图片可排序</p>
            {imglibNumList.length !== 0 &&
              <span onClick={this.clickClearNumList} className='btn btn-b clearbtn'>清除排序</span>
            }
          </div>
          {imglibList.length !== 0 &&
          <div className='imglib-list'>
            {imglibList.map((item, index) => {
              let imgUrl = `${imgBasicUrl}${item.url}`
              return (
                <div key={index} className={`imglib-item ${imglibNumList.indexOf(item) !== -1 && 'has-num'}`}>
                  {imglibNumList.indexOf(item) !== -1 &&
                    <div className='num-box'>
                      <span>{imglibNumList.indexOf(item) + 1}</span>
                    </div>
                  }
                  <div onClick={() => this.clickDelImglib(item)} className='del-box'>
                    <i className='iconfont'>&#xe634;</i>
                  </div>
                  <div onClick={() => this.clickSortImglib(item, index)} className='imglib-box'>
                    <img alt='' src={imgUrl} />
                  </div>
                  <div onClick={() => {
                    this.setState({
                      activeImgIndex: index
                    })
                  }} className='preview'>
                    <i className='iconfont'>&#xe625;</i>
                  </div>
                </div>
              )
            })
            }
          </div>
          }
        </Modal>
        <Modal
          title='添加网络图片'
          visible={showNetworkImg}
          width={700}
          onCancel={() => {
            this.setState({
              showNetworkImg: false,
              networkImg: ''
            })
          }}
          onOk={() => {
            if (networkImg) {
              if (imglibList.length < maxUpImg) {
                this.setState({
                  imglibList: [...imglibList, {url: networkImg}],
                  showNetworkImg: false,
                  networkImg: '',
                })
              } else {
                message.info(`最多只能添加${maxUpImg}张，请删除多余的图片再添加`)
                this.setState({
                  showNetworkImg: false,
                })
              }
            } else {
              this.setState({
                showNetworkImg: false,
              })
            }
          }}
        >
          <Input 
            class='input' 
            placeholder='图片地址'
            style={{width: '640px'}}
            value={networkImg}
            onChange={(e) => {
              this.setState({
                networkImg: e.target.value
              })
            }}
          />
        </Modal>
        <Modal
          footer={null}
          title={null}
          width={800}
          visible={activeImgIndex !== 'no'}
          className='enlargeimg-modal'
          onCancel={() => {
            this.setState({
              activeImgIndex: 'no',
            })
          }}
        >
          {activeImgIndex !== 'no' && imglibList.length > 0 && <img className='img' src={`${imgBasicUrl}${imglibList[activeImgIndex].url}`} alt='' />}
          <span className='btn-changeimg prev' onClick={() => this.changeEnlargeImg('prev')} />
          <span className='btn-changeimg next' onClick={() => this.changeEnlargeImg('next')} />
        </Modal>
      </div>
    )
  }
}

UpLoadImgModal.propTypes = {
  actionUrl: PropTypes.string,
  changeImgList: PropTypes.func,
  maxUpImg: PropTypes.number,
  imgList: PropTypes.arrayOf(PropTypes.object),
  maxSize: PropTypes.number,
  disabled: PropTypes.bool,
  defaultImgList: PropTypes.arrayOf(PropTypes.object),
}

export default UpLoadImgModal