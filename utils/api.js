var request = require('wxPromise.js').requestPromisify
var wxPromisify = require('wxPromise.js').wxPromisify

const qnTokenUrl = "https://www.in66.com/promo/commonapi/qiniutoken"
const qnUploadUrl = "http://up.qiniu.com"
const qnResUrl = "http://up.qiniu.com"


const uploadImageToQiniu = (file) => {
  request({
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
    console.log(`https://inimg07.jiuyan.info/${res.key}`)
    return `https://inimg07.jiuyan.info/${res.key}`
  })
}
const chooseImg = () => {

}
module.exports = {
  uploadImageToQiniu
}