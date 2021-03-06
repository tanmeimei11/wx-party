var request = require('../../utils/wxPromise.js').requestPromisify
var payMoney = require('../../utils/api.js').payMoney
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowPayModal: false
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
      track(this, 'h5_tcpa_pintuan_pay_click', [`active_amt=${this.data.priceInfo.act_charge}`, `pt_amt=${this.data.priceInfo.union_discount}`, `glj_amt=${this.data.priceInfo.bounty_deduct}`, `active_id=${this.data.id}`, `type=${this.data.unionInfo.is_owner ? 1 : 0}`])
    } else {
      _data.is_seckill_finish = this.data.seckill.is_seckill_finish
      track(this, 'h5_tcpa_pay_click', [`amt=${this.data.priceInfo.final_cost}`, `type=${this.data.priceInfo.charge == 0 ? 0:1}`, `gz_amt=${this.data.priceInfo.book_charge}`, `glj_amt=${this.data.priceInfo.bounty_deduct}`, `active_amt=${this.data.priceInfo.act_charge}`])
    }
    payMoney(_data)
      .then(() => {
        if (!_data.is_union) {
          track(this, 'h5_tcpa_detail_pay_succ')
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
        if (res.code == '4160032402') {
          this.toastModal('请稍后重试', '当前有人正在拼团')
        }
        //  来晚一步啦～
        if (res.code == '4160032399') {
          this.lateModal()
        }
        //  拼团过期了～
        if (res.code == '4160032400' || res.code == '4160032401') {
          this.guoqiModal()
        }
        if (res && res.code) {
          this.closePayModal()
        }
        wx.hideLoading()
      }).catch(() => {
        this.loadingOut()
      })
  },
  pay: function (e) {
    this.loadingIn('请稍后...')
    this.payMoneyAgain()
  }
}