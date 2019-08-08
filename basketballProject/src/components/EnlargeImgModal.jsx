import React, {useState, useEffect} from "react";
import {Modal} from 'antd'

const EnlargeImgModal = React.memo((props) => {
  const [activeIndex, setActiveIndex] = useState(false)

  const changeEnlargeImg = type => {
    const imgSum = props.imgList.length - 1
    if (type === 'prev') {
      if (activeIndex === 0) {
        setActiveIndex(imgSum)
      } else {
        setActiveIndex(activeIndex - 1)
      }
    }
    if (type === 'next') {
      if (activeIndex === imgSum) {
        setActiveIndex(0)
      } else {
        setActiveIndex(activeIndex + 1)
      }
    }
  }

  useEffect(() => {
    setActiveIndex(props.activeIndex)
  }, [props.activeIndex])

  return (
    <Modal
      footer={null}
      title={null}
      width={800}
      visible={props.visible}
      className='enlargeimg-modal'
      onCancel={() => {
        props.onCancel()
      }}
    >
      {props.isVideo ? 
        <video width={700} src={activeIndex ? props.imgList[activeIndex] : props.imgList} controls="controls" /> :
        <img className='img' src={`${(activeIndex || activeIndex === 0) ? props.imgList[activeIndex] : props.imgList}`} alt='' />
      }
      {(activeIndex || activeIndex === 0) &&
        <React.Fragment>
          <span className='btn-changeimg prev' onClick={() => changeEnlargeImg('prev')} />
          <span className='btn-changeimg next' onClick={() => changeEnlargeImg('next')} />
        </React.Fragment>
      }
    </Modal>
  )
})

export default EnlargeImgModal