var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* globals wx */
import { buildTrackUrl, buildtrack } from './track';
import { is } from '../utils';

export var Share = function () {
  function Share(options) {
    _classCallCheck(this, Share);

    this.opts = options;
    this.setting = is.wx ? this._wxsdk(this.opts.sdkUrl) : Promise.resolve(1);
  }

  Share.prototype._wxsdk = function _wxsdk() {
    return fetch(this.opts.sdkUrl + '?redirectUrl=' + encodeURIComponent(location.href.split('#')[0])).then(function (res) {
      return res.json();
    }).then(function (res) {
      return res.succ ? res.data : {};
    }).then(function (data) {
      if (data.appId) {
        // wx.error(res => alert(JSON.stringify(res)))
        wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        });
      }
      return data;
    });
  };

  Share.prototype._setIn = function _setIn() {
    var _this = this;

    var shareSet = document.getElementById('shareSet');
    if (shareSet == null) {
      shareSet = document.createElement('div');
      shareSet.setAttribute('id', 'shareSet');
      document.body.appendChild(shareSet);
    }
    var html = [];
    Object.keys(this._config).forEach(function (key) {
      var ids = {
        'title': ['shareTitle'],
        'desc': ['shareDesc'],
        'link': ['shareLink'],
        'img': ['shareImgSrc', 'shareImgUrl'],
        'track': ['shareCallback']
      }[key];
      if (ids === undefined) throw new ReferenceError(key + ' not found');
      var val = _this._config[key];
      if (ids[0] === 'shareCallback') {
        val = buildTrackUrl(_this.opts.trackUrl, val);
      }
      ids.forEach(function (id) {
        return html.push('<input type="hidden" id="' + id + '" value="' + val + '">');
      });
    });
    shareSet.innerHTML = html.join('');
  };

  Share.prototype._setWx = function _setWx() {
    var _this2 = this;

    var shareObj = {
      title: this._config.title,
      desc: this._config.desc,
      link: this._config.link,
      imgUrl: this._config.img,
      success: function success() {
        _this2._config.track && buildtrack(_this2.opts.trackUrl)(_this2._config.track);
        _this2._config.success && _this2._config.success();
      },
      cancel: function cancel() {
        _this2._config.cancel && _this2._config.cancel();
      }
    };
    wx.ready(function () {
      wx.onMenuShareTimeline(shareObj);
      wx.onMenuShareAppMessage(shareObj);
      wx.onMenuShareQQ(shareObj);
      wx.onMenuShareWeibo(shareObj);
      wx.onMenuShareQZone(shareObj);
    });
  };

  _createClass(Share, [{
    key: 'config',
    get: function get() {
      return {
        get title() {
          return this._config.title;
        },
        set title(value) {
          this.config = {
            title: value
          };
        },
        get desc() {
          return this._config.desc;
        },
        set desc(value) {
          this.config = {
            desc: value
          };
        },
        get link() {
          return this._config.link;
        },
        set link(value) {
          this.config = {
            link: value
          };
        },
        get img() {
          return this._config.img;
        },
        set img(value) {
          this.config = {
            img: value
          };
        },
        get track() {
          return this._config.track;
        },
        set track(value) {
          this.config = {
            track: value
          };
        }
      };
    },
    set: function set(value) {
      var _this3 = this;

      var config = this._config || {};
      this._config = _extends({}, config, value);
      if (this._config.img) {
        // fix shareImgAddr
        var anchor = document.createElement('a');
        anchor.href = this._config.img;
        this._config.img = anchor.href;
      }
      console.log(this._config.img);
      if (is.wx) {
        this.setting.then(function () {
          return _this3._setWx();
        });
      } else if (is.inApp) {
        this.setting.then(function () {
          return _this3._setIn();
        });
      }
    }
  }]);

  return Share;
}();