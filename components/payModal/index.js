var request = require('../../utils/wxPromise.js').requestPromisify
var payMoney = require('../../utils/api.js').payMoney
module.exports = {
  data: {
    isShowPayModal: false,
    photos: ['', '', ''],
    promoMoney: '9.9',
    promoDelayMoney: '123'
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
      })
  }
}