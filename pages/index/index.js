const app = getApp()
let util = require('../../utils/util.js')
let request = require('../../utils/wxPromise.js').requestPromisify
var locationStorage = require('../../utils/api.js').locationStorage
import track from '../../utils/track.js'
var getMoneyModal = require('../../components/getMoneyModal/index.js')
var riseMoneyModal = require('../../components/riseMoneyModal/index.js')
// var seckillEntry = require('../../components/seckill/entry/index.js')
var seckillEntry = require('../../components/seckill/item/index.js')
var openRedpocketModal = require('../../components/openRedpocketModal/index.js')
var openRiseRedpocketModal = require('../../components/openRiseRedpocketModal/index.js')
var mutulPage = require('../../utils/mixin.js').mutulPage
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify


mutulPage({
  mixins: [getMoneyModal, riseMoneyModal, seckillEntry, openRedpocketModal, openRiseRedpocketModal],
  data: {
    seckill: [],
    promoList: [],
    launchTop: 0,
    hidden: false,
    scrollHeight: 0,
    noMorePromo: false,
    currentList: 'promoList',
    promoListLoaded: false,
    loadingMorePromo: false,
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_index_entry',
    promoNum: 0,
    currentCursorPromo: 0,
    isNeedFillInfo: true,
    isSubmitFormId: true,
    myMoney: '',
    is_get_bouns: true,
    onTop: false,
    toTop: false,
    screen: '全部活动',
    screenID: '',
    screenList: [],
    screenOpen: false,
    sort: '排序',
    sortID: '',
    sortList: [],
    sortOpen: false,
    _gps: '',
    isHangzhou: false,
    currentID1: '',
    currentID2: '',
    notfindpromo: false,
    globalData: app.globalData
  },
  closeSelect: function () {
    this.setData({
      screenOpen: false,
      sortOpen: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'in同城趴，出门一起玩，认识新朋友',
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
    console.log('options：', options)
    track(this, 'h5_tcpa_index_screen_enter')
    track(this, 'h5_tcpa_index_enter', [`cannel_id=${options.from}`])

    // 分渠道埋点
    if (options.from) {
      wx.setStorageSync("from", options.from)
    }

    let self = this
    console.log('获取设备信息')
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          launchTop: res.windowWidth / 750 * 150,
        });
      }
    })
    this.getLocation().then((res) => {
      console.log('获取地理位置')
      // 鼓励金详情页面好友分享点进来 options.sharekey
      if (options.sharekey) {
        this.showShareMoneyModal(options.sharekey)
      } else {
        this.loadBalance()
      }
      this.loadMorePromo()
    })
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

        // 从来没有领取过 那就直接领取
        if (!res.data.is_get_bouns) {
          this.showGetMoneyModal()
        }
      }
    })
  },
  onReachBottom: function () {
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
  onPageScroll: function (e) {
    if (e.scrollTop > this.data.launchTop) {
      this.setData({
        onTop: true
      })
    } else {
      this.setData({
        onTop: false
      })
    }
    if (e.scrollTop > this.data.scrollHeight) {
      this.setData({
        toTop: true
      })
    } else {
      this.setData({
        toTop: false
      })
    }
  },
  toTop: function () {
    this.setData({
      toTop: false
    })
    track(this, 'h5_tcpa_index_top_click')
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  changeAppData: function (key, val) {
    app.globalData.deviceInfo == null && (app.globalData.deviceInfo = {})
    app.globalData.deviceInfo[key] = val
  },
  getLocation: function (e) {
    let self = this
    return wxPromisify(wx.authorize)({
      scope: 'scope.userLocation'
    }).then(suc => {
      console.log("授权成功")
      return wxPromisify(wx.getLocation)({
        type: 'gcj02'
      })
    }, rej => {
      console.log('授权失败')
    }).then(res => {
      if (!res) {
        return
      }
      console.log("获取地理位置成功")
      var latitude = res.latitude
      var longitude = res.longitude
      var _gps = longitude + ',' + latitude
      this.changeAppData('gps', _gps)
      self.setData({
        _gps: _gps
      })
      return locationStorage({
        gps: _gps
      })
    }, rej => {
      console.log("获取地理位置失败")
    }).then(res => {
      this.setData({
        isHangzhou: wx.getStorageSync('locationHZ')
      })
    })
  },
  loadMorePromo: function () {
    console.log('111')
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
        if (res.data.list.length < 10) {
          this.setData({
            noMorePromo: true,
          })
        } else {
          this.setData({
            noMorePromo: false,
          })
        }
        // 搜索返回判断
        if (bottomItem) {
          // 搜索为空
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
      } else {
        this.setData({
          noMorePromo: true
        })
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
  setTimeoutBnalance: function () {
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
  toBalance: function () {
    track(this, 'h5_tcpa_gold_incentive_click')
    // 先进行判断
    request({
      url: '/bounty/bounty_type'
    }).then(res => {
      if (res.succ && res.data == 0) {
        wx.navigateTo({
          url: '../balance/balance'
        })
      } else {
        wx.navigateTo({
          url: '../newbalance/newbalance'
        })
      }
    }).then(() => {
      this.setTimeoutBnalance()
    })
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
  showGetMoneyModal: function () {
    return request({
      // url: '/bounty/get', 换了新接口
      url: '/bounty/get_new',
      data: {
        gps: this.data._gps
      }
    }).then(res => {
      if (res.succ && res.data) {
        // 判断是鼓励斤还是红包
        var _data = res.data
        if (_data.bounty_type == 0) {
          track(this, 'h5_tcpa_gold_see_expo')
          this.setData({
            isShowGetMoneyModal: _data.is_pop,
            is_get_bouns: true,
            myMoney: _data.bounty,
          })
        } else {
          track(this, 'h5_tcpa_redbag_box_expo_v7')
          this.setData({
            isShowOpenRedpocketModal: _data.is_pop,
            is_get_bouns: true,
            myMoney: _data.bounty,
          })
        }
      }
    })
  },
  showShareMoneyModal: function (sharekey) {
    request({
      // url: '/bounty/open',
      url: '/bounty/open_new',
      data: {
        share_key: sharekey
      }
    }).then(res => {
      if (res.succ && res.data) {
        var _data = res.data
        var _type = ""

        // 分享显示弹窗的类型
        if (_data.bounty_type == 0 && _data.bounty_info && _data.bounty_info.is_first_amount) {
          track(this, 'h5_tcpa_gold_share_page', [`user_id=${sharekey}`])
          _type = 'isShowGetMoneyModal'
        } else if (_data.bounty_type == 1 && _data.redpacket_info && _data.redpacket_info.is_first_amount) {
          track(this, 'h5_tcpa_redbag_sharepage_box_v7', [`type=0`, `user_id=${ _data.redpacket_info.friend_user_id}`])
          _type = 'isShowOpenRiseRedpocketModal'
        } else if (_data.bounty_type == 0 && _data.bounty_info && !_data.bounty_info.is_first_amount) {
          track(this, 'h5_tcpa_gold_share_page', [`user_id=${sharekey}`])
          _type = 'isShowRiseMoneyModal'
        } else {
          console.log('2222')
          track(this, 'h5_tcpa_redbag_sharepage_box_v7', [`type=1`, `user_id=${ _data.redpacket_info.friend_user_id}`])
          _type = 'isShowOpenRiseRedpocketModal'
        }

        var _info = _data.bounty_type == 0 ? _data.bounty_info : _data.redpacket_info
        var _data = {
          shareModalType: _data.bounty_type,
          myMoney: _info.my_amount || 0,
          riseMoney: _info.friend_amount || 0,
          friendAvatar: _info.avatar_url,
          friendNick: _info.nick_name,
          is_get_bouns: true,
          isScanTwice: _info.is_already_open,
          redpocketNum: _info.num || 0
        }


        if (!_info.is_owner) { // 不是自己才展示弹窗
          _data[_type] = true
        }
        if (_info.is_first_amount == true) { //分享进来第一次领取
          track(this, 'h5_tcpa_gold_forward_expo')
        }
        this.setData(_data)
      }
    })
  }
})