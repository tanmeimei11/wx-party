import track from '../../../utils/track.js'
module.exports = {
  data: {
    seckill: {
      // gender: '男',      avatar_url:'http://inimg02.jiuyan.info/in/2017/03/24/5F838417-1DDA-CE2A-14A6-7A0D0247301C-1wGMzYZ.jpg',
      // name:'犀牛',
      // price: '59',
      // original: '169',
      // count: 3,
      is_finish: 1,
      is_seckill: 0,
    }
  },
  setSeckillInfo(data) {
    if (data.is_seckill != 1) return
    this.setData({
      seckill: {
        is_seckill: +data.is_seckill,
        name: data.share_user_name,
        avatar_url: data.share_user_avatar,
        price: data.amount,
        original: data.charge,
        count: data.num,
        gender: data.share_user_gender,
        is_finish: +data.is_finish
      }
    })
  },
  confirmOpenBook(){
    this.openBook()
  },
  // 显示弹窗
  showSeckillModal() {
    track(this, 'h5_tcpa_seckill_modal_show_cick')
    this.setData({
      seckill: {
        ...this.data.seckill,
        is_finish: 1
      }
    })
  },
  // 关闭弹窗
  closeSeckillModal() {
    track(this, 'h5_tcpa_seckill_modal_close_cick')
    this.setData({
      seckill: {
        ...this.data.seckill,
        is_finish: 0
      }
    })
  }
}