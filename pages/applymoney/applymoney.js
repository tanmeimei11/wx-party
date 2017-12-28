//index.js
//获取应用实例
const app = getApp()
let api = require('../../utils/api.js')
var loginPromisify = require('../../utils/wxPromise.js').loginPromisify
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    alipayID: '',
    name: '',
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_sign_enter',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs?id=333'
    })
  },
  inputalipay: function (e) {
    this.data.alipayID = e.detail.value
  },
  inputname: function (e) {
    this.data.name = e.detail.value
  },
  jiesuan: function () {
    console.log(this.data.alipayID, this.data.name)
    wx.showModal({
      title: '申请成功',
      content: '我们将在1-3个工作日之内完成结算',
      confirmText: '确定',
      showCancel: false
    })
  },
  onLoad: function () {}
})