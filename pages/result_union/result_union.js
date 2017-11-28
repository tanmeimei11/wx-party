import track from '../../utils/track.js'
var request = require('../../utils/wxPromise.js').requestPromisify
import {
  mutulPage
} from '../../utils/mixin.js'
var seckillResult = require('../../components/seckill/result/index.js')
mutulPage({
  mixins: [seckillResult],
  data: {
    item: 0,

  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_result_screen_enter')
    // 取页面上的id
    this.setData({
      id: option.id,
      promoText: `本周在你附近举办的${option.promonum == 0 ? "" : `${option.promonum}个`}活动`,
      sessionFrom: `activityassistant_${option.id}`,
      transferImageUrl: option.transferImageUrl,
      title: option.title,
    })
    this.setSeckillOptions(option)
    request({
      url: `/union/share_info`,
      data: {
        act_id: '',
        launch_user_id: '',
        _v: ''
      }
    }).then((res) => {
      // console.log(res.data.map(item => {
      //   item.cutTime = +item.count_down / 1000
      //   return item
      // }))
      // this.setData({
      //   item: res.data
      // })
    })
  },
  goBack: function () {
    track(this, 'h5_tcpa_paysucc_look')
    wx.redirectTo({
      url: '../index/index?tab=2'
    })
  }
})