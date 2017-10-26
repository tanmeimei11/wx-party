// 本地
let mockConfig = require('../mock/mockConfig');
var config = require('config')
var isMock = config.isMock
var DOMAIN = config.DOMAIN
var code = ''
/**
 * 封装wxPromisefy
 */
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        if (res.data) {
          resolve(res.data)
        }
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

var request = (option) => {
  console.log('-------before request------')
  wxCheckLogin(option).then((token) => {
    console.log(token);
    if (token) {
      !option.data && (option.data = {});
      !/^http/.test(option.url) && (option.url = DOMAIN + option.url)
      option.header = {
        'Cookie': `tg_auth=${token};_v=${config._v}`
      };
      (option.method != 'POST') && (option.data.privateKey = token);
      // option.data.privateKey = '57819e690e696de86db7bb646b4766d1'
      if (isMock) {
        console.log('===== Begin mock request =====')
        console.log(option.data)
        console.log('============ End =============')
        option.success(require('../mock/' + mockConfig[option.url]))
        return
      }
      console.log('-------start request------')
      wx.request(option)
    }
  })
}

// 检查登陆态和token
var wxCheckLogin = function (option) {
  console.log('-------checkSession------')
  return wxPromisify(wx.checkSession)()
    .then((res) => {
      let _token = wx.getStorageSync('token')
      return _token ? _token : wxLogin()
    }, () => {
      wxLogin(option)
    })
}


var wxLogin = function (option) {
  console.log('-------get code------')
  return wxPromisify(wx.login)()
    .then(res => {
      code = res.code
      console.log('-------get UserInfo------')
      return wxPromisify(wx.getUserInfo)({
        lang: 'zh_CN'
      })
    })
    .then(res => {
      console.log('-------logins------')
      let _data = {
        url: DOMAIN + '/party/login',
        data: {
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      }
      return wxPromisify(wx.request)(_data)
    }).then((res) => {
      if (res.succ && res.data) {
        console.log('-------login succ------')
        wx.setStorageSync("token", res.data)
        option && request(option)
      }
      return res.data
    }).catch((error) => {
      console.log(error)
    })
}

module.exports = {
  mockConfig,
  DOMAIN,
  isMock,
  wxPromisify,
  requestPromisify: wxPromisify(request)
}