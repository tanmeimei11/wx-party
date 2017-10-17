//logs.js
const util = require('../../utils/util.js')
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var Promise = require('../../lib/es6-promise');
Page({
  data: {
    access_token: ''
  },
  onLoad: function (e) {},
  getQrImage: function () {
    wx.request({
      url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${this.data.access_token}`,
      method: 'POST',
      data: {
        scene: urlencode('id=1'),
        page: 'pages/index/index'
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  getAccessToken: function () {
    var url = `https://api.weixin.qq.com/cgi-bin/token`
    wx.request({
      url: url,
      data: {
        grant_type: 'client_credential',
        appid: 'wx48155bddeea6fb66',
        secret: '020c936597fde8569460709311aba7bb'
      },
      success: (res) => {
        console.log(res)
        this.setData({
          access_token: res.data.access_token
        })
        this.getQrImage()
      }
    })
  }
})