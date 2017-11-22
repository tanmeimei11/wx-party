// 本地
let mockConfig = require('../mock/mockConfig');
var config = require('config')
var isMock = config.isMock
var DOMAIN = config.DOMAIN
var code = ''
var isLoginIng = false
var loginCollectOptions = [] // 请求搜集
/**
 * 封装wxPromisefy
 */
var wxPromisify = fn => {
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

var request = option => {
  wxCheckLogin(option).then((token) => {
    console.log('token:', token)
    // var token = '05b81ab2f8f6c6d1458a0f59b22e8c9b'
    if (token) {
      !option.data && (option.data = {});
      !/^http/.test(option.url) && (option.url = DOMAIN + option.url)
      option.header = {
        'Cookie': `tg_auth=${token};_v=${config._v}`
      };
      // 支付网关必须加上必要字段_token
      if (/payment\/signature/.test(option.url)) {
        option.data._token = token
      }
      (option.method != 'POST') && (option.data.privateKey = token);
      // 请求带上来源
      option.data.from = wx.getStorageSync('from')
      if (isMock) {
        // console.log('mock request', option.url, option.data)
        // console.log('mock responce', require('../mock/' + mockConfig[option.url]))
        option.success(require('../mock/' + mockConfig[option.url]))
        return
      }
      wx.request(option)
    }
  })
}

/**
 * 检查登陆态和token
 * @param {*} option  请求字段 当监测到没有登录时 保存option 登陆完成后继续请求
 */
var wxCheckLogin = option => {
  console.log('-------checkSession------')
  return wxPromisify(wx.checkSession)()
    .then((res) => {
      let _token = wx.getStorageSync('token')
      return _token ? _token : wxLogin(option)
    }, () => {
      wxLogin(option)
    })
}


var loginRequest = () => {
  if (!loginCollectOptions.length) return
  for (var i = 0; i < loginCollectOptions.length; i++) {
    request(loginCollectOptions[i])
  }
  loginCollectOptions = []
}


/**
 * 登录
 * @param {*} option 
 */
var wxLogin = option => {
  // 搜集登录的request 这样防止请求很多次code 重复多次登录
  loginCollectOptions.push(option)
  if (isLoginIng) {
    return Promise.reject()
  } else {
    isLoginIng = true
  }

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
      console.log('-------get login------')
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
        loginRequest()
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