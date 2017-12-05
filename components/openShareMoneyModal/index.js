// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    openShareMoneyModalData: {
      isShow: true,
      money: 20,
      name: 'in同城趴送你'
    }
  },
  reciveRedpocket: function () {
    this.setData({
      openShareMoneyModalData: {
        ...this.data.openShareMoneyModalData,
        isShow: false
      }
    })
  }
}