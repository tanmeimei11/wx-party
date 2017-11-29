var request = require('../../utils/wxPromise.js').requestPromisify
var payMoney = require('../../utils/api.js').payMoney
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowPayModal: false,
    promoMoney: 0,
    promoDelayMoney: 0
  },
  closePayModal: function () {
    this.setData({
      isShowPayModal: false
    })
  },
  payMoneyAgain() {
    var _data = {
      id: this.data.id
    }
    // 开团或者秒杀
    if (this.data.showPayModalByUnion) {
      _data.is_union = true
      _data.union_id = this.data.unionInfo.union_id
    } else {
      _data.is_seckill_finish = this.data.seckill.is_seckill_finish
    }
    payMoney(_data)
      .then(() => {
        track(this, 'h5_tcpa_detail_pay_succ')
        wx.redirectTo({
          url: `../result/result?prepage=apply&${this.getRedirectParam()}}`
        })
      }, (res) => {
        if (res == 'fail') {
          this.showSeckillModal()
        }
        wx.hideLoading()
      }).catch(() => {
        this.loadingOut()
      })
  },
  pay: function (e) {
    track(this, 'h5_tcpa_pay_click', [`amt=${this.data.priceInfo.final_cost}`, `type=${this.data.promoMoney == 0 ? 0:1}`, `gz_amt=${this.data.priceInfo.book_charge}`, `glj_amt=${this.data.priceInfo.bounty_deduct}`, `active_amt=${this.data.priceInfo.act_charge}`])
    this.loadingIn('请稍后...')
    this.payMoneyAgain()
  }
}