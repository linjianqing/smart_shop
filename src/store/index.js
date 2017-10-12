import Vue from 'vue'
import Vuex from 'vuex'

import cart from './modules/cart'
import shop from './modules/shop'
import menu from './modules/menu'
import header from './modules/header'
import city from './modules/city'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    cart,
    shop,
    menu,
    header,
    city
  },
  strict: debug
})
