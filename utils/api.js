let API_HOST = 'http://activity.in66.com'
let QUN_LILS = '/citysocial/groups'
let DEBUG = true
let Mock = require('mock.js')

function ajax(data = '', fn, method = "get", header = {}) {
  if (!DEBUG) {
    wx.request({
      url: API_HOST + data,
      method: method ? method : 'get',
      data: {},
      header: header ? header : { "Content-Type": "application/json" },
      success: function (res) {
        fn(res)
      }
    })
  } else {
  }
}
module.exports = {
  ajax: ajax
}