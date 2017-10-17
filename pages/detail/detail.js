//index.js
//获取应用实例
const app = getApp()
var Promise = require('../../lib/es6-promise');
let getLenStr = require('../../utils/util.js').getLenStr
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
Page({
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    curSwiperIdx: 0,
    id: '',
    userInfo: app.globalData.userInfo,
    isShowIntroAll: false,
    isShowInviteModal: false,
    isShowBookModal: false,
    notShowOther: false,
    isOrgize: false,
    actStatus: '0',
    bookStatus: 0,
    // bookQrImg: '',
    actQrImg: '',
    images: {
      head: {
        src: "",
        local: ""
      },
      bottom: {
        src: "https://inimg01.jiuyan.info/in/2017/10/16/2BB3896A-650A-D7AD-F90B-88D0322F5038.jpg",
        local: ""
      },
      logo: {
        src: '',
        local: ""
      },
      avatar: {
        src: "",
        local: ""
      },
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来参加活动吧～',
      path: `pages/detail/detail?id=${this.data.id}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '活动详情'
    })

    // 取页面上的id
    this.setData({
      id: option.id || '10201'
    })

    if (option.prepage == 'apply') {
      this.setData({
        isShowBookModal: true
      })
    }

    if (!option.notShowOther) {
      this.setData({
        isShowOtherAct: true
      })
    }

    if (!this.data.userInfo) {
      wxPromisify(wx.getUserInfo)()
        .then((res) => {
          this.data.images.avatar.src = res.userInfo.avatarUrl
          this.setData({
            userInfo: res.userInfo,
            images: this.data.images
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
        console.log(res)
        if (res.succ && res.data) {
          this.getActiveInfo(res.data)
        } else {
          wx.showToast({
            title: '网络开小差了',
            image: '../../images/toast-fail.png',
            duration: 2000
          })
        }
        return 'a'
      })
    }
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
    console.log('2222')
    return {
      avatar_url: item.avatar_url,
      name: item.name,
      personDesc: _desc,
      gender: item.gender
    }
  },
  getQrImage: function () {
    this.getInternetImage(bookQrImg)
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
  openSign: function () {
    wx.redirectTo({
      url: `../sign/sign?id=${this.data.id}`
    })
  },
  openBook: function () {
    if (this.data.bookStatus == '1') { //0:未参与 1:已参与  2:已签到
      this.setData({
        isShowBookModal: true
      })
      return
    }
    requestPromisify({
      url: "/activity/join",
      data: {
        id: this.data.id
      }
    }).then((res) => {
      if (res.succ) {
        console.log(res.data)
        if (res.data == '1') {
          this.setData({
            isShowBookModal: true
          })
          return
        }
        wx.redirectTo({
          url: '../apply/apply?prepage=detail'
        })
      }
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
  getOneQrByRandom: function (arr) {
    var len = arr.length;
    var _idx = Math.floor(Math.random() * (len - 1))
    return arr[_idx].assistant_url
  },
  getActiveInfo: function (data) {
    // this.data.images.logo.src = data.share_qrcode_url
    this.data.images.logo.src = 'https://inimg01.jiuyan.info/in/2017/10/15/7F0C1C09-F71E-F0D9-45E8-A00C102CF065.jpg'
    this.data.images.head.src = data.act_url[0]
    this.setData({
      imgUrls: data.act_url,
      headLine: {
        title: data.act_name,
        desc: `发起人：${data.creator_name}`
      },
      infos: {
        sAddr: data.city_district,
        time: formatTimeToTime(data.start_time, data.end_time),
        detailAddr: data.act_location,
        intro: data.act_desc
      },
      tempIntro: this.getLenStr(data.act_desc),
      siginInUsers: data.joiners.map(this.getDescCollect),
      // bookQrImg: this.getOneQrByRandom(data.assistants),
      actQrImg: data.share_qrcode_url,
      otherAct: `同城趴其他${data.other_act_count}个活动`,
      images: this.data.images,
      bookStatus: data.join_status,
      isOrgize: data.is_org,
      actStatus: data.act_status
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
        console.log('loadimg finish')
        console.log(this.data.images)
        var ctx = wx.createCanvasContext('firstCanvas')
        var _images = this.data.images

        // 画头上的背景
        ctx.drawImage(_images.head.local, 0, 0, 750, 545)
        // 画底部背景
        ctx.drawImage(_images.bottom.local, 0, 545, 750, 321)
        // 画头像
        ctx.drawImage(_images.avatar.local, 311, 132, 128, 128)
        // 画二维码
        ctx.drawImage(_images.logo.local, 275, 444, 200, 200)

        // 画文字
        var title = getLenStr(this.data.headLine.title, 20)
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
            console.log('saveImage start')
            this.saveImage(res.tempFilePath)
          })
        }, 100)
      }).catch((error) => {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          image: '../../images/toast-fail.png',
          duration: 2000
        })
      })
  },
  saveImage: function (file) {
    wxPromisify(wx.authorize)({
      scope: 'scope.writePhotosAlbum'
    }).then(() => {
      console.log('授权成功')
      wxPromisify(wx.saveImageToPhotosAlbum)({
          filePath: file
        })
        .then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            duration: 2000
          })
        })
    }, () => {
      wx.hideLoading()
      wx.showToast({
        title: '保存失败',
        image: '../../images/toast-fail.png',
        duration: 2000
      })
    })

  },
  swiperChange: function (e) {
    this.setData({
      curSwiperIdx: e.detail.current
    })
  }
})