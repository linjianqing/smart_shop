import CartBottom from '../components/shopcart/cartbottom.vue'

const install = function (Vue) {
  if (install.installed) return
  Vue.component('CartBottom', CartBottom)
}

// auto install 处理底部异常
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default {
  install,
  version: '1.0.0'
}
