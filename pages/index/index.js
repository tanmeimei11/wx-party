const app = getApp()
let util = require('../../utils/util.js')
// let request = util.request 
let request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
Page({
  data: {
    qunList: [],
    promoList: [],
    hidden: false,
    scrollHeight: 0,
    noMoreQun: false,
    noMorePromo: false,
    currentList: 'qunList',
    qunListLoaded: false,
    promoListLoaded: false,
    isJoinQun: false,
    trackSeed: '',
    joinQunQrcode: '',
    promoNum: 0,
    currentCursorQun: 0,
    currentCursorPromo: 0
  },
  close: function (e) {
    this.setData({
      isJoinQun: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'in打印照片',
      desc: '和我一起0.01元抢1人高熊公仔',
      path: '/pages/index/index'
    }
  },
  joinQun: function (e) {
    // track(this, '------------------')
    this.setData({
      isJoinQun: true,
      joinQunQrcode: e.target.dataset.qrcodeUrl
    })
    // if (e.target.dataset.qrcodeUrl) {
    //   console.log(e.target.dataset.qrcodeUrl)
    // }
  },
  jumpToDetail: function (e) {
    if (e.target.dataset.id) {
      wx.navigateTo({
        url: '../detail/detail?id=' + e.target.dataset.id + '&notShowOther=true'
      })
    }
  },
  switchTab1: function (e) {
    if (this.data.promoListLoaded && this.data.currentList == 'qunList') {
      return
    }
    this.setData({
      currentList: 'qunList',
      hidden: false,
      currentCursorQun: 0
    })
    this.loadMoreQun()
  },
  switchTab2: function (e) {
    if (this.data.currentList == 'promoList') {
      return
    }
    this.setData({
      currentList: 'promoList',
      hidden: false,
      currentCursorPromo: 0
    })
    this.loadMorePromo()
  },
  upper: function () {
    console.log("upper");
  },
  promoLower: function () {
    console.log("promoLower")
    let that = this;
    setTimeout(function () {
      that.loadMorePromo();
    }, 300);
  },
  lower: function (e) {
    console.log("lower")
    let that = this;
    setTimeout(function () {
      that.loadMoreQun();
    }, 300);
  },
  scroll: function (e) {
    console.log("scroll")
  },
  loadMorePromo: function () {
    console.log('loadMorePromo')
    if (this.data.noMorePromo) {
      console.log('noMorePromo')
      this.setData({
        hidden: true
      })
      return
    }
    let params = {
      url: '/activity/groups',
      data: {
        limit: 10,
        cursor: this.data.currentCursorPromo
      }
    }
    request(params).then((res) => {
      if (res.succ && res.data && res.data.list) {
        // console.log(res.data)
        if (!res.data.list.length) {
          this.setData({
            noMorePromo: true
          })
        }
        this.setData({
          promoList: this.data.promoList.concat(res.data.list),
          promoListLoaded: true,
          currentCursorPromo: res.data.current_cursor || null
        })
      } else {
        this.setData({
          noMorePromo: true
        })
      }
      let self = this
      setTimeout(function () {
        self.setData({
          hidden: true
        })
      }, 300)
    })
  },
  loadMoreQun: function () {
    console.log('loadMoreQun')
    if (this.data.noMoreQun) {
      console.log('noMoreQun')
      this.setData({
        hidden: true
      })
      return
    }
    let params = {
      url: '/citysocial/groups',
      data: {
        limit: 10,
        cursor: this.data.currentCursorQun
      }
    }
    // console.log('00000')
    // request(params).then((res)=>{
    //   console.log('====111111111')
    //   console.log(res)
    //   // cosnole.log(res)
    // })
    // return 
    request(params).then((res) => {
      if (res.succ && res.data && res.data.list) {
        if (!res.data.list.length) {
          this.setData({
            noMoreQun: true
          })
        }
        this.setData({
          qunList: this.data.qunList.concat(res.data.list),
          qunListLoaded: true,
          promoNum: res.data && res.data.act_num || 0,
          currentCursorQun: res.data.current_cursor || null
        })
      } else {
        this.setData({
          noMoreQun: true
        })
      }
      let self = this
      setTimeout(function () {
        self.setData({
          hidden: true
        })
      }, 300)
    })
  },
  onLoad() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight - 50
        });
      }
    })
    wx.setNavigationBarTitle({
      title: 'in 同城趴'
    })
    // console.log(request({
    //   url: '/citysocial/groups',
    //   data: {
    //     limit: 10,
    //     cursor: this.data.currentCursorQun
    //   }
    // })
    // )
    this.switchTab1()
  }
})
// checkString(str, len, tag) {
//   if (str && str.length > len) {
//     return str.substring(0, len) + tag
//   }
//   return str
// },