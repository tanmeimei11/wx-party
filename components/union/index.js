var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    defaultUnionInfo: {
      'status': 'none',
      'avatar': 'https://inimg07.jiuyan.info/in/2017/11/28/29AB4215-BACF-F96B-88A0-A0BE33046BF0.png',
      'nick_name': '还差一人'
    },
    unionInfo: {
      cutDownTimer: null,
      is_union: false,
    }
  },
  setUnionInfo: function (data) {
    if (!data.union_info || !data.union_info.is_union) {
      return
    }
    var union_info = data.union_info
    if (union_info.join_info && union_info.join_info.avatar) {
      union_info.join_info.status = ''
    } else {
      if (union_info.is_owner) {
        union_info.launch_info = union_info.owner_info
      }
      union_info.join_info = this.data.defaultUnionInfo
    }
    union_info.union_countdown_diff = parseInt(+data.union_info.union_countdown_diff / 1000) - 1
    this.setData({
      unionInfo: {
        ...this.data.unionInfo,
        ...union_info
      }
    })
    this.countdownPay()
  },
  getUnionParam: function () {
    var _shareInfo = this.getUnionShareInfo()
    return [`id=${this.data.id}`,
      `&user_id=${this.data.unionInfo.launch_info.user_id}`,
      `transferImageUrl=${encodeURIComponent(this.data.transferImageUrl)}`,
      `title=${encodeURIComponent(_shareInfo.title)}`
    ].join('&')
  },
  // 拼团倒计时
  countdownPay: function () {
    if (this.data.unionInfo.union_status == 0 || this.data.unionInfo.union_status == 2 || this.data.unionInfo.union_status == 3 || this.data.unionInfo.union_status == 4) {
      return
    }
    if (this.data.unionInfo.cutDownTimer) {
      clearInterval(this.data.unionInfo.cutDownTimer)
    }

    this.setData({
      unionInfo: {
        ...this.data.unionInfo,
        cutDownTimer: setInterval(this.cutDownFun, 1000)
      }
    })
  },
  cutDownFun: function () {
    // joiner 进来倒计时结束 (拼团者0 ＋ 发起者 1) ＝> 已过期3
    if (this.data.unionInfo.union_countdown_diff <= 0) {
      clearInterval(this.data.unionInfo.cutDownTimer)
      var _data = {
        ...this.data.unionInfo,
        union_status: 3,
        desc: '来晚一步，拼团已经过期了'
      }
      var d = {
        unionInfo: _data,
        unionIngModalInfo: {
          ...this.data.unionIngModalInfo,
          isShow: false
        },
        isShowPayModal: false
      }
      this.setData(d)
      return
    }
    this.setData({
      unionInfo: {
        ...this.data.unionInfo,
        union_countdown_diff: this.data.unionInfo.union_countdown_diff - 1
      }
    })
  },
  // 拼团成功
  goUnionSucc: function () {
    wx.redirectTo({
      url: `../result_union/result_union?${this.getUnionParam()}`
    })
  },
  // 拼团中
  goUnionIng: function () {
    track(this, 'h5_tcpa_pintuan_ing_click')
    this.setData({
      unionIngModalInfo: {
        ...this.data.unionIngModalInfo,
        isShow: true
      }
    })
  },
  // 过期状态  (拼团人来晚了 活动过期了)状态重置到0
  changeUnionToOrigin: function () {
    var _data = {}
    if (this.data.unionInfo && (this.data.unionInfo.union_status == 2 || this.data.unionInfo.union_status == 3)) {
      _data = {
        unionInfo: {
          ...this.data.unionInfo,
          union_id: '',
          union_status: 0,
          union_countdown_diff: 0,
          is_owner: true,
          desc: '',
          launch_info: this.data.unionInfo.owner_info,
          join_info: this.data.defaultUnionInfo,
        },
        isShowPayModal: false
      }
    }
    this.setData(_data)
  }
}