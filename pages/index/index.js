const app = getApp()
let util = require('../../utils/util.js')
let request = util.wxRequest 
// let request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
Page({
  data: {
    qunList: [],
    promoList: [],
    hidden: false,
    scrollHeight: 0,
    noMoreQun: false,
    noMorePromo: false,
    currentList: 'qunList',
    qunListLoaded: false,
    promoListLoaded: false,
    loadingMoreQun: false,
    loadingMorePromo: false,
    isJoinQun: false,
    trackSeed: '',
    promoNum: 0,
    currentCursorQun: 0,
    currentCursorPromo: 0
  },
  downloadQrcode: function() {},
  close: function (e) {
    this.setData({
      isJoinQun: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'in同城趴本周活动报名中，点击查看',
      desc: 'in同城趴，出门一起玩，认识新朋友',
      path: '/pages/index/index'
    }
  },
  joinQun: function (e) {
    this.setData({
      isJoinQun: true
    })
  },
  jumpToDetail: function (e) {
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.dataset.id + '&notShowOther=true'
      })
    }
  },
  switchTab1: function (e) {
    if (this.data.promoListLoaded && this.data.currentList == 'qunList') {
      return
    }
    this.setData({
      currentCursorQun: 0,
      noMoreQun: false,
      qunList: [],
      currentList: 'qunList',
      hidden: false,
      currentCursorQun: 0
    })
    this.loadMoreQun()
  },
  switchTab2: function (e) {
    if (this.data.currentList == 'promoList') {
      return
    }
    this.setData({
      currentCursorPromo: 0,
      noMorePromo: false,
      promoList: [],
      currentList: 'promoList',
      hidden: false,
      currentCursorPromo: 0
    })
    this.loadMorePromo()
  },
  upper: function () {
    console.log("upper");
  },
  promoLower: function () {
    console.log("promoLower")
    let that = this;
    setTimeout(function () {
      that.loadMorePromo();
    }, 300);
  },
  lower: function (e) {
    console.log("lower")
    let that = this;
    setTimeout(function () {
      that.loadMoreQun();
    }, 300);
  },
  scroll: function (e) {
    console.log("scroll")
  },
  loadMorePromo: function () {
    if (this.data.loadingMorePromo) {
      return
    }
    this.data.loadingMorePromo = true
    console.log('loadMorePromo')
    
    if (this.data.noMorePromo) {
      console.log('noMorePromo')
      this.setData({
        hidden: true
      })
      return
    }
    let params = {
      url: '/activity/groups',
      data: {
        limit: 10,
        cursor: this.data.currentCursorPromo
      }
    }
    request(params).then((res) => {
      if (res.succ && res.data && res.data.list) {
        // console.log(res.data)
        if (!res.data.list.length) {
          this.setData({
            noMorePromo: true
          })
        }
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].end_time = null
          if (res.data.list[i].start_time && res.data.list[i].end_time) {
          res.data.list[i].time = util.formatTimeToTime(res.data.list[i].start_time, res.data.list[i].end_time)
          } else {
            res.data.list[i].time = util.formatTime(new Date(res.data.list[i].start_time))
          }
        }
        this.setData({
          promoList: this.data.promoList.concat(res.data.list),
          promoListLoaded: true,
          currentCursorPromo: res.data.current_cursor || null
        })
      } else {
        this.setData({
          noMorePromo: true
        })
      }
      this.data.loadingMorePromo = false
      let self = this
      setTimeout(function () {
        self.setData({
          hidden: true
        })
      }, 300)
    })
  },
  loadMoreQun: function () {
    if (this.data.loadingMoreQun) {
      return
    }
    this.data.loadingMoreQun = true
    console.log('loadMoreQun')
    if (this.data.noMoreQun) {
      console.log('noMoreQun')
      this.setData({
        hidden: true
      })
      return
    }
    let params = {
      url: '/citysocial/groups',
      data: {
        limit: 10,
        cursor: this.data.currentCursorQun
      }
    }
    request(params).then((res) => {
      console.log(res)
      if (res.succ && res.data && res.data.list) {
        if (!res.data.list.length) {
          this.setData({
            noMoreQun: true
          })
        }
        
        this.setData({
          qunList: this.data.qunList.concat(res.data.list),
          qunListLoaded: true,
          promoNum: res.data && res.data.promo_num || 0,
          currentCursorQun: res.data.current_cursor || null
        })
      } else {
        this.setData({
          noMoreQun: true
        })
      }
      this.data.loadingMoreQun = false
      let self = this
      setTimeout(function () {
        self.setData({
          hidden: true
        })
      }, 300)
    })
  },
  onLoad(options) {
    console.log(currentList)
    let currentList = (options.tab == '2' && 'promoList') || 'qunList'
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight - 50
        });
      }
    })
    wx.setNavigationBarTitle({
      title: 'in 同城趴'
    })
    if (currentList == 'qunList') {
      this.switchTab1()
    } else {
      this.switchTab2()
    }
  }
})
