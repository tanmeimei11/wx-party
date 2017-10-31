import track from '../../utils/track.js'

Page({
  data: {

  },
  onLoad: function (option) {
    console.log(option)
    // 取页面上的id
    this.setData({
      promoText: `本周在你附近举办的${option.promonum==0 ? "":`${option.promonum}个`}活动`,
      sessionFrom: `activity_${option.id}`
    })
  }

})