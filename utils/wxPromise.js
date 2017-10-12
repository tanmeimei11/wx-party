var Promise = require('../lib/es6-promise');
var mockConfig = require('../mock/mockConfig')
var isMock = true
var domain = 'https://activity.in66.com'

// 封装wxPromisefy
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


var loginPromisify = wxPromisify(wx.login)
// 封装request 并且mock
var requestPromisify = (() => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      // 添加domain
      if (!/^http/.test(obj.url)) {
        obj.url = domain + obj.url
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
  loginPromisify: loginPromisify,
  requestPromisify: requestPromisify,
  wxPromisify: wxPromisify
}