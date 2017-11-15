import track from '../../utils/track.js'
var goldMoneyModal = require('../../components/goldMoneyModal/index.js')
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var mutulPage = require('../../utils/util.js').mutulPage
let request = require('../../utils/wxPromise.js').requestPromisify
mutulPage({
  mixins: [goldMoneyModal],
  data: {
    balance: 0.00,
    currentCursor: 0,
    scrollHeight: 0,
    loading: false,
    noMoreNote: false,
    hidden: true,
    listLoaded: false,
    list: [],
    nextMonday: '',
    isShowGoldMoneyModal: false,
    share_qrcode_url: '',
    avatarUrl: '',
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_balance_enter'
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_balance_screen_enter')
    wx.showLoading({
      title: '加载中...'
    })
    this.countTime()
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight
        });
      }
    })
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          avatarUrl: res.userInfo.avatarUrl
        });
      }
    })
    wx.setNavigationBarTitle({
      title: '我的鼓励金'
    })
    request({
      url: '/account/balance'
    }).then((res) => {
      console.log(res)
      if (res.succ) {
        if (res.data.is_get_bouns) {
          this.setData({
            balance: res.data.balance
          })
        }
        request({
          url: '/bounty/get'
        }).then((res2) => {
          console.log(res2)
          if (res2.succ && !res.data.is_get_bouns) {
            this.setData({
              balance: (parseFloat(res.data.balance) + parseFloat(res2.data.bounty)).toFixed(2),
              share_qrcode_url: res2.data.share_qrcode_url
            })
          } else if (res.data.is_get_bouns) {
            console.log(res2.data.share_qrcode_url)
            this.setData({
              share_qrcode_url: res2.data.share_qrcode_url
            })
          }
          wx.hideLoading()
        })
      }
    })
    request({
      url: '/account/details',
      data: {
        cursor: this.data.currentCursor,
        limit: 10
      }
    }).then((res) => {
      console.log(res)
      if (res.data.length) {
        this.setData({
          currentCursor: res.data[res.data.length - 1].cursor,
          list: res.data
        })
        if (res.data.length < 10) {
          this.setData({
            noMoreNote: true
          })
        }
      }
    })
  },
  promoLower: function () {
    if (this.data.noMoreNote) {
      return
    }
    console.log("promoLower")
    let that = this;
    setTimeout(function () {
      that.loadMoreNote();
    }, 300);
  },
  loadMoreNote: function () {
    if (this.data.loading) {
      return
    }
    this.data.loading = true

    request({
      url: '/account/details',
      data: {
        cursor: this.data.currentCursor,
        limit: 10
      }
    }).then((res) => {
      console.log(res)
      if (res.succ && res.data) {
        if (!res.data.length) {
          this.setData({
            noMoreNote: true
          })
        }
        this.setData({
          list: this.data.list.concat(res.data),
          listLoaded: true,
          currentCursor: res.data[res.data.length - 1].cursor || null
        })
      } else {
        this.setData({
          noMoreNote: true
        })
      }
      this.data.loading = false
      let self = this
      setTimeout(function () {
        self.setData({
          hidden: true
        })
      }, 300)
    })
  },
  share: function () {
    track(this, 'h5_tcpa_gold_forward')
    this.setData({
      isShowGoldMoneyModal: true
    })
  },
  countTime: function () {
    let date = new Date()
    let theDay = date.getDay()
    if (theDay == 0) {
      theDay = 7
    }
    date.setDate(date.getDate() + 8 - theDay)
    let theYear = date.getFullYear()
    let theMonth = date.getMonth() + 1
    let theDate = date.getDate()

    let newMonday = theYear + '.' + theMonth + '.' + theDate
    this.setData({
      nextMonday: newMonday
    })
  }
})