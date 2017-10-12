/** 工具类 **/

let util = {}
util.find = function (list, match) {
  for (let i of list) {
    let item = list[i]
    if (match(item)) { return list[i] }
  }
  return undefined
}
util.Math = {
  // 乘法
  mul (arg1, arg2) {
    let r1 = arg1.toString()
    let r2 = arg2.toString()
    let m
    let resultVal
    let d = arguments[2]
    m = (r1.split('.')[1] ? r1.split('.')[1].length : 0) + (r2.split('.')[1] ? r2.split('.')[1].length : 0)
    resultVal = Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  },
  div: function (arg1, arg2) {
    let r1 = arg1.toString()
    let r2 = arg2.toString()
    let m
    let resultVal
    let d = arguments[2]
    m = (r2.split('.')[1] ? r2.split('.')[1].length : 0) - (r1.split('.')[1] ? r1.split('.')[1].length : 0)
    resultVal = Number(r1.replace('.', '')) / Number(r2.replace('.', '')) * Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  },
  add: function (arg1, arg2) {
    arg1 = arg1.toString()
    arg2 = arg2.toString()
    let arg1Arr = arg1.split('.')
    let arg2Arr = arg2.split('.')
    let d1 = arg1Arr.length === 2 ? arg1Arr[1] : ''
    let d2 = arg2Arr.length === 2 ? arg2Arr[1] : ''
    let maxLen = Math.max(d1.length, d2.length)
    let m = Math.pow(10, maxLen)
    let result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen))
    let d = arguments[2]
    return typeof d === 'number' ? Number((result).toFixed(d)) : result
  },
  sub: function (arg1, arg2) {
    return this.add(arg1, -Number(arg2), arguments[2])
  }
}

util.each = function (obj, callback) {
  let i, len
  if (Array.isArray(obj)) {
    for (i = 0, len = obj.length; i < len; i++) {
      if (callback(obj[i], i, obj) === false) {
        break
      }
    }
  } else {
    for (i in obj) {
      if (callback(obj[i], i, obj) === false) {
        break
      }
    }
  }
  return obj
}

util.isWeixinBrowser = function () {
  const ua = navigator.userAgent.toLowerCase()
  return (/micromessenger/.test(ua))
}

util.combineByKey = function (arr, key) {
  return arr.reduce((pre, cur, index) => { return index === 0 ? cur[key] : pre + cur[key] }, '')
}
util.deepcopy = function (obj) {
  let temp = []
  for (let i in obj) {
    temp.push(obj[i])
  }
  return temp
}
export default util
