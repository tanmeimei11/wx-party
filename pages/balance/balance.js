import track from '../../utils/track.js'
var goldMoneyModal = require('../../components/goldMoneyModal/index.js')
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var mutulPage = require('../../utils/util.js').mutulPage
let request = require('../../utils/wxPromise.js').requestPromisify
mutulPage({
  mixins: [goldMoneyModal],
  data: {
    balance: '',
    currentCursor: 0,
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_result_enter'
  },
  onLoad: function (option) {
    // 取页面上的id
    this.setData({
      list: [],
      promoText: `本周在你附近举办的${option.promonum==0 ? "":`${option.promonum}个`}活动`,
      sessionFrom: `activityassistant_${option.id}`
    })
    // request({
    //   url: '/account/balance'
    // }).then((res) => {
    //   this.balance = res.data.balance
    //   console.log(this.balance)
    // })
    request({
      url: '/account/details',
      cursor: this.currentCursor
    }).then((res) => {
      console.log(res)
      this.setData({
        list: res.list
      })
    })
  }
})