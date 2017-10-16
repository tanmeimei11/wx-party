//logs.js
const util = require('../../utils/util.js')
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var Promise = require('../../lib/es6-promise');
Page({
  data: {
    isShowCanvas: false,
    logs: [],
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
  onLoad: function (e) {},
  saveImage: function (file) {
    wxPromisify(wx.authorize)({
      scope: 'scope.writePhotosAlbum'
    }).then(() => {
      wx.showToast({
        title: '授权成功',
        duration: 1000
      })
      wxPromisify(wx.saveImageToPhotosAlbum)({
          filePath: file
        })
        .then(res => {
          wx.showToast({
            title: '下载成功',
            duration: 1000
          })
        })
    })

  },
  getCanvas: function () {
    wxPromisify(wx.canvasToTempFilePath)({
      canvasId: 'firstCanvas',
    }).then(res => {
      this.saveImage(res.tempFilePath)
      console.log(res.tempFilePath)
    })
  },
  getTextCanvas: function () {
    let ctx = wx.createContext()
    ctx.rect(50, 50, 100, 100);
    ctx.stroke();
    ctx.drawImage('http://h5.in66.com/inpromo/face-party/gongce/img/rule.b414ef1.png', 10, 10, 200, 200)
    wx.drawCanvas({
      canvasId: 'myCanvas',
      actions: ctx.getActions()
    })
  },
  compose: function () {
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

        }, 100)
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
  goDetail: function () {
    wx.redirectTo({
      url: '../detail/detail?id=22'
    })
  }
})