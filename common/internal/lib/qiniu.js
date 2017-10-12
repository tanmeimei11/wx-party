var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { buildGetParam, buildPostParam } from './ajax';
import { is } from '../utils';
/**
 * 根据当前 protocol 选择地址
 * @param {String} https https的地址
 * @param {String} http http的地址
 */
var isHttps = function isHttps(https, http) {
  return location.protocol === 'http:' ? http : https;
};
/**
 * 
 * @param {*} qnTokenUrl 
 */
export function buildUploadQiniu(qnTokenUrl) {
  /**
   * 七牛上传地址
   */
  var qnUrl = isHttps('https://up.qbox.me', 'http://up.qiniu.com');

  /**
   * 七牛base64上传地址
   */
  var qnBase64Url = isHttps('https://up.qbox.me/putb64/-1/key/', 'http://up.qiniu.com/putb64/-1/key/');
  /**
  * 获取上传图片的token
  * @param {Boolean} isPrivate 是否为私密空间
  */
  var qnToken = function qnToken(isPrivate) {
    return fetch(buildGetParam(qnTokenUrl, {
      time: +new Date(),
      isPrivate: isPrivate ? 1 : ''
    })).then(function (res) {
      return res.json();
    }).then(function (res) {
      if (res.succ) return res.data;
      throw res.data.msg;
    });
  };
  /**
   * 上传图片
   */
  return function uploadQiniu(data, isPrivate) {
    var getToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (tokenRes, res) {
      return {
        origin: tokenRes.urlTpl.replace('%QiniuUploadImg%', res.key).replace(/\?[^?]+$/, ''),
        key: res.key,
        hash: res.hash
      };
    };

    var isBase64 = is.string(data);
    return qnToken(isPrivate).then(function (tokenRes) {
      var _ref = isBase64 ? ['' + qnBase64Url + tokenRes.key, {
        headers: {
          Authorization: 'UpToken ' + tokenRes.token,
          contentType: 'application/octet-stream'
        },
        body: /^data:image/.test(data) ? data.replace(/^.*?,/, '') : data
      }] : [qnUrl, {
        body: buildPostParam({
          key: tokenRes.key,
          token: tokenRes.token,
          file: data
        })
      }],
          url = _ref[0],
          opt = _ref[1];

      return fetch(url, _extends({
        method: 'POST'
      }, opt)).then(function (res) {
        return res.json();
      }).then(function (res) {
        return getToken(tokenRes, res);
      });
    });
  };
}