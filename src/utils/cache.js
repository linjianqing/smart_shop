/**
 * Created by Janus on 2017/4/7.
 *
 * 简单的缓存模块, 会添加前缀，与 本地储存隔离
 * 默认超时为 60秒
 */

const PREFIX = 'WD_' // 前缀

function isInteger (obj) {
  return typeof obj === 'number' && obj % 1 === 0
}

function set (key, data, timeout) {
  let now = Math.round(new Date().getTime() / 1000)
  if (!timeout) {
    timeout = 60
  } else if (!isInteger(timeout)) {
    throw new Error('timeout必须为整数')
  }
  let jsonData = {'data': data, 'timeout': now + timeout}
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(jsonData))
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.log('已经超出本地存储限定大小！')
      localStorage.clear()
      localStorage.setItem(PREFIX + key, JSON.stringify(jsonData))
    }
  }
}

function del (key) {
  localStorage.removeItem(PREFIX + key)
}

function get (key, defaultValue) {
  let value = localStorage.getItem(PREFIX + key)
  console.log('value: ' + value)
  if (!value) return defaultValue
  try {
    value = JSON.parse(value)
  } catch (e) {
    console.error('load cache error, return default value')
    return defaultValue
  }

  if (!value.timeout || !value.data) {
    return defaultValue
  }
  let now = Math.round(new Date().getTime() / 1000)
  if (value.timeout < now) {
    del(key)
    return defaultValue
  }

  return value.data
}

function ttl (key) {
  let value = localStorage.getItem(PREFIX + key)
  if (!value) return 0
  try {
    value = JSON.parse(value)
  } catch (e) {
    console.error('load cache error, return default value')
    return 0
  }
  if (!value.timeout || !value.data) return 0
  let now = Math.round(new Date().getTime() / 1000)
  if (value.timeout < now) {
    del(key)
    return 0
  }
  return value.timeout - now
}

export default {
  get: get,
  del: del,
  set: set,
  ttl: ttl
}
