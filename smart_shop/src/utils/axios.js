/**
 * Created by KatH on 6.28.028.
 */

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 5000
// code状态码200判断
axios.interceptors.response.use((res) => {
  console.info(res)
  let retCode = res.data.code
  if (retCode === 100008) {
    console.info('登录授权过期或者没有权限操作')
    return Promise.reject(res)
  } else if (retCode && retCode !== 0) {
    // 有可能一些外部接口没有返回code，这里兼容一下
    let errMsg = res.data.message || '返回数据有误'
    console.info(errMsg)
    return Promise.reject(res)
  }
  return res
}, (error) => {
  console.log('promise error:' + error)
  return Promise.reject(error)
})
export default axios
