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
  lookNewbalance: function () {
    this.closeOpenRiseRedpocketModal()
    wx.navigateTo({
      url: `../newbalance/newbalance`
    })

  },
}