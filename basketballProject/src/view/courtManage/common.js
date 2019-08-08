import moment from 'moment'

export const canEditMonth = yearMonth => {
  const sellStartM = moment().format('YYYYMM') 
  const sellEndM = moment().add(31, 'days').format('YYYYMM')
  return moment(yearMonth, 'YYYYMM').isAfter(moment()) && yearMonth !== sellStartM && yearMonth !== sellEndM
}

export const canEditDay = day => {
  let canEdit = moment(day, 'YYYYMMDD').isAfter(moment().add(-1, 'days'))
  return canEdit
}

export const isSaleDate = day => {
  const saleStartDate = moment().add(-1, 'days')
    const saleEndDate = moment().add(31, 'days')
    const mData = moment(day, 'YYYYMMDD')
    const isBefore = saleStartDate.isBefore(mData)
    const isAfter = saleEndDate.isAfter(mData)
    let isSaleDate = false
    if (isBefore && isAfter){
      isSaleDate = true
    }
    return isSaleDate
}

export const getErrTImeIndex = (dataList) => {
  const newList = dataList.filter(item => !(!item.start && !item.end && !item.quantity && !item.price)).filter(item => !item.isDel)
    const timeArr = newList.map(item => {
      let i = ''
      i = `${item.start}${item.end}`
      return i
    })

    let errTImeIndex = [];
		timeArr.forEach((item, index) => {
      if(timeArr.indexOf(item) !== timeArr.lastIndexOf(item) && errTImeIndex.indexOf(item) === -1) {
        errTImeIndex.push(index);
      }
    })

    newList.forEach((item, index) => {
      const getTimeNum = time => {
        let num = 0
        num = Number(moment(time, 'HH:mm').format('HHmm'))
        return num
      }
      if (getTimeNum(item.start) >= getTimeNum(item.end)) {
        errTImeIndex.push(index)
      }
    })

    return errTImeIndex
}
