//app.js
var wxPromisify = require('./utils/wxPromise.js').wxPromisify
var requestPromisify = require('./utils/wxPromise.js').requestPromisify
let util = require('./utils/util.js')
App({
  globalData: {
    code: null,
    userInfo: null
  },
  onLaunch: function () {
  }
})