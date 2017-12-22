var wxPromisify = require('common.js').wxPromisify

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

function get(key, isforce) {
  var scope = 'scope.' + key;
  return new Promise((authRes, authRej) => {
    authPromisify.getSetting().then(res => {
      console.log(res)
      if (res.authSetting[scope]) {
        authRes(true);
      } else {
        console.log(scope)
        authPromisify.authorize({
          scope: scope
        }).then(suc => {
          authRes(suc);
        }, rej => {
          console.log('rej', rej)
          reGet(scope, authRes, isforce);
        })
      }
    })
  });
}

// 弹窗询问 
function reGet(scope, authRes, isforce) {
  authPromisify.showModal({
    title: '请在设置中打开用户信息授权',
    content: '未获取您的公开信息（昵称、头像等）将无法使用鼓励金和报名活动',
    confirmText: '去设置',
    showCancel: false
  }).then(() => {
    authPromisify.openSetting().then(() => {
      authPromisify.getSetting().then(res => {
        if (!res.authSetting[scope]) {
          if (isforce) {
            setTimeout(() => {
              reGet(scope, authRes, isforce);
            }, 100);
          }
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