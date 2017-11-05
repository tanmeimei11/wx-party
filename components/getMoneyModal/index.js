// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowGetMoneyModal: false,
    avatarUrl: 'https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg',
    actQrImg: 'https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg'
  },
  closeGetMoneyModal: function () {
    this.setData({
      isShowGetMoneyModal: false
    })
  },
  lookBalance: function () {
    wx.redirectTo({
      url: `../balance/balance`
    })
  }
}