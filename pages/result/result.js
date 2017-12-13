import track from '../../utils/track.js'
const app = getApp()
var request = require('../../utils/wxPromise.js').requestPromisify
import {
  mutulPage
} from '../../utils/mixin.js'
var seckillResult = require('../../components/seckill/result/index.js')
mutulPage({
  mixins: [seckillResult],
  data: {
    toAPPsession: '',
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_result_enter'
  },
  onShareAppMessage(options) {
    const _options = options.from === 'button' ? {
      title: `${this.data.seckill.shareUserName}抢到了一次秒杀机会，和他一起参加"${decodeURIComponent(this.data.title)}",立减¥${this.data.seckill.discount}`,
      path: `pages/detail/detail?id=${this.data.id}&shareUserId=${this.data.seckill.shareUserId}`,
    } : {
      title: `"${decodeURIComponent(this.data.title)}"火热报名中,快来加入吧～`,
      path: `pages/detail/detail?id=${this.data.id}`,
    }
    if (options.from === 'button') {
      track(this, 'h5_tcpa_paysucc_share')
    }
    return {
      ..._options,
      imageUrl: decodeURIComponent(this.data.transferImageUrl),
      success: function (res) {
        // 转发成功
        // track(this, 'h5_tcpa_share_page', [`id=${this.data.id}`])
      }
    }
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_result_screen_enter')
    wx.setNavigationBarTitle({
      title: '报名成功'
    })
    this.Polling(option)
  },
  pageLoaded: function (option) {
    // 取页面上的id
    this.setData({
      toAPPsession: `openapp_${option.id}_${app.globalData.orderNo}`,
      id: option.id,
      promoText: `本周在你附近举办的${option.promonum == 0 ? "" : `${option.promonum}个`}活动`,
      sessionFrom: `activityassistant_${option.id}`,
      transferImageUrl: option.transferImageUrl,
      title: option.title,
    })
    this.setSeckillOptions(option)
  },
  Polling: function(option) {
    request({
      url: `/activity/order/issucc`,
      data: {
        orderNo: app.globalData.orderNo
      }
    }).then((res) => {
      if (res.succ) {
        this.pageLoaded(option)
      } else {
        setTimeout(() => {
          this.Polling(option)
        },1000)
      }
    })
  },
  goBack: function () {
    track(this, 'h5_tcpa_paysucc_look')
    wx.redirectTo({
      url: '../index/index?tab=2'
    })
  },
  getQrTrack: function () {
    track(this, 'h5_tcpa_paysucc_look')
  }
})