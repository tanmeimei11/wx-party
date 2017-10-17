const DOMAIN = 'https://activity.in66.com'
var Promise = require('../lib/es6-promise');
var mockConfig = require('../mock/mockConfig')
var isMock = true
var globalCode = ''
var globalUserInfo = null
var userInfo = null

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
      if (_token) {
        if (!obj.data) {
          obj.data = {}
        }
        obj.data.privateKey = _token
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


module.exports = {
  requestPromisify: requestPromisify,
  wxPromisify: wxPromisify,
  userInfo: userInfo
}