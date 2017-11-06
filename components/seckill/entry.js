// var request = require('../../utils/wxPromise.js').requestPromisify
import track from '../../utils/track.js'
module.exports = {
  data: {
    seckill: {
      name: '冰岛极光露营',
      cover: 'http://inimg02.jiuyan.info/in/2017/03/24/5F838417-1DDA-CE2A-14A6-7A0D0247301C-1wGMzYZ.jpg',
      price: '59',
      original: '169',
      time: 7400,
      people: 5,
      total: 13
    }
  },
  countdown(){
    if (this.data.seckill.time===0) return
    this.setData({
      seckill: {
        ...this.data.seckill,
        time: this.data.seckill.time - 1
      }
    })
    setTimeout(()=>this.countdown(),1000)
  }
}