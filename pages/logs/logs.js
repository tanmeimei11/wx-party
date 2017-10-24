//logs.js
const util = require('../../utils/util.js')
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var request = require('../../utils/wxPromise.js').requestPromisify
var Promise = require('../../lib/es6-promise');
Page({
  data: {
    access_token: '',
    qrImg: 'https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg'
  },
  onLoad: function (e) {
    // this.getAccessToken()
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    request({
      url: '/tmpl/formid/submit',
      data: {
        formId: e.detail.formId
      }
    }).then(res => {
      console.log('发送成功')
    })

  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  getQrImage: function () {
    // wx.request({
    //   url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${this.data.access_token}`,
    //   method: 'POST',
    //   data: {
    //     scene: 'id=1',
    //     page: '../index/index'
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
    wx.request({
      url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${this.data.access_token}`,
      method: 'POST',
      data: {
        path: '../index/index'
      },
      success: res => {
        console.log('===')
        console.log(res)
        console.log('===')

        this.setData({
          // qrImg: res.data
        })
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
  },
  preview: function () {
    wx.previewImage({
      urls: ['https://inimg07.jiuyan.info/in/2017/07/07/B0382243-8A7C-32B2-8D0E-E68CC8AD6AA0.jpg']
    })
  }
})