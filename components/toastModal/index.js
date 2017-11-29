var request = require('../../utils/wxPromise.js').requestPromisify
// import track from '../../utils/track.js'
module.exports = {
  data: {
    lateModal: {
      is_show: true
    }
  },
  closelateModal: function () {
    this.setData({
      lateModal: {
        ...this.data.lateModal,
        is_show: false
      }
    })
  }
}