import track from '../../../utils/track.js'
var requestPromisify = require('../../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    seckill: []
    // seckill: [{
    // name: '冰岛极光露营',
    // cover: 'http://inimg02.jiuyan.info/in/2017/03/24/5F838417-1DDA-CE2A-14A6-7A0D0247301C-1wGMzYZ.jpg',
    // price: '59',
    // original: '169',
    // time: 7400,
    // people: 5,
    // total: 13
    // }]
  },
  loadSeckill() {
    requestPromisify({
      url: "/activity/inventorys",
    }).then(res => {
      if (res.succ) {
        this.setData({
          seckill: res.data.map(item => ({
            act_id: item.act_id,
            name: item.act_name,
            cover: item.act_url[0],
            people: item.sum_num - item.num,
            total: item.sum_num,
            price: item.amount,
            original: item.charge,
            time: +(item.count_down) / 1000
          }))
        })
        this.countdown()
        if (this.data.seckill.filter(item => item.time != 0).length > 0) {
          track(this, 'h5_tcpa_seckill_finish_page')
        }
      }
    })
  },
  countdown() {
    this.setData({
      seckill: this.data.seckill.map(item => ({
        ...item,
        time: item.time - 1
      }))
    })
    setTimeout(() => this.countdown(), 1000)
  }
}