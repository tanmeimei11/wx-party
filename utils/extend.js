var type = obj => {
  return obj == null ? String(obj) : "object"
}
var isPlainObject = obj => {
  return type(obj) == "object" && Object.getPrototypeOf(obj) == Object.prototype
}
var isArray = Array.isArray ||
  function (object) {
    return object instanceof Array
  }
var slice = [].slice

function extend(target, source, deep) {
  for (let key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {}
      if (isArray(source[key]) && !isArray(target[key]))
        target[key] = []
      extend(target[key], source[key], deep)
    }
  else if (source[key] !== undefined) target[key] = source[key]
}

var extendAll = function (target) {
  var deep = true;
  var args = slice.call(arguments, 1);
  console.log(target, args, deep)
  args.forEach(function (arg) {
    extend(target, arg, deep)
  })
  return target
}
module.exports = extendAll