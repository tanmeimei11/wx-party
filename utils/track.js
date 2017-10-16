// import common from './common'
// const U_TRACK = 'http://stats1.jiuyan.info/onepiece/router.html'
const U_TRACK = 'http://10.10.109.253:8018/index.html'


export default function track(app, seed, query = []) {
  // let img = new Image()
  // img.src = combineQuery(seed, query)
  let trackSeed = combineQuery(seed, query)
  console.log(trackSeed)
  app.setData({
    trackSeed: trackSeed
  })  
}

export function combineQuery(seed, query = []) {
  let _track = []
  let _trackPrefix = ''
  let _trackSuffix = ''
  query.push(`action=${_trackPrefix}${seed}${_trackSuffix}`)
  query = query.concat(_track)
  return `${U_TRACK}?` + query.concat([
    // `_host=${location.host}`,
    // `_token=${common.token}`,
    // `_s=${common.source}`,
    // `_v=${common.version}`,
    // `_ig=${common.query._ig || common.query.ig}`,
    `_=${+new Date()}`
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