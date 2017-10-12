var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { is } from '../utils';
/**
 * 构建参数 
 * @param {string} prefix key的前缀
 * @param {object} param  参数
 * @param {function} append 回调方法
 */
var buildParam = function buildParam(prefix, param, append) {
  if (is.obj(param) && param.constructor === {}.constructor || is.array(param)) {
    Object.keys(param).forEach(function (key) {
      var val = param['' + key];
      var _key = is.obj(val) || is.array(val) || is.obj(param) ? key : '';
      buildParam(prefix === '' ? key : prefix + '[' + _key + ']', val, append);
    });
  } else {
    append('' + prefix, param);
  }
};

/**
 * 构建get请求参数
 * @param {*} url 地址
 * @param {*} params 请求对象
 */
export var buildGetParam = function buildGetParam(url) {
  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
    params[_key2 - 1] = arguments[_key2];
  }

  var query = [];
  params.forEach(function (param) {
    return buildParam('', param, function (key, val) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    });
  });
  if (query.length === 0) return url;
  return url + '?' + query.join('&');
};
/**
 * 构建post请求参数
 * @param {*} params 请求对象
 */
export var buildPostParam = function buildPostParam() {
  for (var _len2 = arguments.length, params = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
    params[_key3] = arguments[_key3];
  }

  var data = new FormData();
  params.forEach(function (param) {
    return buildParam('', param, function (key, val) {
      data.append(key, val);
    });
  });
  return data;
};
/**
 * 
 * @param {*} _options 
 */
function createXhr() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = _extends({
    async: true
  }, opt);
  return new Promise(function (resolve, reject) {
    var xmlhttp = new XMLHttpRequest();
    if (options.credentials) {
      xmlhttp.withCredentials = true;
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState !== 4) return;
      if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
        var result = xmlhttp.responseType === 'arraybuffer' || xmlhttp.responseType === 'blob' ? xmlhttp.response : xmlhttp.responseText;
        try {
          if (~xmlhttp.getResponseHeader('content-type').indexOf('application/json')) {
            result = JSON.parse(result);
          }
        } catch (e) {}
        resolve({
          json: function json() {
            return JSON.parse(JSON.stringify(result));
          }
        });
      } else {
        reject(new Error(xmlhttp.statusText || null));
      }
    };
    xmlhttp.onabort = xmlhttp.onerror = function () {
      return reject(new Error(xmlhttp.status));
    };
    xmlhttp.open(options.method, options.url, options.async);
    xmlhttp.send(options.body);
  });
}

/**
 * 构建请求方法（每个请求每次只能执行一次）
 * @param {Object} commonParam 公共参数
 * @param {Object} urls 请求地址
 * @param {Object} opt 关于请求的配置
 */
export function FetchApi(commonParam, urls, opt) {
  var _host = opt.host;
  var urlObj = {};

  Object.keys(urls).forEach(function (urlKey) {
    var reqUrlInfo = urls['' + urlKey];
    var requestDone = function requestDone(res) {
      urlObj['' + urlKey].loading = false;
      return res;
    };
    urlObj['' + urlKey] = function () {
      var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          method = _ref.method,
          type = _ref.type,
          host = _ref.host;

      // 获取请求地址
      var reqUrl = '' + (reqUrlInfo.host || host || _host) + (reqUrlInfo.url || reqUrlInfo);
      if (urlObj['' + urlKey].loading) return new Promise(function (resolve, reject) {
        return console.warn(reqUrl + ' RequsetIng');
      });
      urlObj['' + urlKey].loading = true;
      // 判断是不是使用fetch
      var isFetch = /fetch/i.test(type || reqUrlInfo.type || 'fetch');
      // 判断是不是get方法
      var isGet = /get/i.test(method || reqUrlInfo.method || 'get');
      return (isFetch ? function (options) {
        return fetch(options.url, options);
      } : createXhr)({
        url: isGet ? buildGetParam(reqUrl, commonParam, param) : reqUrl,
        credentials: 'include',
        method: isGet ? 'GET' : 'POST',
        body: isGet ? null : buildPostParam(commonParam, param),
        headers: {} // 'X-Requested-With': 'XMLHttpRequest' 当后端需要判断是否为ajax的时候添加
      }).then(function (res) {
        return res.json();
      }).then(function (json) {
        if (!json.succ && json.data && json.data.status === 302) {
          location.href = json.data.location;
          throw json;
        }
        return json;
      }).then(function (res) {
        return requestDone(res);
      }, function (err) {
        return requestDone(err);
      });
    };
  });
  return urlObj;
}