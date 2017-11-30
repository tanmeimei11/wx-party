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
  onLoad: function () {
    requestPromisify({
      url: '/citysocial/groups'
    }).then((res) => {})
    // 使用 Mock
    api.ajax('', function (res) {
      //这里既可以获取模拟的res
      // this.setData({
      //   list: this.data
      // })
    });
    // console.log(this.data.list)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log('login')
      // 在没有 open-type=getUserInfo 版本的兼容处理

      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
    }
  },
  getUserInfo: function () {
    // console.log('login')
    var that = this
    // console.log(this)
    wxPromisify(wx.getUserInfo)()
      .then(res => {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      })
  }
})