//index.js
const app = getApp()
let request = require('../../utils/wxPromise.js').requestPromisify
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
    isJoinQun: false,
    trackSeed: '',
    joinQunQrcode: '',
    token: null
  },
  close: function (e) {
    this.setData({
      isJoinQun: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'in打印照片',
      desc: '和我一起0.01元抢1人高熊公仔',
      path: '/pages/index/index'
    }
  },
  joinQun: function (e) {
    // track(this, '------------------')
    this.setData({
      isJoinQun: true,
      joinQunQrcode: e.target.dataset.qrcodeUrl
    })
    // if (e.target.dataset.qrcodeUrl) {
    //   console.log(e.target.dataset.qrcodeUrl)
    // }
  },
  jumpToDetail: function (e) {
    if (e.target.dataset.id) {
      wx.navigateTo({
        url: '../detail/detail?id=' + e.target.dataset.id
      })
    }
  },
  switchTab1: function (e) {
    this.setData({
      currentList: 'qunList',
      hidden: false
    })
    this.loadMoreQun()
  },
  switchTab2: function (e) {
    this.setData({
      currentList: 'promoList',
      hidden: false
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
    console.log('loadMorePromo')
    if (this.data.noMorePromo) {
      console.log('noMorePromo')
      return
    }
    request({
      url: '/activity/groups',
      token: this.data.token
    }).then((res) => {
      if (res.succ && res.data) {
        // console.log(res.data)
        this.setData({
          promoList: this.data.promoList.concat(res.data),
          promoListLoaded: true
        })
        let self = this
        setTimeout(function () {
          self.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },
  loadMoreQun: function () {
    console.log('loadMoreQun')
    if (this.data.noMoreQun) {
      console.log('noMoreQun')
      return
    }
    request({
      url: '/citysocial/groups',
      token: this.data.token
    }).then((res) => {
      if (res.succ && res.data) {
        console.log(res.data)
        this.setData({
          qunList: this.data.qunList.concat(res.data),
          qunListLoaded: true
        })
        let self = this
        setTimeout(function () {
          self.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },
  onLoad() {
    console.log('onLoad')
    let self = this
    try {
      let token = wx.getStorageSync('token')
      if (token.length) {
        self.data.token = token
      }
    } catch (e) {
      // Do something when catch error
    }
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
    this.switchTab1()
  }
})
// checkString(str, len, tag) {
//   if (str && str.length > len) {
//     return str.substring(0, len) + tag
//   }
//   return str
// },