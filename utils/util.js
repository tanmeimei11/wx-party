const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return formatNumber(month) + '月' + formatNumber(day) + '日' + ' ' + [hour, minute].map(formatNumber).join(':')
}

/**
 * 个位参数加0
 * @param {*} n 
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取时间对象
 * @param {*} [time]  
 */
const getTimeObj = time => {

  var date = time ? new Date(time) : new Date()
  return {
    year: date.getFullYear(),
    month: formatNumber(date.getMonth() + 1),
    day: formatNumber(date.getDate()),
    hour: formatNumber(date.getHours()),
    minute: formatNumber(date.getMinutes()),
    second: formatNumber(date.getSeconds())
  }
}
/**
 * 
 * @param {*} startTime  开始时间
 * @param {*} endTime  结束时间
 * @reutrn 返回一个 时间段的字符串 mm-dd hh:mm ~ mm-dd hh:mm 
 */
const formatTimeToTime = (startTime, endTime) => {
  var _sDate = getTimeObj(startTime)
  var _eDate = getTimeObj(endTime)

  if (_sDate.day == _eDate.day) {
    return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].join(':')}~${[_eDate.hour, _eDate.minute].map(formatNumber).join(':')}`
  }
  return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].join(':')}~${_eDate.month}月${_eDate.day}日 ${[_eDate.hour, _eDate.minute].join(':')}`
}

/**
 * 截取固定长度的字符串
 * @param {*} str  截取的字符串
 * @param {*} realLen 截取的长度
 */
const getLenStr = (str, realLen) => {
  var len = str.length
  var truelen = 0
  for (var x = 0; x < len; x++) {
    var s = str.charCodeAt(x)
    if (s > 128) {
      truelen += 2
    } else {
      truelen += 1
    }
    if (truelen > realLen) {
      return {
        str: str.slice(0, x) + '...'
      }
    }
  }
  return {
    str: str,
    all: true
  }
}


module.exports = {
  getTimeObj,
  formatTime,
  getLenStr,
  formatTimeToTime
}