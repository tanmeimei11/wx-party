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

const getFutureYearArray = (num) => {
  var _thisYear = parseInt(getTimeObj().year)
  var _arr = []
  for (var i = 0; i < num; i++) {
    _arr.push(`${_thisYear + i}年`)
  }
  return _arr
}
const getFullNumArray = (num, str = "", start = 0) => {
  var _arr = []
  for (var i = start; i <= num; i++) {
    _arr.push(`${formatNumber(i)}${str}`)
  }
  return _arr
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

let getOneQrByRandom = function (arr) {
  var len = arr.length;
  var _idx = Math.floor(Math.random() * (len - 1))
  return arr[_idx]
}

const weekdays = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
const year = getTimeObj().year
let getMonthDayWeekArr = () => {
  var monthNum = 12
  var perMonthDay = []

  for (var i = 1; i <= monthNum; i++) {
    var _day = new Date(year, i, 0).getDate()
    for (var j = 1; j <= _day; j++) {
      var weekDay = new Date(`${year}/${formatNumber(i)}/${formatNumber(j)}`).getDay()
      perMonthDay.push(`${i}月${j}日${weekdays[weekDay]}`)
    }
  }
  return perMonthDay
}

getMonthDayWeekArr()
module.exports = {
  getOneQrByRandom,
  getTimeObj,
  formatTime,
  getLenStr,
  formatNumber,
  formatTimeToTime,
  getFullNumArray,
  getFutureYearArray,
  getMonthDayWeekArr,
  weekdays,
  year
}