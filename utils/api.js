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
    return `${qnResUrl}${res.key}`
  })
}

/**
 * 支付接口
 * @param {*} id 
 */
var payMoney = (id) => {
  return request({
    url: '/activity/join_order',
    data: {
      id: id
    }
  }).then(Res => {
    if (Res.succ) {
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
      throw 'error'
    }
  })
}

// 秒杀活动 post
var paySeckill = (id) => {
  return request({
    url: '/activity/seckill',
    data: {
      id: id
    }
  })
}

module.exports = {
  uploadImageToQiniu,
  payMoney
}