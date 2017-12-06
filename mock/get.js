module.exports = {
  data: {
    "msg": "",
    "code": "0",
    "data": {
      // "bounty": "5", //获得的初始鼓励金
      // "is_pop": true,
      // "share_qrcode_url": "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg", //加密后的用户ID
      "bounty_type": "1", //0表示鼓励金,1表示红包
      "bounty_info": {
        "bounty": "5", //获得的初始鼓励金
        "is_pop": "false", // 是否弹窗  false 否  true 是  
        "share_qrcode_url": "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg" //分享二维码url
      }, //鼓励金信息
      "redpacket_info": {
        "num": "20", //红包数量
        "is_pop": "false", // 是否弹窗  false 否  true 是  
        "share_qrcode_url": "https://inimg01.jiuyan.info/in/2017/02/28/85929FBE-BB9D-91D5-7BA3-068EE42A6000-1JyqzdYV.jpg" //分享二维码url
      }, //红包信息 //鼓励金与红包位互斥的关系,只会出现其中一个根据bounty_type判断
    },
    "succ": true,
    "timestamp": "1508744458"
  }
}