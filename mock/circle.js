module.exports = {
  data: {
    "msg": "",
    "code": "200003",
    "succ": true,
    "data": {
      "current_cursor": "3",
      "list": [{
        "feed_type": "publish", //feed类型  create_activity、join_activity、publish(图片)
        "feed_user_name": "犀牛",
        "feed_user_id": 122321,
        "join_together": "一起参加过\"龙井户外徒步\"等5次活动",
        "hasJoin": true, //如果当前用户参与过任何一次活动，但是好友们没有一条动态，则显示【你的趴友们什么都没发】
        "photo_info": {
          "id": 1234321,
          "photos": [{
              "img_width": "5584",
              "img_height": "3864",
              "url": "http:\/\/inimg07.jiuyan.info\/in\/2017\/10\/24\/95DDD93F-1BF5-B2A7-314B-E6E2A88D97E0-1PbpPWw.jpg?imageMogr2\/format\/jpg\/thumbnail\/720x%3E\/quality\/90!"
            },
            {
              "img_width": "5584",
              "img_height": "3864",
              "url": "http:\/\/inimg07.jiuyan.info\/in\/2017\/10\/24\/95DDD93F-1BF5-B2A7-314B-E6E2A88D97E0-1PbpPWw.jpg?imageMogr2\/format\/jpg\/thumbnail\/720x%3E\/quality\/90!"
            },
            {
              "img_width": "5584",
              "img_height": "3864",
              "url": "http:\/\/inimg07.jiuyan.info\/in\/2017\/10\/24\/95DDD93F-1BF5-B2A7-314B-E6E2A88D97E0-1PbpPWw.jpg?imageMogr2\/format\/jpg\/thumbnail\/720x%3E\/quality\/90!"
            }
          ],
          "desc": "这里是图片的描述",
          "comment_info": {
            "comment_count": "1",
            "comment_items": [{
              "content": "\u8fd9\u989c\u8272\u6211\u559c\u6b22\ud83d\udc95",
              "id": "22542236",
              "user_avatar": "http:\/\/res.jiuyan.info\/in66v2\/src\/images\/default_50x50.png",
              "user_id": "343426785",
              "user_name": "\u5a77\u5b50",
              "pic_height": "0",
              "pic_width": "0",
              "content_pic": "",
              "created_at": "",
              "at_users": []
            }]
          }
        }
      }, {
        "feed_type": "create_activity", //feed类型  create_activity、join_activity、publish(图片)
        "feed_user_name": "犀牛",
        "feed_user_id": 122321,
        "join_together": "一起参加过\"龙井户外徒步\"等5次活动",
        "hasJoin": true, //如果当前用户参与过任何一次活动，但是好友们没有一条动态，则显示【你的趴友们什么都没发】
        "activity_info": {
          "act_charge": "123",
          "act_id": "10928",
          "act_name": "龙井户外徒步",
          "act_status": "1", //0：未开始 //1：已结束
          "act_url": ["http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!"],
          "city_district": "杭州 城西",
          "start_time": 1506787200000,
          "end_time": 1509379200000,
          "join_status": "2", //0:未参与 1:已参与  2:已签到
          "joiners": [{
              "avatar_url": "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!",
              "gender": "男"
            },
            {
              "avatar_url": "http://inimg05.jiuyan.info/in/2017/07/08/1FA80AEF-1F57-27FD-FB72-D66207D45228-1xLEKMvL.jpg?imageMogr2/format/jpg/thumbnail/180x%3E/quality/80!",
              "gender": "女"
            }
          ],
        }
      }]
    },
    "timestamp": "1508137132"
  }
}