var request = require('../../utils/wxPromise.js').requestPromisify
// import track from '../../utils/track.js'
module.exports = {
  data: {
    defaultUnionInfo: {
      'status': 'none',
      'avatar': 'https://inimg07.jiuyan.info/in/2017/11/28/29AB4215-BACF-F96B-88A0-A0BE33046BF0.png',
      'nick_name': '还差一人'
    },
    unionInfo: {
      is_union: false,
    },
    unionTimer: null
  },
  setUnionInfo: function (data) {
    if (!data.union_info) {
      return
    }
    var union_info = data.union_info
    if (data.union_info) {
      this.showUnionStatus()
    }
    if (union_info.join_info && union_info.join_info.avatar) {
      union_info.join_info.status = ''
    } else {
      union_info.join_info = this.data.defaultUnionInfo
    }
    union_info.union_countdown_diff = 5
    this.setData({
      unionInfo: data.union_info
    })
    this.countdownPay()
  },
  // 拼团倒计时
  countdownPay() {
    if (this.data.unionInfo.union_status == 2 || this.data.unionInfo.union_status == 3 || this.data.unionInfo.union_status == 4) {
      return
    }
    // joiner 进来倒计时结束 (拼团者0 ＋ 发起者 1) ＝> 已过期3
    if (this.data.unionInfo.union_countdown_diff === 0) {
      var _data = {
        ...this.data.unionInfo,
        union_status: 3,
        desc: '来晚一步，拼团已经过期了'
      }
      this.setData({
        unionInfo: _data,
        isShowPayModal: false,
        unionIngModalInfo: {
          ...this.data.unionIngModalInfo,
          isShow: false
        },
        isShowPayModal: false
      })
      clearTimeout(unionTimer)
      return
    }

    this.setData({
      unionInfo: {
        ...this.data.unionInfo,
        union_countdown_diff: this.data.unionInfo.union_countdown_diff - 1
      }
    })
    this.data.unionTimer = setTimeout(() => this.countdownPay(), 1000)
  },
  // 拼团成功
  // 拼团中
  getUnionIng: function () {
    this.setData({
      unionIngModalInfo: {
        ...this.data.unionIngModalInfo,
        isShow: true
      }
    })
  },
  // 判断状态  (来晚了 过期了)状态重置到0
  changeUnionStatus() {
    var _data = {}
    if (this.data.unionInfo.union_status == 2 || this.data.unionInfo.union_status == 3) {
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