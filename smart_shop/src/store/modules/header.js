/**
 * Created by KatH on 7.2.002.
 */
import * as types from '../mutation-types'

const state = {
  wxOpenId: 0,
  tableId: 0,
  tableName: '',
  phone: '',
  orderId: '',
  logoUrl: '',
  logoRedirectUrl: ''
}

const getters = {
  wxOpenId: state => state.wxOpenId,
  tableId: state => state.tableId,
  phone: state => state.phone,
  tableName: state => state.tableName,
  orderId: state => state.orderId,
  logoUrl: state => state.logoUrl,
  logoRedirectUrl: state => state.logoRedirectUrl
}

const mutations = {
  [types.SET_WXOPEN_ID] (state, wxopenid) { state.wxOpenId = wxopenid },
  [types.SET_PHONE] (state, phone) { state.phone = phone },
  [types.SET_TABLE_ID] (state, tableId) { state.tableId = tableId },
  [types.SET_TABLE_NAME] (state, tableName) { state.tableName = tableName },
  [types.SET_ORDER_ID] (state, orderId) { state.orderId = orderId },
  [types.SET_LOGO_INFO] (state, logoInfo) {
    state.logoUrl = logoInfo.weixinBrandLogo
    state.logoRedirectUrl = logoInfo.weixinBrandUrl
  }
}

const actions = {
  setWXOpenid ({commit}, wxopenid) {
    commit(types.SET_WXOPEN_ID, wxopenid)
  },
  setTableId ({commit}, tableId) {
    commit(types.SET_TABLE_ID, tableId)
  },
  setPhone ({commit}, phone) {
    commit(types.SET_PHONE, phone)
  },
  setTableName ({commit}, tableName) {
    commit(types.SET_TABLE_NAME, tableName)
  },
  setOrderId ({commit}, orderId) {
    commit(types.SET_ORDER_ID, orderId)
  },
  setLogoInfo ({commit}, logoInfo) {
    commit(types.SET_LOGO_INFO, logoInfo)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
