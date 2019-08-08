import React from 'react'
import {Icon, Button, message} from 'antd'
import axios from 'axios'
import './index.scss'
import EnlargeImgModal from '../../components/EnlargeImgModal'

class UpLoadVideo extends React.Component {
  state = {
    fileList: [],
  }

  render() {
    const {
      isloading = false,
      fileList,
      lookVideo,
    } = this.state
    const {
      maxNum,
      basicUrl,
      disabled,
      // maxSizeText,
    } = this.props

    const canUpLoad = !disabled && fileList.length !== maxNum
    return (
      <React.Fragment>
        <Button className={`m-uploadvideo-btn ${canUpLoad ? 'show' : ''}`}>
          <div className="uploadvideo-btn-text">
            <Icon type="upload" />
            {isloading ?
              <span className='loading'>上传中...</span> :
              <span>上传视频</span>
            }
          </div>
          <input 
            className='input-file'
            id='videoFile'
            name='file1'
            type="file" 
            disabled={disabled}
            multiple="multiple"
            accept="video/mpeg,video/mpg,video/mp4,video/mov,video/3gp,video/rmvb" 
            onChange={this.uploadpic} 
          />
        </Button>
        {fileList.length !== 0 &&
          <div className='m-video-link'>
            {fileList.map((item, i) => <div 
              key={i} 
              className='btn-text'
            >
              <span 
                onClick={() => {this.setState({lookVideo: `${basicUrl}${item}`})}}
              >视频{i + 1}</span>
              <i className='iconfont del' onClick={() => this.delVideo(item)}>&#xe634;</i>
            </div> )}
          </div>
        }
        {/* {canUpLoad && <span className="text-s">视频不大于{maxSizeText}</span>} */}
        <EnlargeImgModal 
          visible={!!lookVideo}
          imgList={lookVideo}
          isVideo
          onCancel={() => {
            this.setState({lookVideo: null})
          }}
        />
      </React.Fragment>
    )
  }


  componentWillMount() {
    this.updata(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initVideo !== nextProps.initVideo) {
      this.updata(nextProps)
    }
  }

  updata = (props) => {
    this.setState({
      fileList: props.initVideo
    })
  }

  delVideo = (url) => {
    const newFileList = this.state.fileList.filter(i => i !== url)
    this.setState({
      fileList: newFileList
    })
    this.props.changeVideo(newFileList)
  }

  uploadpic = (e) => {
    const clearFile = () => {
      document.getElementById('videoFile').setAttribute('type', 'text')
      setTimeout( () => {
        document.getElementById('videoFile').setAttribute('type', 'file')
      }, 100)
    }
    let files = e.target.files;
    let param = new FormData() 
    let videoSize = []
    for (let i = 0; i < files.length; i++) {
      let videoName;
      videoSize[i] = files[i].size;
      videoName = `video${i}`
      param.append(`${videoName}`, files[i]);
    } 
    console.log('videoSize', videoSize)
    if (videoSize.filter(i => i > this.props.maxSize).length !== 0) {
      message.info(`视频过大，请压缩后后再上传`)
      clearFile()
      return false
    }
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    }
    if (this.state.fileList.length + files.length > this.props.maxNum) {
      message.info(`最多上传${this.props.maxNum}个视频，请删除多余的视频后再上传`)
      clearFile()
      return false
    }
    // 添加请求头
    if (files.length > 0 && files.length <= this.props.maxNum) {
      this.setState({
        isloading: true
      }) 
      axios.post(this.props.actionUrl, param, config)
      .then(res => {
        clearFile()
        if (res.data.code === '000') {
          const newFileList = [...this.state.fileList, ...res.data.data]
          this.setState({
            fileList: newFileList
          })
          this.props.changeVideo(newFileList)
          this.props.changeImage && this.props.changeImage(res.data.image[0])
        } else {
          message.error(res.data.msg)
        }
        this.setState({
          isloading: false
        })
      })
    }
  }

}

export default UpLoadVideo