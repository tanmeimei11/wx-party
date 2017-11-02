var request = require('../../utils/wxPromise.js').requestPromisify
module.exports = {
  getConcern: function (e) {
    var _dataset = e.currentTarget.dataset
    var concern = _dataset.concern
    if (concern) {
      return false
    }

    var uid = _dataset.uid
    var idx = _dataset.statusIdx
    console.log(idx)
    request({
      url: '/friend/inwatch',
      data: {
        feed_user_id: uid
      }
    }).then((res) => {
      console.log(res)
      if (res.succ) {
        console.log('----关注-----')
        var _otherStatus = this.data.otherStatus
        _otherStatus[idx].has_in_watch = true
        this.setData({
          otherStatus: _otherStatus,
          isShowConcernModal: true
        })
      }
    })
  }
}