// var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
import track from '../../utils/track.js'
var util = require('../../utils/util.js')
module.exports = {
  data: {
    images: {
      body: {
        src: "https://inimg07.jiuyan.info/in/2017/11/05/C0C8F5C0-6BC9-BDC5-D76F-C481EFAE83CA.jpg",
        local: "",
        x: 0,
        y: 0,
        w: 750,
        h: 866
      },
      avatar: {
        src: "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg",
        local: "",
        x: 311,
        y: 132,
        w: 128,
        h: 128,
      },
    },
    isShowGoldMoneyModal: false,
    avatarUrl: 'https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg',
    actQrImg: 'https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg'
  },
  closeGoldMoneyModal: function () {
    this.setData({
      isShowGoldMoneyModal: false
    })
  },
  compose: function () {
    this.loadingIn('加载中')
    // track(this, 'h5_tcpa_active_compose_click', [`id=${this.data.id}`])
    console.log(this.data)
    util.loadImages(this.data.images)
      .then(() => {
        var ctx = wx.createCanvasContext('firstCanvas')
        var _images = this.data.images
        var _avatar = _images.avatar
        var _body = _images.body
        ctx.drawImage(_body.local, _body.x, _body.y, _body.w, _body.h)
        util.drawImageInCenter(ctx, _avatar.local, _avatar.x, _avatar.y, _avatar.w, _avatar.h)
          .then(() => {
            setTimeout(() => {
              return wxPromisify(wx.canvasToTempFilePath)({
                canvasId: 'firstCanvas',
              }).then(res => {
                console.log(res.tempFilePath)
                // this.saveImage()
                this.loadingOut()
              })
            }, 100)
          })
      }).catch((error) => {
        this.loadingOut()
        this.toastFail('保存失败')
      })
  }
}