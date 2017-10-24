//launch.js
//获取应用实例
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var formatNumber = require('../../utils/util.js').formatNumber
var getTimeObj = require('../../utils/util.js').getTimeObj
var getFutureYearArray = require('../../utils/util.js').getFutureYearArray
var getFullNumArray = require('../../utils/util.js').getFullNumArray
var uploadImageToQiniu = require('../../utils/api.js').uploadImageToQiniu
import track from '../../utils/track.js'
const originText = {
  'name': "活动名称",
  'addr': "活动地点",
  'detailAddr': "详细地址",
  'beginText': "活动开始时间",
  'endText': "活动结束时间",
  'detailDesc': "活动详细介绍及其他要点",
  'wechat': "微信号"
}
const errorText = {
  'image': "请上传图片",
  'name': "请填写活动名称",
  'addr': "请选择活动地点",
  'detailAddr': "请填写详细地址",
  'beginText': "请选择开始时间",
  'endText': "请选择结束时间",
  'detailDesc': "请填写活动详细介绍及其他要点",
  'wechat': "请填写微信号"
}
Page({
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_apply_entry',
    jobList: [],
    birth: [],
    job: '',
    initAddrVal: ['浙江省', '杭州市', '西湖区'],
    multiArray: [
      getFutureYearArray(5),
      getFullNumArray(12, '月', 1),
      getFullNumArray(31, '日', 1),
      getFullNumArray(24, '时'),
      getFullNumArray(60, '分')
    ],
    multiIndex: [],
    originText: originText,
    name: originText.name,
    addr: originText.addr,
    detailAddr: originText.detailAddr,
    beginText: originText.beginText,
    endText: originText.endText,
    detailDesc: originText.detailDesc,
    wechat: originText.wechat,
    phoneNum: '',
    images: [],
    isVerify: false,
    id: '',
    isAddImg: true
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

    this.initTime()
  },
  loadImages: function (files) {
    var len = files.length
    var _num = 0
    var _load = (file) => {
      console.log(_num)
      return uploadImageToQiniu(file)
        .then(url => {
          this.data.images.push(url)
          if (_num >= len - 1 || this.data.images.length >= 9) {
            return 'succ'
          }
          return _load(files[++_num])
        })

    }
    return _load(files[_num]).then(() => {
      console.log('------all images upload succ-----')
    })

  },
  loadingIn: function () {
    wx.showLoading({
      title: '正在上传',
    })
  },
  loadingOut: function () {
    wx.hideLoading()
  },
  chooseImage: function () {
    wxPromisify(wx.chooseImage)({
      count: 9,
      success: function (res) {}
    }).then(res => {
      var tempFilePaths = res.tempFilePaths
      this.loadingIn()
      return this.loadImages(tempFilePaths)

    }).then(() => {
      var _images = this.data.images
      this.setData({
        images: _images
      })
      this.loadingOut()
      if (_images.length >= 9) {
        this.setData({
          isAddImg: false
        })
      }
      console.log(this.images)
    })
  },
  changeAddr: function (e) {
    var _val = e.detail.value.join('');
    this.setData({
      addr: _val,
    })
    this.verify('', true)
  },
  initTime: function () {
    var date = new Date()
    var _timeObj = {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    }
    var _index = [_timeObj.year, _timeObj.month, _timeObj.day - 1, _timeObj.hour, _timeObj.minute]
    this.setData({
      beginIndex: _index,
      endIndex: _index
    })
  },
  changeTime: function (e) {
    // begin end
    var _val = e.detail.value
    var _type = e.target.dataset.type
    var _year = this.data.multiArray[0][_val[0]]
    var _timeText = `${_year.split(_year.slice(-1))[0]}-${formatNumber(_val[1]+1)}-${formatNumber(_val[2]+1)} ${formatNumber(_val[3])}:${formatNumber(_val[4])}`
    var _data = {}
    _data[`${_type}Index`] = _val
    _data[`${_type}Text`] = _timeText
    this.setData(_data)
  },
  bindMultiPickerColumnChange: function (e) {
    console.log(e)
  },
  getText: function (e) {
    var _val = e.detail.value
    var _type = e.target.dataset.type
    var _data = {}
    _data[`${_type}`] = _val
    this.setData(_data)
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
  verifyKong: function (str) {
    return /^\s*$/g.test(str)
  },
  verify: function (e, type) {

    var _data = this.data
    // 验证图片
    if (!_data.images.length) {
      !type && this.toast(errorText['image'], 'error')
      return
    }
    // 活动名称
    if (this.verifyKong(_data.name) || _data.name == originText.name) {
      !type && this.toast(errorText['name'], 'error')
      return
    }
    // 活动地点
    if (_data.addr == originText.addr) {
      !type && this.toast(errorText['addr'], 'error')
      return
    }
    // 详细地址
    if (this.verifyKong(_data.detailAddr) || _data.detailAddr == originText.detailAddr) {
      !type && this.toast(errorText['detailAddr'], 'error')
      return
    }
    // 开始时间
    if (_data.beginText == originText.beginText) {
      !type && this.toast(errorText['beginText'], 'error')
      return
    }
    // 结束时间
    if (_data.endText == originText.endText) {
      !type && this.toast(errorText['endText'], 'error')
      return
    }
    // 描述
    if (this.verifyKong(_data.detailDesc) || _data.detailDesc == originText.detailDesc) {
      !type && this.toast(errorText['detailDesc'], 'error')
      return
    }
    // 微信号
    if (this.verifyKong(_data.wechat) || _data.wechat == originText.wechat) {
      !type && this.toast(errorText['wechat'], 'error')
      return
    }

    this.setData({
      isVerify: true
    })

    // if (!type) {
    //   this.submit()
    // }
  },
  submit: function () {
    track(this, 'h5_tcpa_apply_finish')
    var _data = this.data
    var requestData = {
      actName: _data.name, // 活动名称
      actUrls: _data.images, // 活动照片
      district: _data.addr, //地区
      actLocation: _data.detailAddr, // 详细地点
      startTime: +new Date(_data.beginText), //开始时间 （穿时间戳）
      endTime: +new Date(_data.endTime), //结束时间 （穿时间戳）
      actDesc: _data.detailDesc, // 活动描述
      wxNo: _data.wechat
    }
    console.log(requestData)
    requestPromisify({
      url: `/activity/create`,
      // method: 'POST',
      data: requestData
    }).then((res) => {
      if (res.succ) {
        this.toast('创建成功')
        setTimeout(() => {
          wx.redirectTo({
            url: `../detail/detail?prepage=apply&id=${res.data}&notShowOther=true`
          })
        }, 2000)
      }
    })
  }
})