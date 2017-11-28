/**
 * 获取设备信息
 */
var getDeviceInfo = (app, key) => {
  var _data = app.data
  if (_data.deviceInfo) {
    return key ? _data.deviceInfo : _data.deviceInfo[key]
  }
  var deviceInfo = wx.getSystemInfoSync()
  console.log(deviceInfo)
  app.setData({
    deviceInfo: deviceInfo
  })
  return key ? deviceInfo : deviceInfo[key]
}

module.exports = {
  getDeviceInfo
}