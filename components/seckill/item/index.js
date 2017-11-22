import track from '../../../utils/track.js'
var requestPromisify = require('../../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    xxtimer:null
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
    clearTimeout(this.data.xxtimer)
    if (this.data.promoList.filter(item => item.cutTime > 0).length == 0) {
      return
    }
    this.setData({
      promoList: this.data.promoList.map(item => ({
        ...item,
        cutTime: (item.cutTime - 1 <= 0) ? 0 : (item.cutTime - 1)
      }))
    })

    this.data.xxtimer = setTimeout(() => this.countdown(), 1000)
  }
}