import track from '../../../utils/track.js'
module.exports = {
  data: {
    seckill: {
      // gender: '男',      avatar_url:'http://inimg02.jiuyan.info/in/2017/03/24/5F838417-1DDA-CE2A-14A6-7A0D0247301C-1wGMzYZ.jpg',
      // name:'犀牛',
      // price: '59',
      // original: '169',
      count: 0,
      count_down: 0,
      is_seckill_finish: 1,
      is_seckill: 0,
      isShow: false
    }
  },
  setSeckillInfo(data) {
    if (data.is_seckill != 1) return
    this.setData({
      seckill: {
        count_down: +data.count_down / 1000,
        is_seckill: +data.is_seckill,
        name: data.share_user_name,
        avatar_url: data.share_user_avatar,
        price: data.amount,
        original: data.charge,
        count: data.num,
        gender: data.share_user_gender,
        is_seckill_finish: +data.is_seckill_finish
      }
    })
    this.countdown()
  },
  countdown() {
    if (this.data.seckill.count_down === 0) return
    this.setData({
      seckill: {
        ...this.data.seckill,
        count_down: this.data.seckill.count_down - 1
      }
    })
    setTimeout(() => this.countdown(), 1000)
  },
  // 显示弹窗
  showSeckillModal() {
    this.setData({
      isShowPayModal: false,
      seckill: {
        ...this.data.seckill,
        is_seckill_finish: 1,
        isShow: true
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