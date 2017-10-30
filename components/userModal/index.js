var request = require('../../utils/wxPromise.js').requestPromisify
module.exports = {
  data: {
    isShowUserModal: true,
    photos: ['', '', '']
  },
  closeUserModal: function () {
    this.setData({
      isShowUserModal: false
    })
  }
}