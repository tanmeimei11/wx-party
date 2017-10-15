//index.js
//获取应用实例
const app = getApp()
let getLenStr = require('../../utils/util.js').getLenStr
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
Page({
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    curSwiperIdx: 0,
    id: '',
    userInfo: app.globalData.userInfo,
    isShowIntroAll: false,
    isShowInviteModal: false,
    isShowBookModal: false,
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '活动详情'
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
    if (this.data.id) {
      requestPromisify({
        url: "/activity/detail",
        data: {
          id: this.data.id
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
    }
  },
  lookMore: function () {
    console.log('more')
    this.setData({
      tempIntro: this.data.infos.intro,
      isShowIntroAll: false
    })
  },
  goBack: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  getLenStr: function (str) {
    var obj = getLenStr(str, 150)
    this.setData({
      isShowIntroAll: obj.all ? false : true
    })
    return obj.str
  },
  openInviteModal: function () {
    this.setData({
      isShowInviteModal: true
    })
  },
  closeInviteModal: function () {
    this.setData({
      isShowInviteModal: false
    })
  },
  openBookModal: function () {
    this.setData({
      isShowBookModal: true
    })
  },
  closeBookModal: function () {
    this.setData({
      isShowBookModal: false
    })
  },
  getActiveInfo: function (data) {
    this.setData({
      imgUrls: data.act_urls,
      headLine: {
        title: data.group_name,
        desc: `发起人：${data.creator_name}`
      },
      infos: {
        sAddr: data.city_district,
        time: data.start_time,
        detailAddr: data.act_location,
        intro: data.act_desc
      },
      tempIntro: this.getLenStr(data.act_desc),
      siginInUsers: data.joins,
      otherAct: `同城趴其他${data.other_act_count}个活动`
    })
  },
  swiperChange: function (e) {
    this.setData({
      curSwiperIdx: e.detail.current
    })
  }
})