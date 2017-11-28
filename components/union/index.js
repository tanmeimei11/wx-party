var request = require('../../utils/wxPromise.js').requestPromisify
// import track from '../../utils/track.js'
module.exports = {
  data: {
    unionInfo: {
      is_union: false
    }
  },
  setUnionInfo: function (data) {
    data.union_info && (
      this.setData({
        unionInfo: data.union_info
      })
    )
  },
  // 拼团成功
  // 两人成团
  // 拼团中
  getUnionIng: function () {
    this.setData({
      unionIngModalInfo: {
        ...this.data.unionIngModalInfo,
        isShow: true
      }
    })
  }
}