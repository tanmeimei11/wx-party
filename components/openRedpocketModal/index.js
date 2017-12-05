// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    openRedpocketModalData: {
      isShow: false,
      redpocketNum: 20
    }
  },

  openRedpocket: function () {
    this.setData({
      openRedpocketModalData: {
        ...this.data.openRedpocketModalData,
        isShow: false
      }
    })
  }
}