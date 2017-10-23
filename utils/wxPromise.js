// 本地
let DOMAIN = 'http://10.10.106.127:30929'
// DOMAIN = 'https://activity.in66.com'
DOMAIN = 'http://qaactivity.in66.com'
let isMock = true
isMock = false
let debug = true
let mockConfig = require('../mock/mockConfig');
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

var request = (option) => {
  console.log('-------before request------')
  wxCheckLogin(option).then((token) => {
    console.log('-------get token------')
    console.log(token)
    console.log('-------start request------')
    if (!option.data) {
      option.data = {}
    }
    option.data.privateKey = token
    // 添加DOMAIN
    if (!/^http/.test(option.url)) {
      option.url = DOMAIN + option.url
    }
    if (isMock) {
      console.log('===== Begin mock request =====')
      console.log(option.data)
      console.log('============ End =============')
      option.success(require('../mock/' + mockConfig[option.url]))
      return
    }
    wx.request(option)
  })
}

// 检查登陆态和token
var wxCheckLogin = function (option) {
  console.log('-------checkSession------')
  return wxPromisify(wx.checkSession)()
    .then((res) => {
      if (!wx.getStorageSync('token')) {
        console.log('-------login------')
        return wxLogin()
      } else {
        return wx.getStorageSync('token')
      }
    }, () => {
      wxLogin(option)
    })
}


var wxLogin = function (option) {
  console.log('-------get code------')
  return wxPromisify(wx.login)()
    .then(res => {
      code = res.code
      console.log('-------get UserInfo------')
      return wxPromisify(wx.getUserInfo)({
        lang: 'zh_CN'
      })
    })
    .then(res => {
      console.log('-------login request------')
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
        console.log('-------login succ------')
        wx.setStorageSync("token", res.data)
        if (option) {
          console.log('-------登陆后重新请求------')
          request(option)
        }
      }
      return res.data
    }).catch((error) => {
      console.log(error)
    })
}

module.exports = {
  mockConfig,
  DOMAIN,
  isMock,
  wxPromisify,
  requestPromisify: wxPromisify(request)
}