// const DOMAIN = 'https://activity.in66.com'
// const DOMAIN = 'http://10.10.106.127:30929'
const DOMAIN = 'http://10.10.106.127:30245/' //qa
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
        if (res.data) {
          resolve(res.data)
        }
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

var requestMock = (option) => {
  // 添加DOMAIN
  if (!/^http/.test(option.url)) {
    option.url = DOMAIN + option.url
  }
  if (isMock) {
    console.log('===== Begin mock request =====')
    console.log(option)
    console.log(option.data)
    console.log('============ End =============')
    option.success(require('../mock/' + mockConfig[option.url]))
    return
  }
  wx.request(option)
}

var request = (option) => {
  checkLoginSession(option).then(() => {
    // 添加token
    var _token = wx.getStorageSync('token')
    if (_token) {
      if (!option.data) {
        option.data = {}
      }
      option.data.privateKey = _token
    }
    // option.data.privateKey = '8d3c12936d21114f3fe218af9bf9ce76'
    // option.data.privateKey = '8d3c12936d21114f3fe218af9bf9ce76'
    requestMock(option)
  }, () => {
    loginSession(option)
  })
}

// 检查登陆态
var checkLoginSession = function (option) {
  return wxPromisify(wx.checkSession)()
    .then((res) => {
      if (!wx.getStorageSync('token')) {
        return loginSession(option)
      } else {
        return wxPromisify(wx.getUserInfo)()
      }
    }, () => {
      console.log('not login')
      loginSession(option)
    })
}
// 授权登录
var loginSession = function (option) {
  return wxPromisify(wx.login)()
    .then(res => {
      console.log('get code')
      console.log(res)
      code = res.code
      return wxPromisify(wx.getUserInfo)()
    })
    .then(res => {
      return wxPromisify(wx.request)({
        url: DOMAIN + '/party/login',
        data: {
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      })
    }).then((res) => {
      if (res.succ && res.data) {
        wx.setStorageSync("token", res.data)
      }
      return '1'
    }).catch((error) => {
      console.log(error)
    })
}

module.exports = {
  requestPromisify: wxPromisify(request),
  wxPromisify: wxPromisify,
  userInfo: userInfo
}