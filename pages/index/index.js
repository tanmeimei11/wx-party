const app = getApp()
let util = require('../../utils/util.js')
let request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
var getMoneyModal = require('../../components/getMoneyModal/index.js')
var riseMoneyModal = require('../../components/riseMoneyModal/index.js')
var seckillEntry = require('../../components/seckill/entry/index.js')
var mutulPage = require('../../utils/util.js').mutulPage
mutulPage({
  mixins: [getMoneyModal, riseMoneyModal, seckillEntry],
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
    loadingMoreQun: false,
    loadingMorePromo: false,
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_index_entry',
    promoNum: 0,
    currentCursorQun: 0,
    currentCursorPromo: 0,
    isNeedFillInfo: true,
    isSubmitFormId: true,
    myMoney: '',
    is_get_bouns: true,
    is_share: false,
    joinTips: [
      '1、点击下方按钮联系小助手',
      '2、回复“加群”，获取二维码链接',
      '3、选择对应群二维码，长按识别',
      '4、小助手邀请你进群'
    ]
  },
  downloadQrcode: function () {},
  setShare: function (tab) {
    if (tab == 1) {
      this.onShareAppMessage = function () {
        return {
          title: 'in同城趴，出门一起玩，认识新朋友',
          desc: 'in同城趴本周活动报名中，点击查看',
          path: '/pages/index/index'
        }
      }
    } else {
      this.onShareAppMessage = function () {
        return {
          title: 'in同城趴本周活动报名中，点击查看',
          desc: 'in同城趴，出门一起玩，认识新朋友',
          path: '/pages/index/index?tab=2'
        }
      }
    }
  },
  onShareAppMessage: function () {
    return {
      title: 'in同城趴，出门一起玩，认识新朋友',
      desc: 'in同城趴本周活动报名中，点击查看',
      path: '/pages/index/index'
    }
  },
  joinQun: function (e) {
    var _qunId = e.currentTarget.dataset.id
    track(this, 'h5_tcpa_index_group_join', [`id=${_qunId}`])
    // 加群人数＋1
    let params = {
      url: '/citysocial/join',
      data: {
        id: _qunId,
      }
    }
    request(params).then((res) => {
      if (res.succ && res.data == '1') {
        // 遍历群
        var _qun = this.data.qunList
        _qun.forEach((item, idx) => {
          if (item.city_social_id == _qunId) {
            item.count = parseInt(item.count) + 1
          }
        })
        this.setData({
          qunList: _qun
        })
      }
    })
  },
  jumpToDetail: function (e) {
    if (e.currentTarget.dataset.id) {
      track(this, 'h5_tcpa_index_active_join', [`id=${e.currentTarget.dataset.id}`])
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.dataset.id + '&isShowOtherAct=false'
      })
    }
  },
  switchTab1: function (e) {
    if (this.data.promoListLoaded && this.data.currentList == 'qunList') {
      return
    }
    if (e) {
      this.setShare(1)
      track(this, 'h5_tcpa_index_group_tab_click ')
    }
    this.setData({
      currentCursorQun: 0,
      noMoreQun: false,
      qunList: [],
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
    if (e) {
      this.setShare(2)
      track(this, 'h5_tcpa_index_active_tab_click ')
    }
    this.setData({
      currentCursorPromo: 0,
      noMorePromo: false,
      promoList: [],
      currentList: 'promoList',
      hidden: false,
      currentCursorPromo: 0
    })
    if (!this.data.is_share) {
      request({
        url: '/account/balance'
      }).then((res) => {
        console.log(res)
        this.setData({
          myMoney: res.data.balance,
          is_get_bouns: res.data.is_get_bouns
        })
      })
    }
    this.loadMorePromo()
    this.loadSeckill()
  },
  upper: function () {
    // console.log("upper");
  },
  promoLower: function () {
    // console.log("promoLower")
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
    if (this.data.loadingMorePromo) {
      return
    }
    this.data.loadingMorePromo = true
    console.log('loadMorePromo')

    // if (this.data.noMorePromo) {
    //   console.log('noMorePromo')
    //   this.setData({
    //     hidden: true,
    //     loadingMoreQun: false
    //   })
    //   return
    // }
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
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].end_time = null
          if (res.data.list[i].start_time && res.data.list[i].end_time) {
            res.data.list[i].time = util.formatTimeToTime(res.data.list[i].start_time, res.data.list[i].end_time)
          } else {
            res.data.list[i].time = util.formatTime(new Date(res.data.list[i].start_time), true)
          }
        }
        console.log(this.data)
        this.setData({
          promoList: this.data.promoList.concat(res.data.list),
          promoListLoaded: true,
          currentCursorPromo: res.data.current_cursor || null,
          isNeedFillInfo: res.data.is_need_info == 1
        })
      } else {
        this.setData({
          noMorePromo: true
        })
      }
      this.data.loadingMorePromo = false
      let self = this
      setTimeout(function () {
        self.setData({
          hidden: true
        })
      }, 300)
    })
  },
  loadMoreQun: function () {
    if (this.data.loadingMoreQun) {
      return
    }
    this.data.loadingMoreQun = true
    // console.log('loadMoreQun')
    // if (this.data.noMoreQun) {
    //   console.log('noMoreQun')
    //   this.setData({
    //     hidden: true,
    //     loadingMoreQun: false
    //   })
    //   return
    // }
    let params = {
      url: '/citysocial/groups',
      data: {
        limit: 10,
        cursor: this.data.currentCursorQun
      }
    }
    request(params).then((res) => {
      if (res.succ && res.data && res.data.list) {
        if (!res.data.list.length) {
          this.setData({
            noMoreQun: true
          })
        }
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].male_count && res.data.list[i].female_count) {
            res.data.list[i].count = parseInt(res.data.list[i].male_count) + parseInt(res.data.list[i].female_count)
          }
        }
        this.setData({
          qunList: this.data.qunList.concat(res.data.list),
          qunListLoaded: true,
          promoNum: res.data && res.data.promo_num || 0,
          currentCursorQun: res.data.current_cursor || null
        })
      } else {
        this.setData({
          noMoreQun: true
        })
      }
      this.data.loadingMoreQun = false
      let self = this
      setTimeout(function () {
        self.setData({
          hidden: true
        })
      }, 300)
    })
  },
  launchPromo: function () {
    track(this, 'h5_tcpa_goto_launch_promo')
    var _url = this.data.isNeedFillInfo ? '../apply/apply?nextpage=launch&prepage=index' : '../launch/launch'
    wx.navigateTo({
      url: _url
    })
  },
  toBalance: function () {
    track(this, 'h5_tcpa_gold_incentive_click')
    wx.navigateTo({
      url: '../balance/balance'
    })
    setTimeout(() => {
      request({
        url: '/account/balance'
      }).then(res => {
        if (res.succ) {
          if (res.data.is_get_bouns) {
            this.setData({
              myMoney : res.data.balance
            })
          } else {
            this.setData({
              myMoney : (parseFloat(res.data.balance) + 5).toFixed(2)
            })
          }
          this.setData({
            is_get_bouns : true
          })
        }
        console.log(res)
      })
    },1000)
  },
  formSubmit: function (e) {
    if (this.data.isSubmitFormId) {
      console.log('form发生了submit事件，携带数据为：', e.detail.formId)
      request({
        url: '/tmpl/formid/submit',
        data: {
          formId: e.detail.formId
        }
      }).then(res => {
        if (res.succ) {
          console.log('发送成功')
        } else {
          this.data.isSubmitFormId = false
        }
      })
    }
  },
  showMoneyModal: function (sharekey) {
    console.log(sharekey)
    request({
      url: '/bounty/open',
      data: {
        share_key: sharekey
      }
    }).then(res => {
      if (res.succ) {
        let _type = res.data.is_first_amount == true ? 'isShowGetMoneyModal' : 'isShowRiseMoneyModal'
        var _data = {
          myMoney: res.data.my_amount,
          riseMoney: res.data.friend_amount,
          friendAvatar: res.data.avatar_url,
          friendNick: res.data.nick_name,
          is_get_bouns: true
        }
        _data[_type] = true
        this.setData(_data)
      }
    })
  },
  onLoad(options) {
    let currentList = (options.tab == '1' && 'qunList') || 'promoList'
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
    // 好友分享点进来
    if (options.sharekey) {
      this.setData({
        is_share: true
      })
      track(this, 'h5_tcpa_gold_share_page', [`user_id=${options.sharekey}`])
      this.showMoneyModal(options.sharekey)
    }
    // 分渠道
    if (options.from) {
      track(this, 'h5_tcpa_index_enter', [`cannel_id=${options.from}`])
    }

    if (currentList == 'qunList') {
      this.switchTab1()
    } else {
      this.switchTab2()
    }
  }
})