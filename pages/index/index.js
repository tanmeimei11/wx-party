const app = getApp()
let util = require('../../utils/util.js')
// let request = util.wxRequest
let request = require('../../utils/wxPromise.js').requestPromisify

// let system = require('../../utils/system.js')
// let request = system.wxRequest
import track from '../../utils/track.js'
// 组件
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var mutulPage = require('../../utils/util.js').mutulPage
var promo = require('../../components/promoCard/index.js')
var commont = require('../../components/commentCard/index.js')
var user = require('../../components/userCard/index.js')
var photos = require('../../components/photosCard/index.js')
var concernModal = require('../../components/concernModal/index.js')
var userModal = require('../../components/userModal/index.js')

mutulPage({
  mixins: [promo, commont, user, photos, concernModal, userModal],
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
    isShowOtherCircle: false,
    circleStatus: 'join', // join joinnostatus notjoin
    allStatus: [],
    otherStatus: [],
    isLoadingCircle: false,
    noMoreCircle: false,
    lists: [
      'qunList',
      'promoList',
      'circleList'
    ],
    currentCursorCircle: 0,
    currentCursorOtherCircle: 0,
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
    this.loadMorePromo()
  },
  switchTab3: function (e) {

    if (this.data.currentList == 'circleList') {
      return
    }

    wx.showLoading({
      title: '加载中',
    })

    if (e) {
      this.setShare(2)
      track(this, 'h5_tcpa_index_active_tab_click ')
    }
    this.setData({
      currentList: 'circleList',
      isShowOtherCircle: false,
      circleStatus: 'join',
      allStatus: [],
      otherStatus: [],
      isLoadingCircle: false,
      noMoreCircle: false,
      hidden: true
    })
    this.getPageData('loading')
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
            res.data.list[i].time = util.formatTime(new Date(res.data.list[i].start_time))
          }
        }
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
  loading: function () {
    this.setData({
      isLoadingCircle: true
    })
  },
  loadingOut: function () {
    setTimeout(() => {
      this.setData({
        isLoadingCircle: false
      })
    }, 300)
  },
  getPageData: function (loading) {

    request({
      url: '/friend/feed',
      data: {
        cursor: this.data.currentCursorCircle,
        limit: 10
      }
    }).then((res) => {
      if (res.succ) {
        if (!res.data.hasJoin || this.data.noMoreCircle) {
          this.getOtherData()
          this.setData({
            isShowOtherCircle: true,
          })
        } else {
          this.initCircleData(res.data)
        }
        loading && wx.hideLoading()
      } else {
        this.loadingOut()
      }
    }, () => {
      this.loadingOut()
      wx.showToast({
        title: '网路错误',
        icon: 'fail',
        duration: 2000
      })
    })
  },
  getDescCollect: function (age, city, district, work) {
    var _desc = ''
    if (age && age != 0) {
      _desc += `${age}岁`
    }
    if (city) {
      _desc += ` ${city}`
      district && (_desc += `.${district}`)
    } else {
      district && (_desc += ` ${district}`)
    }
    work && (_desc += ` ${work}`)
    return _desc
  },
  getOtherData: function () {
    request({
      url: '/friend/rec',
      data: {
        cursor: this.data.currentCursorOtherCircle,
        limit: 10
      }
    }).then((res) => {
      if (res.succ) {
        this.initOtherData(res.data)
      }
    })
  },
  initOtherData: function (data) { // 推荐
    // 没有数据了
    if (!data.list.length) {
      this.setData({
        noMoreCircle: true
      })
    }

    this.setData({
      currentCursorOtherCircle: data.current_cursor
    })
    var otherStatus = data.list
    otherStatus.forEach((item, idx) => {
      if (item.feed_type != 'publish') {
        var _promo = item.activity_info
        _promo.time = formatTimeToTime(_promo.start_time)
      } else {
        var _descObj = util.getLenStr(item.photo_info.desc, 100);
        !_descObj.all && (item.photo_info.tempDesc = _descObj.str, item.photo_info.isTempDesc = true)
      }

      // 组合描述
      item.userDesc = this.getDescCollect(item.feed_user_age, item.feed_user_city, item.feed_user_district, item.feed_user_work)
    })
    var _otherStatus = this.data.otherStatus
    this.setData({
      otherStatus: [..._otherStatus, ...otherStatus],
    })
    this.loadingOut()
    // del
    this.setData({
      noMoreCircle: true
    })
  },
  initCircleData: function (data) { // 趴友圈
    // 显示推荐
    if (!data.list.length) {
      this.setData({
        isShowOtherCircle: true
      })
    }

    this.setData({
      currentCursorCircle: data.current_cursor
    })
    var allStatus = data.list
    allStatus.forEach((item, idx) => {
      if (item.feed_type != 'publish') {
        var _promo = item.activity_info
        _promo.time = formatTimeToTime(_promo.start_time)
      } else {
        var _descObj = util.getLenStr(item.photo_info.desc, 100);
        !_descObj.all && (item.photo_info.tempDesc = _descObj.str, item.photo_info.isTempDesc = true)
      }
    })
    var _allStatus = this.data.allStatus
    this.setData({
      allStatus: [..._allStatus, ...allStatus]
    })
    this.loadingOut()
    // del
    this.setData({
      isShowOtherCircle: true
    })
  },
  scrollChange: function (e) {
    if (this.data.isLoadingCircle || this.data.noMoreCircle) {
      return
    }
    if (!this.data.isShowOtherCircle) {
      this.getPageData()
    } else {
      this.getOtherData()
    }
    this.loading()
  },
  getMorePicDesc: function (e) {
    var _idx = e.currentTarget.dataset.idx
    var _allStatus = this.data.allStatus
    _allStatus[_idx].photo_info.isTempDesc = !_allStatus[_idx].photo_info.isTempDesc
    this.setData({
      allStatus: _allStatus
    })
  },
  lookMoreInStatus: function () {

  },
  onLoad(options) {
    let currentList = this.data.lists[options.tab - 1]
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
    if (currentList == 'qunList') {
      this.switchTab1()
    } else if (currentList == 'promoList') {
      this.switchTab2()
    } else {
      this.switchTab3()
    }
  }
})