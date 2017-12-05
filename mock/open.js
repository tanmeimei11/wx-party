module.exports = {
  data: {
    "msg": "",
    "code": "0",
    "data": {
      // is_first_amount: true, //true:"第一次领取" false:"不是第一次领取"
      // my_amount: "5", //我增加的鼓励金
      // friend_amount: "12", //为好友增加的鼓励金
      // avatar_url: "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg",
      // nick_name: "我增加的鼓励金我增加的鼓励金我增加的鼓励金我增加的鼓励金我增加的鼓励金我增加的鼓励金"

      "bounty_type": "1", //0表示鼓励金,1表示红包,bounty_type仅表示当前用户的鼓励金类型
      "bounty_info": {
        "is_owner": false, //可能为空，true:表示自己扫自己， 默认为false，为true的情况下其他字段为空
        "is_first_amount": true, //true:"第一次领取" false:"不是第一次领取"
        "my_amount": "5", //我的鼓励金余额
        "friend_amount": "12", //为好友增加的鼓励金
        "avatar_url": "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg",
        "nick_name": "犀牛",
        "is_already_open": false //是否在一个周期内已经打开过,如果是自己扫自己直接返回flase
      },
      "redpacket_info": {
        "is_owner": false, //可能为空，true:表示自己扫自己， 默认为false，为true的情况下其他字段为空
        "friend_amount": "12", //为好友增加的鼓励金
        "avatar_url": "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg",
        "nick_name": "犀牛2",
        "num": 10, // 当前用户剩余红包数
        "is_first_amount": false, //true:"第一次领取" false:"不是第一次领取"
        "is_already_open": false
      }
    },
    "succ": true,
    "timestamp": "1508744458"
  }
}