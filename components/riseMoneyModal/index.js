// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    isShowRiseMoneyModal: true,
    avatarUrl: 'https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg',
    nick: '犀牛不太牛',
    money: 23,
    riseMoney: 0.5
  },
  closeRiseMoneyModal: function () {
    this.setData({
      isShowRiseMoneyModal: false
    })
  },
  saveMoneyImageToAnblum: function () {

  }
}