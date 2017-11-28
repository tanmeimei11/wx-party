var extendAll = require('./extend.js')
var baseMethods = {
  loadingIn: function (text) {
    wx.showLoading({
      title: text,
    })
  },
  loadingOut: function () {
    wx.hideLoading()
  },
  toastFail: function (text) {
    wx.showToast({
      title: text,
      image: '../../images/toast-fail.png',
      duration: 2000
    })
  },
  toastSucc: function (text) {
    wx.showToast({
      title: text,
      duration: 2000
    })
  }

}
var mutulPage = (data) => {
  var realData = data
  var _mixins = realData.mixins
  if (_mixins) {
    _mixins.forEach((sItem) => {
      // 这里不能用原来的那个对象 多个组件应用的的时候对象是引用 会出问题
      var item = extendAll({}, sItem)
      if (item.data) {
        realData.data = { ...realData.data,
          ...item.data
        }
        delete item.data
      }

      delete item.onLoad;
      var _methods = item
      realData = {
        ...realData,
        ...item,
        ...baseMethods
      }
    })
  }
  Page(realData)
}

module.exports = {
  mutulPage
}