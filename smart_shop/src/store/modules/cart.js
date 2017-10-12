/**
 * Created by Janus on 2017/4/1.
 */
import * as types from '../mutation-types'
import $utils from '../../utils'
import shop from '../modules/shop'

const state = {
  goodsList: [], // 购物车
  shopId: 1,
  remark: '',
  inputNumber: 0,
  nextLevelCampaign: {},
  // false为非会员， true其他都是为会员
  memberStatus: false,
  customerId: 0,
  noticeInfo: []
}

// getters
const getters = {
  allGoods: state => state.goodsList,
  goodsCount: state => {
    let temp = 0
    for (let i of state.goodsList) {
      temp += i.quantity
    }
    return temp
  },
  allPrice: state => {
    let sum = 0
    // priceType 1 常态 2 特价 3会员
    state.goodsList.forEach(function (i) {
      let addPrice
      if (state.memberStatus || i.priceType === 2) {
        addPrice = i.price
      } else {
        addPrice = i.originalPrice
      }
      sum += $utils.Math.mul(addPrice, i.quantity, 2)
    })
    return sum
  },
  getCartGoodsById: (state) => (id) => {
    return state.goodsList.filter(x => x.id === id)
  },
  getCartGoodsByCategory: (state) => (categoryId) => {
    return state.goodsList.filter(x => x.categoryId === categoryId)
  },
  remarks: state => state.remark,
  peoples: state => state.inputNumber,
  nextLevelCampaign: state => state.nextLevelCampaign,
  memberStatus: state => state.memberStatus,
  customerId: state => state.customerId,
  noticeInfo: state => state.noticeInfo
}

// actions
const actions = {
  addToCart ({commit}, {products, id}) {
    commit(types.ADD_TO_CART, {products, id})
  },
  reduceFromCart ({commit}, products) {
    commit(types.REDUCE_FROM_CART, products)
  },
  clearAllCart ({commit}, shopData) {
    commit(types.CLEAR_CART, shopData)
  },
  setRemark ({commit}, remark) {
    commit(types.SET_INPUT_REMART, remark)
  },
  setInputNumber ({commit}, people) {
    commit(types.SET_INPUT_NUMBER, people)
  },
  setNextLevelCampaign ({commit}, campaign) {
    commit(types.SET_NEXT_CAMPAIGN, campaign)
  },
  setMemberStatus ({commit}, memberStatus) {
    commit(types.SET_MEMBER_STATUS, memberStatus)
  },
  setNoticeInfo ({commit}, notice) {
    commit(types.SET_NOTICE_INFO, notice)
  },
  setResultMemberStatus ({commit}, memberStatus) {
    commit(types.SET_MEMBER_RESULT_STATUS, memberStatus)
  }
}

// mutations
const mutations = {
  /* 添加商品 */
  [types.ADD_TO_CART] (state, {products, id}) {
    // 分两次过滤提升一点点性能
    let itemList = state.goodsList.filter(x => x.id === products.id)
    if (itemList) {
      let item
      if (products.isPackage) {
        item = itemList.find(x => JSON.stringify(x.packageGoods) === JSON.stringify(products.packageGoods))
      } else {
        item = itemList.find(x => JSON.stringify(x.productAttrsList) === JSON.stringify(products.productAttrsList) && JSON.stringify(x.tastes) === JSON.stringify(products.tastes))
      }
      if (item) {
        item.quantity++
        return 0
      }
    }
    // 后付款模式没有原价 前端处理
    let originalPrice = (shop.state.payType === 0 ? products.price : products.originalPrice)
    let importGoods = {
      id: products.id,
      name: !products.name ? products.productName : products.name, //  购物车列表
      price: products.price,
      categoryId: products.categoryId,
      productAttrsList: products.productAttrsList || [],  //  购物车列表
      quantity: !products.amount ? 1 : products.amount,  //  购物车列表
      goodsId: id,
      unit: products.unit,
      originalPrice: originalPrice,
      priceType: products.priceType,
      isPackage: products.isPackage
    }
    if (products.isPackage) {
      importGoods['packageGoods'] = products.packageGoods
      importGoods['tastes'] = products.tastes || []
    }
    if (products.tastes) {
      importGoods['tastes'] = products.tastes
    }
    state.goodsList.push(importGoods)
  },
  /* 减少商品 */
  [types.REDUCE_FROM_CART] (state, goods) {
    let item = state.goodsList.find(x => x.goodsId === goods.goodsId)
    if (item.quantity > 1) {
      item.quantity--
    } else {
      state.goodsList.splice(state.goodsList.indexOf(item), 1)
    }
  },
  [types.CLEAR_CART] (state) {
    state.goodsList = []
  },
  [types.SET_INPUT_REMART] (state, remark) {
    state.remark = remark
  },
  [types.SET_INPUT_NUMBER] (state, inputNumber) {
    state.inputNumber = inputNumber
  },
  [types.SET_NEXT_CAMPAIGN] (state, campaign) {
    state.nextLevelCampaign = campaign
  },
  [types.SET_MEMBER_STATUS] (state, response) {
    state.memberStatus = response.memberStatus
    state.customerId = response.customerId
  },
  [types.SET_NOTICE_INFO] (state, notice) {
    state.noticeInfo = notice
  },
  [types.SET_MEMBER_RESULT_STATUS] (state, status) {
    state.memberStatus = status
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
