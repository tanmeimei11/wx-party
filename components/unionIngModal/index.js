// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    unionIngModalInfo: {
      isShow: false
    }
  },
  closeUnionIngModal: function () {
    this.setData({
      unionIngModalInfo: {
        ...this.data.unionIngModalInfo,
        isShow: false
      }
    })
  }
}