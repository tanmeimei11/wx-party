// import common from './common'
const U_TRACK = 'http://stats1.jiuyan.info/onepiece/router.html'
var isTrack = require('./config.js').isTrack
// const U_TRACK = 'http://10.10.109.253:8018/index.html'
var ga = require('../lib/ga.js');
var config = require('./config.js')

var HitBuilders = ga.HitBuilders;
var t = getApp().getTracker();
var trackArray = []
var gaTrackArray = []
var isTrackLoading = false

var gaTrack = (app, track) => {
  var _action = track.action
  var _query = track.query
  if (!_query) {
    _query = 'click'
  }
  var entry = /.*_screen_enter/.exec(_action)
  if (entry) {
    // _action = '首页'
    t.setScreenName(_action);
    var screenName = new HitBuilders.ScreenViewBuilder().build()
    t.send(screenName);
  }
  var a = new HitBuilders.EventBuilder()
    .setCategory(_action)
    .setAction(_query)
    .setLabel(`from__${wx.getStorageSync('from')}`) // 可选
  // .setValue('34567')
  t.send(a);
}

var requestTrack = (app) => {
  var t = getApp().getTracker();
  return new Promise((resolve, reject) => {
    if (trackArray.length) {
      setTimeout(() => {
        gaTrack(app, gaTrackArray[0])
        app.setData({
          trackSeed: trackArray[0]
        })
        trackArray.shift()
        gaTrackArray.shift()
        return requestTrack(app)
      }, 100)
    } else {
      isTrackLoading = false
      resolve()
    }
  })
}

export default function track(app, seed, query = []) {
  gaTrackArray.push({
    action: seed,
    query: query.join('&')
  })
  let trackSeed = combineQuery(app, seed, query)
  // 这样请求会被丢弃 有的埋点抓不到 原因1，img赋值太快了造成页面请求还没有发就被丢弃了 2，替换的过快 setdata直接跳过类似vue 好像setdata内部也是和vue内部一样的 超过一定数量采取更新dom 
  trackArray.push(trackSeed)
  if (!isTrack) {
    return
  }
  if (isTrackLoading) {
    return
  }
  isTrackLoading = true
  requestTrack(app)
}

export function combineQuery(app, seed, query = []) {
  let _track = []
  let _trackPrefix = ''
  let _trackSuffix = ''
  query.push(`action=${_trackPrefix}${seed}${_trackSuffix}`)
  query = query.concat(_track)
  // 添加必要的辅助字断
  var deviceInfo = getApp().getDeviceInfo()
  return `${U_TRACK}?` + query.concat([
    // `_host=${location.host}`,
    `_token=${wx.getStorageSync('token')}`,
    `_pf=${deviceInfo.platform}`,
    `_sys=${deviceInfo.system}`,
    `_phone=${deviceInfo.model}`,
    `_v=${config._v}`,
    `_wxv=${deviceInfo.version}`,
    `_sdkv=${deviceInfo.SDKVersion}`,
    `_time=${+new Date()}`
  ]).join('&')
}

export function trackParam(search, items = []) {
  if (!search.length) return true
  let [seed, query] = search.split('?')
  if (query && query.length) {
    items = items.concat(query.split('&'))
  }
  track(seed, items)
}