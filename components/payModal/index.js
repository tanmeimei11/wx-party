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
      _data.union_id = this.data.unionInfo.union_id || ''
    } else {
      _data.is_seckill_finish = this.data.seckill.is_seckill_finish
    }
    payMoney(_data)
      .then(() => {
        track(this, 'h5_tcpa_detail_pay_succ')
        if (!_data.is_union) {
          wx.redirectTo({
            url: `../result/result?prepage=apply&${this.getRedirectParam()}}`
          })
        } else {
          this.goUnionSucc()
        }
      }, (res) => {
        // 没有秒杀到
        if (res.code == '4000032352') {
          this.showSeckillModal()
        }
        //  来晚一步啦～
        if (res.code == '4160032399') {
          this.lateModal()
        }
        //  拼团过期了～
        if (res.code == '4160032400' || res.code == '4160032401') {
          this.guoqiModal()
        }
        this.closePayModal()
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