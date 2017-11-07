// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowGetMoneyModal: false,
  },
  closeGetMoneyModal: function () {
    this.setData({
      isShowGetMoneyModal: false
    })
  },
  lookBalance: function () {
    track(this, 'h5_tcpa_gold_see_click')
    wx.navigateTo({
      url: `../balance/balance`
    })
  }
}