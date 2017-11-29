var request = require('../../utils/wxPromise.js').requestPromisify
// import track from '../../utils/track.js'
module.exports = {
  data: {
    lateModal: {
      is_show: false,
      txt1: '来晚了一步',
      txt2: '活动开始前一小时内，无法拼团报名'
    }
  },
  guoqiModal: function () {
    this.setData({
      lateModal: {
        ...this.data.lateModal,
        txt1: '来晚了一步',
        txt2: '活动开始前一小时内，无法拼团报名'
      }
    })
  },
  lateModal: function () {
    this.setData({
      lateModal: {
        ...this.data.lateModal,
        txt1: '来晚了一步',
        txt2: '已经有人抢先拼团了'
      }
    })
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