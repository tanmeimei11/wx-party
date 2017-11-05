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
    wx.redirectTo({
      url: `../balance/balance`
    })
  }
}