// import common from './common'
const U_TRACK = 'http://stats1.jiuyan.info/onepiece/router.html'
// const U_TRACK = 'http://10.10.109.253:8018/index.html'
// 这里是ga统计
var ga = require('../lib/ga.js');

var HitBuilders = ga.HitBuilders;
var t = getApp().getTracker();
t.setScreenName('测试页面');
// t.send();
var trackArray = []
var gaTrackArray = []
var isTrack = false

var gaTrack = (app, track) => {
  var _action = track.action
  var _query = track.query
  if (!_query) {
    _query = 'click'
  }
  var entry = /.*_page_enter/.exec(_query)
  if (entry) {
    t.setScreenName(entry);
    var screenName = new HitBuilders.ScreenViewBuilder().build()
    t.send(screenName);
  }
  var a = new HitBuilders.EventBuilder()
    .setCategory(_action)
    .setAction(_query)
  // .setLabel('1111') // 可选
  // .setValue('34567')
  t.send(a);
}

var requestTrack = (app) => {
  console.log(isTrack)

  var t = getApp().getTracker();
  t.setScreenName('这里是日志页面');
  t.send(new HitBuilders.ScreenViewBuilder().build());
  return new Promise((resolve, reject) => {
    if (trackArray.length) {
      setTimeout(() => {
        console.log('real', trackArray[0])
        gaTrack(app, gaTrackArray[0])
        console.log(gaTrackArray[0])
        app.setData({
          trackSeed: trackArray[0]
        })
        trackArray.shift()
        gaTrackArray.shift()
        return requestTrack(app)
      }, 100)
    } else {
      isTrack = false
      resolve()
    }
  })
}

export default function track(app, seed, query = []) {
  // let img = new Image()
  // img.src = combineQuery(seed, query)
  gaTrackArray.push({
    action: seed,
    query: query.join('&')
  })
  let trackSeed = combineQuery(seed, query)
  console.log('visual', trackSeed)
  // 这样请求会被丢弃 有的埋点抓不到 原因1，img赋值太快了造成页面请求还没有发就被丢弃了 2，替换的过快 setdata直接跳过类似vue 好像setdata内部也是和vue内部一样的 超过一定数量采取更新dom 
  // app.setData({
  //   trackSeed: trackArray[0]
  // })
  trackArray.push(trackSeed)
  if (isTrack) {
    return
  }
  isTrack = true
  requestTrack(app)
}

export function combineQuery(seed, query = []) {
  let _track = []
  let _trackPrefix = ''
  let _trackSuffix = ''
  query.push(`action=${_trackPrefix}${seed}${_trackSuffix}`)
  query = query.concat(_track)
  return `${U_TRACK}?` + query.concat([
    // `_host=${location.host}`,
    `_token=${wx.getStorageSync('token')}`,
    // `_s=${common.source}`,
    // `_v=${common.version}`,
    // `_ig=${common.query._ig || common.query.ig}`,
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