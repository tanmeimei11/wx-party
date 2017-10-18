//logs.js
const util = require('../../utils/util.js')
const app = getApp()
let getLenStr = require('../../utils/util.js').getLenStr
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
Page({
  data: {
    title: '',
    logs: [],
    id: '',
    userInfo: app.globalData.userInfo,
    siginInUsers: [],
    qrImage: '',
    requestInyerval: 3000
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '签到'
    })

    // 取页面上的id
    this.setData({
      id: option.id,
      title: option.title
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
    console.log(this.data.id)
    if (this.data.id) {
      this.getRequest()
    }
  },
  getRequest: function () {
    return requestPromisify({
      url: "/activity/prepare",
      data: {
        id: this.data.id
      }
    }).then((res) => {
      if (res.succ && res.data) {
        this.getListInfo(res.data)
      } else {
        wx.showToast({
          title: '网络开小差了',
          image: '../../images/toast-fail.png',
          duration: 2000
        })
      }
    }).then(() => {
      setTimeout(() => {
        this.getRequest()
      }, this.data.requestInyerval)
    })
  },
  getListInfo: function (data) {
    this.setData({
      siginInUsers: data.list.map(this.getDescCollect),
      qrImage: data.act_qrcode_url
    })
  },
  getDescCollect: function (item) {
    var _desc = ''
    item.age && (_desc += `${item.age}岁`)
    if (item.city) {
      _desc += ` ${item.city}`
      item.district && (_desc += `.${item.district}`)
    } else {
      item.district && (_desc += ` ${item.district}`)
    }
    item.work && (_desc += ` ${item.work}`)
    return {
      avatar_url: item.avatar_url,
      name: item.name,
      personDesc: _desc,
      gender: item.gender
    }
  }

})