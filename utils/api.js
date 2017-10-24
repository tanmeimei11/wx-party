var request = require('wxPromise.js').requestPromisify
var wxPromisify = require('wxPromise.js').wxPromisify

const qnTokenUrl = "https://www.in66.com/promo/commonapi/qiniutoken"
const qnUploadUrl = "http://up.qiniu.com"
const qnResUrl = "https://inimg07.jiuyan.info/"


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