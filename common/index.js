import { readOrientation, vaildImgType, compressImg } from './internal/lib/exif';
export { is, common, app } from './internal/utils';
export { awake } from './internal/lib/jsBridge';
export { buildtrack } from './internal/lib/track';
export { FetchApi } from './internal/lib/ajax';
export { Share } from './internal/lib/share';
export { buildUploadQiniu } from './internal/lib/qiniu';

/**
 * 压缩图片
 * @param {*} file 
 * @param {*} maxWidth 
 * @return {String} Base64
 */
export function tinyImg(file, maxWidth) {
  return vaildImgType(file).then(function (fileType) {
    return readOrientation(file).then(function (orientation) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          event.target.value = '';
          var base64 = reader.result.replace(/^.*?,/, '');
          var img = new Image();
          img.onload = function () {
            compressImg(img, orientation, maxWidth).then(function (canvas) {
              resolve(canvas.toDataURL('image/jpeg', 0.96));
            });
          };
          img.src = 'data:image/' + fileType + ';base64,' + base64;
        };
        reader.readAsDataURL(file);
      });
    });
  });
}