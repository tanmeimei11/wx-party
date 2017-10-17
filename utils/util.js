const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTimeObj = time => {
  var date = new Date(time)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  }
}

const formatTimeToTime = (startTime, endTime) => {
  var _sDate = getTimeObj(startTime)
  var _eDate = getTimeObj(endTime)

  if (_sDate.day == _eDate.day) {
    return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].map(formatNumber).join(':')}~${[_eDate.hour, _eDate.minute].map(formatNumber).join(':')}`
  }

  return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].map(formatNumber).join(':')}~${_eDate.month}月${_eDate.day}日 ${[_eDate.hour, _eDate.minute].map(formatNumber).join(':')}`

}

// 截取固定长度的字符串
function getLenStr(str, realLen) {
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
  formatTime: formatTime,
  getLenStr: getLenStr,
  formatTimeToTime: formatTimeToTime
}