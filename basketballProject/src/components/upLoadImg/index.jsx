/**
 * @file    index.jsx
 * @desc    上传图片
 * @author  易梦蝶
 * @update  20180326 
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import UpLoadImgModal from '../../components/upLoadImgModal'


class UploadImg extends Component {
  constructor() {
    super();
    this.state = {
      isloading: false,
      disabled: false,
      enlargeImg: '',
      showUploadImgModal: false,
      imgList: [],
    }
  }
  componentWillMount() {
    this.setState({
      imgList: this.props.imgList,
    })
  }
  componentWillReceiveProps(nextProp) {
    if (this.props.imgList !== nextProp.imgList) {
      this.setState({
        imgList: nextProp.imgList,
      })
    }
  }

  clickDelImg = (item) => {
    const func = async() => {
      this.setState({
        imgList: this.state.imgList.filter((item1, index) => item1 !== item ),
      })
    }
    func().then(() => {
      this.props.changeImgList(this.state.imgList)
    })
  }

  changeEnlargeImg = type => {
    const imgSum = this.state.imgList.length - 1
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


  render() {
    const {
      showUploadImgModal,
      imgList,
      activeImgIndex = 'no'
    } = this.state
    const {
      actionUrl,
      changeImgList,
      maxUpImg,
      maxSize,
      disabled,
      imgBasicUrl,
      hasWH,
    } = this.props
    return (
      <div className='m-up-img'>
        {imgList.length !== 0 &&
          <div className='img-list'>
            {imgList.map((item, index) => {
              let imgUrl = `${imgBasicUrl}${item.url}`
              return (
                <div key={index} className="item-box">
                  {!disabled &&
                    <div className='close-img' onClick={() => this.clickDelImg(item)}>
                      <i className='iconfont'>&#xe634;</i>
                    </div>
                  }
                  <div className='img'>
                    <div className='preview' onClick={() => {
                      this.setState({
                        activeImgIndex: index
                      })
                    }}>
                      <i className='iconfont'>&#xe625;</i>
                    </div>
                    <img alt={item.name} src={imgUrl} />
                  </div>
                </div>
              )
            })
            }
          </div>
        }
        {!disabled &&
          <div className='add-img-box' 
            onClick={() => {
              this.setState({
                showUploadImgModal: true
              })
            }}>
            <i className='iconfont'>&#xe618;</i>
            <p>最多{maxUpImg}张</p>
          </div>
        }
         <UpLoadImgModal
          visible={showUploadImgModal}
          onCancel={() => {
            this.setState({
              showUploadImgModal: false
            })
          }}
          imgBasicUrl={imgBasicUrl}
          defaultImgList={imgList}
          actionUrl={actionUrl}
          maxUpImg={maxUpImg}
          maxSize={maxSize}
          hasWH={hasWH}
          onOk={(imglibList) => {
            changeImgList(imglibList)
            this.setState({
              imgList: imglibList,
              showUploadImgModal: false,
            })
          }}
        />
        <Modal
          title={null}
          footer={null}
          width={800}
          visible={activeImgIndex !== 'no'}
          className='enlargeimg-modal'
          onCancel={() => {
            this.setState({
              activeImgIndex: 'no',
            })
          }}
        >
            {activeImgIndex !== 'no' && imgList.length > 0 && <img className='img' src={`${imgBasicUrl}${imgList[activeImgIndex].url}`} alt='' />}
            <span className='btn-changeimg prev' onClick={() => this.changeEnlargeImg('prev')} />
            <span className='btn-changeimg next' onClick={() => this.changeEnlargeImg('next')} />
        </Modal>
      </div>
    )
  }
}
UploadImg.propTypes = {
  actionUrl: PropTypes.string,
  changeImgList: PropTypes.func,
  maxUpImg: PropTypes.number,
  imgList: PropTypes.arrayOf(PropTypes.object),
  maxSize: PropTypes.number,
  disabled: PropTypes.bool,
}

export default UploadImg