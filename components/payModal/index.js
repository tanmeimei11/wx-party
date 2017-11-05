var request = require('../../utils/wxPromise.js').requestPromisify
var payMoney = require('../../utils/api.js').payMoney
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowPayModal: false,
    promoMoney: 0,
    promoDelayMoney: 0
  },
  loadingIn: function (text) {
    wx.showLoading({
      title: text,
    })
  },
  loadingOut: function () {
    wx.hideLoading()
  },
  closeUserModal: function () {
    this.setData({
      isShowPayModal: false
    })
  },
  pay: function (e) {
    track(this, 'h5_tcpa_pay_cick', [`amt=${this.data.promoMoney == 0 ? this.data.promoMoney:this.data.promoDelayMoney}`, `type=${this.data.promoMoney == 0 ? 0:1}`])
    this.loadingIn('请稍后...')
    payMoney(this.data.id)
      .then(() => {
        console.log('paySucc')
        track(this, 'h5_tcpa_detail_pay_succ')
        wx.redirectTo({
          url: `../result/result?prepage=apply&promonum=${this.data.otherPromoNum}&id=${id}`
        })
      }).catch(() => {
        this.loadingOut()
      })
  }
}