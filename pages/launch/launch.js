//launch.js
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var formatNumber = require('../../utils/util.js').formatNumber
var getTimeObj = require('../../utils/util.js').getTimeObj
var monthDayWeekArr = require('../../utils/util.js').getMonthDayWeekArr()
var weekdays = require('../../utils/util.js').weekdays
var year = require('../../utils/util.js').year
var getFullNumArray = require('../../utils/util.js').getFullNumArray
var uploadImageToQiniu = require('../../utils/api.js').uploadImageToQiniu
var getAuth = require('../../utils/auth.js').get
import track from '../../utils/track.js'
const originText = {
  'name': "活动名称",
  // 'addr': "活动地点",
  // 'detailAddr': "详细地址",
  'mapName': "活动地点",
  'beginText': "活动开始时间",
  'endText': "活动结束时间",
  'detailDesc': "活动详细介绍及其他要点",
  'wechat': "微信号",
  'amount': "活动价格",
  'door': "门牌号，如1幢1单元402"
}
const errorText = {
  'image': "请上传图片",
  'name': "请填写活动名称",
  // 'addr': "请选择活动地点",
  // 'detailAddr': "请填写详细地址",
  'mapName': "请选择活动地点",
  'beginText': "请选择开始时间",
  'endText': "请选择结束时间",
  'detailDesc': "请填写活动详细介绍及其他要点",
  'wechat': "请填写微信号",
  'amount': "请填写活动价格",
  'door': "请填写门牌号"
}
Page({
  data: {
    trackSeed: 'http://stats1.jiuyan.info/onepiece/router.html?action=h5_tcpa_launch_enter',
    jobList: [],
    birth: [],
    job: '',
    initAddrVal: ['浙江省', '杭州市', '西湖区'],
    monthDayWeekArr: monthDayWeekArr,
    multiArray: [
      monthDayWeekArr,
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
    amount: originText.amount,
    door: originText.door,
    mapName: originText.mapName,
    phoneNum: '',
    images: [],
    isVerify: false,
    id: '',
    isAddImg: true,
    isShowMapName: false
  },
  onLoad: function (option) {
    track(this, 'h5_tcpa_launch_entry')
    track(this, 'h5_tcpa_launch_screen_enter')
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
      // console.log('------all images upload succ-----')
    })

  },
  loadingIn: function (text) {
    wx.showLoading({
      title: text,
    })
  },
  loadingOut: function () {
    wx.hideLoading()
  },
  chooseImage: function () {
    track(this, 'h5_tcpa_active_photo_add')
    wxPromisify(wx.chooseImage)({
      count: 9,
      success: function (res) {}
    }).then(res => {
      var tempFilePaths = res.tempFilePaths
      this.loadingIn('正在上传')
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
      // console.log(this.images)
    })
  },
  changeAddr: function (e) {
    var _val = e.detail.value.join('');
    this.setData({
      addrJson: e.detail.value,
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
      weekDay: date.getDay()
    }
    var _idx = 0
    for (var i = 0; i < monthDayWeekArr.length; i++) {
      if (monthDayWeekArr[i] == `${_timeObj.month +1}月${_timeObj.day}日${weekdays[_timeObj.weekDay]}`) {
        _idx = i
      }
    }
    var _index = [_idx, _timeObj.hour, _timeObj.minute]
    this.setData({
      beginIndex: _index,
      endIndex: _index
    })
  },
  changeTime: function (e) {
    // begin end
    var _val = e.detail.value
    var _type = e.target.dataset.type
    var _md = this.data.multiArray[0][_val[0]].split('日')[0].split('月')
    var _timeText = `${year}-${formatNumber(_md[0])}-${formatNumber(_md[1])} ${formatNumber(_val[1])}:${formatNumber(_val[2])}`
    var _data = {}
    _data[`${_type}Index`] = _val
    _data[`${_type}Text`] = _timeText
    _data[`${_type}Md`] = _md
    this.setData(_data)
    this.verify('', true)
  },
  getText: function (e) {
    var _val = e.detail.value
    var _type = e.target.dataset.type
    var _data = {}
    _data[`${_type}`] = _val
    this.setData(_data)
    if (_type == 'end') {
      this.verify('', false)
      return
    }
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
      !type && this.toast(errorText['image'], 'warn')
      return
    }
    // 活动名称
    if (this.verifyKong(_data.name) || _data.name == originText.name) {
      !type && this.toast(errorText['name'], 'warn')
      return
    }
    // 活动地点
    // if (_data.addr == originText.addr) {
    //   !type && this.toast(errorText['addr'], 'warn')
    //   return
    // }
    // 详细地址
    // if (this.verifyKong(_data.detailAddr) || _data.detailAddr == originText.detailAddr) {
    //   !type && this.toast(errorText['detailAddr'], 'warn')
    //   return
    // }

    // 地图数据
    if (!this.data.isShowMapName) {
      !type && this.toast(errorText['mapName'], 'warn')
      return
    }

    // 门牌号
    if (this.verifyKong(_data.door) || _data.door == originText.door) {
      !type && this.toast(errorText['door'], 'warn')
      return
    }

    // 活动价格
    if (this.verifyKong(_data.amount) || _data.amount == originText.amount) {
      !type && this.toast(errorText['amount'], 'warn')
      return
    }
    // 开始时间
    if (_data.beginText == originText.beginText || (+new Date(_data.beginText.replace(/-/g, '/')) - +new Date() < 100)) {
      !type && this.toast(errorText['beginText'], 'warn')
      return
    }
    // 结束时间 
    if (_data.endText == originText.endText || (+new Date(_data.endText.replace(/-/g, '/')) - +new Date(_data.beginText.replace(/-/g, '/'))) < 100) {
      !type && (this.toast(errorText['endText'], 'warn'))
      return
    }
    // 描述
    if (this.verifyKong(_data.detailDesc) || _data.detailDesc == originText.detailDesc) {
      !type && this.toast(errorText['detailDesc'], 'warn')
      return
    }
    // 微信号
    if (this.verifyKong(_data.wechat) || _data.wechat == originText.wechat) {
      !type && this.toast(errorText['wechat'], 'warn')
      return
    }

    this.setData({
      isVerify: true
    })

    if (!type) {
      this.submit()
    }
  },
  getProviceByString: function (str) {
    var array = /(.*省)(.*市)(.*区)/g.exec(str)
    return JSON.stringify([array[1], array[2], array[3]])
  },
  submit: function () {
    track(this, 'h5_tcpa_active_submit')
    this.loadingIn('正在创建')
    var _data = this.data
    var requestData = {
      actName: _data.name,
      actUrls: _data.images,
      district: this.getProviceByString(_data.mapAddress),
      wxAreaName: _data.mapName,
      wxAddress: _data.mapAddress,
      latitude: _data.mapLatitude,
      longitude: _data.mapLongitude,
      houseNo: _data.door,
      // actLocation: _data.detailAddr,
      startTime: +new Date(_data.beginText.replace(/-/g, '/')),
      endTime: +new Date(_data.endText.replace(/-/g, '/')),
      actDesc: _data.detailDesc,
      amount: _data.amount,
      wxNo: _data.wechat,

    }
    // var requestData = {
    //   actName: 'ceshi',
    //   actUrls: ['http://inimg02.jiuyan.info/in/2015/08/13/999D6165-C074-7176-B939-3A26C28C19C9.jpg'],
    //   // district: '浙江省杭州市西湖区',
    //   district: JSON.stringify(['浙江省','杭州市','西湖区']),
    //   actLocation: '22222',
    //   startTime: 1509089640000,
    //   endTime: 1509262440000,
    //   actDesc: '3333',
    //   amount: 12,
    //   wxNo: '4444'
    // }
    // console.log(requestData)
    requestPromisify({
      url: `/activity/create`,
      method: 'POST',
      data: requestData,
    }).then((res) => {
      this.loadingOut()
      if (res.succ) {
        this.loadingOut()
        this.toast('创建成功')
        track(this, 'h5_tcpa_active_submit_succ', [`id=${res.data}`])
        setTimeout(() => {
          wx.redirectTo({
            url: `../detail/detail?prepage=launch&id=${res.data}&isShowOtherAct=false`
          })
        }, 2000)
      } else {
        this.toast('创建失败', 'error')
      }
    }, () => {
      this.loadingOut()
      this.toast('创建失败', 'error')
    })
  },
  chooseMap: function () {
    getAuth('userLocation')
      .then(() => {
        wxPromisify(wx.chooseLocation)({}).then(res => {
          this.setData({
            mapName: res.name,
            mapAddress: res.address,
            mapLatitude: res.latitude,
            mapLongitude: res.longitude,
            isShowMapName: true
          })
        })
      })
  },
})