// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowOpenRiseRedpocketModal: false,
  },
  closeOpenRiseMoneyModal: function () {
    this.setData({
      isShowOpenRiseRedpocketModal: false
    })
  },
  lookNewbalance: function () {
    wx.navigateTo({
      url: `../newbalance/newbalance`
    })
    this.closeRedpocketModal()
  },
}