import track from '../../utils/track.js'
var goldMoneyModal = require('../../components/goldMoneyModal/index.js')
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var mutulPage = require('../../utils/util.js').mutulPage
let request = require('../../utils/wxPromise.js').requestPromisify
mutulPage({
  mixins: [goldMoneyModal],
  data: {
    balance: '',
    currentCursor: 0,
    scrollHeight: 0,
    loading: false,
    noMoreNote: false,
    hidden: true,
    listLoaded: false,
    isShowGoldMoneyModal: false,
    share_qrcode_url: '',
    avatarUrl: '',
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_balance_enter'
  },
  onLoad: function (option) {
    wx.showLoading({
      title: '加载中...'
    })
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
        console.log(res)
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
        this.setData({
          balance : res.data.balance
        })
        request({
          url: '/bounty/get'
        }).then((res2) => {
          console.log(res2)
          if (res2.succ && !res.data.is_get_bouns) {
            this.setData({
              balance : parseFloat(this.data.balance) + parseFloat(res2.data.bounty),
              share_qrcode_url: res2.data.share_qrcode_url
            })
          } else if (res2.data.is_get_bouns) {
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
      cursor: this.currentCursor,
      limit: 10
    }).then((res) => {
      // console.log(res)
      this.setData({
        currentCursor: res.data.current_cursor,
        list: res.data.list
      })
    })
  },
  promoLower: function () {
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
      cursor: this.currentCursor,
      limit: 10
    }).then((res) => {
      console.log(res)
      if (res.succ && res.data && res.data.list) {
        if (!res.data.list.length) {
          this.setData({
            noMoreNote: true
          })
        }
        this.setData({
          list: this.data.list.concat(res.data.list),
          listLoaded: true,
          currentCursor: res.data.current_cursor || null
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
      isShowGoldMoneyModal : true
    })
  }
})