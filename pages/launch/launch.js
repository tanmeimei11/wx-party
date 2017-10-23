//index.js
//获取应用实例
const app = getApp()
var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
Page({
  data: {
    qnTokenUrl: '/promo/commonapi/qiniutoken',
    qnUrl: 'https://up.qbox.me'
  },
  onLoad: function () {
    // this.qnToken()
  },

})