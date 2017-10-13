const DOMAIN = 'https://activity.in66.com'
var Promise = require('../lib/es6-promise');
var mockConfig = require('../mock/mockConfig')
var isMock = true
var globalCode = ''
var globalUserInfo = null

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

/**
 * 检查登陆态
 */
var checkLoginSession = () => {
  wxPromisify(wx.checkSession)()
    .then(() => {
      if (!wx.getStorageSync('token')) {
        loginSession()
      }
    }, () => {
      loginSession()
    }).catch(() => {
      loginSession()
    })
}
/**
 * 授权登录
 */
var loginSession = () => {
  wx.showToast({
    title: '授权失败',
    image: '../images/toast-fail.png',
    duration: 2000
  })
  loginPromisify()
    .then(res => {
      globalCode = res.code
      console.log(globalCode)
      return wxPromisify(wx.getUserInfo)()
    })
    .then(res => {
      console.log(res.userInfo)
      return requestPromisify({
        url: '/login',
        data: {
          code: globalCode,
          encryptedData: res.encryptedData,
          iv: res.encryptedData
        }
      })
    }).then((res) => {
      console.log(res.data.token)
      if (res.succ && res.data) {
        wx.setStorageSync("token", res.data.token)
      }
    }).catch((error) => {
      // wx.showToast({
      //   title: '授权失败',
      //   image: '../images/toast-fail.png',
      //   duration: 2000
      // })
      loginSession()
    })
}


// 封装request 并且mock
var requestPromisify = (() => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      // 添加DOMAIN
      if (!/^http/.test(obj.url)) {
        obj.url = DOMAIN + obj.url
      }
      if (isMock) {
        resolve(require('../mock/' + mockConfig[obj.url]))
      } else {
        obj.success = function (res) {
          resolve(res)
        }
        obj.fail = function (res) {
          reject(res)
        }
        wx.request(obj)
      }
    })
  }
})()

var loginPromisify = wxPromisify(wx.login)
checkLoginSession()

module.exports = {
  loginPromisify: loginPromisify,
  requestPromisify: requestPromisify,
  wxPromisify: wxPromisify
}