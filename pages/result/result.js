import track from '../../utils/track.js'
import { mutulPage } from '../../utils/util.js'
let getLenStr = require('../../utils/util.js').getLenStr
var seckillResult = require('../../components/seckill/result/index.js')
mutulPage({
  mixins: [seckillResult],
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_result_enter'
  },
  onShareAppMessage(options) {
    const _options = options.from === 'button' ? {
      title: `${this.data.seckill.shareUserName}抢到了一次秒杀机会，和他一起参加"${getLenStr(this.data.title, 30).str}",立减¥${this.data.seckill.discount}`,
      path: `pages/detail/detail?id=${this.data.id}&shareUserId=${this.data.seckill.shareUserId}`,
    } : {
        title: `"${getLenStr(this.data.title, 30).str}"火热报名中,快来加入吧～`,
      path: `pages/detail/detail?id=${this.data.id}`,
    }
    return {
      ..._options,
      imageUrl: this.data.transferImageUrl,
      success: function (res) {
        // 转发成功
        track(this, 'h5_tcpa_result_share_succ', [`id=${this.data.id}`])
      }
    }
  },
  onLoad: function (option) {
    console.log(option)
    // 取页面上的id
    this.setData({
      id:option.id, 
      promoText: `本周在你附近举办的${option.promonum == 0 ? "" : `${option.promonum}个`}活动`,
      sessionFrom: `activityassistant_${option.id}`,
      transferImageUrl: option.transferImageUrl,
      title: option.title, 
    })
    this.setSeckillOptions(option)
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