//index.js
const app = getApp()
let request = require('../../utils/wxPromise.js').requestPromisify
Page({
  data: {
    qunList: [],
    promoList: [],
    hidden: false,
    scrollHeight: 0,
    noMore: false
  },
  // checkString(str, len, tag) {
  //   if (str && str.length > len) {
  //     return str.substring(0, len) + tag
  //   }
  //   return str
  // },
  upper: function () {
    console.log("upper"); 
  },
  lower: function (e) {
    console.log("lower")
    let that = this;
    setTimeout(function () { that.loadMore(); }, 300);
  },
  scroll: function (e) {
    console.log("scroll")
  },
  loadMore: function () {
    console.log('loadMore')
    if (this.noMore) {
      console.log('noMore')
      return 
    }
    request({
      url: '/citysocial/groups'
    }).then((res) => {
      if (res.succ && res.data) {
        console.log(res.data)
        this.setData({
          qunList: this.data.qunList.concat(res.data)
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
          scrollHeight: res.windowHeight
        });
      }
    })
    this.loadMore()
  }
})