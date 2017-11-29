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
    shareInfo: {},
    id: '',
    title: '',
    transferImageUrl: '',
    union_id: ''
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_result_screen_enter')
    console.log(option)
    console.log(decodeURIComponent(option.title))
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
      user_id: option.user_id,
      title: decodeURIComponent(option.title),
      transferImageUrl: decodeURIComponent(option.transferImageUrl),
    })
    request({
      url: `/union/share_info`,
      data: {
        act_id: this.data.act_id,
        user_id: this.data.user_id,
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
        done: true,
        union_id: union_id
      })
    })
  },
  onShareAppMessage(options) {
    return {
      title: this.data.title,
      id: this.data.id,
      imageUrl: this.data.transferImageUrl,
      path: `pages/detail/detail?id=${this.data.id}&shareUserId=${this.data.union_id}`,
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
        url: `../detail/detail?id=${this.data.id}`
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