import track from '../../../utils/track.js'
var requestPromisify = require('../../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    xxtimer: null
  },
  initSeckill: function () {
    this.setData({
      promoList: this.data.promoList.map(item => {
        item.cutTime = +item.count_down / 1000
        return item
      })
    })
    this.countdown()
  },
  countdown: function () {
    if (this.data.promoList.filter(item => item.cutTime > 0).length == 0) {
      return
    }
    var cutDownFun = () => {
      if (this.data.promoList.filter(item => item.cutTime > 0).length == 0) {
        return
      }
      this.setData({
        promoList: this.data.promoList.map(item => ({
          ...item,
          cutTime: (item.cutTime - 1 <= 0) ? 0 : (item.cutTime - 1)
        }))
      })
    };
    !this.data.xxtimer && (this.data.xxtimer = setInterval(cutDownFun, 1000))
  }
}