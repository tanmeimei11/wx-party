// var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
import track from '../../utils/track.js'
var util = require('../../utils/util.js')
var getAuth = require('../../utils/auth.js').get
module.exports = {
  data: {
    goldMoneyModalData: {
      images: {
        body: {
          src: "https://inimg07.jiuyan.info/in/2017/11/07/D2BBB9D0-B9BD-A49A-85F5-FF91D3D5BF45.jpg",
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
          src: "https://inimg07.jiuyan.info/in/2017/11/06/6934FAC6-A317-EAE6-75A5-9472183A4B91.jpg",
          local: "",
          x: 265,
          y: 423,
          w: 220,
          h: 220,
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
      isShow: true,
    }

  },
  setGoldMoneyModalData: function (key, value) {
    var _goldMoneyModalData = this.data.goldMoneyModalData
    _goldMoneyModalData[key] = value
    this.setData({
      goldMoneyModalData: _goldMoneyModalData
    })
  },
  getGoldMoneyModalData: function (key) {
    return this.data.goldMoneyModalData[key]
  },
  closeGoldMoneyModal: function () {
    this.setGoldMoneyModalData('isShow', false)
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
    var _images = this.data.goldMoneyModalData.images
    _images.qr.src = this.getGoldMoneyModalData('actQrImg')
    _images.avatar.src = this.getGoldMoneyModalData('avatarUrl')
    util.loadImages(_images)
      .then(() => {
        var ctx = wx.createCanvasContext('firstCanvas')
        var _avatar = _images.avatar
        var _qr = _images.qr
        var _qrContain = _images.qrContain
        var _body = _images.body
        return util.drawImageInCenter(ctx, _avatar.local, _avatar.x, _avatar.y, _avatar.w, _avatar.h)
          .then(() => {
            return util.drawImageInCenter(ctx, _qr.local, _qr.x, _qr.y, _qr.w, _qr.h)
          }).then(() => {
            ctx.drawImage(_body.local, _body.x, _body.y, _body.w, _body.h)
            return util.drawImageInCenter(ctx, _qrContain.local, _qrContain.x, _qrContain.y, _qrContain.w, _qrContain.h)
          }).then(() => {
            ctx.draw(true)
            // ctx.drawImage(_body.local, _body.x, _body.y, _body.w, _body.h)
            // ctx.draw(true)
            setTimeout(() => {
              // 画文字
              ctx.setTextAlign('center')
              ctx.setFillStyle('white')
              ctx.setFontSize(42)
              ctx.fillText('扫码拆开红包', 375, 315)
              ctx.setFontSize(36)

              ctx.setFillStyle('#FEE1DD')
              ctx.fillText('红包最高可升值为 ¥100 ', 375, 375)
              ctx.draw(true)
              return wxPromisify(wx.canvasToTempFilePath)({
                canvasId: 'firstCanvas',
              }).then(res => {
                this.saveImage(res.tempFilePath)
              }, () => {
                wx.hideLoading()
                wx.showToast({
                  title: '当前微信版本不支持, 请截屏分享',
                  image: '../../images/toast-fail.png',
                  duration: 2000
                })
              }).catch(error => {
                wx.hideLoading()
                wx.showToast({
                  title: '当前微信版本不支持, 请截屏分享',
                  image: '../../images/toast-fail.png',
                  duration: 2000
                })
              })
            }, 100)
          })
      }).catch((error) => {
        this.loadingOut()
        this.toastFail('保存失败')
      })
  }
}