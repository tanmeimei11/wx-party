//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function (e) {
    wx.redirectTo({
      url: '../detail/detail?id=22'
    })
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    console.log(e)
  },
  goDetail: function () {
    wx.redirectTo({
      url: '../detail/detail?id=22'
    })
  }
})