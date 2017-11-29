import track from '../../utils/track.js'
var request = require('../../utils/wxPromise.js').requestPromisify
import {
  mutulPage
} from '../../utils/mixin.js'
var seckillResult = require('../../components/seckill/result/index.js')
mutulPage({
  mixins: [seckillResult],
  data: {
    item: [],
    xxtimer: null,
    unionSucc: false,
    done: false,
    _v: '',
    act_id: '',
    shareInfo: {}
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_result_screen_enter')
    var self = this
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          _v: res.version
        });
      }
    })
    // 取页面上的id
    this.setData({
      id: option.id,
      promoText: `本周在你附近举办的${option.promonum == 0 ? "" : `${option.promonum}个`}活动`,
      sessionFrom: `activityassistant_${option.id}`,
      transferImageUrl: option.transferImageUrl,
      title: option.title,
    })
    this.getInfo(option)
    request({
      url: `/union/share_info`,
      data: {
        act_id: this.data.act_id,
        launch_user_id: '',
        _v: this.data._v
      }
    }).then((res) => {
      // console.log(res.data.map(item => {
      //   item.cutTime = +item.count_down / 1000
      //   return item
      // }))
      var list = res.data
      if (res.data.join_info.join_avatar) {
        var unionSucc = true
      } else {
        var unionSucc = false
        list.cutTime = list.count_down / 1000
        this.countdown()
      }
      this.setData({
        item: list,
        unionSucc: unionSucc,
        done: true
      })
    })
  },
  getInfo: function (option) {
    request({
      url: "/activity/share_info",
      data: {
          id: option.id
      }
    }).then(res => {
      if (res.succ) {
        this.setData({
          shareInfo: {
            shareUserName: res.data.user_name,
            shareUserId: res.data.user_id,
            discount: res.data.discount,
          }
        })
      }
    })
  },
  onShareAppMessage(options) {
    const _options = options.from === 'button' ? {
      title: `${this.data.shareInfo.shareUserName}邀请你一起参团，参加"${decodeURIComponent(this.data.title)}",立减¥${this.data.seckill.discount}`,
      path: `pages/detail/detail?id=${this.data.id}&shareUserId=${this.data.seckill.shareUserId}`,
    } : {
      title: `"${decodeURIComponent(this.data.title)}"火热报名中,快来加入吧～`,
      path: `pages/detail/detail?id=${this.data.id}`,
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
  countdown: function () {
    var list = this.data.item
    if (list.cutTime < 1) {
      wx.redirectTo({
        url: '../detail/detail'
      })
      return
    }
    list.cutTime -= 1
    this.setData({
      item: list
    })

    this.data.xxtimer = setTimeout(() => this.countdown(), 1000)
  },
  goback: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  }
})