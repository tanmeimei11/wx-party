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
var requestPromisify = (() => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      // 添加DOMAIN
      if (!/^http/.test(obj.url)) {
        obj.url = DOMAIN + obj.url
      }
      // 添加token
      var _token = wx.getStorageSync('token')
      console.log(obj.url, _token)
      if (_token) {
        if (!obj.data) {
          obj.data = {}
        }
        obj.data.privateKey = _token
        // obj.data.privateKey = '12321'
      }
      if (isMock) {
        console.log('===== Begin mock request =====')
        console.log(obj)
        console.log(obj.data)
        console.log('============ End =============')
        resolve(require('../mock/' + mockConfig[obj.url]))
      } else {
        obj.success = function (res) {
          resolve(res.data)
        }
        obj.fail = function (res) {
          reject(res)
        }
        wx.request(obj)
      }
    })
  }
})()


// 检查登陆态
var checkLoginSession = function () {
  wxPromisify(wx.checkSession)()
    .then(() => {
      console.log('login')
      if (!wx.getStorageSync('token')) {
        console.log('token 过期')
        loginSession()
      } else {
        wxPromisify(wx.getUserInfo)()
      }
    }, () => {
      console.log('not login')
      // loginSession()
    }).catch(() => {
      console.log('not login')
      // loginSession()
    })
}
// 授权登录
var loginSession = function () {
  wxPromisify(wx.login)()
    .then(res => {
      console.log('登录')
      code = res.code
      return wxPromisify(wx.getUserInfo)()
    })
    .then(res => {
      console.log('接口')
      return requestPromisify({
        url: '/party/login',
        data: {
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      })
    }).then((res) => {
      console.log('token', res)
      if (res.succ && res.data) {
        wx.setStorageSync("token", res.data)
      }
    }).catch((error) => {
      console.log(error)
    })
}

checkLoginSession()
module.exports = {
  requestPromisify: requestPromisify,
  wxPromisify: wxPromisify,
  userInfo: userInfo
}