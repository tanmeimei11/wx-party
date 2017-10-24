//launch.js
//获取应用实例
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var getTimeObj = require('../../utils/util.js').getTimeObj
import track from '../../utils/track.js'
const originText = {
  'name': "活动名称",
  'addr': "活动地点",
  'detailAddr': "详细地址",
  'begin': "活动开始时间",
  'end': "活动结束时间",
  'detailDesc': "活动详细介绍及其他要点",
  'wechat': "微信号"
}
const errorText = {
  'name': "请填写活动名称",
  'addr': "请选择活动地点",
  'detailAddr': "请填写详细地址",
  'begin': "请选择活动开始时间",
  'end': "请选择活动结束时间",
  'detailDesc': "请填写活动详细介绍及其他要点",
  'wechat': "请填写微信号"
}

Page({
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_apply_entry',
    jobList: [],
    region: ['浙江省', '杭州市', '西湖区'],
    birth: [],
    job: '',
    originText: originText,
    name: originText.name,
    addr: originText.addr,
    detailAddr: originText.detailAddr,
    begin: originText.begin,
    end: originText.end,
    detailDesc: originText.detailDesc,
    wechat: originText.wechat,
    phoneNum: '',
    isVerify: false,
    endTime: '2017-1-1',
    id: ''
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_apply_entry')
    if (option.prepage) {
      this.setData({
        prepage: option.prepage
      })
    }

    if (option.id) {
      this.setData({
        id: option.id,
        sessionFrom: `activity_${option.id}`
      })
    }

    wx.setNavigationBarTitle({
      title: '发起活动'
    })

    // 初始化生日的结束时间
    var timeObj = getTimeObj(new Date())
    this.setData({
      endTime: `${timeObj.year}-${timeObj.month}-${timeObj.day}`
    })
  },
  chooseImage: function () {
    wxPromisify(wx.chooseImage)({
      count: 1,
      success: function (res) {}
    }).then(res => {
      var tempFilePaths = res.tempFilePaths[0]
      uploadImageToQiniu(tempFilePaths)
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
  getPhoneNum: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
    this.verify('', true)
  },
  getJob: function (e) {
    this.setData({
      job: e.detail.value
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
    if (this.data.regionText == originText.region) {
      !type && this.toast('error', errorText['region'])
      return
    }
    if (this.data.birthText == originText.birth) {
      !type && this.toast('error', errorText['birth'])
      return
    }
    if (/^\s*$/g.test(this.data.job.replace(/\s+/g, ''))) {
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
    track(this, 'h5_tcpa_apply_finish')
    requestPromisify({
      url: `/activity/add_info`,
      data: {
        area: this.data.region,
        birth: this.data.birthText,
        work: this.data.job.replace(/\s+/g, ''),
        phone: this.data.phoneNum
      }
    }).then((res) => {
      if (res.succ) {
        wx.redirectTo({
          url: `../${this.data.prepage}/${this.data.prepage}?prepage=apply&id=${this.data.id}&notShowOther=true`
        })
        return requestPromisify({
          url: "/activity/join",
          data: {
            id: this.data.id
          }
        })
      } else {
        this.toast('fail', '提交失败')
      }
    }).then((res) => {
      if (res.succ) {
        this.toastSucc('报名成功')
        setTimeout(() => {
          if (this.data.id) {
            wx.redirectTo({
              url: `../${this.data.prepage}/${this.data.prepage}?prepage=apply&id=${this.data.id}&notShowOther=true`
            })
          }
        }, 2000)
      }
    })
  }
})