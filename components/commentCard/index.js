var request = require('../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    commentId: ''
  },
  comment: function (e) {
    var id = e.currentTarget.dataset.photoId
    this.setData({
      commentId: id
    })
  },
  submitComment: function (e) {
    var id = e.currentTarget.dataset.commentId
    request({
      url: 'http://dev.in66.com/h5/photo/comment',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        pid: id,
        uid: '1KVvK',
        content: '评论内容'
      }
    }).then(() => {
      console.log('comment succ')
    })
  }
}