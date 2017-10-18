//index.js
//获取应用实例
const app = getApp()
var Promise = require('../../lib/es6-promise');
let getLenStr = require('../../utils/util.js').getLenStr
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
import track from '../../utils/track.js'

Page({
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_detail_entry',
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
    transferImageUrl: '',
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
      curtain: {
        src: "https://inimg01.jiuyan.info/in/2017/10/18/B29CD73D-7BA7-7EC6-5176-9EB0263BF8B0.jpg",
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
    return {
      title: `"${getLenStr(this.data.headLine.title,30).str}"火热报名中,快来加入吧～`,
      path: `pages/detail/detail?id=${this.data.id}`,
      imageUrl: this.data.transferImageUrl,
      success: function (res) {
        // 转发成功
        track(this, 'h5_tcpa_active_transfer_succ', [`id=${this.data.id}`])
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
      id: option.id || '10502'
    })


    if (option.prepage == 'apply') {
      this.setData({
        isShowBookModal: true
      })
    }

    if (!option.notShowOther) {
      track(this, 'h5_tcpa_active_detail_entry_byshare', [`id=${this.data.id}`])
      this.setData({
        isShowOtherAct: true
      })
    } else {
      track(this, 'h5_tcpa_active_detail_entry_byindex', [`id=${this.data.id}`])
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
        if (res.succ && res.data) {
          this.getActiveInfo(res.data)
        }
      })
    }
  },
  transferTrack: function () {
    track(this, 'h5_tcpa_active_transfer_friend', [`id=${this.data.id}`])
  },
  contactTrack: function () {
    track(this, 'h5_tcpa_active_contact', [`id=${this.data.id}`])
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
    this.setData({
      tempIntro: this.data.infos.intro,
      isShowIntroAll: false
    })
  },
  goBack: function () {
    track(this, 'h5_tcpa_other_act')
    wx.redirectTo({
      url: '../index/index?tab=2'
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
    track(this, 'h5_tcpa_active_invite_click', [`id=${this.data.id}`])
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
    track(this, 'h5_tcpa_active_signup_click', [`id=${this.data.id}`])
    wx.redirectTo({
      url: `../sign/sign?id=${this.data.id}&title=${this.data.headLine.title}`
    })
  },
  openBook: function () {
    track(this, 'h5_tcpa_active_book_click', [`id=${this.data.id}`])
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
        if (res.data == '1') {
          this.setData({
            isShowBookModal: true,
            bookStatus: '1'
          })
          return
        }
        wx.redirectTo({
          url: `../apply/apply?prepage=detail&id=${this.data.id}`
        })
      }
    })
  },
  openBookModal: function () {
    track(this, 'h5_tcpa_active_book_again_click', [`id=${this.data.id}`])
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
    this.data.images.logo.src = data.share_qrcode_url
    // this.data.images.logo.src = 'https://inimg01.jiuyan.info/in/2017/10/15/7F0C1C09-F71E-F0D9-45E8-A00C102CF065.jpg'
    if (data.act_url.length) {
      this.data.images.head.src = data.act_url[0]
    }
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
      otherAct: `in同城趴更多${data.other_act_count}个活动正在报名中`,
      images: this.data.images,
      bookStatus: data.join_status,
      isOrgize: data.is_org,
      actStatus: data.act_status,
      transferImageUrl: data.act_url[0]
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
  getActFirstImg: function (ctx, url) {
    return wxPromisify(wx.getImageInfo)({
      src: url
    }).then((res) => {
      var _imgW = res.width
      var _imgH = res.height
      var targetW = 750
      var targetH = 545
      var clipW = _imgW
      var clipH = _imgH
      var scale = 1
      var x = 0
      var y = 0
      // 长图
      if (_imgW / _imgH > targetW / targetH) {
        scale = targetH / _imgH
        clipH = _imgH * scale
        clipW = _imgW * scale
        x = (targetW - clipW) / 2
      } else {
        scale = targetW / _imgW
        clipH = _imgH * scale
        clipW = _imgW * scale
        y = (targetH - clipH) / 2
      }

      // 画头上的背景
      ctx.save()
      // console.log(x, y, clipW, clipH)
      ctx.drawImage(res.path, x, y, clipW, clipH)
      ctx.draw()
      ctx.restore()
    })
  },
  compose: function () {
    wx.showLoading({
      title: '正在生成图片...',
    })
    track(this, 'h5_tcpa_active_compose_click', [`id=${this.data.id}`])
    this.loadImages(this.data.images)
      .then(() => {
        // console.log('loadimg finish')
        var ctx = wx.createCanvasContext('firstCanvas')
        var _images = this.data.images
        this.getActFirstImg(ctx, _images.head.local)
          .then(() => {
            // 画底部背景
            ctx.drawImage(_images.bottom.local, 0, 545, 750, 321)
            // 画蒙层
            ctx.drawImage(_images.curtain.local, 0, 0, 750, 545)
            // 画头像
            ctx.drawImage(_images.avatar.local, 311, 132, 128, 128)
            // 画二维码
            ctx.drawImage(_images.logo.local, 275, 444, 200, 200)

            // 画文字
            var title = getLenStr(this.data.headLine.title, 20)
            ctx.draw(true)

            setTimeout(() => {
              ctx.setTextAlign('center')
              ctx.setFillStyle('white')
              ctx.setFontSize(24)
              ctx.fillText('参加了一个活动', 375, 300)
              ctx.draw(true)
              ctx.setFontSize(40)
              ctx.fillText(title.str, 375, 352)
              ctx.draw(true)
              wxPromisify(wx.canvasToTempFilePath)({
                canvasId: 'firstCanvas',
              }).then(res => {
                this.saveImage(res.tempFilePath)
              })
            }, 100)
          })
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
      wx.hideLoading()
      wxPromisify(wx.saveImageToPhotosAlbum)({
          filePath: file
        })
        .then(res => {
          wx.showToast({
            title: '图片已保存到相册',
            duration: 2000
          })
        })
    }, () => {
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