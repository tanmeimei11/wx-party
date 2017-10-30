//circle.js
//获取应用实例
var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var mutulPage = require('../../utils/util.js').mutulPage
var promo = require('../../components/promoCard/index.js')
var commont = require('../../components/commentCard/index.js')
var user = require('../../components/userCard/index.js')
var photos = require('../../components/photosCard/index.js')
mutulPage({
  mixins: [promo, commont, user, photos],
  data: {
    isShowOtherCircle: false,
    circleStatus: 'join', // join joinnostatus notjoin
    allStatus: [],
    otherStatus: [],
    isLoadingCircle: false,
    noMoreCircle: false
  },
  onLoad: function () {
    var self = this
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight
        });
      }
    })
    this.getPageData()
  },
  loading: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      isLoadingCircle: true
    })
  },
  loadingOut: function () {
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        isLoadingCircle: false
      })
    }, 300)
  },
  getPageData: function () {
    if (this.data.isLoadingCircle) {
      return
    }
    this.loading()
    request({
      url: '/friend/feed',
      data: {
        cursor: 0,
        limit: 10
      }
    }).then((res) => {
      if (res.succ) {
        if (!res.data.hasJoin || this.data.noMoreCircle) {
          this.getOtherData()
          this.setData({
            isShowOtherCircle: true,
          })
          return
        }
        this.initCircleData(res.data)
      }
    }, () => {
      this.loadingOut()
      wx.showToast({
        title: '网路错误',
        icon: 'fail',
        duration: 2000
      })
    })
  },
  getOtherData: function () {
    request({
      url: '/friend/rec',
      data: {
        cursor: 0,
        limit: 10
      }
    }).then((res) => {
      if (res.succ) {
        this.initOtherData(res.data)
      }
    })
  },
  initOtherData: function (data) { // 推荐
    var otherStatus = data.list
    otherStatus.forEach((item, idx) => {
      if (item.feed_type != 'publish') {
        var _promo = item.activity_info
        _promo.time = formatTimeToTime(_promo.start_time)
      }
    })
    console.log(otherStatus)
    var _otherStatus = this.data.otherStatus
    this.setData({
      otherStatus: [..._otherStatus, ...otherStatus],
    })
    this.loadingOut()
  },
  initCircleData: function (data) { // 趴友圈
    var allStatus = data.list
    allStatus.forEach((item, idx) => {
      if (item.feed_type != 'publish') {
        var _promo = item.activity_info
        _promo.time = formatTimeToTime(_promo.start_time)
      }
    })
    var _allStatus = this.data.allStatus
    this.setData({
      allStatus: [..._allStatus, ...allStatus],
      noMoreCircle: true
    })
    this.loadingOut()
  },
  scrollChange: function (e) {
    if (!this.data.isShowOtherCircle) {
      this.getPageData()
    } else {
      this.getOtherData()
    }
  }
})