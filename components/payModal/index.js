var request = require('../../utils/wxPromise.js').requestPromisify
var payMoney = require('../../utils/api.js').payMoney
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
    var id = e.target.dataset.id
    payMoney(id)
      .then(() => {
        console.log('paySucc')
        wx.redirectTo({
          url: `../result/result?prepage=apply&promonum=${this.data.otherPromoNum}&id=${id}`
        })
      })
  }
}