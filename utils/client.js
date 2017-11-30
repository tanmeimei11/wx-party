/**
 * 获取设备信息
 */
var getDeviceInfo = (key) => {
  var app = getApp()
  if (!app) {
    return
  }
  var deviceInfo = app.globalData.deviceInfo
  if (deviceInfo) {
    return key ? deviceInfo[key] : deviceInfo
  }
  app.globalData.deviceInfo = wx.getSystemInfoSync()
  deviceInfo = wx.getSystemInfoSync()
  return key ? deviceInfo[key] : deviceInfo
}

module.exports = {
  getDeviceInfo
}