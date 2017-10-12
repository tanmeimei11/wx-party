function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { is } from '../utils';

var JSBridge = function () {
  function JSBridge() {
    _classCallCheck(this, JSBridge);

    this.protocolId = 0;
    this.protocolList = {};
  }
  /**
   * js向oc发送消息
   * @param {*} iosMessage
   */


  JSBridge.prototype.postNotification = function postNotification(iosMessage) {
    this.protocolId++;
    this.protocolList[this.protocolId] = iosMessage;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'jsbridge://PostNotificationWithId-' + this.protocolId;
    iframe.onload = function () {
      return iframe.parentNode.removeChild(iframe);
    };
    document.documentElement.appendChild(iframe);
  };
  /**
   * oc获取消息数据
   * @param {*} protocolId
   */


  JSBridge.prototype.popNotificationObject = function popNotificationObject(protocolId) {
    var iosMessage = this.protocolList[this.protocolId];
    delete this.protocolList[protocolId];
    return JSON.stringify({
      name: 'p',
      userInfo: {
        message: iosMessage
      }
    });
  };

  return JSBridge;
}();
/**
 * 调用协议
 * @param {*} iosMessage ios协议
 * @param {*} androidMessage andr协议
 */


export function awake(iosMessage) {
  var androidMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iosMessage;

  if (is.ios) {
    window.jsBridge = window.jsBridge || new JSBridge();
    window.jsBridge.postNotification(iosMessage);
  } else if (is.android) {
    window.client.getprotocol(androidMessage);
  } else {
    throw new TypeError(is._ua + '  is not supported');
  }
}