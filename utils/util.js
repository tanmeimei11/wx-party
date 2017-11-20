var extendAll = require('./extend')
var wxPromisify = require('./wxPromise.js').wxPromisify
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

/**
 * 格式化时间戳
 * @param {*} date 
 * @param {*} isShowWeek 
 */
const formatTime = (date, isShowWeek) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const week = weekdays[date.getDay()]
  if (isShowWeek) {
    return `${formatNumber(month)}月${formatNumber(day)}日 ${week} ${[hour, minute].map(formatNumber).join(':')}`
  }
  return `${formatNumber(month)}月${formatNumber(day)}日 ${[hour, minute].map(formatNumber).join(':')}`
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
    second: formatNumber(date.getSeconds()),
    week: weekdays[date.getDay()]
  }
}
/**
 * 
 * @param {*} startTime  开始时间
 * @param {*} endTime  结束时间
 * @reutrn 返回一个 时间段的字符串 mm-dd hh:mm ~ mm-dd hh:mm 
 */
const formatTimeToTime = (startTime, endTime, isShowWeek) => {
  var _sDate = getTimeObj(startTime)
  var _eDate = getTimeObj(endTime)

  if (_sDate.day == _eDate.day) {
    if (isShowWeek) {
      return `${_sDate.month}月${_sDate.day}日 ${_sDate.week} ${[_sDate.hour, _sDate.minute].join(':')}~${[_eDate.hour, _eDate.minute].map(formatNumber).join(':')}`
    }
    return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].join(':')}~${[_eDate.hour, _eDate.minute].map(formatNumber).join(':')}`
  }
  if (isShowWeek) {
    return `${_sDate.month}月${_sDate.day}日 ${_sDate.week} ${[_sDate.hour, _sDate.minute].join(':')}~${_eDate.month}月${_eDate.day}日 ${_eDate.week}  ${[_eDate.hour, _eDate.minute].join(':')}`
  }
  return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].join(':')}~${_eDate.month}月${_eDate.day}日 ${[_eDate.hour, _eDate.minute].join(':')}`
}


const year = getTimeObj().year
const getFutureYearArray = (num) => {
  var _thisYear = parseInt(getTimeObj().year)
  var _arr = []
  for (var i = 0; i < num; i++) {
    _arr.push(`${_thisYear + i}年`)
  }
  return _arr
}

/**
 * 根据数据初始化数组
 * @param {*} num 
 * @param {*} str 
 * @param {*} start 
 */
const getFullNumArray = (num, str = "", start = 0) => {
  var _arr = []
  for (var i = start; i < num; i++) {
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

/**
 * 加载images
 * @param {*} images  数组 src为image的url
 */
var loadImages = (images) => {
  if (!images) {
    return Promise.reject()
  }
  var imgPromiseList = []
  Object.keys(images).forEach((idx) => {
    var _val = images[idx]
    imgPromiseList.push(wxPromisify(wx.downloadFile)({
      url: _val.src
    }).then(res => {
      _val.local = res.tempFilePath
      return _val
    }))
  })
  return Promise.all(imgPromiseList)
}


/**
 * 画在中心的图片
 * @param {*} ctx 
 * @param {*} url 
 * @param {*} x 
 * @param {*} y 
 * @param {*} targetW 
 * @param {*} targetH 
 */
var drawImageInCenter = function (ctx, url, x = 0, y = 0, targetW = 0, targetH = 0) {
  return wxPromisify(wx.getImageInfo)({
    src: url
  }).then((res) => {
    // console.log(res)
    var _imgW = res.width
    var _imgH = res.height
    var clipW = _imgW
    var clipH = _imgH
    var scale = 1
    var cliX = 0
    var cliY = 0
    // 长图
    if (_imgW / _imgH > targetW / targetH) {
      scale = targetH / _imgH
      clipH = _imgH * scale
      clipW = _imgW * scale
      cliX = (targetW - clipW) / 2
    } else {
      scale = targetW / _imgW
      clipH = _imgH * scale
      clipW = _imgW * scale
      cliY = (targetH - clipH) / 2
    }
    // console.log(res.path, cliX + x, cliY + y, clipW, clipH)
    ctx.drawImage(res.path, cliX + x, cliY + y, clipW, clipH)
    // ctx.drawImage(res.path, x, y, clipW, clipH)
    // ctx.draw()
    return Promise.resolve()
  })
}

var baseMethods = {
  loadingIn: function (text) {
    wx.showLoading({
      title: text,
    })
  },
  loadingOut: function () {
    wx.hideLoading()
  },
  toastFail: function (text) {
    wx.showToast({
      title: text,
      image: '../../images/toast-fail.png',
      duration: 2000
    })
  },
  toastSucc: function (text) {
    wx.showToast({
      title: text,
      duration: 2000
    })
  }

}
var mutulPage = (data) => {
  var realData = data
  var _mixins = realData.mixins
  if (_mixins) {
    _mixins.forEach((sItem) => {
      // 这里不能用原来的那个对象 多个组件应用的的时候对象是引用 会出问题
      var item = extendAll({}, sItem)
      if (item.data) {
        realData.data = { ...realData.data,
          ...item.data
        }
        delete item.data
      }

      delete item.onLoad;
      var _methods = item
      realData = {
        ...realData,
        ...item,
        ...baseMethods
      }
    })
  }
  Page(realData)
}
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
  year,
  mutulPage,
  loadImages,
  drawImageInCenter
}