import track from '../../utils/track.js'
var openMoneyModal = require('../../components/openMoneyModal/index.js')
var openShareMoneyModal = require('../../components/openShareMoneyModal/index.js')
var goldMoneyModal = require('../../components/goldMoneyModal/index.js')
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var mutulPage = require('../../utils/mixin.js').mutulPage
let request = require('../../utils/wxPromise.js').requestPromisify
mutulPage({
  mixins: [openMoneyModal, openShareMoneyModal, goldMoneyModal],
  data: {
    packetList: [],
    listLast: '',
    balance: 0.00,
    currentCursor: 0,
    scrollHeight: 0,
    loading: false,
    noMoreNote: false,
    listLoaded: false,
    list: [],
    nextMonday: '',
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_balance_enter'
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_balance_screen_enter')
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
        // self.setGoldMoneyModalData('avatarUrl', res.userInfo.avatarUrl)
      }
    })
    wx.setNavigationBarTitle({
      title: '我的鼓励金'
    })
    request({
      url: '/account/balance'
    }).then((res) => {
      if (res.succ) {
        if (res.data.is_get_bouns) {
          this.setData({
            balance: res.data.balance
          })
        }
        request({
          url: '/bounty/get_new'
        }).then((res2) => {
          console.log(res2)
          if (res2.data.bounty_type > 0) {// 红包
            this.setData({
              listLast: res2.data.redpacket_info.num
            })
          } else if (!res.data.is_get_bouns) {
            this.setData({
              balance: (parseFloat(res.data.balance) + parseFloat(res2.data.redpacket_info.num)).toFixed(2),
            })
          }
          this.setGoldMoneyModalData('actQrImg', res2.data.share_qrcode_url)
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
    this.getRedPacket()
  },
  getRedPacket: function () {
    request({
      url: '/bounty/my_redpacket',
    }).then(res => {
      if (res.succ) {
        this.setData({
          packetList: res.data
        })
      }
    })
  },
  openPacket: function (e) {
    var item = e.currentTarget.dataset.item
    if (!item.is_allow) {
      this.setOpenShareMoneyModalData('isShow',true)
      return
    }
    this.setRedpocket(true, item.nick_name, item.redpacket_amount)
    request({
      url: '/bounty/redpacket_open',
      data: {
        user_id: item.user_id
      }
    }).then(res => {
      if (res.succ) {
        // openMoneyModal.data.isShow = true

        var list = this.data.packetList
        list.splice(list.findIndex(e => e.user_id === item.user_id), 1)
        this.setData({
          balance: res.data.amount,
          packetList: list,
          listLast: list.length
        })
      }
    })
  },
  onReachBottom: function () {
    if (this.data.noMoreNote) {
      return
    }
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
      if (res.succ && res.data) {
        if (!res.data.length) {
          this.setData({
            noMoreNote: true
          })
          return
        }
        this.setData({
          list: this.data.list.concat(res.data),
          listLoaded: true,
          currentCursor: res.data[res.data.length - 1].cursor
        })
      } else {
        this.setData({
          noMoreNote: true
        })
      }
      this.data.loading = false
    })
  },
  share: function () {
    track(this, 'h5_tcpa_gold_forwardhigh_click')
    this.setGoldMoneyModalData('isShow', true)
  }
})