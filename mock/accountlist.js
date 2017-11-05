let Mock = require('../utils/mock.js')
module.exports = Mock.mock({
  'data': {
    'succ': true,
    "current_cursor|+1": 3,
    'data': {
      'list|10': [{
        'id|+1': 1,
        "account_amount": "123.22",
        "operation_amount": "-5",//变动的金额
        "created_at":"2017-11-05 12:28",//产生明细的时间
        "note":"好友犀牛扫码，鼓励金升值好友犀牛扫码，鼓励金升值好友犀牛扫码，鼓励金升值"//明细描述
      }]
    }
  },
  'time': 1502261173
})