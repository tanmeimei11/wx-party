//logs.js
const util = require('../../utils/util.js')
const app = getApp()
let getLenStr = require('../../utils/util.js').getLenStr
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
Page({
  data: {
    logs: [],
    id: '',
    userInfo: app.globalData.userInfo,
    siginInUsers: [],
    qrImage: ''
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '签到'
    })

    // 取页面上的id
    this.setData({
      id: option.id
    })

    if (!this.data.userInfo) {
      wxPromisify(wx.getUserInfo)()
        .then((res) => {
          this.setData({
            userInfo: res.userInfo
          })
        })
    }
    // 数据
    console.log(this.data.id)
    if (this.data.id) {
      requestPromisify({
        url: "/activity/signins",
        data: {
          id: this.data.id
        }
      }).then((res) => {
        if (res.succ && res.data) {
          this.getListInfo(res.data)
        } else {
          wx.showToast({
            title: '网络开小差了',
            image: '../../images/toast-fail.png',
            duration: 2000
          })
        }
      })
    }
  },
  getListInfo: function (data) {
    this.setData({
      siginInUsers: data
    })
  }
})