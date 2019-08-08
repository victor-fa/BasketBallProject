import React, {useState, useEffect} from "react";
import EnlargeImgModal from '../EnlargeImgModal'
import './index.scss'

const TableImages = (props) => {

  const [imgList, setImgList] = useState([])
  const [showEnlargeImgModal, setShowEnlargeImgModal] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect( false, () => {
    setImgList(props.imgList)
  })

  const changeIndex = index => {
    setShowEnlargeImgModal(true)
    setActiveIndex(index)
  }

  const imgArr = [...imgList].splice(0, 2)

  return (
    <React.Fragment>
      {imgArr.map((item, index) => (
        <img 
          width='30'
          height='30'
          className='img pointer' 
          key={item} 
          src={item}
          alt=''
          onClick={() => changeIndex(index)}
        />
      ))}
      {imgList.length > 2 && 
        <i 
          className='iconfont u-tableImg-more'
          onClick={() => changeIndex(2)}
        >&#xe670;</i>
      }
      <EnlargeImgModal 
        visible={showEnlargeImgModal}
        imgList={imgList}
        activeIndex={activeIndex}
        onCancel={() => {
          setShowEnlargeImgModal(false)
          props.onCancel && props.onCancel()
        }}
      />
    </React.Fragment>
  )
}

export default TableImages