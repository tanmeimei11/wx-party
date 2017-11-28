const app = getApp()
let getLenStr = require('../../utils/util.js').getLenStr
var mutulPage = require('../../utils/util.js').mutulPage
var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var payModal = require('../../components/payModal/index.js')
var seckillDetail = require('../../components/seckill/detail/index.js')
var toastWhite = require('../../components/toastWhite/index.js')
import track from '../../utils/track.js'
mutulPage({
  mixins: [payModal, seckillDetail, toastWhite],
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_detail_entry',
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    curSwiperIdx: 0,
    id: '',
    userInfo: app.globalData.userInfo,
    isShowIntroAll: false,
    isShowIntroLess: false,
    isShowInviteModal: false,
    isJoin: false,
    isShowOtherAct: false,
    isOrgize: false,
    actStatus: '0',
    bookStatus: 0,
    transferImageUrl: '',
    actQrImg: '',
    isShowVerifyModal: false,
    isSubmitFormId: true,
    newDesc: false,
    joinTips: [
      '1、点击下方按钮联系小助手',
      '2、回复“报名”，获取二维码链接',
      '3、选择对应活动二维码，长按识别',
      '4、进群，报名成功'
    ],
    sessionFromQr: wx.getStorageSync('token'),
    priceInfo: {},
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
  onLoad: function (options) {
    track(this, 'h5_tcpa_detail_screen_enter')
    wx.showLoading({
      title: '加载中...'
    })
    wx.setNavigationBarTitle({
      title: '活动详情'
    })

    // 取页面上的id
    this.setData({
      shareUserId: options.shareUserId || '',
      id: options.id || '11001',
      sessionFrom: `activity_${options.id}`,
      sessionFromQr: `activitymanager_${options.id}`,
      sessionFromAct: `typeactivity_${options.id}`
    })

    options.isShowPayModal && this.showPayModal()
    // 秒杀分享
    if (options.shareUserId) {
      track(this, 'h5_tcpa_share_page', [`id=${this.data.id}`, `user_id=${options.shareUserId}`])
    }
    // 分渠道
    if (options.from) {
      wx.setStorageSync("from", options.from)
      track(this, 'h5_tcpa_detail_enter', [`cannel_id=${options.from}`, `active_id=${this.data.id}`])
    }

    // 是否显示导航条
    if (!options.isShowOtherAct) {
      track(this, 'h5_tcpa_active_detail_entry_byshare', [`id=${this.data.id}`])
      this.setData({
        isShowOtherAct: true
      })
    } else {
      track(this, 'h5_tcpa_active_detail_entry_byindex', [`id=${this.data.id}`])
    }

    // 审核中
    if (options.prepage == 'launch') {
      this.setData({
        isShowVerifyModal: true
      })
    } else if (options.prepage == 'apply') { // 支付
      this.setData({
        promoDelayMoney: true
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
      request({
        url: "/activity/detail",
        data: {
          id: this.data.id,
          shareUserId: this.data.shareUserId
        }
      }).then((res) => {
        if (res.succ && res.data) {
          this.getActiveInfo(res.data)
        }
      })
    }
  },
  showPayModal: function () {
    request({
      url: '/activity/cost',
      data: {
        act_id: this.data.id,
        is_seckill_finish: this.data.seckill.is_seckill_finish
      }
    }).then(res => {
      if (res.succ) {
        var _preText = ''
        if (this.data.seckill.is_seckill_finish == 0) {
          _preText = '秒杀活动不支持鼓励金，'
        }
        // 计算的文案
        if (parseFloat(res.data.act_charge) > parseFloat(res.data.book_charge) && res.data.refund > 0) {
          res.data.desc = `＊${_preText}如果最终不参加，会扣除鸽子费¥${res.data.book_charge}，最终退款¥${res.data.refund}，一个工作日内退款`
        } else if (parseFloat(res.data.act_charge) >= parseFloat(res.data.book_charge) && res.data.refund <= 0) {
          res.data.desc = `＊${_preText}如果最终不参加，会扣除鸽子费¥${res.data.book_charge}，最终退款¥0`
        } else {
          res.data.desc = `＊鼓励金只抵扣活动费用，不抵扣鸽子费\n＊如果最终不参加，¥${res.data.book_charge}元鸽子费不会退款`
        }
        this.setData({
          priceInfo: res.data,
          isShowPayModal: true
        })
      }
    })
  },
  transferTrack: function () {
    track(this, 'h5_tcpa_active_transfer_friend', [`id=${this.data.id}`])
  },
  contactTrack: function () {
    track(this, 'h5_tcpa_active_contact', [`id=${this.data.id}`])
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
  getQrImage: function () {
    this.getInternetImage(bookQrImg)
  },
  getInternetImage: function (url) {
    wxPromisify(wx.authorize)({
      scope: 'scope.writePhotosAlbum'
    }).then(() => {
      return wxPromisify(wx.downloadFile)({
        url: url
      })
    }).then(res => {

      return wxPromisify(wx.saveImageToPhotosAlbum)({
        filePath: res.tempFilePath
      })
    }).then(res => {
      wx.showToast({
        title: '保存成功',
        duration: 2000
      })
    })
  },
  lookMore: function () {
    this.setData({
      tempIntro: this.data.infos.intro,
      isShowIntroAll: false,
      isShowIntroLess: true
    })
  },
  lookLess: function () {
    this.setData({
      tempIntro: this.data.tempLessIntro,
      isShowIntroLess: false,
      isShowIntroAll: true
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
    return obj.str.replace(/\\n/g, '\n')
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
  closeVerifyModal: function () {
    track(this, 'h5_tcpa_active_box_cancel')
    this.setData({
      isShowVerifyModal: false
    })
  },
  getAsisstantQrTrack: function () {
    track(this, 'h5_tcpa_active_box_astcode')
  },
  openSign: function () {
    track(this, 'h5_tcpa_active_signup_click', [`id=${this.data.id}`])
    wx.redirectTo({
      url: `../sign/sign?id=${this.data.id}&title=${this.data.headLine.title}`
    })
  },
  openBook: function () {
    if (this.data.seckill.seckillStatus == 'ready' || this.data.bookStatus == '1') {
      return
    }
    if (this.data.shareUserId) {
      track(this, 'h5_tcpa_share_seckill_click', [`id=${this.data.id}`, `type=${this.data.seckill.is_seckill}`])
    }
    track(this, 'h5_tcpa_active_book_click', [`id=${this.data.id}`, `type=${this.data.seckill.is_seckill}`, `acttype=${this.data.actType}`])
    // 首次报名
    if (this.data.isNeedInfo == 1) {
      this.redirectApply()
      return
    }
    this.showPayModal()
  },
  getRedirectParam() {
    return [`id=${this.data.id}`,
      `promonum=${this.data.otherPromoNum}`,
      `isSeckill=${(this.data.seckill.is_seckill == 1 && this.data.seckill.is_seckill_finish==0)?1:0}`,
      `transferImageUrl=${encodeURIComponent(this.data.transferImageUrl)}`,
      `title=${encodeURIComponent(getLenStr(this.data.headLine.title,30).str)}`
    ].join('&')
  },
  openBookAlready: function () {
    track(this, 'h5_tcpa_active_book_again_click', [`id=${this.data.id}`, `acttype=${this.data.actType}`])
    wx.redirectTo({
      url: `../result/result?nextpage=detail&prepage=detail&${this.getRedirectParam()}`
    })
  },
  redirectApply: function () {
    wx.redirectTo({
      url: `../apply/apply?nextpage=detail&prepage=detail&id=${this.data.id}`
    })
  },
  closeJoin: function () {
    this.setData({
      isJoin: false
    })
  },
  changeHttpUrl: function (httpUrl) {
    return httpUrl.replace(/^http:\/\//, 'https://')
  },
  getActiveInfo: function (data) {
    this.data.images.logo.src = this.changeHttpUrl(data.share_qrcode_url)
    // this.data.images.logo.src = 'https://inimg01.jiuyan.info/in/2017/10/15/7F0C1C09-F71E-F0D9-45E8-A00C102CF065.jpg'
    if (data.act_url.length) {
      this.data.images.head.src = this.changeHttpUrl(data.act_url[0])
    }
    wx.hideLoading()
    this.setData({
      imgUrls: data.act_url,
      headLine: {
        title: data.act_name,
        desc: `发起人：${data.creator_name}`
      },
      infos: {
        charge: `¥${ data.charge || 0}`,
        sAddr: data.city_district,
        time: formatTimeToTime(data.start_time, data.end_time, true),
        detailAddr: (data.latitude == '0') ? data.act_location : '',
        intro: data.act_desc.replace(/\\n/g, '\n'),
        mapName: data.wx_area_name,
        mapAddress: data.wx_address,
        mapLatitude: data.latitude,
        mapLongitude: data.longitude,
        door: data.house_no,
        phone: data.phone || ''
        // phone: ''
      },
      tempIntro: this.getNewDesc(data.act_desc),
      tempLessIntro: this.getLenStr(data.act_desc),
      siginInUsers: data.joiners.map(this.getDescCollect),
      actQrImg: data.share_qrcode_url,
      otherAct: `本周在你附近举办的${data.other_act_count==0 ? "":`${data.other_act_count}个`}活动`,
      images: this.data.images,
      bookStatus: data.join_status,
      isOrgize: data.is_org,
      actStatus: (data.is_org == 1 && data.act_status == 1) ? 0 : data.act_status, // 如果是创建者 那么永远都不会结束
      transferImageUrl: data.act_url[0],
      isNeedInfo: data.is_need_info,
      promoMoney: data.charge || 0,
      promoDelayMoney: data.booking_charge || 0,
      otherPromoNum: data.other_act_count,
      actType: data.act_type,
      banner: data.banner
    })
    // 设置秒杀信息
    this.setSeckillInfo(data)
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
  getNewDesc: function (desc) {
    if (/^\[{/.test(desc)) {
      try {
        var context = JSON.parse(desc)
        var arr = []
        Object.keys(context).forEach((idx) => {
          if (context[idx].insert.image) {
            arr.push(context[idx].insert)
          } else {
            arr = arr.concat(context[idx].insert.replace(/\n/g, '|').split('|'))
          }
        })
        this.setData({
          newDesc: true
        })
        return arr
      } catch (e) {
        this.setData({
          newDesc: false
        })
        return desc
      }
    } else {
      this.setData({
        newDesc: false
      })
      return desc
    }
  },
  check: function () {
    // console.log(this.data.tempIntro)
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
      ctx.drawImage(res.path, x, y, clipW, clipH)
      ctx.draw()
    })
  },
  getImgFromBack() {
    request({
      url: '/activity/detail_img',
      data: {
        id: this.data.id
      }
    }).then(res => {
      if (res.succ && res.data) {
        this.saveImage(res.data)
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({
        title: '当前微信版本不支持, 请截屏分享',
        image: '../../images/toast-fail.png',
        duration: 2000
      })
    })
  },
  compose: function () {
    wx.showLoading({
      title: '正在生成图片...',
    })
    track(this, 'h5_tcpa_active_compose_click', [`id=${this.data.id}`])
    this.loadImages(this.data.images)
      .then(() => {
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
              return wxPromisify(wx.canvasToTempFilePath)({
                canvasId: 'firstCanvas'
              }).then(res => {
                this.saveImage(res.tempFilePath)
              }, () => {
                this.getImgFromBack()
              }).catch(error => {
                this.getImgFromBack()
              })
            }, 100)
          })
      }).catch((error) => {
        this.getImgFromBack()
      })
  },
  saveImage: function (url) {
    wxPromisify(wx.authorize)({
      scope: 'scope.writePhotosAlbum'
    }).then(() => {
      wx.hideLoading()
      var prePromise = Promise.resolve({
        path: url
      })
      if (/^http/.test(url)) {
        prePromise = wxPromisify(wx.getImageInfo)({
          src: url
        })
      }
      return prePromise.then(res => {
        console.log(res)
        return wxPromisify(wx.saveImageToPhotosAlbum)({
          filePath: res.path
        })
      })
    }).then(res => {
      wx.showToast({
        title: '图片已保存到相册',
        duration: 2000
      })
    }).catch(e => {
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
  },
  formSubmit: function (e) {
    if (this.data.isSubmitFormId) {
      request({
        url: '/tmpl/formid/submit',
        data: {
          formId: e.detail.formId
        }
      }).then(res => {
        if (res.succ) {
          // console.log('发送成功')
        } else {
          this.data.isSubmitFormId = false
        }
      })
    }
  },
  openMap: function () {
    track(this, 'h5_tcpa_active_detail_place', [`id=${this.data.id}`])
    var _data = {
      latitude: Number(this.data.infos.mapLatitude),
      longitude: Number(this.data.infos.mapLongitude),
      address: this.data.infos.mapAddress,
      name: this.data.infos.mapName
    }
    wxPromisify(wx.openLocation)(_data).then(res => {})
  },
  makePhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.infos.phone
    })
  }
})