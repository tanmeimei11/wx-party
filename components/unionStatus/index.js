var request = require('../../utils/wxPromise.js').requestPromisify
// import track from '../../utils/track.js'
module.exports = {
  data: {
    unionStatus: {
      is_show: false
    }
  },
  showUnionStatus: function () {
    this.setData({
      unionStatus: {
        ...this.data.unionStatus,
        is_show: true
      }
    })
  },
  closeWindow: function () {
    this.setData({
      unionStatus: {
        ...this.data.unionStatus,
        is_show: false
      }
    })
  }
}