import * as types from '../mutation-types'

// 这里是存商店的基本配置，/config/get_config_info
const state = {
  baseUrl: '/wxcanyin',
  // prefix: '/saofu-mobile',    // zhcttest那个开发环境要换成这个 zhcttest.zb25.cn/saofu-mobile/smart_shop/xxxxx
  prefix: '',                    // 除了zhcttest那个开发环境其他都要这个
  shopApi: {
    // 门店列表
    'getShopList': '/smart_shop/getShopList',   // 首页获取门店列表
    'getCityList': '/smart_shop/getCityList',   // 首页获取城市列表
    // 点餐页
    'getShopInfo': '/config/get_config_info',
    'getMenuList': '/menu/menu_list',
    'createCart': '/shopping_cart/create',      // 商品从0到1的时候调的是这个
    'delAllCart': '/shopping_cart/del_all',
    'delBatchCart': '/shopping_cart/del_batch',
    'updateAmount': '/shopping_cart/update_amount',
    'updateTable': '/shopping_cart/update_table',
    'queryList': '/shopping_cart/query_list',
    'postOrder': '/order/post',
    'createOrder': '/orders/creater_order',
    'orderInfo': '/orders/order_info',
    'cancelOrder': '/cancel/order',
    'post': '/order/post',                  // 提交订单
    'payResult': '/pay/result',
    'addGoods': '/orders/add_goods',
    'getOrderId': '/orders/active_order',     // 这个是通过openid来查这个用户有没有未结账的订单,
    'getPackageInfo': '/goods/get_package_goods_dtl',  // 拉取套餐信息
    // 以下的接口不需要带前缀，使用的时候（getUrl）记得加false
    'getBasicInfo': '/smart_shop/get_shop_base_info',   // 获取单个门店的信息
    'getPhoneNum': '/smart_shop/get_phone_num',
    'sendSms': '/smart_shop/send_sms',
    'validateCode': '/smart_shop/validate_code',
    'getJSAPI': '/smart_shop/getJSAPI',
    'xiaoerQRCode': '/wxmarketing/qrcode/bind_xiaoer',
    'shopSerialAndId': '/smart_shop/shop_serial_id',
    'weixinPay': '/order/post',  // 先付款专用
    // 评论相关接口
    'getCommentGood': '/comment/order_goods',   // 获取需要评价的商品列表（不同口味的同一商品会被当成一个来看待）
    'getCommentConfig': '/comment/get_config',   // 获取评论设置
    'saveComment': '/comment/save_comment',       // 发送评论
    'getGoodsComment': '/comment/goods_info',      // 单个菜品信息+评价
    'getCommentList': '/comment/list', // 评价列表
    // 个人中心接口
    'getWXUserInfo': '/smart_shop/get_wx_user_info',        // 获取微信头像和昵称
    'getMemberStatus': '/smart_shop/get_member_status',      // 获取当前会员的状态
    'getUserCenterInfo': '/smart_shop/get_user_center_info', // 获取个人中心头部接口的基本信息（积分，优惠啥的）
    'getUnifiedOrder': '/smart_shop/get_unified_order',      // 获取统一订单
    'getCoupon': '/smart_shop/get_coupon_list',               // 获取该用户的优惠券
    'getUncommentOrder': '/smart_shop/get_uncomment_list', // 获取未评论
    'getCardSerial': '/smart_shop/get_cardSerial',         // 获取cardSerial 跳转用
    // 商铺首页接口
    'shopHome': '/wxmarketing/canyin/xiaoer/home', // 首页信息拉取
    'receiveCoupon': '/wxmarketing/canyin/xiaoer/receive_coupons', // 领取优惠券
    'callWaiter': '/wxmarketing/canyin/xiaoer/call_waiter', // 呼叫店员
    'xiaoerCommentList': '/xiaoer/comment/list',
    // 全局导航和弹窗广告接口
    'getGlobalNav': '/wxmarketing/canyin/xiaoer/navigation',
    'popupBanner': '/wxmarketing/canyin/xiaoer/banner',
    // 营销公告
    'getNotice': '/cmpaign/announcement',
    // 门店列表星数评价
    'shopStar': '/smart_shop/bulk_shop_rating',
    // 购物车优惠
    'cartCoupon': '/cmpaign/preferential',
    // 后面加的通过orderId获取该订单的branchId（获取其他门店的订单信息）
    'newGetOrderInfo': '/orders/orders_info'
  },

  latitude: 0,
  longitude: 0,
  shopSerial: 0,
  branchId: 0,
  // 这里经常出现businessType读不到的问题，试一下把shopinfo的东西拆出来存
  shopsInfo: {},
  announce: '',
  businessType: 0,
  displayType: 0,
  payType: 0,
  goodsScrollTop: 0
}

// getters
const getters = {
  getUrl: state => (urlKey, withPrefix = true) => {
    let tmpList = []
    for (let i of ['shopSerial', 'branchId']) {
      let val = state[i]
      if (val) {
        tmpList.push(`${i}=${val}`)
      }
    }
    let subfix = tmpList.length ? `?${tmpList.join('&')}` : ''
    let path = state.shopApi[urlKey]
    if (path) {
      if (withPrefix) {
        return `${state.prefix}${state.baseUrl}${path}${subfix}`
      } else {
        return `${state.prefix}${path}${subfix}`
      }
    }
  },
  getBaseUrl: state => state.prefix + state.baseUrl,
  getShopBranch: state => state.prefix + state.shopApi.shopSerialAndId,
  getShopApi: state => state.shopApi,
  shopSerial: state => state.shopSerial,
  branchId: state => state.branchId,
  shopInfo: state => state.shopsInfo,
  latitude: state => state.latitude,
  longitude: state => state.longitude,
  announce: state => state.announce,
  businessType: state => state.businessType,
  displayType: state => state.displayType,
  payType: state => state.payType,
  goodsScrollTop: state => state.goodsScrollTop,
  orderStatus: state => state.orderStatus
}

// actions
const actions = {
  setShopSerial ({commit}, shopSerial) {
    commit(types.SET_SHOP_SERIAL, shopSerial)
  },
  setBranchId ({commit}, branchId) {
    commit(types.SET_BRANCH_ID, branchId)
  },
  setShopInfo ({commit}, shop) {
    commit(types.SET_SHOP_INFO, shop)
  },
  setLocation ({commit}, {longitude, latitude}) {
    commit(types.SET_LOCATION, {longitude, latitude})
  },
  setGoodsScrollTop ({commit}, scrollTop) {
    commit(types.SET_GOODS_SCROLL_TOP, scrollTop)
  }
}

// mutations
const mutations = {
  [types.SET_SHOP_SERIAL] (state, shopSerial) { state.shopSerial = shopSerial },
  [types.SET_BRANCH_ID] (state, branchid) { state.branchId = branchid },
  [types.SET_SHOP_INFO] (state, shopInfo) {
    if (!shopInfo) return
    state.shopsInfo = shopInfo
    state.announce = shopInfo.announce
    state.businessType = shopInfo.businessType
    state.displayType = shopInfo.displayType
    state.payType = shopInfo.payType
    state.diancanConfig = shopInfo.diancanConfig
  },
  [types.SET_LOCATION] (state, {longitude, latitude}) {
    state.longitude = longitude
    state.latitude = latitude
  },
  [types.SET_GOODS_SCROLL_TOP] (state, scrollTop) {
    state.goodsScrollTop = scrollTop
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
