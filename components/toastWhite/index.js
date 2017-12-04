var request = require('../../utils/wxPromise.js').requestPromisify
// import track from '../../utils/track.js'
module.exports = {
  data: {
    toastWhiteTimer: null,
    isShowToastWhite: false,
  },
  showToastWhite: function (str) {
    clearTimeout(this.toastWhiteTimer)
    this.setData({
      isShowToastWhite: true,
      toastWhiteStr: str
    })
    this.toastWhiteTimer = setTimeout(() => {
      this.hideToastWhite()
    }, 2000)
  },
  hideToastWhite: function () {
    this.setData({
      isShowToastWhite: false,
      toastWhiteStr: ''
    })
  }
}