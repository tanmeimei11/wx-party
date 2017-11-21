var request = require('../../utils/wxPromise.js').requestPromisify
// import track from '../../utils/track.js'
module.exports = {
  data: {
    actTypes: {
      list: [],
      activeType: {}
    }
  },
  getActTypes: function () {
    console.log('22')
    request({
      url: '/activity/act_type',
    }).then(res => {
      console.log(res.data)
      this.setData({
        actTypes: {
          list: res.data,
          activeType: {}
        }
      })
    })
  },
  chooseType: function (e) {
    var item = e.target.dataset.item
    this.setData({
      actTypes: {
        list: this.data.actTypes.list,
        activeType: item
      }
    })
  }
}