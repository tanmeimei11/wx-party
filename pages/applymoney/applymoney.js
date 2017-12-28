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
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs?id=333'
    })
  },
  onLoad: function () {}
})