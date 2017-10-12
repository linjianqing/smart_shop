/**
 * Created by KatH on 7.2.002.
 */
import { SET_SHOP_DATA } from '../mutation-types'

const state = {
  goods: [],
  category: [],
  recommend: [],
  tastes: []
}

// getter
const getters = {
  goods: state => state.goods,
  category: state => state.category,
  recommend: state => state.recommend,
  tastes: state => state.tastes,
  // hack方法
  getGoodsById: (state) => (id) => {
    return state.goods.find(x => x.id === id)
  },
  getGoodsByCategory: (state) => (categoryId) => {
    return state.goods.filter(x => x.categoryId === categoryId)
  }
}

// mutations

const mutations = {
  [SET_SHOP_DATA] (state, {goods, category, recommend, tastes}) {
    // 0906这里过滤了一下isVisible
    state.goods = goods.filter(x => x.isVisible === 1)
    state.tastes = tastes || []
    state.recommend = recommend
    state.category = recommend.length ? [{id: 0, name: '推荐'}, ...category] : category
  }
}

// action
const actions = {
  setShopData ({commit}, shopData) {
    commit(SET_SHOP_DATA, shopData)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
