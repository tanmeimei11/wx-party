/**
 * 获取设备信息
 */
var getDeviceInfo = (key) => {
  var app = getApp()
  if (!app) {
    return
  }
  var deviceInfo = app.globalData.deviceInfo
  // if (deviceInfo) {
  //   return key ? deviceInfo : deviceInfo[key]
  // }
  return wx.getSystemInfoSync()
  // deviceInfo = app.globalData.deviceInfo = wx.getSystemInfoSync()
  // return key ? deviceInfo : deviceInfo[key]
}

module.exports = {
  getDeviceInfo
}