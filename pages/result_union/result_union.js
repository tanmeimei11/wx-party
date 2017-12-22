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
    union_id: '',
    hidden: false,
    trackSeed: `http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_pintuan_succ_page`
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_pintuan_succ_page', [`active_id=${this.data.id}`])
    console.log(option)
    console.log(decodeURIComponent(option.title))
    // 取页面上的id
    this.setData({
      id: option.id,
      user_id: option.user_id,
      title: decodeURIComponent(option.title),
      transferImageUrl: decodeURIComponent(option.transferImageUrl),
    })
    request({
      url: `/union/pay_after_info`,
      data: {
        act_id: this.data.id,
        user_id: this.data.user_id,
      }
    }).then((res) => {
      // console.log(res.data.map(item => {
      //   item.cutTime = +item.count_down / 1000
      //   return item
      // }))
      var list = res.data
      if (res.data.join_info && res.data.join_info.join_avatar) {
        var unionSucc = true
      } else {
        var unionSucc = false
        list.cutTime = parseInt(+list.count_down / 1000)
        this.countdown()
      }
      this.setData({
        hidden: true,
        item: list,
        unionSucc: unionSucc,
        done: true,
        union_id: res.data.union_id
      })
    })
  },
  onShareAppMessage(options) {
    return {
      title: this.data.title,
      id: this.data.id,
      imageUrl: this.data.transferImageUrl,
      path: `pages/detail/detail?id=${this.data.id}&shareUnionId=${this.data.union_id}`,
      success: function (res) {
        // 转发成功
        // track(this, 'h5_tcpa_share_page', [`id=${this.data.id}`])
      }
    }
  },
  shareQr: function () {
    track(this, 'h5_tcpa_pintuan_invite_click')
  },
  getQr: function () {
    track(this, 'h5_tcpa_pintuan_asst_qrcode_click')
  },
  countdown: function () {
    var cutDownFun = () => {
      if (this.data.item.cutTime < 1) {
        clearInterval(this.data.xxtimer)
        wx.redirectTo({
          url: `../detail/detail?id=${this.data.id}`
        })
        return
      }
      this.data.item.cutTime -= 1
      this.setData({
        item: {
          ...this.data.item
        }
      })
    };
    !this.data.xxtimer && (this.data.xxtimer = setInterval(cutDownFun, 1000))
  },
  goback: function () {
    track(this, 'h5_tcpa_pintuan_near_active_click')
    wx.redirectTo({
      url: '../index/index'
    })
  }
})