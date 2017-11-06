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
  // 登陆失败的loginFailCallback
  // var loginFailCallback = () => {
  //   console.log('进入了loginFailCallback')
  //   request(option)
  // }
  // var loginFailCallback = option
  wxCheckLogin(option).then((token) => {
    console.log('-------------------------token-----------');
    console.log(token);
    // var token = '05b81ab2f8f6c6d1458a0f59b22e8c9b'
    if (token) {
      !option.data && (option.data = {});
      !/^http/.test(option.url) && (option.url = DOMAIN + option.url)
      option.header = {
        'Cookie': `tg_auth=${token};_v=${config._v}`
      };
      console.log(typeof option.data)
      if (typeof option.data == 'object') {
        // java 支付网关必须加上必要字段_token
        if (/payment\/signature/.test(option.url)) {
          option.data._token = token
        }
        (option.method != 'POST') && (option.data.privateKey = token);
      }
      if (isMock) {
        console.log('===== Begin mock request =====')
        console.log(option.data)
        console.log(option.url)
        console.log('============ End =============')
        console.log(require('../mock/' + mockConfig[option.url]))
        option.success(require('../mock/' + mockConfig[option.url]))
        return
      }
      console.log('-------start request------')
      wx.request(option)
    }
  })
}

var isLoginIng = false
var loginColectOptions = []
// 检查登陆态和token
var wxCheckLogin = function (option) {
  console.log('-------checkSession------')
  return wxPromisify(wx.checkSession)()
    .then((res) => {
      let _token = wx.getStorageSync('token')
      return _token ? _token : wxLogin()
    }, () => {
      if (!isLoginIng) {
        wxLogin(option)
        loginColectOptions.push(option)
        isLoginIng = true
      } else {
        loginColectOptions.push(option)
      }
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
        isLoginIng = false
        if (loginColectOptions.length) {
          for (var i = 0; i < loginColectOptions.length; i++) {
            console.log('1324353465764876586798089')
            request(loginColectOptions[i])
          }
          loginColectOptions = []
        }
        // option && loginFailCallback()
      } else {
        throw ''
      }

      console.log(res.data)
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