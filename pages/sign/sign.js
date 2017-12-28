//logs.js
const util = require('../../utils/util.js')
const app = getApp()
let getLenStr = require('../../utils/util.js').getLenStr
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
import track from '../../utils/track.js'
Page({
  data: {
    title: '',
    logs: [],
    id: '',
    userInfo: app.globalData.userInfo,
    siginInUsers: [],
    qrImage: '',
    requestInterval: 3000,
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_sign_enter'
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_sign_screen_enter')
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
    // console.log(this.data.id)
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
      console.log(res)
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
        var pageRouter = getCurrentPages()
        var len = pageRouter.length
        if (pageRouter[len - 1].route == 'pages/sign/sign') {
          this.getRequest()
        }
      }, this.data.requestInterval)
    })
  },
  getListInfo: function (data) {
    this.setData({
      siginInUsers: data.list,
      qrImage: data.act_qrcode_url
    })
    console.log(this.data.siginInUsers)
  },
  getDescCollect: function (item) {
    var _desc = ''
    if (item.age && item.age != 0) {
      _desc += `${item.age}岁`
    }
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
  },
  phonecall: function (num) {
    console.log(num.currentTarget.dataset.num)
    wx.makePhoneCall({
      phoneNumber: num.currentTarget.dataset.num
    })
  }

})