// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
let getLenStr = require('../../utils/util.js').getLenStr
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
  },
  getUnionShareInfo: function () {
    var _shareInfo = {
      title: `${this.data.unionInfo.launch_info.nick_name}邀请你一起拼团，参加${getLenStr(this.data.headLine.title,30).str}`,
      path: `pages/detail/detail?id=${this.data.id}&shareUnionId=${this.data.unionInfo.union_id}`,
      imageUrl: this.data.transferImageUrl,
      success: (res) => {
        // 转发成功
        track(this, 'h5_tcpa_active_transfer_succ', [`id=${this.data.id}`])
      },
      fail: function (res) {
        // 转发失败
      }
    }
    return _shareInfo
  }
}