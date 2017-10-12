import { app, common } from '../utils';

/**
 * 构建参数
 */
export function buildTrackUrl(trackUrl) {
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var _track = window._track || [];
  var _trackPrefix = window._trackPrefix || '';
  var _trackSuffix = window._trackSuffix || '';

  var _action$split = action.split('?'),
      seed = _action$split[0],
      _action$split$ = _action$split[1],
      items = _action$split$ === undefined ? '' : _action$split$;

  query = query.concat(items.length ? items.split('&') : []).concat(_track);
  query.push('action=' + _trackPrefix + seed + _trackSuffix);
  trackUrl = ~trackUrl.indexOf('http') ? trackUrl : '' + location.protocol + trackUrl;
  return trackUrl + '?' + query.concat(['_host=' + location.hostname, '_token=' + (app.token || ''), '_s=' + (app.source || ''), '_v=' + (app.version || ''), '_ig=' + (common.query._ig || common.query.ig || ''), '_=' + +new Date()]).join('&');
}
/**
 *
 * @param {*} trackUrl
 */
export function buildtrack(trackUrl) {
  /**
   *
   * @param {*} action
   * @param {*} query
   */
  return function track() {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!action.length) return true;
    var img = new Image();
    img.src = buildTrackUrl(trackUrl, action, query);
  };
}