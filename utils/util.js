const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return formatNumber(month) + '月' + formatNumber(day) + '日' + ' ' + [hour, minute].map(formatNumber).join(':')
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
let wxP = require('./wxPromise.js')
let wxPromisify = wxP.wxPromisify
let wxLoginPromise = wxPromisify(wx.login)
let wxCheckSessionPromise = wxPromisify(wx.checkSession)
let wxGetUserInfoPromise = wxPromisify(wx.getUserInfo)
let DOMAIN = wxP.DOMAIN
console.log(wxP.DOMAIN)
let isMock = wxP.isMock
let debug = true
let mockConfig = wxP.mockConfig
let wxLog = function (msg) {
  if (debug) {
    console.log(msg)
  }
}
let getStoragePromise = function () {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data && res.data.length) {
          wxLog('===== getStorage token success token:' + res.data)
          resolve(res.data)
        } else {
          reject('===== getStorage token is empty')
        }
      },
      fail: function (err) {
        return reject(err)
      }
    })
  })
}
let wxRequestPromise = function (option) {
  return new Promise((resolve, reject) => {
    // wxLog(option)
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
      option.data.privateKey = _token
    }
    // option.data.privateKey = '84f7e69969dea92a925508f7c1f9579a'
    if (isMock) {
      // wxLog('===== Begin mock request')
      // wxLog(option)
      // wxLog(option.data)
      // wxLog('===== End')
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
let wxLogin = function (next) {
  let code, encryptedData, iv, userInfo, token
  return wxLoginPromise()
    .then(res => {
      wxLog('===== wxLoginPromise')
      wxLog(res)
      code = res.code
      return wxGetUserInfoPromise({
        lang: 'zh_CN'
      })
    })
    .then(res => {
      wxLog('===== wxGetUserInfoPromise')
      wxLog(res)
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
      wxLog('===== wxRequestPromise login')
      wxLog(res)
      wxLog('===== token')
      wxLog(res.data)
      if (res.succ && res.data) {
        wx.setStorageSync("token", res.data)
      }
      if (next) {
        return next(code, res.data, userInfo, encryptedData, iv)
      }
      return res.succ
    }).catch((err) => {
      wxLog(err)
    })
}
let wxLogout = function () {
  try {
    return wx.removeStorageSync('token')
  } catch (e) {
    wxLog('===== logout error:' + e)
  }
}
let wxRelogin = function (next) {
  // wxLogout()
  return wxLogin(next)
}
let wxTimeout = function (fn) {}
let wxCheck = function (next) {
  return wxCheckSessionPromise()
    .then((res) => {
      wxLog('===== wxCheckSessionPromise success ~')
      return getStoragePromise()
        .then(function (token) {
          return next()
        }, function () {
          return wxRelogin(next)
        })
    }, function () {
      wxLog("===== check fail ~")
      return wxRelogin(next)
    }).catch(function (err) {
      wxLog("===== throw err ~")
      wxLog(err)
    })
}
let wxInit = function (app) {
  if (app.globalData.inited) {
    return true
  }
  wxLogin(function (code, token, userInfo) {
    app.globalData.inited = true
    app.globalData.code = code
    app.globalData.token = token
    app.globalData.userInfo = userInfo
    wx.setStorageSync('token', token)
  })

  return true
}
let wxRequest = function (options) {
  return wxCheck(function (code, token, userInfo) {
    // wxLog(code, token, userInfo)
    return wxRequestPromise(options)
  })
}
let downLoadInternetImage = function (url) {
  wxPromisify(wx.authorize)({
    scope: 'scope.writePhotosAlbum'
  }).then(() => {
    wxPromisify(wx.downloadFile)({
      url: url
    }).then(res => {
      wxPromisify(wx.saveImageToPhotosAlbum)({
          filePath: res.tempFilePath
        })
        .then(res => {
          wx.showToast({
            title: '保存成功',
            duration: 2000
          })
        })
    })
  })
}
let getOneQrByRandom = function (arr) {
  var len = arr.length;
  var _idx = Math.floor(Math.random() * (len - 1))
  return arr[_idx]
}
module.exports = {
  debug,
  getOneQrByRandom,
  downLoadInternetImage,
  wxRequest,
  wxInit,
  wxCheck,
  wxLogin,
  getTimeObj,
  formatTime,
  getLenStr,
  formatTimeToTime
}