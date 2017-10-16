//index.js
//获取应用实例
const app = getApp()
var Promise = require('../../lib/es6-promise');
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
    images: {
      head: {
        src: "http://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg",
        local: ""
      },
      bottom: {
        src: "http://inimg01.jiuyan.info/in/2017/10/16/2BB3896A-650A-D7AD-F90B-88D0322F5038.jpg",
        local: ""
      },
      logo: {
        src: "http://inimg01.jiuyan.info/in/2017/10/15/6CD1BC72-FBBB-BC4E-528E-50943934E20F.jpg",
        local: ""
      },
      avatar: {
        src: "http://inimg01.jiuyan.info/in/2017/03/13/B0ABE39F-0BD4-D9D8-2312-2DEE4E9F5B4F-1JyqzdYV.jpg",
        local: ""
      },
    }
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
    this.composeImage()
  },
  composeImage: function () {
    console.log('composeImage')

  },
  getInternetImage: function (url) {
    wxPromisify(wx.authorize)({
      scope: 'scope.writePhotosAlbum'
    }).then(() => {
      wxPromisify(wx.downloadFile)({
          url: url
        })
        .then(res => {
          wxPromisify(wx.saveImageToPhotosAlbum)({
              filePath: res.tempFilePath
            })
            .then(res => {
              wx.showToast({
                title: '保存成功',
                duration: 2000
              })
            })
        })
    })

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
  loadImages: function (images) {
    var imgPromiseList = []
    Object.keys(images).forEach((idx) => {
      var _val = images[idx]
      imgPromiseList.push(wxPromisify(wx.downloadFile)({
        url: _val.src
      }).then(res => {
        _val.local = res.tempFilePath
        return _val
      }))
    })
    return Promise.all(imgPromiseList)
  },
  compose: function () {
    wx.showLoading({
      title: '正在生成图片...',
    })
    this.loadImages(this.data.images)
      .then(() => {
        var ctx = wx.createCanvasContext('firstCanvas')
        var _images = this.data.images
        // 画头上的背景
        ctx.drawImage(_images.head.local, 0, 0, 750, 545)
        // 画底部背景
        ctx.drawImage(_images.bottom.local, 0, 545, 750, 321)
        // 画头像
        ctx.drawImage(_images.avatar.local, 311, 132, 128, 128)
        // 画二维码
        setTimeout(() => {
          ctx.drawImage(_images.logo.local, 275, 444, 200, 200)
        }, 100)
        // 画文字
        var title = util.getLenStr('龙井户外徒步旅行烧烤龙井户外徒步旅行烧烤龙井户外徒步旅行烧烤龙井户外徒步旅行烧烤', 20)
        ctx.draw()
        setTimeout(() => {
          ctx.setTextAlign('center')
          ctx.setFillStyle('white')
          ctx.setFontSize(24)
          ctx.fillText('参加了一个活动', 375, 300)
          ctx.draw(true)
          ctx.setFontSize(40)
          ctx.fillText(title.str, 375, 348)
          ctx.draw(true)
          wxPromisify(wx.canvasToTempFilePath)({
            canvasId: 'firstCanvas',
          }).then(res => {
            this.saveImage(res.tempFilePath)
          })
        }, 100)
      })
  },
  saveImage: function (file) {
    wxPromisify(wx.authorize)({
      scope: 'scope.writePhotosAlbum'
    }).then(() => {
      wxPromisify(wx.saveImageToPhotosAlbum)({
          filePath: file
        })
        .then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            duration: 1000
          })
        })
    })

  },
  swiperChange: function (e) {
    this.setData({
      curSwiperIdx: e.detail.current
    })
  }
})