const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('－') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTimeObj = time => {
  var date = new Date(time)
  return {
    year: date.getFullYear(),
    month: formatNumber(date.getMonth() + 1),
    day: formatNumber(date.getDate()),
    hour: formatNumber(date.getHours()),
    minute: formatNumber(date.getMinutes()),
    second: formatNumber(date.getSeconds())
  }
}

const formatTimeToTime = (startTime, endTime) => {
  var _sDate = getTimeObj(startTime)
  var _eDate = getTimeObj(endTime)

  if (_sDate.day == _eDate.day) {
    return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].join(':')}~${[_eDate.hour, _eDate.minute].map(formatNumber).join(':')}`
  }

  return `${_sDate.month}月${_sDate.day}日 ${[_sDate.hour, _sDate.minute].join(':')}~${_eDate.month}月${_eDate.day}日 ${[_eDate.hour, _eDate.minute].join(':')}`

}

// 截取固定长度的字符串
function getLenStr(str, realLen) {
  var len = str.length
  console.log(len)
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
// const DOMAIN = 'http://10.10.106.127:30929'
const DOMAIN = 'https://activity.in66.com'

var isMock = true
var mockConfig = require('../mock/mockConfig')

let wxRequestPromise = function (option) {
  return new Promise((resolve, reject) => {
    console.log(option)
    // 添加DOMAIN
    if (!/^http/.test(option.url)) {
      option.url = DOMAIN + option.url
    }
    // 添加token
    var _token = wx.getStorageSync('token')
    if (_token) {
      if (!option.data) {
        option.data = {}
      }
      // option.data.privateKey = _token
    }
    option.data.privateKey = '84f7e69969dea92a925508f7c1f9579a'
    if (isMock) {
      console.log('===== Begin mock request =====')
      console.log(option)
      console.log(option.data)
      console.log('============ End =============')
      resolve(require('../mock/' + mockConfig[option.url]))
    } else {
      option.success = function (res) {
        resolve(res.data)
      }
      option.fail = function (res) {
        reject(res)
      }
      wx.request(option)
    }
  })
}

let wxPromise = require('./wxPromise.js').wxPromisify
// let wxRequestPromise = require('./wxPromise.js').requestPromisify
let wxPromisify = require('./wxPromise.js').wxPromisify
let wxLoginPromise = wxPromisify(wx.login)
let wxCheckSessionPromise = wxPromisify(wx.checkSession)
let wxGetUserInfoPromise = wxPromisify(wx.getUserInfo)

function wxLogin(next) {
  let code, encryptedData, iv, userInfo, token
  wxLoginPromise()
    .then(res => {
      console.log('wxLoginPromise')
      console.log(res)
      code = res.code
      return wxGetUserInfoPromise()
    })
    .then(res => {
      console.log('wxGetUserInfoPromise')
      console.log(res)
      userInfo = res.userInfo
      encryptedData = res.encryptedData
      iv = res.iv
      return wxRequestPromise({
        url: '/party/login',
        data: {
          code: code,
          encryptedData: encryptedData,
          iv: iv
        }
      })
    })
    .then(res => {
      console.log('wxRequestPromise login')
      console.log(res)
      if (res.succ && res.data) {
        wx.setStorageSync("token", res.data.token)
      }
      if (next) {
        console.log('===next===')
        return next
      }
      // return true
    }).catch((error) => {
      console.log(error)
    })
}

function wxCheck(next) {
  console.log('11')
  // console.log(next)
  return wxCheckSessionPromise()
    .then((res) => {
      // wx.getStorage({
      //   key: 'token',
      //   success: function (res) {
      console.log(res)
      //     if (res.data && res.data.length) {
            console.log('token check success ~')
            // console.log(next)
            return next()
          // } else {
          //   return wxLogin(next)
          // }
        // },
        // fail: function (err) {
        //   console.log("storageerr", err)
        //   return wxLogin(next)
        // }
      // })
    }, function () {
      console.log("=== check fail ~")
      return wxLogin(next)
    })
}

function request() {
  return wxCheck(wxRequestPromise)
}

module.exports = {
  request: request,
  wxCheck: wxCheck,
  wxLogin: wxLogin,
  getTimeObj: getTimeObj,
  formatTime: formatTime,
  getLenStr: getLenStr,
  formatTimeToTime: formatTimeToTime
}