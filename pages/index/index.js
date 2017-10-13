//index.js
const app = getApp()
var request = require('../../utils/wxPromise.js').requestPromisify
Page({
  data: {
    qunList: [],
    promoList: [],
    hidden: false
  },
  onLoad () {
    request({
      url: '/citysocial/groups'
    }).then((res) => {
      if (res.succ && res.data) {
        this.setData({
          qunList: res.data
        })
        let self = this
        setTimeout(function () {
          self.setData({
            hidden: true
          })
        }, 300)
      }
    })
  }
})