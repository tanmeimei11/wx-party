//index.js
const app = getApp()
let request = require('../../utils/wxPromise.js').requestPromisify
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
    promoListLoaded: false
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
      currentList: 'qunList'
    })
    this.loadMoreQun()
  },
  switchTab2: function (e) {
    this.setData({
      currentList: 'promoList'
    })
    this.loadMorePromo()
  },
  upper: function () {
    console.log("upper");
  },
  promoLower: function () {
    console.log("promoLower")
    let that = this;
    setTimeout(function () { that.loadMorePromo(); }, 300);
  },
  lower: function (e) {
    console.log("lower")
    let that = this;
    setTimeout(function () { that.loadMoreQun(); }, 300);
  },
  scroll: function (e) {
    console.log("scroll")
  },
  loadMorePromo: function () {
    console.log('loadMorePromo')
    if (this.noMorePromo) {
      console.log('noMorePromo')
      return
    }
    request({
      url: '/activity/groups'
    }).then((res) => {
      if (res.succ && res.data) {
        console.log(res.data)
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
    if (this.noMoreQun) {
      console.log('noMore')
      return
    }
    request({
      url: '/citysocial/groups'
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
    let self = this;
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