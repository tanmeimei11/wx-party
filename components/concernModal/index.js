var request = require('../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    isShowConcernModal: false
  },
  closeConcernModal: function () {
    this.setData({
      isShowConcernModal: false
    })
  }
}