// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowOpenRiseRedpocketModal: false,
  },
  closeOpenRiseRedpocketModal: function () {
    this.setData({
      isShowOpenRiseRedpocketModal: false
    })
  },
  lookNewbalance1: function () {
    this.closeOpenRiseRedpocketModal()
    track(this, 'h5_tcpa_redbag_sharepage_nowopen_v7')
    wx.navigateTo({
      url: `../newbalance/newbalance`
    })
  }
}