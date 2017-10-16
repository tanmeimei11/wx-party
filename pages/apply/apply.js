const originText = {
  'region': "活跃区域",
  'birth': "我的生日",
  'job': "我的职业"
}
const errorText = {
  'region': "请选择活跃区域",
  'birth': "请选择生日",
  'job': "请选择职业",
  'phone': "请填写手机号码"
}

var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
Page({
  data: {
    jobList: ['1', '2', '3'],
    region: [],
    birth: [],
    job: [],
    regionText: originText.region,
    birthText: originText.birth,
    jobText: originText.job,
    phoneNum: '',
    isVerify: false
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '报名'
    })
  },
  bindRegionChange: function (e) {
    var _text = e.detail.value.join('')
    this.setData({
      region: e.detail.value,
      regionText: _text
    })
    this.verify('', true)
  },
  bindDateChange: function (e) {
    var _text = e.detail.value
    this.setData({
      birth: _text,
      birthText: _text
    })
    this.verify('', true)
  },
  bindJobChange: function (e) {
    var _text = e.detail.value
    this.setData({
      job: _text,
      jobText: this.data.jobList[_text]
    })
    this.verify('', true)
  },
  getPhoneNum: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
    this.verify('', true)
  },
  toast: function (type, text) {
    wx.showToast({
      title: text,
      image: type == 'error' ? '../../images/toast-error.png' : '../../images/toast-fail.png',
      duration: 2000
    })
  },
  toastSucc: function (text) {
    wx.showToast({
      title: text,
      icon: 'success',
      duration: 2000
    })
  },
  verify: function (e, type) {
    console.log('change', type)
    if (this.data.regionText == originText.region) {
      !type && this.toast('error', errorText['region'])
      return
    }
    if (this.data.birthText == originText.birth) {
      !type && this.toast('error', errorText['birth'])
      return
    }
    if (this.data.jobText == originText.job) {
      !type && this.toast('error', errorText['job'])
      return
    }
    if (!(/\d{11}/.test(this.data.phoneNum))) {
      !type && this.toast('error', errorText['phone'])
      return
    }

    this.setData({
      isVerify: true
    })

    if (!type) {
      this.submit()
    }
  },
  submit: function () {
    requestPromisify({
      url: '/activity/add_info',
      method: 'POST',
      data: {
        area: this.data.regionText,
        birth: this.data.birthText,
        work: this.data.jobText,
        phone: this.data.phoneNum
      }
    }).then((res) => {
      if (res.succ) {
        this.toastSucc('提交成功')
      } else {
        this.toast('fail', '提交失败')
      }
    })
  }
})