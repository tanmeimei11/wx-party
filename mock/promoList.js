let Mock = require('../utils/mock.js')
module.exports = Mock.mock({
  'succ': true,
  'data': {
    "current_cursor|+1": 3,
    'list|10': [{
      'id|+1': 1,
      act_id: 123,
      act_name: "龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步",
      act_url: "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!",
      act_location: "杭州 城西",
      start_time: "2017-10-12 14:00",
      end_time: "2017-10-12 17:00",
      act_status: 0, //0：未开始 //1：进行中 //2：已结束
      joiners: [
        { avatar_url: "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!", gender: 1, },
        { avatar_url: "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!", gender: 0 }
        ],
      join_status: 1  //0:未参与 1:已参与  2:已签到
    }]
  },
  'time': 1502261173
})