// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    openMoneyModalData: {
      isShow: false,
      money: 20,
      name: 'in同城趴送你'
    }
  },
  reciveRedpocket: function () {
    this.setData({
      openMoneyModalData: {
        ...this.data.openMoneyModalData,
        isShow: false
      }
    })
  }
}