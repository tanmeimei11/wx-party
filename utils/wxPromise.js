// const DOMAIN = 'https://activity.in66.com'
const DOMAIN = 'http://10.10.106.127:30929'
var Promise = require('../lib/es6-promise');
var mockConfig = require('../mock/mockConfig')
// var isMock = true
var isMock = false
var globalCode = ''
var globalUserInfo = null
var userInfo = null
var code = ''

/**
 * 封装wxPromisefy
 */
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

// 封装request 并且mock
var requestPromisify = ((not) => {
  return function (option = {}) {
    console.log(option)
    return new Promise((resolve, reject) => {
      checkLoginSession(option).then(() => {
        console.log('开始实际的请求')
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
      }, () => {
        console.log('reject')
      }).catch((error) => {
        console.log(error)
      })
    })
  }
})()

// 检查登陆态
var checkLoginSession = function (option) {
  return wxPromisify(wx.checkSession)()
    .then(() => {
      if (!wx.getStorageSync('token')) {
        console.log('token 过期')
        return loginSession(option)
      } else {
        return wxPromisify(wx.getUserInfo)()
      }
    }, () => {
      console.log('not login')
      loginSession(option)
    }).catch(() => {
      console.log('not login')
      loginSession(option)
    })
}
// 授权登录
var loginSession = function (option) {
  return wxPromisify(wx.login)()
    .then(res => {
      console.log('get code')
      code = res.code
      return wxPromisify(wx.getUserInfo)()
    })
    .then(res => {
      console.log('get userInfo')
      console.log('请求token')
      return wxPromisify(wx.request)({
        url: DOMAIN + '/party/login',
        data: {
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      })
    }).then((res) => {
      console.log(res.data.succ)
      return new Promise((resolve, reject) => {
        if (res.data.succ && res.data.data) {
          console.log('拿到token')
          wx.setStorageSync("token", res.data.data)
          console.log('重新请求')
          if (option) {
            requestPromisify(option)
          }
          reject()
        }
      })
    }).catch((error) => {
      console.log(error)
    })
}

module.exports = {
  requestPromisify: requestPromisify,
  wxPromisify: wxPromisify,
  userInfo: userInfo
}