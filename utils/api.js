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

module.exports = {
  uploadImageToQiniu
}