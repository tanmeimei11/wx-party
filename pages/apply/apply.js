var requestPromisify = require('../../utils/wxPromise.js').requestPromisify
var formatTimeToTime = require('../../utils/util.js').formatTimeToTime
var getTimeObj = require('../../utils/util.js').getTimeObj
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

Page({
  data: {
    jobList: ["制图员与摄影测绘师", "制图师", "物流师", "土木工程师", "石油工程师", "轮机工程师与造船师", "勘测员", "景观建筑师", "建筑师", "健康与安全工程师", "机械工程师", "环境工程师", "化学工程师", "核工程师", "航空航天工程师", "工业工程师", "电子工程师", "电气与电子工程师", "城市及区域规划师", "材料工程师", "运营分析师", "预算分析师", "统计师", "市场分析师", "精算师", "金融审计师", "金融分析师", "会计师与审计师", "管理分析师", "个人理财顾问", "成本估算师", "不动产估价师与评估师", "保险理赔师", "人力资源专员", "信息安全分析师", "网络与计算机系统管理员", "计算机硬件工程师", "网站开发师", "数据库管理员", "计算机系统分析师", "网络架构师", "软件开发师", "程序员", "展览设计师", "平面设计师", "工业设计师", "室内设计师", "花艺设计师", "摄影师", "时装设计师", "工艺美术家", "舞台管理", "医师", "药剂师", "牙医", "兽医（职业）", "足医", "注册护士", "助理医生", "职业治疗师", "语音语言病理学家", "心理医生", "物理治疗师", "听力学家", "配镜师", "生物医学工程师", "社会工作者", "康复咨询师", "职教教师", "幼师及小学教师", "学前教师", "学生辅导员", "图书馆员", "特教教师", "助教", "高中教师", "初中教师", "职业顾问", "大学教师", "档案管理员", "计算机科学家", "医学家", "野生动物生物学家", "微生物学家", "生物化学家与生物物理学家", "流行病学家", "动物学家", "土壤与植物学家", "数学家", "物理学家和天文学家", "化学家", "环境学家", "地质学家", "地理学家", "水文学家", "大气科学家", "政治学家", "社会学家", "人类学家", "历史学家", "考古学家", "经济学家", "律师", "法医", "法官", "律师助理", "法庭书记员", "记者", "播音员", "翻译", "会展策划", "编辑"],
    region: ['浙江省', '杭州市', '西湖区'],
    birth: [],
    job: [],
    regionText: originText.region,
    birthText: originText.birth,
    jobText: originText.job,
    phoneNum: '',
    isVerify: false,
    endTime: '2017-1-1',
    id: ''
  },
  onLoad: function (option) {
    if (option.prepage) {
      this.setData({
        prepage: option.prepage
      })
    }

    if (option.id) {
      this.setData({
        id: option.id
      })
    }

    wx.setNavigationBarTitle({
      title: '报名'
    })

    // 初始化生日的结束时间
    var timeObj = getTimeObj(new Date())
    console.log(timeObj)
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
    console.log('222')

    this.setData({
      isVerify: true
    })

    if (!type) {
      this.submit()
    }
  },
  submit: function () {
    requestPromisify({
      url: `/activity/add_info`,
      data: {
        area: this.data.region,
        birth: this.data.birthText,
        work: this.data.jobText,
        phone: this.data.phoneNum
      }
    }).then((res) => {
      if (res.succ) {
        this.toastSucc('提交成功')
        if (this.data.id) {
          wx.redirectTo({
            url: `../${this.data.prepage}/${this.data.prepage}?prepage=apply&id=${this.data.id}`
          })
        }
      } else {
        this.toast('fail', '提交失败')
      }
    })
  }
})