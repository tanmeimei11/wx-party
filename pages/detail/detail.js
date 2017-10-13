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
    curSwiperIdx: 0,
    headLine: {
      title: "摄影外拍：秋日童话的邂逅",
      desc: "发起人：犀牛"
    },
    infos: {
      sAddr: "杭州 西湖",
      time: "10月5日 14:00-19:00",
      detailAddr: "杭州市西湖区万塘路8号黄龙时代广场A1802",
      intro: "金秋十月，丹桂飘香，杭城大街小巷，飘着淡淡的桂花香……你说紫金港的桂花是什么味道呢？秋日的桂花雨，是触手可及的浪漫，每一朵都是惊喜。让我们来一场秋日的摄影聚会…  展开全部"
    },
    siginInUsers: [{
      avatar: "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
      sex: "male",
      nick: "犀牛",
      desc: "23岁  杭州.城西  互联网产品经理"
    }, {
      avatar: "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
      sex: "female",
      nick: "犀牛",
      desc: "23岁  杭州.城西  互联网产品经理"
    }]
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
        detailAddr: "杭州市西湖区万塘路8号黄龙时代广场A1802",
        intro: "金秋十月，丹桂飘香，杭城大街小巷，飘着淡淡的桂花香……你说紫金港的桂花是什么味道呢？秋日的桂花雨，是触手可及的浪漫，每一朵都是惊喜。让我们来一场秋日的摄影聚会…  展开全部"
      },
      siginInUsers: [{
        avatar: "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
        sex: "male",
        nick: "犀牛",
        desc: "23岁  杭州.城西  互联网产品经理"
      }, {
        avatar: "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
        sex: "female",
        nick: "犀牛",
        desc: "23岁  杭州.城西  互联网产品经理"
      }]
    })
  },
  swiperChange: function (e) {
    this.setData({
      curSwiperIdx: e.detail.current
    })
  }
})