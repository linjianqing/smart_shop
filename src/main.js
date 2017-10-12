// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import VueResource from 'vue-resource'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
import Filters from './components/filters'
import yunnexDialog from 'yunnexDialog'
import App from './App.vue'
import wx from 'weixin-js-sdk'
import 'lib-flexible'
import 'normalize.css'
// import vconsole from 'vconsole'
// Vue.use(vconsole)

Vue.config.productionTip = false

// 请求封装
Vue.prototype.$wx = wx
Vue.prototype.$yunnexDialog = yunnexDialog

Vue.use(Filters)
Vue.use(VueResource)
Vue.use(infiniteScroll)

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  attempt: 1,
  listenEvents: ['scroll', 'touchmove', 'wheel', 'mousewheel']
})
Vue.http.options.emulateJSON = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})
