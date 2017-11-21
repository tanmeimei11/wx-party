let Mock = require('../utils/mock.js')
module.exports = Mock.mock({
  data: {
    'succ': true,
    'data': {
      "current_cursor|+1": 3,
      "is_need_info": "0",   // 是否需要填写信息（0:否; 1:是）,
      "screen_list":[
          {
              "name":"全部",
              "screen":0
          },
          {
              "name":"户外",
              "screen":1
          }
      ],
      "sort_list":[
          {
              "name":"按工作日排序",
              "sort":"workday"
          },
          {
              "name":"按距离远近排序",
              "sort":"gps"
          }
      ],
      'list|10': [{
            "act_id": "10928",
            "act_name": "龙井户外徒步龙井户外徒步龙井户外徒步龙井户外徒步",
            "act_status": "0",//0:未开始 //1:已结束
            "act_url": ["http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!"],
            "city_district": "杭州 城西",
            "start_time": 1611248859879,
            "end_time": 1911249782631,
            "num":5, //剩余数量,
            "sum_num":10, //总量,
            "amount":10.00, //秒杀价,
            "charge":20.00, //原价
            "is_seckill": true, //是否秒杀,可能为空默认为false
            "act_type":1 //分类
        }]
    },
    'time': 1502261173
  }
})