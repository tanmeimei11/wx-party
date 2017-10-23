//launch.js
//获取应用实例
const app = getApp()
var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var uploadImageToQiniu = require('../../utils/api.js').uploadImageToQiniu
Page({
  data: {
    qnTokenUrl: '/promo/commonapi/qiniutoken',
    qnUrl: 'https://up.qbox.me'
  },
  onLoad: function () {
    this.chooseImage()
  },
  chooseImage: function () {
    wxPromisify(wx.chooseImage)({
      count: 1,
      success: function (res) {}
    }).then(res => {
      var tempFilePaths = res.tempFilePaths[0]
      uploadImageToQiniu(tempFilePaths)
    })
  }
})