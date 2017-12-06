// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowOpenRedpocketModal: false,
    openRedpocketModalData: {
      redpocketNum: 20
    }
  },
  lookNewbalance: function () {
    track(this, 'h5_tcpa_redbag_nowopen_v7')
    this.closeRedpocketModal()
    wx.navigateTo({
      url: `../newbalance/newbalance`
    })
  },
  closeRedpocketModal: function () {
    this.setData({
      isShowOpenRedpocketModal: false
    })
  }
}