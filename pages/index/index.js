const app = getApp()
let util = require('../../utils/util.js')
let request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
var getMoneyModal = require('../../components/getMoneyModal/index.js')
var riseMoneyModal = require('../../components/riseMoneyModal/index.js')
// var seckillEntry = require('../../components/seckill/entry/index.js')
var seckillEntry = require('../../components/seckill/item/index.js')
var mutulPage = require('../../utils/util.js').mutulPage
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify

mutulPage({
  mixins: [getMoneyModal, riseMoneyModal, seckillEntry],
  data: {
    seckill: [],
    qunList: [],
    promoList: [],
    launchTop: 0,
    hidden: false,
    scrollHeight: 0,
    noMorePromo: false,
    currentList: 'qunList',
    qunListLoaded: false,
    promoListLoaded: false,
    loadingMorePromo: false,
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_index_entry',
    promoNum: 0,
    currentCursorPromo: 0,
    isNeedFillInfo: true,
    isSubmitFormId: true,
    myMoney: '',
    is_get_bouns: true,
    is_share: false,
    is_ending: false,
    onTop: false,
    screen: '全部活动',
    screenID: '',
    screenList: [],
    screenOpen: false,
    sort: '排序',
    sortID: '',
    sortList: [],
    sortOpen: false,
    _gps: '',
    currentID1: '',
    currentID2: '',
    nowTime: 0,
    notfindpromo: false,
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
  openScreen: function () {
    this.setData({
      screenOpen: !this.data.screenOpen,
      sortOpen: false
    })
  },
  openSort: function () {
    this.setData({
      sortOpen: !this.data.sortOpen,
      screenOpen: false
    })
  },
  jumpToDetail: function (e) {
    if (e.currentTarget.dataset.id) {
      track(this, 'h5_tcpa_index_active_join', [`id=${e.currentTarget.dataset.id}`, `type=${e.currentTarget.dataset.tpye}`])
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.dataset.id + '&isShowOtherAct=false'
      })
    }
  },
  onLoad(options) {
    console.log('-------options---------')
    console.log(options)
    track(this, 'h5_tcpa_index_screen_enter')
    track(this, 'h5_tcpa_index_enter', [`cannel_id=${options.from}`])
    wx.setNavigationBarTitle({
      title: 'in 同城趴'
    })

    let self = this
    console.log('-------获取设备信息---------')
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          launchTop: res.windowWidth / 750 * 150,
          nowTime: new Date().getTime()
        });
      }
    })
    this.getLocation().then((res) => {
      console.log('-------获取地理位置---------')
      // 鼓励金详情页面好友分享点进来 options.sharekey
      if (options.sharekey) {
        this.setData({
          is_share: true
        })
        track(this, 'h5_tcpa_gold_share_page', [`user_id=${options.sharekey}`])
        this.showMoneyModal(options.sharekey)
      }

      // 分渠道埋点
      if (options.from) {
        wx.setStorageSync("from", options.from)
      }
      // 即将过期
      if (options.ending) {
        this.setData({
          is_ending: true
        })
      }
      console.log('-------switchTab2---------')
      this.switchTab2()
    })
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
    if (!this.data.is_get_bouns) {
      console.log('-------第一次获取鼓励斤---------')
      request({
        url: '/bounty/get'
      }).then(res => {
        if (res.succ) {
          this.setData({
            isShowGetMoneyModal: true,
            is_get_bouns: true,
            myMoney: res.data.bounty,
          })
        }
      })
    }
    if (!this.data.is_share) {
      console.log('-------loadBalance---------')
      this.loadBalance()
        .then((is_get_bouns) => {
          if (!is_get_bouns) {
            this.getFirstMoneyModal()
          }
        })
    }
    this.loadMorePromo()
    // this.loadSeckill()
  },
  loadBalance: function () {
    return request({
      url: '/account/balance'
    }).then((res) => {
      if (res.succ) {
        this.setData({
          myMoney: res.data.balance,
          is_get_bouns: res.data.is_get_bouns
        })
        return res.data.is_get_bouns
      }
    })
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
    let that = this;
    setTimeout(function () {
      that.loadMoreQun();
    }, 300);
  },
  scroll: function (e) {
    if (e.detail.scrollTop > this.data.launchTop) {
      this.setData({
        onTop: true
      })
    } else {
      this.setData({
        onTop: false
      })
    }
  },
  getLocation: function (e) {
    let self = this
    return wxPromisify(wx.authorize)({
      scope: 'scope.userLocation'
    }).then(suc => {
      return wxPromisify(wx.getLocation)({
        type: 'gcj02'
      })
    }, rej => {}).then(res => {
      if (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        self.setData({
          _gps: longitude + ',' + latitude
        })
      }
    })
  },
  loadMorePromo: function () {
    if (this.data.loadingMorePromo) {
      return
    }
    this.data.loadingMorePromo = true
    // if (this.data.noMorePromo) {
    //   console.log('noMorePromo')
    //   this.setData({
    //     hidden: true,
    //     loadingMoreQun: false
    //   })
    //   return
    // }
    this.getPromo()
  },
  reselect: function (e) {
    if (this.data.loadingMorePromo) {
      return
    }
    this.data.loadingMorePromo = true
    let res = e.currentTarget.dataset
    this.setData({
      promoList: []
    })
    if (res.screen) {
      track(this, 'h5_tcpa_category_click', [`type=${res.screen}`])
      this.setData({
        screen: res.name,
        screenID: res.screen,
        currentID1: res.id,
        hidden: false,
        currentCursorPromo: 0
      })
    } else {
      track(this, 'h5_tcpa_order_click', [`type=${res.sort}`])
      this.setData({
        sort: res.name,
        sortID: res.sort,
        currentID2: res.id,
        screenID: this.data.currentID1,
        hidden: false,
        currentCursorPromo: 0
      })
    }
    this.getPromo('reselect')
  },
  getPromo: function (bottomItem) {
    console.log('-------getPromo-----groups_new----')
    request({
      url: '/activity/groups_new',
      data: {
        limit: 10,
        cursor: this.data.currentCursorPromo,
        _gps: this.data._gps,
        screen: this.data.screenID,
        sort: this.data.sortID
      }
    }).then((res) => {
      if (res.succ && res.data && res.data.list) {
        // console.log(res.data)
        // this.setData({
        //   noMorePromo: res.data.list.length ? false : true,
        //   notfindpromo: false
        // })
        if (bottomItem) {
          if (res.data.is_empty) {
            this.setData({
              notfindpromo: true,
              currentCursorPromo: 0,
              screenID: '',
              sortID: ''
            })
            this.getPromo()
          } else {
            this.setData({
              notfindpromo: false,
            })
          }
        }
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].end_time = null
          if (res.data.list[i].start_time && res.data.list[i].end_time) {
            res.data.list[i].time = util.formatTimeToTime(res.data.list[i].start_time, res.data.list[i].end_time)
          } else {
            res.data.list[i].time = util.formatTime(new Date(res.data.list[i].start_time), true)
          }
        }
        this.setData({
          screenList: res.data.screen_list,
          sortList: res.data.sort_list,
          promoList: this.data.promoList.concat(res.data.list),
          promoListLoaded: true,
          currentCursorPromo: res.data.current_cursor || null,
          isNeedFillInfo: res.data.is_need_info == 1
        })
        this.initSeckill()
      }
      this.data.loadingMorePromo = false
      let self = this
      setTimeout(function () {
        self.setData({
          screenOpen: false,
          sortOpen: false,
          hidden: true
        })
      }, 300)
    })
  },
  launchPromo: function () {
    track(this, 'h5_tcpa_active_setup_click')
    var _url = this.data.isNeedFillInfo ? '../apply/apply?nextpage=launch&prepage=index' : '../launch/launch'
    wx.navigateTo({
      url: _url
    })
  },
  toBalance: function () {
    track(this, 'h5_tcpa_gold_incentive_click')
    this.setData({
      is_ending: false
    })
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
              myMoney: res.data.balance
            })
          } else {
            this.setData({
              myMoney: (parseFloat(res.data.balance) + 5).toFixed(2)
            })
          }
          this.setData({
            is_get_bouns: true
          })
        }
      })
    }, 2000)
  },
  formSubmit: function (e) {
    if (this.data.isSubmitFormId) {
      request({
        url: '/tmpl/formid/submit',
        data: {
          formId: e.detail.formId
        }
      }).then(res => {
        if (res.succ) {} else {
          this.data.isSubmitFormId = false
        }
      })
    }
  },
  getFirstMoneyModal: function () {
    return request({
      url: '/bounty/get'
    }).then(res => {
      if (res.succ) {
        this.setData({
          isShowGetMoneyModal: true,
          is_get_bouns: true,
          myMoney: res.data.bounty,
        })
      }
    })
  },
  showMoneyModal: function (sharekey) {
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
          is_get_bouns: true,
          isScanTwice: res.data.is_already_open
        }

        if (!res.data.is_owner) { // 不是自己才展示弹窗
          _data[_type] = true
        }


        this.setData(_data)
      }
    })
  }
})