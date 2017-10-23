var request = require('wxPromise.js').requestPromisify

// const uploadImage = () => {
//     request({
//       url: 'https://www.in66.com/promo/commonapi/qiniutoken'
//     }).then(res => {
//         console.log(res)
//         return wxPromisify(wx.chooseImage)({
//           count: 1,
//         }).then((sres => {
//             console.log(sres)
//             var data = {
//               file: sres.tempFilePaths[0],
//               token: res.data.token,
//               key: res.data.key
//             }
//             return data
//           })
//         }).then(data => {
//         console.log('--------data-----')
//         console.log(data)
//         var uploadData = {
//           url: 'http://up.qiniu.com',
//           filePath: data.file,
//           name: 'file',
//           formData: {
//             key: data.key,
//             token: data.token,
//           },
//         }
//         return wxPromisify(wx.uploadFile)(uploadData)
//       }).then(res => {

//       })
//     }