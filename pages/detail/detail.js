//index.js
//获取应用实例
const app = getApp()
let api = require('../../utils/api.js')
var loginPromisify = require('../../utils/wxPromise.js').loginPromisify
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    curSwiperIdx: 0
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '活动详情'
    })
  },
  swiperChange: function (e) {
    console.log(e.detail.current)
    this.setData({
      curSwiperIdx: e.detail.current
    })
  }
})