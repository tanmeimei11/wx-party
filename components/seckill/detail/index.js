import track from '../../../utils/track.js'
var request = require('../../../utils/wxPromise.js').requestPromisify

module.exports = {
  data: {
    seckill: {
      count: 0,
      count_down: 0,
      is_seckill_finish: 1,
      is_seckill: 0,
      isShow: false,
      seckillStatus: '',
      cutDownTimer: null
    }
  },
  setSeckillInfo(data) {
    if (data.is_seckill != 1) return

    var seckillStatus = ''
    var seckill = {
      cutDownTimer: null,
      count_down: +data.count_down / 1000,
      is_seckill: +data.is_seckill,
      name: data.share_user_name,
      avatar_url: data.share_user_avatar,
      price: data.amount,
      original: data.charge,
      count: data.num,
      gender: data.share_user_gender,
      is_seckill_finish: +data.is_seckill_finish,
      isShow: false,
      isSeckillReminded: data.is_seckill_reminded || false,
      isSeckillInterested: data.is_seckill_interested || false
    }
    if (seckill.is_seckill == 1 && seckill.count_down != 0 && seckill.is_seckill_finish != 1) { // 即将开抢
      seckillStatus = 'ready'
    } else if (seckill.is_seckill == 1 && seckill.count_down <= 0 && seckill.is_seckill_finish != 1) { //正在秒杀
      seckillStatus = 'begin'
    } else if (seckill.is_seckill == 1 && seckill.is_seckill_finish == 1) { //已经结束了
      seckillStatus = 'over'
    }
    seckill.seckillStatus = seckillStatus
    this.setData({
      seckill: seckill
    })
    this.countdown()
  },
  setSeckillWarnBefore() {
    if (!this.data.id) {
      return
    }
    if (this.data.seckill.isSeckillReminded) {
      this.showToastWhite('已开启提醒，勿重复点击')
      return
    }
    request({
      url: '/activity/remindseckill',
      data: {
        act_id: this.data.id
      }
      // method: 'POST'
    }).then(res => {
      if (res.succ) {
        this.showToastWhite('成功开启提醒')
        var _s = this.data.seckill
        _s.isSeckillReminded = true
        this.setData({
          seckill: _s
        })
      }
    })
  },
  // 设置提醒
  setSeckillWarn() {
    if (!this.data.id) {
      return
    }
    if (this.data.seckill.isSeckillInterested) {
      this.showToastWhite('已开启提醒，勿重复点击')
      return
    }
    request({
      url: '/activity/interestinseckill'
      // method: 'POST'
    }).then(res => {
      if (res.succ) {
        this.showToastWhite('成功开启提醒')
        var _s = this.data.seckill
        _s.isSeckillInterested = true
        this.setData({
          seckill: _s
        })
      }
    })
  },
  countdown() {
    var cutDownFun = () => {
      if (this.data.seckill.count_down <= 0) {
        clearInterval(this.data.seckill.cutDownTimer)
        var _seckill = this.data.seckill
        _seckill.seckillStatus = 'begin'
        this.setData({
          seckill: _seckill
        })
        return
      }

      this.setData({
        seckill: {
          ...this.data.seckill,
          count_down: this.data.seckill.count_down - 1
        }
      })
    };

    !this.data.seckill.cutDownTimer && (this.data.seckill.cutDownTimer = setInterval(cutDownFun, 1000))
  },
  // 显示弹窗
  showSeckillModal() {
    this.setData({
      isShowPayModal: false,
      seckill: {
        ...this.data.seckill,
        is_seckill_finish: 1,
        isShow: true,
        seckillStatus: 'over'
      }
    })
  },
  // 关闭弹窗
  closeSeckillModal() {
    track(this, 'h5_tcpa_seckill_iknow_cick')
    this.setData({
      seckill: {
        ...this.data.seckill,
        isShow: false
      }
    })
  }
}