var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import { awake } from './lib/jsBridge';
export var APPLINKS = {
  in: '//m.in66.com/applinks'
  /**
   * 对象判断
   */
};var is = {
  func: function func(f) {
    return typeof f === 'function';
  },
  number: function number(n) {
    return typeof n === 'number';
  },
  string: function string(s) {
    return typeof s === 'string';
  },
  array: Array.isArray,
  obj: function obj(_obj) {
    return _obj && !is.array(_obj) && (typeof _obj === 'undefined' ? 'undefined' : _typeof(_obj)) === 'object';
  },
  get _ua() {
    return window.navigator.userAgent.toLowerCase();
  },
  get ios() {
    return (/iphone|ipod|ipad/gi.test(this._ua)
    );
  },
  get android() {
    return (/android|adr/gi.test(this._ua)
    );
  },
  get wx() {
    return (/micromessenger/gi.test(this._ua)
    );
  },
  get wb() {
    return (/weibo/gi.test(this._ua)
    );
  },
  get wyMusic() {
    return (/neteasemusic/gi.test(this._ua)
    );
  },
  get inApp() {
    return (/infashion/gi.test(this._ua)
    );
  }
};
/**
 * 公共查询
 */
export { is };
export var common = {
  get _domain() {
    return (/in66.com$/.test(location.hostname) ? 'in66.com' : ''
    );
  },
  get query() {
    return __splitData(location.search.substr(1), '&', function (key) {
      return key.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    }, decodeURIComponent);
  },
  queryString: function queryString(search) {
    return __splitData(search.substr(1), '&', function (key) {
      return key.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    }, decodeURIComponent);
  },

  get cookie() {
    return __splitData(document.cookie, ';', function (key) {
      return key;
    }, unescape);
  },
  // 设置cookie
  set cookie(val) {
    var name = val.name,
        value = val.value,
        expiredays = val.expiredays;

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    var expireStr = expiredays == null ? '' : ';expires=' + exdate.toGMTString();
    document.cookie = name + '=' + escape(value) + ';domain=' + this._domain + ';path=/;' + expireStr;
    return this.cookie;
  }
};

/**
 * app 信息
 */
export var app = {
  // 获取版本
  get version() {
    return common.query._v || common.query._version || common.cookie._v || common.cookie._version;
  },
  // 获取类型
  get source() {
    return common.query._s || common.query._source || common.cookie._s || common.cookie._source;
  },
  // 获取token
  get token() {
    return common.query._token || common.query.tg_auth || common.cookie._token || common.cookie.tg_auth;
  },
  // 判断版本
  lessThanVer: function lessThanVer(version) {
    var _version$trim$split = version.trim().split('.'),
        _version$trim$split$ = _version$trim$split[0],
        major = _version$trim$split$ === undefined ? Infinity : _version$trim$split$,
        _version$trim$split$2 = _version$trim$split[1],
        minor = _version$trim$split$2 === undefined ? Infinity : _version$trim$split$2,
        _version$trim$split$3 = _version$trim$split[2],
        patch = _version$trim$split$3 === undefined ? Infinity : _version$trim$split$3;

    var _version$trim$split2 = this.version.trim().split('.'),
        _version$trim$split2$ = _version$trim$split2[0],
        cmajor = _version$trim$split2$ === undefined ? Infinity : _version$trim$split2$,
        _version$trim$split2$2 = _version$trim$split2[1],
        cminor = _version$trim$split2$2 === undefined ? Infinity : _version$trim$split2$2,
        _version$trim$split2$3 = _version$trim$split2[2],
        cpatch = _version$trim$split2$3 === undefined ? Infinity : _version$trim$split2$3;

    return !(Number(cmajor) > Number(major) || Number(cminor) > Number(minor) || Number(cpatch) >= Number(patch));
  },

  // 打开app
  open: function open(iosMessage) {
    var androidMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iosMessage;

    var destUrl = document.createElement('a');
    destUrl.href = is.ios ? iosMessage : androidMessage;
    var isWeb = /^https?:$/.test(destUrl.protocol);
    if (isWeb || !is.inApp) {
      var appUri = is.ios ? encodeURIComponent(destUrl.href) : destUrl.href;
      appUri = isWeb ? 'in://webview?url=' + encodeURIComponent(appUri) : appUri;
      location.href = '' + location.protocol + APPLINKS.in + '?protocol=' + encodeURIComponent(appUri);
    } else if (is.inApp && isWeb) {
      location.href = destUrl.href;
    } else if (is.inApp) {
      awake(destUrl.href);
    }
  },

  // 帮in埋token
  initIn: function initIn() {
    if (!is.inApp) return;
    var expiredays = 30;
    var token = this.token;
    var source = this.source;
    var version = this.version;
    token && (common.cookie = {
      name: 'tg_auth',
      value: token,
      expiredays: expiredays
    }) && (common.cookie = {
      name: '_token',
      value: token,
      expiredays: expiredays
    });
    source && (common.cookie = {
      name: '_s',
      value: source,
      expiredays: expiredays
    });
    version && (common.cookie = {
      name: '_v',
      value: version,
      expiredays: expiredays
    });
  }
};

function __splitData(str, delimiter, decodeKey, decodeValue) {
  if (str.trim().length === 0) return {};
  var info = {};
  str.split(delimiter).forEach(function (item) {
    var _item$trim$split = item.trim().split('='),
        key = _item$trim$split[0],
        _item$trim$split$ = _item$trim$split[1],
        val = _item$trim$split$ === undefined ? '' : _item$trim$split$;

    info[decodeKey(key)] = decodeValue(val);
  });
  return info;
}