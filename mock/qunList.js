let Mock = require('../utils/mock.js')
module.exports = Mock.mock({
  'succ': true,
  'data|10': {
    'current_cursor': 32123123,
    'act_num': 12,
    'list|10': [{
      'id|+1': 1,
      'city_social_id|+1': 11212,
      'city_social_name': '杭州城西户外群222222222222222222222222222',
      'female_count': 10,
      'male_count': 11,
      'avatar': 'http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!',
      'tags': [
        '90后', '活动丰富', '90后', '活动丰富', '90后', '活动丰富', '活动丰富活动丰富活动丰富活动丰富活动丰富活动丰富活动丰富', '90后', '活动丰富', '90后'
      ],
      "assistants": [
        { "assistant_name": "助手1", "assistant_url": "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80", "created_at": "1508229599", "group_id": "10101", "group_type": "1", "id": "4", "updated_at": 1508229599000 },
        { "assistant_name": "助手2", "assistant_url": "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80", "created_at": "1508237723", "group_id": "10101", "group_type": "1", "id": "9", "updated_at": 1508237723000 },
        { "assistant_name": "助手3", "assistant_url": "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80", "created_at": "1508237723", "group_id": "10101", "group_type": "1", "id": "10", "updated_at": 1508237723000 }
      ]
    }]
  },
  'timestamp': 1502261173
})