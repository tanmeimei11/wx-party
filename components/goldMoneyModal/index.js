// var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
import track from '../../utils/track.js'
var util = require('../../utils/util.js')
var getAuth = require('../../utils/auth.js').get
module.exports = {
  data: {
    images: {
      body: {
        src: "https://inimg07.jiuyan.info/in/2017/11/06/A973E8DF-771A-139A-A344-464315E333BF.jpg",
        local: "",
        x: 0,
        y: 0,
        w: 750,
        h: 866
      },
      qr: {
        src: "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg",
        local: "",
        x: 275,
        y: 433,
        w: 200,
        h: 200,
      },
      qrContain: {
        src: "https://inimg07.jiuyan.info/in/2017/11/06/4FAB771E-CA69-70BD-A4C9-1A289DCA501E.jpg",
        local: "",
        x: 295,
        y: 433,
        w: 200,
        h: 200,
      },
      avatar: {
        src: "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg",
        local: "",
        x: 311,
        y: 108,
        w: 128,
        h: 128,
      },
    },
    isShowGoldMoneyModal: false,
  },
  closeGoldMoneyModal: function () {
    this.setData({
      isShowGoldMoneyModal: false
    })
  },
  saveImage: function (url) {
    getAuth('writePhotosAlbum')
      .then(() => {
        return wxPromisify(wx.saveImageToPhotosAlbum)({
          filePath: url
        })
      }).then(res => {
        this.loadingOut()
        this.toastSucc('保存成功')
      })
  },
  compose: function () {
    this.loadingIn('加载中')
    track(this, 'h5_tcpa_gold_photo_save')
    this.data.images.qr.src = this.data.share_qrcode_url
    this.data.images.avatar.src = this.data.avatarUrl
    util.loadImages(this.data.images)
      .then(() => {
        var ctx = wx.createCanvasContext('firstCanvas')
        var _images = this.data.images
        var _avatar = _images.avatar
        var _qr = _images.qr
        var _qrContain = _images.qrContain
        var _body = _images.body
        return util.drawImageInCenter(ctx, _avatar.local, _avatar.x, _avatar.y, _avatar.w, _avatar.h)
          .then(() => {
            return util.drawImageInCenter(ctx, _qr.local, _qr.x, _qr.y, _qr.w, _qr.h)
          }).then(() => {
            return util.drawImageInCenter(ctx, _qrContain.local, _qrContain.x, _qrContain.y, _qrContain.w, _qrContain.h)
          }).then(() => {
            ctx.drawImage(_body.local, _body.x, _body.y, _body.w, _body.h)
            ctx.draw(true)
            setTimeout(() => {
              // 画文字
              ctx.setTextAlign('center')
              ctx.setFillStyle('white')
              ctx.setFontSize(42)
              ctx.fillText('扫码拆开红包', 375, 320)
              ctx.setFontSize(36)
              ctx.fillText('红包最高可升值为 ¥100 ', 375, 380)
              ctx.draw(true)
              return wxPromisify(wx.canvasToTempFilePath)({
                canvasId: 'firstCanvas',
              }).then(res => {
                this.saveImage(res.tempFilePath)
              })
            }, 100)
          })
      }).catch((error) => {
        this.loadingOut()
        this.toastFail('保存失败')
      })
  }
}