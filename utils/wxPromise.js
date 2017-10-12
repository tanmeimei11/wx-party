var Promise = require('../lib/es6-promise');
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
var requestPromisify = wxPromisify(wx.request)

module.exports = {
  loginPromisify: loginPromisify,
  requestPromisify: requestPromisify
}