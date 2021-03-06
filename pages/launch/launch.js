//launch.js
var mutulPage = require('../../utils/mixin.js').mutulPage
var wxPromisify = require('../../utils/wxPromise.js').wxPromisify
var request = require('../../utils/wxPromise.js').requestPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var formatNumber = require('../../utils/util.js').formatNumber
var getTimeObj = require('../../utils/util.js').getTimeObj
var monthDayWeekArr = require('../../utils/util.js').getMonthDayWeekArr()
var weekdays = require('../../utils/util.js').weekdays
var year = require('../../utils/util.js').year
var getFullNumArray = require('../../utils/util.js').getFullNumArray
var uploadImageToQiniu = require('../../utils/api.js').uploadImageToQiniu
var getAuth = require('../../utils/auth.js').get
var perLine = require('./config.js')
var actTypes = require('../../components/actTypes/index.js')

console.log(actTypes)
import track from '../../utils/track.js'

mutulPage({
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
    perLine: perLine,
    multiIndex: [],
    name: '',
    detailAddr: perLine.detailAddr,
    beginText: perLine.begin.placeHolder,
    endText: perLine.end.placeHolder,
    detailDesc: '',
    wechat: '',
    amount: '',
    door: '',
    mapName: '',
    phone: '',
    images: [],
    isVerify: false,
    id: '',
    isAddImg: true,
    isShowMapName: false
  },
  mixins: [actTypes],
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
    this.getActTypes()
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
    // 验证分类
    if (!_data.actTypes.activeType.screen) {
      !type && this.toast(perLine['activeType'].errorMsg, 'warn')
      return
    }
    // 验证图片
    if (!_data.images.length) {
      !type && this.toast(perLine['image'].errorMsg, 'warn')
      return
    }
    // 活动名称
    if (this.verifyKong(_data.name)) {
      !type && this.toast(perLine['name'].errorMsg, 'warn')
      return
    }
    // 地图数据
    if (!this.data.isShowMapName) {
      !type && this.toast(perLine['mapName'].errorMsg, 'warn')
      return
    }

    // 门牌号
    if (this.verifyKong(_data.door)) {
      !type && this.toast(perLine['door'].errorMsg, 'warn')
      return
    }

    // 活动价格
    if (this.verifyKong(_data.amount)) {
      !type && this.toast(perLine['amount'].errorMsg, 'warn')
      return
    }
    // 开始时间
    if (_data.beginText == _data.perLine.begin.placeHolder || (+new Date(_data.beginText.replace(/-/g, '/')) - +new Date() < 100)) {
      !type && this.toast(perLine['begin'].errorMsg, 'warn')
      return
    }
    // 结束时间 
    if (_data.endText == _data.perLine.end.placeHolder || (+new Date(_data.endText.replace(/-/g, '/')) - +new Date(_data.beginText.replace(/-/g, '/'))) < 100) {
      !type && (this.toast(perLine['end'].errorMsg, 'warn'))
      return
    }
    // 描述
    if (this.verifyKong(_data.detailDesc)) {
      !type && this.toast(perLine['detailDesc'].errorMsg, 'warn')
      return
    }
    // 手机号
    if (!/\d{11}/.test(_data.phone)) {
      !type && this.toast(perLine['phone'].errorMsg, 'warn')
      return
    }
    // 微信号
    if (this.verifyKong(_data.wechat)) {
      !type && this.toast(perLine['wechat'].errorMsg, 'warn')
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
    var array = /(.*省)?(.*市)?(.*区)?/g.exec(str)
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
      startTime: +new Date(_data.beginText.replace(/-/g, '/')),
      endTime: +new Date(_data.endText.replace(/-/g, '/')),
      actDesc: _data.detailDesc,
      amount: _data.amount,
      wxNo: _data.wechat,
      phone: _data.phone,
      actType: _data.actTypes.activeType.screen

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
    request({
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