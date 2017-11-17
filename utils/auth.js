var wxPromisify = require('wxPromise.js').wxPromisify

// Promisify
var authPromisify = [
  'login', 'getUserInfo', 'authorize', 'getSetting', 'startRecord', 'stopRecord',
  'showModal', 'openSetting'
].reduce((acc, cur) => {
  acc[cur] = wxPromisify(wx[cur]);

  return acc;
}, {
  wxPromisify: wxPromisify
});

function get(key) {
  var scope = 'scope.' + key;
  return new Promise((authRes, authRej) => {
    authPromisify.getSetting().then(res => {
      if (res.authSetting[scope]) {
        authRes(true);
      } else {
        authPromisify.authorize({
          scope: scope
        }).then(suc => {
          authRes(suc);
        }, rej => {
          reGet(scope, authRes);
        })
      }
    })
  });
}

// 弹窗询问 
function reGet(scope, authRes) {
  authPromisify.showModal({
    title: '授权提醒',
    content: '拒绝授权会影响小程序的使用, 请点击重新授权',
    confirmText: '重新授权',
    showCancel: false
  }).then(() => {
    authPromisify.openSetting().then(() => {
      authPromisify.getSetting().then(res => {
        if (!res.authSetting[scope]) {
          setTimeout(() => {
            reGet(scope, authRes);
          }, 100);
        } else {
          authRes();
        }
      })
    });
  });
}

module.exports = {
  get
}