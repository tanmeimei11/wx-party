var request = require('../../utils/wxPromise.js').requestPromisify
var payMoney = require('../../utils/api.js').payMoney
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowPayModal: false,
    promoMoney: 0,
    promoDelayMoney: 0
  },
  closeUserModal: function () {
    this.setData({
      isShowPayModal: false
    })
  },
  pay: function (e) {
    track(this, 'h5_tcpa_pay_cick', [`amt=${priceInfo.final_cost}`, `type=${this.data.promoMoney == 0 ? 0:1}`, `gz_amt=${priceInfo.book_charge}`, `glj_amt=${priceInfo.bounty_deduct}`, `active_amt=${priceInfo.actCharge}`])
    this.loadingIn('请稍后...')
    payMoney(this.data.id)
      .then(() => {
        track(this, 'h5_tcpa_detail_pay_succ')
        wx.redirectTo({
          url: `../result/result?prepage=apply&promonum=${this.data.otherPromoNum}&id=${id}`
        })
      }).catch(() => {
        this.loadingOut()
      })
  }
}