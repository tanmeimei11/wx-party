// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    openMoneyModalData: {
      isShow: false,
      money: 20,
      name: 'in同城趴送你',
      avatarUrl: '',
    }
  },
  reciveRedpocket: function () {
    this.setData({
      openMoneyModalData: {
        ...this.data.openMoneyModalData,
        isShow: false
      }
    })
  },
  setRedpocket: function (open, nickname, num, avatarUrl) {
    this.setData({
      openMoneyModalData: {
        ...this.data.openMoneyModalData,
        isShow: open,
        name: nickname,
        money: num,
        avatarUrl: avatarUrl
      }
    })
  }
}