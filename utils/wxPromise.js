var wxPromisify = require('./common').wxPromisify
// 本地
let mockConfig = require('../mock/mockConfig');
var config = require('config')
var isMock = config.isMock
var DOMAIN = config.DOMAIN
var code = ''
var isLoginIng = false
var loginCollectOptions = [] // 请求搜集器
var LOG = console.log || (() => {})

/**
 * 登陆前的准备
 * @param {*} option  
 * @param {*} token 
 */
var requestBefore = (option, token) => {
  !option.data && (option.data = {});
  !/^http/.test(option.url) && (option.url = DOMAIN + option.url)
  // 添加必要的辅助字断
  var deviceInfo = getApp().getDeviceInfo()
  var cookieObj = {
    'tg_auth': token,
    '_v': config._v,
    'wxv': deviceInfo.version,
    '_s': `${deviceInfo.platform.toLowerCase()}_wxminiprogram`,
    '_sys': deviceInfo.system.toLowerCase(),
    '_gps': deviceInfo.gps || ''
  }
  option.data = {
    ...option.data,
    ...cookieObj
  }
  option.header = {
    'Cookie': Object.keys(cookieObj).map((key) => {
      return `${key}=${cookieObj[key]}`
    }).join(';')
  };
  // 支付网关必须加上必要字段_token
  if (/payment\/signature/.test(option.url)) {
    option.data._token = token
  }
  (option.method != 'POST') && (option.data.privateKey = token);
  // 请求带上来源
  option.data.from = wx.getStorageSync('from')
}

/**
 * 请求函数
 * @param {*} option 
 */

var request = (option) => {
  var isCheckPromise = null
  if (option.isNotCheck) {
    isCheckPromise = Promise.resolve('')
  } else {
    isCheckPromise = wxCheckLogin(option)
  }
  isCheckPromise.then((token) => {
    // var token = '05b81ab2f8f6c6d1458a0f59b22e8c9b'
    if (token || option.isNotCheck) {
      LOG('get token', token);
      requestBefore(option, token)
      if (isMock) {
        option.success(require('../mock/' + mockConfig[option.url]))
        return
      }
      LOG('start request option:', option)
      wx.request(option)
    } else {
      LOG('未登陆...')
    }
  }, () => {
    LOG('登陆中...')
  })
}

/**
 * 检查登陆态和token
 * @param {*} option  请求字段 当监测到没有登录时 保存option 登陆完成后继续请求
 * 由于checkssion接口 有的时候 一直进去fail 所以 取消掉检查的这一步
 */
var wxCheckLogin = option => {
  LOG('check token')
  let _token = wx.getStorageSync('token')
  if (_token) {
    LOG('token succ:', _token)
    return Promise.resolve(_token)
  }
  LOG('token fail:', _token)
  return wxLogin(option)
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
    LOG('正在登陆')
    return Promise.reject()
  } else {
    LOG('开始登陆')
    isLoginIng = true
  }

  return wxPromisify(wx.login)()
    .then(res => {
      code = res.code
      LOG('get code', code)
      return wxPromisify(wx.getUserInfo)({
        lang: 'zh_CN'
      }).then(res => {
        return res
      }, error => {
        isLoginIng = false
      })
    })
    .then(res => {
      LOG('get userInfo', res)
      let _data = {
        url: DOMAIN + '/party/login',
        data: {
          code: code,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
      }
      LOG('login', _data)
      return wxPromisify(wx.request)(_data)
    }).then((res) => {
      if (res.succ && res.data) {
        LOG('login succ', res)
        wx.setStorageSync("token", res.data)
        isLoginIng = false
        loginRequest()
      } else {
        LOG('login fail', res)
      }
    }).catch((error) => {
      LOG('login error', res)
      LOG(error)
    })
}

module.exports = {
  mockConfig,
  DOMAIN,
  isMock,
  wxPromisify,
  requestPromisify: wxPromisify(request)
}