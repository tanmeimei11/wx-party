var request = require('wxPromise.js').requestPromisify
var wxPromisify = require('wxPromise.js').wxPromisify
var config = require('config.js')

const qnTokenUrl = config.qnTokenUrl
const qnUploadUrl = config.qnUploadUrl
const qnResUrl = config.qnResUrl

/**
 * 上传文件到七牛
 * @param {*} file 
 */
const uploadImageToQiniu = (file) => {
  return request({
    url: qnTokenUrl
  }).then(res => {
    var data = {
      file: file,
      token: res.data.token,
      key: res.data.key
    }
    var uploadData = {
      url: qnUploadUrl,
      filePath: data.file,
      name: 'file',
      formData: {
        key: data.key,
        token: data.token,
      },
    }
    return wxPromisify(wx.uploadFile)(uploadData)
  }).then(res => {
    res = JSON.parse(res)
    // console.log(`${qnResUrl}${res.key}`)
    return `${qnResUrl}${res.key}?imageMogr2/auto-orient`
  })
}

/**
 * 支付接口
 * @param {*} id 
 */
var payMoney = (id, is_seckill_finish) => {
  return request({
    url: '/activity/join_order',
    data: {
      id: id,
      is_seckill_finish: is_seckill_finish
    }
  }).then(Res => {
    if (Res.succ) {
      // 不需要进行实际的支付
      if (Res.data.order_directly == 1) {
        return Promise.resolve()
      }

      // 进行微信支付
      return request({
        url: config.payUrl,
        data: {
          payment_channel: "weapppay",
          business_party: "activitycenter",
          order_detail: Res.data.order_detail,
          extend_params: JSON.stringify({
            open_id: Res.data.open_id
          })
        }
      }).then((res) => {
        wx.hideLoading()
        if (res.succ && res.data.sign) {
          var _data = res.data.sign
          return wxPromisify(wx.requestPayment)(_data)
        } else {
          throw 'error'
        }
      })
    } else {
      // 没有秒杀到 
      if (Res.code == '4000032352') {
        return Promise.reject('fail')
      }
    }
  })
}

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
  console.log(key ? deviceInfo : deviceInfo[key])
  return key ? deviceInfo : deviceInfo[key]
}


module.exports = {
  uploadImageToQiniu,
  payMoney,
  getDeviceInfo
}