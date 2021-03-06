var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var getTimeObj = require('../../utils/util.js').getTimeObj
import track from '../../utils/track.js'
const originText = {
  'region': "活跃区域",
  'birth': "我的生日"
}
const errorText = {
  'region': "请选择活跃区域",
  'birth': "请选择生日",
  'job': "请填写职业",
  'phone': "请填写手机号码"
}

Page({
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_apply_entry',
    jobList: [],
    region: ['浙江省', '杭州市', '西湖区'],
    birth: [],
    job: '',
    originText: originText,
    regionText: originText.region,
    birthText: originText.birth,
    phoneNum: '',
    isVerify: false,
    endTime: '2017-1-1',
    id: ''
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_apply_screen_enter')
    track(this, 'h5_tcpa_apply_entry')
    if (option.nextpage || option.prepage) {
      this.setData({
        nextpage: option.nextpage,
        prepage: option.prepage
      })
    }

    if (option.id) {
      this.setData({
        id: option.id,
        shareUnionId: option.shareUnionId || '',
        sessionFrom: `activity_${option.id}`,
        byUnion: option.byUnion
      })
    }

    wx.setNavigationBarTitle({
      title: '报名'
    })

    // 初始化生日的结束时间
    var timeObj = getTimeObj(new Date())
    this.setData({
      endTime: `${timeObj.year}-${timeObj.month}-${timeObj.day}`
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
  toast: function (text, type = "") {
    var _data = {
      title: text,
      duration: 2000
    }
    type && (_data.image = `../../images/toast-${type}.png`)
    wx.showToast(_data)
  },
  verify: function (e, type) {
    // if (this.data.regionText == originText.region) {
    //   !type && this.toast(errorText['region'], 'error')
    //   return
    // }
    // if (this.data.birthText == originText.birth || (+new Date(this.data.birthText.replace(/-/g, '/')) - +new Date() > 100)) {
    //   !type && this.toast(errorText['birth'], 'error')
    //   return
    // }
    // if (/^\s*$/g.test(this.data.job.replace(/\s+/g, ''))) {
    //   !type && this.toast(errorText['job'], 'error')
    //   return
    // }
    if (!(/\d{11}/.test(this.data.phoneNum))) {
      !type && this.toast(errorText['phone'], 'error')
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
        // area: this.data.region,
        // birth: this.data.birthText,
        // work: this.data.job.replace(/\s+/g, ''),
        phone: this.data.phoneNum
      }
    }).then((res) => {
      if (res.succ) {
        if (this.data.prepage == 'detail') {
          this.toast('提交成功')
          setTimeout(() => {
            if (this.data.shareUnionId) {
              wx.redirectTo({
                url: `../${this.data.nextpage}/${this.data.nextpage}?prepage=apply&id=${this.data.id}&isShowOtherAct=false&isShowPayModal=true&shareUnionId=${this.data.shareUnionId}&byUnion=${this.data.byUnion}`
              })
              return
            }

            if (this.data.id) {
              wx.redirectTo({
                url: `../${this.data.nextpage}/${this.data.nextpage}?prepage=apply&id=${this.data.id}&isShowOtherAct=false&isShowPayModal=true&byUnion=${this.data.byUnion}`
              })
            }
          }, 2000)
        } else if (this.data.prepage == 'index') {
          wx.redirectTo({
            url: `../${this.data.nextpage}/${this.data.nextpage}?prepage=apply&nextpage=detail`
          })
        } else {
          this.toast('提交失败', 'fail')
        }
      }
    })
  }
})