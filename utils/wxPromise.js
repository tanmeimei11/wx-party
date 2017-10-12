var Promise = require('../lib/es6-promise');
var a = require('../mock/a');
var debug = true

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
  if (debug) {
    return () => {
      return new Promise((resolve, reject) => {
        resolve(a)
      })
    }
  } else {
    return wxPromisify(wx.request)
  }

})()

module.exports = {
  loginPromisify: loginPromisify,
  requestPromisify: requestPromisify,
  wxPromisify: wxPromisify
}