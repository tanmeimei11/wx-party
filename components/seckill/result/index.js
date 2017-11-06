import track from '../../../utils/track.js'
var requestPromisify = require('../../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    seckill: {
      isSeckill : false
    }
  },
  setSeckillOptions(option){
    if (option.isSeckill!=1) return 
    requestPromisify({
      url: "/activity/share_info",
      data: {
        id: option.id
      }
    }).then(res => {
      if (res.succ) {
        this.setData({
          seckill: {
            isSeckill: true,
            shareUserName: res.data.user_name,
            shareUserId: res.data.user_id,
            discount: res.data.discount,
          }
        })
      }
    })
  }
}