//app.js
var wxPromisify = require('./utils/wxPromise.js').wxPromisify
var requestPromisify = require('./utils/wxPromise.js').requestPromisify

App({
  globalData: {
    code: '',
    userInfo: null
  },

  onLaunch: function () {
    // this.checkLoginSession()
  }
})