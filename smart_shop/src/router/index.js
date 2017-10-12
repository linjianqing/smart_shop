import Vue from 'vue'
import Router from 'vue-router'
import wx from 'weixin-js-sdk'

const Index = resolve => require(['@/HomePage'], resolve)
const CreateOrder = resolve => require(['@/pages/CreateOrder'], resolve) // 创建页面
const GoodsList = resolve => require(['@/pages/shopcart/index'], resolve) // 购物车界面
const scan = resolve => require(['@/pages/scan/ScanStart'], resolve) // 扫码界面
const ShopList = resolve => require(['@/pages/shopList/index'], resolve) // 商品列表
const City = resolve => require(['@/pages/city/index'], resolve) // 城市列表
const Payment = resolve => require(['@/pages/pay/Payment'], resolve) // 订单详情界面
const Comment = resolve => require(['@/pages/comment/commentPage'], resolve) // 星星界面
const commentDuplicted = resolve => require(['@/pages/comment/commentDuplicted'], resolve) // 订单界面
const NewDetail = resolve => require(['@/pages/NewDetail'], resolve) // 商品详情界面
const CommentList = resolve => require(['@/pages/CommentList'], resolve) // 评价列表
const userHomePage = resolve => require(['@/pages/userPage/userHomePage'], resolve) // 个人中心——主页
const userOrderList = resolve => require(['@/pages/userPage/userOrderList'], resolve) // 个人中心——订单页
const waitForComment = resolve => require(['@/pages/userPage/waitForComment'], resolve) // 个人中心——评论页
const ShopIndex = resolve => require(['@/pages/shop/ShopIndex'], resolve) // 店铺首页
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/createOrder',
    name: 'createOrder',
    component: CreateOrder
  }, {
    path: '/goodsList',
    name: 'goodsList',
    component: GoodsList
  }, {
    path: '/scan',
    name: 'scan',
    component: scan
  }, {
    path: '/Payment',
    name: 'Payment',
    component: Payment
  }, {
    path: '/comment',
    name: 'Comment',
    component: Comment
  }, {
    path: '/comment_duplicated',
    name: 'commentDuplicted',
    component: commentDuplicted
  }, {
    path: '/newDetail',
    name: 'newDetail',
    component: NewDetail
  }, {
    path: '/user_homepage',
    name: 'userHomePage',
    component: userHomePage
  }, {
    path: '/user_order_list',
    name: 'userOrderList',
    component: userOrderList
  }, {
    path: '/wait_for_comment',
    name: 'waitForComment',
    component: waitForComment
  }, {
    path: '/commentList',
    name: 'commentList',
    component: CommentList
  }, {
    path: '/shopIndex',
    name: 'shopIndex',
    component: ShopIndex
  }, {
    path: '/',
    name: 'index',
    component: Index,
    children: [{
      path: '/:city',
      name: 'shopList',
      component: ShopList
    }, {
      path: 'city',
      name: 'city',
      component: City
    }]
  }
  ]
})

router.beforeEach((to, from, next) => {
  console.info('to.path: ' + to.path)
  wx.hideAllNonBaseMenuItem()
  next()
})
export default router
