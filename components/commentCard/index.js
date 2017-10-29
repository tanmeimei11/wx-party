var request = require('../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    a: 1,
    b: 2
  },
  comment: function () {
    request({
      url: 'http://dev.in66.com/h5/photo/comment',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        pid: '1LVLa',
        uid: '1KVvK',
        content: '评论内容'
      }
    }).then(() => {
      console.log('comment succ')
    })
  }
}