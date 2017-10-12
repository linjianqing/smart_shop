/**
 * Created by KatH on 7.8.008.
 * 这个是排队的时候需要用到的接口
 */
import * as types from '../mutation-types'
const state = {
  cityId: 0,
  fatherId: 0,
  cityName: '',
  cityList: [],
  vagueShopBranchName: ''
}

const getters = {
  cityId: state => state.cityId,
  cityName: state => state.cityName,
  cityList: state => state.cityList,
  fatherId: state => state.fatherId,
  vagueShopBranchName: state => state.vagueShopBranchName

}

const mutations = {
  [types.SET_CITY_ID] (state, cityId) { state.cityId = cityId },
  [types.SET_FATHER_CITY_ID] (state, fatherId) { state.fatherId = fatherId },
  [types.SET_CITY_NAME] (state, cityName) { state.cityName = cityName },
  [types.SET_CITY_LIST] (state, cityList) { state.cityList = cityList },
  [types.SET_VAGUESHOPBRANCHNAME] (state, vagueShopBranchName) { state.vagueShopBranchName = vagueShopBranchName }
}
const actions = {
  setCityId ({commit}, cityId) {
    commit(types.SET_CITY_ID, cityId)
  },
  setFatherId ({commit}, fatherId) {
    commit(types.SET_FATHER_CITY_ID, fatherId)
  },
  setCityName ({commit}, cityName) {
    commit(types.SET_CITY_NAME, cityName)
  },
  setCityList ({commit}, cityList) {
    commit(types.SET_CITY_LIST, cityList)
  },
  setVagueShopBranchName ({commit}, vagueShopBranchName) {
    commit(types.SET_VAGUESHOPBRANCHNAME, vagueShopBranchName)
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
