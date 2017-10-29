//circle.js
//获取应用实例
var request = require('../../utils/wxPromise.js').requestPromisify
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var mutulPage = require('../../utils/util.js').mutulPage
var promo = require('../../components/promoCard/index.js')
var commont = require('../../components/commentCard/index.js')
mutulPage({
  mixins: [promo, commont],
  data: {
    siginInUsers: [{
      avatar_url: 'https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg',
      gender: "女",
      name: '香香',
      personDesc: '1324435 1324 12343'
    }],
  },
  onLoad: function () {
    this.getPageData()
  },
  getPageData: function () {
    request({
      url: '/friend/feed',
      data: {
        cursor: 0,
        limit: 10
      }
    }).then((res) => {
      // 初始化其他数据
      var allStatus = res.data.list
      allStatus.forEach((item, idx) => {
        if (item.feed_type == 'create_activity') { // 活动
          var _promo = item.activity_info
          _promo.time = formatTimeToTime(_promo.start_time)
        } else if (item.feed_type == 'publish') { //照片

        }
      })

      this.setData({
        allStatus: allStatus,
      })
    })
  },
})