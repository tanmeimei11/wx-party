let wxP = require('./wxPromise.js')
let wxPromisify = wxP.wxPromisify
let wxLoginPromise = wxPromisify(wx.login)
let wxCheckSessionPromise = wxPromisify(wx.checkSession)
let wxGetUserInfoPromise = wxPromisify(wx.getUserInfo)
let DOMAIN = wxP.DOMAIN
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
let wxTimeout = function (fn) { }
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
module.exports = {
  debug,
  wxRequest,
  wxInit,
  wxCheck,
  wxLogin
}