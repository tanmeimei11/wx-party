//app.js
var wxPromisify = require('./utils/wxPromise.js').wxPromisify
var requestPromisify = require('./utils/wxPromise.js').requestPromisify

App({
  globalData: {
    code: '',
    userInfo: null
  },
  // 检查登陆态
  checkLoginSession: function () {
    wxPromisify(wx.checkSession)()
      .then(() => {
        if (!wx.getStorageSync('token')) {
          this.loginSession()
        } else {
          wxPromisify(wx.getUserInfo)()
            .then((res) => {
              this.globalData.userInfo = res.userInfo
            })

        }
      }, () => {
        this.loginSession()
      }).catch(() => {
        this.loginSession()
      })
  },
  // 授权登录
  loginSession: function () {
    wxPromisify(wx.login)()
      .then(res => {
        console.log(res)
        this.globalData.code = res.code
        return wxPromisify(wx.getUserInfo)()
      })
      .then(res => {
        this.globalData.userInfo = res.userInfo
        console.log(this.globalData.userInfo)
        return requestPromisify({
          url: '/login',
          data: {
            code: this.globalData.code,
            encryptedData: res.encryptedData,
            iv: res.encryptedData
          }
        })
      }).then((res) => {
        if (res.succ && res.data) {
          wx.setStorageSync("token", res.data.token)
        }
      }).catch((error) => {
        console.log(error)
        // this.loginSession()
      })
  },
  onLaunch: function () {
    this.checkLoginSession()
  }
})