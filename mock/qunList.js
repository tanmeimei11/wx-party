let Mock = require('../utils/mock.js')
module.exports = Mock.mock({
  'succ': true,
  'data|10': [{
    'id|+1': 1,
    'group_name': '杭州城西户外群',
    'female_count': 10,
    'male_count': 11,
    'tags': ['90后', '活动丰富'],
    'assistant_qrcode_url': 'http://img05.in66.com/xxxxx.jpg',
    'current_cursor': 32123123
  }],
  'time': 1502261173
})