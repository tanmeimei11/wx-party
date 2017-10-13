//index.js
//获取应用实例
const app = getApp()
let api = require('../../utils/api.js')
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
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
    // 数据
    requestPromisify({
      url: "/activity/detail",
      data: {
        id: 1233
      }
    }).then((res) => {
      if (res.succ && res.data) {
        this.getActiveInfo(res.data)
      } else {
        wx.showToast({
          title: '网络开小差了',
          image: '../image/toast-fail.png',
          duration: 2000
        })
      }
    })
  },
  getActiveInfo: function (data) {
    console.log(data)
    this.setData({
      headLine: {
        title: data.group_name,
        desc: "发起人：" + data.creator_name
      },
      infos: {
        sAddr: data.city_district,
        time: data.start_time,
        detailAddr: data.act_location,
        intro: data.act_desc
      },
      siginInUsers: data.joins
    })
  },
  swiperChange: function (e) {
    this.setData({
      curSwiperIdx: e.detail.current
    })
  }
})