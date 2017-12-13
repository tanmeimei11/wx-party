//app.js
// var wxPromisify = require('./utils/wxPromise.js').wxPromisify
// var requestPromisify = require('./utils/wxPromise.js').requestPromisify
// let util = require('./utils/util.js')
var ga = require('./lib/ga.js');
var _v = require('./utils/config.js')._v;
var getDeviceInfo = require('./utils/client.js').getDeviceInfo;
var GoogleAnalytics = ga.GoogleAnalytics;
App({
  // ...
  tracker: null,
  getTracker: function () {
    if (!this.tracker) {
      // 初始化GoogleAnalytics Tracker
      this.tracker = GoogleAnalytics.getInstance(this)
        .setAppName('in同城趴')
        .setAppVersion(_v)
        .newTracker('UA-109725915-1'); //用你的 Tracking ID 代替
    }
    return this.tracker;
  },
  getDeviceInfo: getDeviceInfo,
  globalData: {
    code: null,
    userInfo: null,
    balanceIndex: 0,
    deviceInfo: null,
    orderNo: null
  },
  onLaunch: function () {}
  // ...
})