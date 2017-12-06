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
    packetModal: '',
    list: [],
    nextMonday: '',
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_newbalance_enter',
    sharekey: '',
    shareUrl: 'https://inimg07.jiuyan.info/in/2017/12/06/0E8E4A0B-D7A7-AF8C-6EAE-C9BBB2E0DDF6.jpg'
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
        self.setOpenShareMoneyModalData('avatarUrl', res.userInfo.avatarUrl)
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
          if (res2.data.bounty_type > 0) { // 红包
            this.setData({
              listLast: res2.data.redpacket_info.num
            })
          } else if (!res.data.is_get_bouns) {
            this.setData({
              balance: (parseFloat(res.data.balance) + parseFloat(res2.data.bounty_info.bounty)).toFixed(2),
            })
          }
          this.setOpenShareMoneyModalData('actQrImg', res2.data.redpacket_info.share_qrcode_url)
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
  onShareAppMessage: function () {
    return {
      title: '领取20个红包，报名同城活动直接抵扣现金！',
      path: `/pages/index/index?sharekey${this.data.sharekey}`,
      imageUrl: `${this.data.shareUrl}`
    }
  },
  getRedPacket: function () {
    request({
      url: '/bounty/my_redpacket',
    }).then(res => {
      if (res.succ) {
        this.setData({
          packetList: res.data.list,
          sharekey: res.data.share_key
        })
      }
    })
  },
  openPacket: function (e) {
    var item = e.currentTarget.dataset.item
    this.data.packetModal = item
    if (!item.is_allow) {
      this.setOpenShareMoneyModalData('isShow', true)
      return
    }
    this.setRedpocket(true, item.nick_name, item.redpacket_amount, item.user_avatar)
  },
  reciveRedpocket: function () {
    request({
      url: '/bounty/redpacket_open',
      data: {
        user_id: this.data.packetModal.user_id
      }
    }).then(res => {
      if (res.succ) {
        var list = this.data.packetList
        list.splice(list.findIndex(e => e.user_id === this.data.packetModal.user_id), 1)
        this.setData({
          balance: res.data.amount,
          packetList: list,
          listLast: list.length,
          openMoneyModalData: {
            ...this.data.openMoneyModalData,
            isShow: false
          }
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