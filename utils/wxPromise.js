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
  console.log('wxCheckLoginCallback')
  wxCheckLoginCallback(option, function (token) {
    // var token = '05b81ab2f8f6c6d1458a0f59b22e8c9b'
    if (token) {
      console.log('----get token----', token);
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
      console.log('----start-request----')
      console.log(option)
      wx.request(option)
    }
  })
  // wxCheckLogin(option).then((token) => {
  //   // var token = '05b81ab2f8f6c6d1458a0f59b22e8c9b'
  //   if (token) {
  //     console.log('----get token----', token);
  //     !option.data && (option.data = {});
  //     !/^http/.test(option.url) && (option.url = DOMAIN + option.url)
  //     option.header = {
  //       'Cookie': `tg_auth=${token};_v=${config._v}`
  //     };
  //     // 支付网关必须加上必要字段_token
  //     if (/payment\/signature/.test(option.url)) {
  //       option.data._token = token
  //     }
  //     (option.method != 'POST') && (option.data.privateKey = token);
  //     // 请求带上来源
  //     option.data.from = wx.getStorageSync('from')
  //     if (isMock) {
  //       // console.log('mock request', option.url, option.data)
  //       // console.log('mock responce', require('../mock/' + mockConfig[option.url]))
  //       option.success(require('../mock/' + mockConfig[option.url]))
  //       return
  //     }
  //     console.log('----start-request----')
  //     console.log(option)
  //     wx.request(option)
  //   }
  // })
}

/**
 * 检查登陆态和token
 * @param {*} option  请求字段 当监测到没有登录时 保存option 登陆完成后继续请求
 */
var wxCheckLogin = option => {
  console.log('-------checkSession------')
  return wxPromisify(wx.checkSession)()
    .then(() => {
      let _token = wx.getStorageSync('token')
      console.log('token', _token)
      if (!_token) {
        console.log('------会话存在----token没有----重新登陆－－－－')
        wxLogin(option)
      }
      return _token ? _token : ''
    }, () => {
      console.log('------会话失效----重新登陆－－－－')
      wxLogin(option)
    })
}

var wxCheckLoginCallback = (option, callback) => {
  console.log('-------checkSession------')
  wx.checkSession({
    success: function () {
      let _token = wx.getStorageSync('token')
      console.log('token', _token)
      if (!_token) {
        console.log('------会话存在----token没有----重新登陆－－－－')
        wxLogin(option)
      } else {
        callback(_token)
      }
    },
    fail: function () {
      console.log('------会话失效----重新登陆－－－－')
      wxLogin(option)
    }
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
    console.log('----正在登陆－－返回－－')
    // return Promise.reject()
    return false
  } else {
    console.log('----开始登陆－－－－－')
    isLoginIng = true
  }

  console.log('-------get code------')
  return wxPromisify(wx.login)()
    .then(res => {
      code = res.code
      console.log('code', code)
      console.log('-------get UserInfo------')
      return wxPromisify(wx.getUserInfo)({
        lang: 'zh_CN'
      })
    })
    .then(res => {
      console.log('getUserInfo', res)
      console.log('-------get login------')
      let _data = {
        url: DOMAIN + '/party/login',
        data: {
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      }
      console.log('logindata', _data)
      return wxPromisify(wx.request)(_data)
    }).then((res) => {
      console.log('login succ', res)
      if (res.succ && res.data) {
        console.log('-------login succ------')
        console.log('res', res)
        wx.setStorageSync("token", res.data)
        console.log('请求的到的token：', res.data)
        isLoginIng = false
        loginRequest()
      } else {
        console.log('login fail', res)
      }
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