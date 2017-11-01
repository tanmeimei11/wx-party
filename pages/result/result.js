import track from '../../utils/track.js'

Page({
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_result_enter'
  },
  onLoad: function (option) {
    console.log(option)
    // 取页面上的id
    this.setData({
      promoText: `本周在你附近举办的${option.promonum==0 ? "":`${option.promonum}个`}活动`,
      sessionFrom: `activity_${option.id}`
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