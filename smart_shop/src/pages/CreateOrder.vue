<template>
  <div>
    <div class="content" ref="content">
      <div class="header_wrap" ref="headerHeight">
        <div class="table" v-if="isShow">
          <div class="img-table"></div>
          <span class="num">用餐桌号：{{tableNameInfo}}</span>
        </div>
        <div class="table" v-else @click="bindPhone">
          <div class="img-phone"></div>
          <div class="phone">手机号：<span>{{phone ? phone : '请输入联系电话'}}</span></div>
          <div class="img-bind"></div>
        </div>
        <div class="table_number" v-if="!orderId">
          <div class="user_people">
            <div class="img-people"></div>
            <span class="numberPeople">用餐人数：</span>
            <input class="inputPeople" type="tel"  autofocus="autofocus"  pattern="[0-9]*" v-model="inputValue" placeholder="请输入用餐人数" ref="inputNumber"
                   maxlength="3"/>
          </div>
        </div>
      </div>
      <div class="detail_wrap" ref="detailDashHeight">
        <span class="detail">已点{{ dishTotal }}个菜品</span>
      </div>
      <div ref="itemHeight">
        <order-item v-for="(item,index) in orderList" :key="item.id" :items="item"></order-item>
      </div>
      <div class="give_dash_wrap" v-show="cySpecialGoods && cySpecialGoods.length > 0" ref="giveDashHeight">
        <div class="content_wrap">
          <div class="give_img"></div>
          <div class="give_content">{{campContent}}</div>
        </div>
        <order-item v-for="(item,index) in cySpecialGoods" :key="item.id" :items="item"></order-item>
      </div>
      <div class="shop_activity_wrap" ref="couponHeight">
        <div class="shop_activity">店铺优惠</div>
        <div class="activity_img"></div>
        <div class="activity_content" @click="openChoice">{{showCouponContent}}</div>
      </div>
      <div class="line_wrap">
        <div class="left_round"></div>
        <div class="middle_line"></div>
        <div class="right_round"></div>
      </div>
      <div class="price_wrap" ref="wrapHeight">
        <ul class="bottom-wrap">
          <li class="price-item">
            <span class="directory_price">菜品小计:</span>
            <span class="show-price">¥{{allGoodsPrice | price}}</span>
          </li>
          <li class="middle-item" v-if="chaWeiFei != 0">
            <span class="directory_price">茶位费:</span>
            <span class="show-price">+¥{{chaWeiFei | price}}</span>
          </li>
          <li class="bottom-item" v-show="showCouponPrice">
            <span class="directory_price">{{showCouponType}}:</span>
            <span class="show-price">-¥{{showCouponPrice | price}}</span>
          </li>
          <li class="total_wrap">
            <div class="total_price">合计:<span>¥{{allPrice | price}}</span></div>
          </li>
        </ul>
      </div>
      <div class="input_wrap" ref="remarkHeight">
        <div class="remark_wrap">备注:</div>
        <input class="remark" type="num" placeholder="口味偏好要求" v-model="remark" maxlength="20">
      </div>
      <yunnex-info :style="yunnex_info" ref="yunnex"></yunnex-info>
    </div>
    <Bottom :class="showBottom?'hasKb':'noKb'" ref="bottom" @uploadOrder="uploadOrder" @goBack="goBack" ></Bottom>
    <BindPhone v-if="showBindDialog" @cancel="cancel" @confirm="confirm"></BindPhone>
    <ToastShow v-show="toasting" :content="content"></ToastShow>
    <Loading v-if="isLoading"></Loading>
    <choice-coupon v-show="isShowCoupon" @closeShowCoupon="closeShowCoupon" :items="couponAvailables"
                   :index="currentIndex" v-if="couponAvailables && couponAvailables.length > 0"></choice-coupon>
    <pay-give-food v-if="isShowGiveFoodTip" @cancelPay="isShowGiveFoodTip=false"
                   @confirmPay="confirmPay"></pay-give-food>

  </div>
</template>

<script>
  import Bottom from '../components/updateorder/Bottom'
  import BindPhone from '../components/common/CheckPhone'
  import ToastShow from '../components/common/ToastShow'
  import Loading from '../components/common/Loading'
  import YunnexInfo from '../components/common/YunnnexInfo'
  import OrderItem from '../components/createOrder/orderItem.vue'
  import ChoiceCoupon from '../components/createOrder/ChoiceCoupon.vue'
  import utils from '../utils/index'
  import PayGiveFood from '../components/common/PayGiveFoodDialog.vue'
  import $cache from './../utils/cache'

  export default {
    data () {
      return {
        coupon_status: {
          1: '优惠活动', // 满减满折
          2: '赠送菜',
          3: '限时物价',
          4: '优惠劵'
        },
        orderList: [],
        inputValue: '',
        showBindDialog: false,
        toasting: false,
        content: '',
        isLoading: false,
        remark: '',
        teaFee: '',
        showBottom: false,       // 底部的按钮是不是显示（处理键盘弹出的时候）
        originHeight: 0, // 源高度
        screenHeight: 0,  // 动态变化高度
        isDetail: false,  // 详情界面是单面，来自详情全部返回主界面，避免白屏
        isBottomHeight: 0, // 底部高度
        isFixBottomHeight: 0, // logo适应的动态高度
        isShowCoupon: false,
        nextLevelCampaign: [],
        isChoiceCoupon: {},
        campContent: '',
        couponAvailables: [],
        cySpecialGoods: [],
        currentIndex: 0,
        showCouponContent: '无可用优惠劵',
        shoppingCartGoodsVos: [],
        autoHeight: 0,  //  高度计算
        wrapHeight: 0,  // 动态变化
        phone: this.$store.getters.phone,
        isShowGiveFoodTip: false,
        tableId: this.$store.getters.tableId,
        tableName: this.$store.getters.tableName,
        isShow: this.$store.getters.businessType === 0
      }
    },
    watch: {
      '$route' (to, from) {
        if (from.name === 'Payment') {
          this.$router.push({name: 'index'})
        } else if (from.name === null) {
          this.isLoading = false
          $cache.set('needBack', true, 60)
          this.$router.push({name: 'index'})
        }
      },
      inputValue: function (val) {
        this.$store.dispatch('setInputNumber', this.inputValue)
        if (!val) {
          return
        }
        if (!this.checkNumber(val)) {
          this.content = '请输入数字'
          this.toasting = true
          setTimeout(() => {
            this.toasting = false
          }, 3000)
          this.inputValue = val.replace(/[^0-9]/ig, '')
        }
        return this.inputValue
      },
      remark: function (val) {
        this.$store.dispatch('setRemark', val)
        return val
      },
      screenHeight (val) {
        this.showBottom = val < this.originHeight
      }
    },
    created () {
      this.queryList()
      this.getPhoneNum()  // 设置电话
    },
    mounted () {
      this.$nextTick(function () {
        if (this.$refs.bottom) {
          this.originHeight = this.$refs.bottom.$el.offsetTop
          this.screenHeight = this.$refs.bottom.$el.offsetTop
          this.isBottomHeight = this.$refs.bottom.$el.clientHeight
        }
      })
      window.onresize = () => {
        return (() => {
          this.screenHeight = this.$refs.bottom ? this.$refs.bottom.$el.offsetTop : 0
        })()
      }
      window.onpageshow = function (event) {  // ios 专用,每次加载页面时触发
        $cache.set('needBack', true, 60)
        location.reload()
      }
    },
    updated () {
      this.$nextTick(function () {
        this.wrapHeight = this.$refs.wrapHeight ? this.$refs.wrapHeight.clientHeight : 0
        this.isFixBottomHeight = window.innerHeight - this.autoHeight - this.wrapHeight
      })
    },
    deactivated () {
      this.$destroy(true)
    },
    computed: {
      showCouponPrice () {
        // 没劵返回0  有劵且金额小于0时也返回0
        if (!this.isChoiceCoupon || (this.isChoiceCoupon && this.isChoiceCoupon.deductibleAmount < 0)) {
          return 0
        }
        return this.isChoiceCoupon.deductibleAmount
      },
      showCouponType () {
        if (!this.isChoiceCoupon) return
        return this.coupon_status[this.isChoiceCoupon.discountType]
      },
      allGoodsPrice () {
        return this.$store.getters.allPrice
      },
      chaWeiFei () {
        if (this.inputValue && this.teaFee) {
          return utils.Math.mul(this.teaFee, this.inputValue)
        } else {
          return 0
        }
      },
      allPrice () {
        let allGoodsPrice = this.$store.getters.allPrice
        let payFee = utils.Math.add(allGoodsPrice, this.chaWeiFei)
        if (this.isChoiceCoupon && this.isChoiceCoupon.deductibleAmount) {
          payFee -= this.isChoiceCoupon.deductibleAmount
        }
        if (payFee <= 0) {
          payFee = 0
        }
        return payFee
      },
      yunnex_info () {
        return this.isFixBottomHeight > 0 ? {
          'position': 'fixed',
          'bottom': this.isBottomHeight + 'px'
        } : {}
      },
      shopSerial () {
        return this.$store.getters.shopSerial
      },
      branchId () {
        return this.$store.getters.branchId
      },
      orderId () {
        return this.$store.getters.orderId
      },
      tableNameInfo () {
        if (this.tableId !== 0 && this.$store.getters.businessType === 0) {
          return this.tableName
        } else {
          return this.tableId
        }
      },
      dishTotal () {
        let temp = 0
        for (let i of this.orderList) {
          temp += i.amount
        }
        return temp
      }
    },
    methods: {
      confirmPay () {
        this.isShowGiveFoodTip = false
        this.toPay()
      },
      compare (property) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          return value1 - value2
        }
      },
      domHeight: function () {
        this.$nextTick(function () {
          let headerHeight = this.$refs.headerHeight ? this.$refs.headerHeight.clientHeight : 0
          let detailDashHeight = this.$refs.detailDashHeight ? this.$refs.detailDashHeight.clientHeight : 0
          let couponHeight = this.$refs.couponHeight ? this.$refs.couponHeight.clientHeight : 0
          let remarkHeight = this.$refs.remarkHeight ? this.$refs.remarkHeight.clientHeight : 0
          let logoHeight = this.$refs.yunnex ? this.$refs.yunnex.$el.clientHeight : 0
          let itemHeight = this.$refs.itemHeight ? this.$refs.itemHeight.clientHeight : 0
          let giveDashHeight = this.$refs.giveDashHeight ? this.$refs.giveDashHeight.clientHeight : 0
          this.isBottomHeight = this.$refs.bottom ? this.$refs.bottom.$el.clientHeight : 0
          this.autoHeight = headerHeight + detailDashHeight + couponHeight + remarkHeight + (logoHeight * 2) + itemHeight + giveDashHeight + this.isBottomHeight
        })
      },
      getCouponInfo (goods, nextLevelCampaign) {
        let items = []
        for (let i of goods) {
          items.push({
            shoppingId: i.shoppingId,
            goodsId: i.goodsId,
            amount: i.amount
          })
        }
        let data = {
          cyGoodsItemRequests: items
        }
        console.info(data)
        this.$http.post(this.$store.getters.getUrl('cartCoupon'), data).then((res) => {
          console.info(res)
          let result = res.data
          this.isLoading = false
          this.orderList = goods
          if (result.code === 0) {
            // 集成活动与卡劵列表
            // 2 赠菜 4是卡劵 （需集成活动与卡劵列表）
            let resp = result.response
            if (!resp) return
            if (resp.cyGivingGoods && resp.cyGivingGoods.length > 0) {
              this.campContent = result.response.cyGivingGoods[0].campContent
              this.cySpecialGoods = result.response.cyGivingGoods
            }
            this.shoppingCartGoodsVos = result.response.shoppingCartGoodsVos
            // 集成活动数据
            // 组装 活动
            if (resp.cyCampaignFull) {
              this.couponAvailables.push({
                id: '',
                title: resp.cyCampaignFull.discountName,
                deductibleAmount: resp.cyCampaignFull.discountFee,
                couponCode: '',
                discountType: 1,
                campCardezId: resp.cyCampaignFull.campCardezId
              })
            }
            if (resp.couponAvailables && resp.couponAvailables.length > 0) {
              // 组装 卡劵
              for (let i of resp.couponAvailables) {
                this.couponAvailables.push({
                  id: i.id,
                  title: i.title,
                  deductibleAmount: i.deductibleAmount,
                  couponCode: i.couponCode,
                  discountType: 4,
                  campCardezId: ''
                })
              }
            }
            if (this.couponAvailables && this.couponAvailables.length > 0) {
              // 再添加第一条与排序
              let _temp = {title: '不使用优惠', deductibleAmount: -100}
              this.couponAvailables.unshift(_temp)
              this.couponAvailables.sort(this.compare('deductibleAmount'))
              this.isChoiceCoupon = this.couponAvailables.length > 0 ? this.couponAvailables[this.couponAvailables.length - 1] : ''
              this.showCouponContent = this.isChoiceCoupon.title
              this.currentIndex = this.couponAvailables.length - 1
            }
            // 高度
            this.domHeight()
          } else {
            this.toastView(result.message)
          }
        })
      },
      openChoice () {
        if (this.couponAvailables.length > 0) {
          this.isShowCoupon = true
        } else {
          this.toastView('无可用优惠劵')
        }
      },
      closeShowCoupon (data, index) {
        this.currentIndex = index
        this.isShowCoupon = false
        if (!data) return
        if (data.deductibleAmount < 0) {
          this.isChoiceCoupon = ''
        } else {
          this.isChoiceCoupon = data
        }
        this.showCouponContent = data.title
      },
      goBack () {
        if (this.isDetail) {
          this.$router.push({name: 'index'})
        } else {
          this.$router.go(-1)
        }
      },
      checkNumber (isNumber) {
        return (/^[1-9]\d*$/.test(isNumber))
      },
      confirm () {
        this.showBindDialog = false
      },
      cancel (data) {
        if (data) {
          this.phone = data
        }
        this.showBindDialog = false
      },
      createOrder: function () {
        //        '下单模式 0  正餐 1 快餐 默认0',
        let type = this.$store.getters.businessType
        let data
        let shoppingId = []
        let tempGoods = []
        // 过滤特价商品
        for (let i of this.orderList) {
          if (i.priceType === 3 || i.priceType === 1) {
            tempGoods.push(i)
          } else if (i.priceType === 2) {
            let shoppingCart = this.shoppingCartGoodsVos.find(x => x.goodsId === i.goodsId)
            i['campBaseBizId'] = shoppingCart.campCardezId
            tempGoods.push(i)
          }
        }
        for (let i of tempGoods) {
          shoppingId.push(i.shoppingId)
        }
        if (type === 0) {
          let table = {
            id: this.tableId,
            people: this.inputValue,
            name: this.tableName
          }
          data = {
            type: 1, /* 订单类型 1 堂食 3快餐 */
            remark: this.remark,
            goods: tempGoods,
            table: table,
            shoppingId: shoppingId
          }
        } else {
          let fast = {
            people: this.inputValue,
            remark: this.remark
          }
          data = {
            type: 3, /* 订单类型 1 堂食 3快餐 */
            remark: this.remark,
            goods: tempGoods,
            fast: fast,
            shoppingId: shoppingId,
            customerPhone: this.phone
          }
        }
        if (this.isChoiceCoupon && this.isChoiceCoupon.discountType) {
          let campaignType = this.isChoiceCoupon.discountType // 卡劵类型为4
          let couponsId = this.isChoiceCoupon.id
          let couponsCode = this.isChoiceCoupon.couponCode
          data['campaignType'] = campaignType
          if (couponsId) {
            data['couponsId'] = couponsId
          }
          if (couponsCode) {
            data['couponsCode'] = couponsCode
          }
        }
        return data
      },
      toastView: function (msg) {
        this.content = msg
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      goPayIndex: function (orderId) {
        // 清掉订单号
        this.$store.dispatch('setTableId', '')
        this.$store.dispatch('clearAllCart')
        this.$router.push({
          name: 'Payment',
          query: {orderId: orderId}
        })
      },
      requestAddGood: function (orderId) {
        let shoppingId = []
        let tempGoods = []
        for (let i of this.orderList) {
          if (i.priceType === 3 || i.priceType === 1) {
            tempGoods.push(i)
          } else if (i.priceType === 2) {
            let shoppingCart = this.shoppingCartGoodsVos.find(x => x.goodsId === i.goodsId)
            i['campBaseBizId'] = shoppingCart.campCardezId
            tempGoods.push(i)
          }
        }
        for (let i of tempGoods) {
          shoppingId.push(i.shoppingId)
        }
        let data = {
          orderId: orderId,
          goods: tempGoods,
          shoppingId: shoppingId,
          remark: this.remark
        }
        return data
      },
      addFood: function (orderId) {
        let data = this.requestAddGood(orderId)
        console.table(data)
        this.$http.post(this.$store.getters.getUrl('addGoods'), data).then((res) => {
          console.info(res)
          this.isLoading = false
          if (res.data.code !== 0) {
            this.toastView(res.data.message)
          } else {
            //              提交成功,并清空购物车
            this.goPayIndex(orderId)
          }
        })
      },
      ToPayOrOrderDetail: function () {
        let data = this.createOrder()
        console.info('---------request---------')
        console.info(data)
        //        console.info(JSON.stringify(data))
        this.$http.post(this.$store.getters.getUrl('createOrder'), data).then((res) => {
          console.info(res)
          this.isLoading = false
          if (res.data.code !== 0) {
            this.toastView(res.data.message)
          } else {
            let orderId = res.data.response.orderId
            //              提交成功,并清空购物车
            //            payType  0 后付款  1 先付款
            //             不需要付款的订单在下单后进入订单详情页
            //             需要付款的订单在下单后直接跳转至统一结账页面
            //            快餐是必须要去付款的
            //            正餐分为先付款和后付款，先付款的没有加菜
            //         businessType   0  正餐 1 快餐
            let payType = this.$store.getters.payType
            let businessType = this.$store.getters.businessType
            if (businessType === 1 || (payType === 1 && businessType === 0)) {
              this.weixinPay(orderId)
            } else {
              this.goPayIndex(orderId)
            }
          }
        })
      },
      weixinPay (orderId) {
        // 茶位费与商品总共金额
        let data = {
          orderId: orderId,
          payType: '',  // 注意：payType 不填默认为收银台支付
          userFee: ''  // 不填写
        }
        this.isLoading = true
        console.info(data)
        this.$http.post(this.$store.getters.getUrl('weixinPay'), data).then((res) => {
          console.info(res)
          this.isLoading = false
          let result = res.data
          this.$store.dispatch('setOrderId', '') // 不管成功失败，支付后不能加菜
          if (result.code === 0) {
            this.$store.dispatch('clearAllCart')
            window.location.href = result.response.url
          } else {
            this.toastView(result.message)
          }
        })
      },
      toPay: function () {
        this.isLoading = true
        this.$http.post(this.$store.getters.getUrl('queryList'), {}).then((res) => {
          console.info(res)
          if (!res.data.response || !res.data.response.goods) {
            this.toastView('你操作太频繁，请稍后重试')
            this.isLoading = false
            return
          }
          console.info('go pay')
          if (this.orderId) {
            this.addFood(this.orderId)
          } else {
            this.ToPayOrOrderDetail()
          }
        })
      },
      uploadOrder () {
        //        0  正餐 1 快餐
        //      包含菜品已估清驳回前端下单请求并返回已被估清的菜品信息
        //      快餐模式直接下单成功并前往支付页面（订单状态：待付款）
        //      正餐模式且需要先付款下单成功并前往支付页面（订单状态：待付款）
        //      正餐模式且不需要先付款，直接下单（订单状态：待审核）
        if (!this.orderId) {
          if (!this.inputValue) {
            this.toastView('人数不可为空')
            return
          }
          if (this.inputValue < 1 || this.inputValue > 99) {
            this.toastView('人数请填写是1到99的整数')
            return
          }
        }
        if (this.$store.getters.businessType === 1 && !this.phone) {
          this.showBindDialog = true
          return
        }
        // 已售馨商品不允许提交订单  1是售完  2未售完
        for (let i of this.orderList) {
          if (i.soldStatus && i.soldStatus === 1) {
            this.toastView('部分商品已售馨,请检查后下单')
            return
          }
        }
        // 增菜商品
        for (let i of this.cySpecialGoods) {
          if (i.soldStatus && i.soldStatus === 1) {
            this.isShowGiveFoodTip = true
            return
          }
        }
        // 存在orderId 时为加菜
        this.toPay()
      },
      bindPhone () {
        this.showBindDialog = true
      },
      queryList () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '提交订单页', 'click', 'createOrder'])
          window._hmt.push(['_trackPageview', '/createOrder'])
        }
        let number = this.$store.getters.peoples
        if (!number || number === 0) {
          number = ''
        }
        this.remark = this.$store.getters.remarks
        this.inputValue = number
        this.isLoading = true
        this.$http.post(this.$store.getters.getUrl('queryList'), {}).then((res) => {
          console.info(res)
          let result = res.data.response
          if (!result) return
          if (res.data.code === 0) {
            this.teaFee = result.teaFee
            let table = result.table
            if (table) {
              this.tableId = table.id
              this.tableName = table.name
            }
            this.getCouponInfo(result.goods, result.nextLevelCampaign) // 劵与赠菜信息
          } else {
            this.isLoading = false
          }
        })
      },
      getPhoneNum () {
        let url = this.$store.getters.getUrl('getPhoneNum', false)
        this.$http.post(url, {params: {shopSerial: this.$store.getters.shopSerial}}).then((res) => {
          if (res.data.code === 0) {
            if (res.data.phone) {
              this.$store.dispatch('setPhone', res.data.phone)
              this.phone = res.data.phone
            }
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.name === 'newDetail') {
          vm.isDetail = true
        } else if (from.name === null) {
          vm.isLoading = false
          $cache.set('needBack', true, 60)
          vm.$router.push({name: 'index'})
        } else if (from.name === 'Payment') {
          vm.isLoading = false
          vm.$router.push({name: 'index'})
        }
      })
    },
    components: {
      Bottom,
      BindPhone,
      ToastShow,
      Loading,
      YunnexInfo,
      OrderItem,
      ChoiceCoupon,
      PayGiveFood
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/css/base";

  .bottom-class {
    position: relative;
  }

  .input_wrap {
    width: 100%;
    display: flex;
    border-top: pr(12) solid #eeeeee;
    background-color: white;
    line-height: pr(74);
    padding-left: pr(24);
    text-align: center;
    padding-top: pr(18);
    padding-bottom: pr(18);
    .remark_wrap {
      color: #181818;
      @include font-dpr(15px);
      width: 11%;
      float: left;
      display: inline-flex
    }
    .remark {
      outline: none;
      border: none;
      line-height: pr(74);
      padding-left: pr(4);
      color: #181818;
      width: 80%;
      @include font-dpr(15px);
    }
    input::-webkit-input-placeholder {
      color: #cecece;
    }
  }

  .line_wrap {
    width: 100%;
    text-align: center;
    display: flex;
    background-color: white;
    .left_round {
      -webkit-border-radius: 0 pr(12) pr(12) 0; //// 上、右、下、左外边距*/
      border: 1px solid transparent;
      background-color: #e8e8e8;
      height: pr(12);
      width: pr(6);
    }
    .middle_line {
      border-top: 1px dashed #e1e1e1;
      height: 1px;
      margin-top: pr(7);
      background-color: white;
      width: 100%;
    }
    .right_round {
      -webkit-border-radius: pr(12) 0 0 pr(12); //// 上、右、下、左外边距*/
      border: 1px solid transparent;
      height: pr(12);
      background-color: #e8e8e8;
      width: pr(6);
    }
  }

  .total_wrap {
    margin-top: pr(26);
    height: pr(102);
    line-height: pr(102);
    width: 100%;
    border-top: 1px dashed #e1e1e1;
    .total_price {
      float: right;
      @include font-dpr(14px);
      color: #545454;
    }
    span {
      color: #f74848;
      margin-left: pr(10);
      @include font-dpr(16px);
      font-weight: bold;
    }
  }

  .price_wrap {
    height: 100%;
    width: 100%;
    background-color: white;
    display: inline-flex;
  }

  .show-price {
    color: #F74848;
    float: right;
    height: pr(30);
    @include font-dpr(14px);
  }

  .directory_price {
    color: #181818;
    height: pr(30);
    @include font-dpr(15px);
  }

  .price-item {
    margin-top: pr(16);
    width: 100%;
    line-height: pr(48);
    height: pr(48);
    display: block;
  }

  .middle-item {
    margin-top: pr(8);
    width: 100%;
    line-height: pr(48);
    height: pr(48);
    display: block;
  }

  .bottom-item {
    width: 100%;
    line-height: pr(48);
    height: pr(48);
    display: block;
  }

  .bottom-wrap {
    width: 100%;
    height: 100%;
    margin-left: pr(24);
    margin-right: pr(24);
  }

  .shop_activity_wrap {
    height: pr(110);
    width: 100%;
    line-height: pr(110);
    background-color: white;
    .shop_activity {
      float: left;
      padding-left: pr(24);
      color: #181818;
      @include font-dpr(15px);
    }
    .activity_content {
      float: right;
      color: #999999;
      @include font-dpr(15px);
    }
    .activity_img {
      background-size: 100% 100%;
      background-image: url('../assets/img/orderPay/nex@2x.png');
      height: pr(24);
      width: pr(12);
      float: right;
      margin-right: pr(24);
      margin-left: pr(24);
      margin-top: pr(42);
    }
  }

  .header_wrap {
    border-radius: pr(4);
    background-color: white;
  }

  .give_dash_wrap {
    width: 100%;
    height: 100%;
    background-color: white;
    .content_wrap {
      height: pr(80);
      width: 100%;
      display: inline-flex;
      line-height: pr(80);
      .give_img {
        background-size: 100% 100%;
        background-image: url('../assets/img/orderPay/Complimentary-label@2x.png');
        height: pr(28);
        width: pr(28);
        margin-top: pr(30);
        margin-left: pr(24);
        margin-right: pr(10);
      }
      .give_content {
        @include font-dpr(12px);
        line-height: pr(90);
        color: #F74848;
      }
    }
  }
/*
  .yunnex-info {
    position: relative;
    bottom: pr(-100);
  }
*/
  .img-bind {
    width: pr(12);
    height: pr(24);
    background-image: url("../assets/img/orderPay/nex-unclick@2x.png");
    margin-bottom: pr(-9);
    background-size: 100% 100%;
    display: inline-block;
  }

  .content {
    position: absolute;
    width: 100%;
    overflow: hidden;
    margin-bottom: pr(100);
    padding-top: pr(12);
    /*background-color: #e8e8e8;*/
  }

  .img-table {
    background-size: 100% 100%;
    background-image: url('../assets/img/orderPay/icon-Table@2x.png');
    height: pr(36);
    width: pr(36);
    display: inline-block;
    margin-bottom: pr(-6);
  }

  .img-phone {
    background-size: 100% 100%;
    background-image: url('../assets/img/orderPay/icon-phone@2x.png');
    height: pr(36);
    width: pr(36);
    display: inline-block;
    margin-bottom: pr(-6);
  }

  .img-people {
    background-size: 100% 100%;
    background-image: url('../assets/img/orderPay/icon-people@2x.png');
    height: pr(36);
    width: pr(36);
    display: inline-block;
    margin-bottom: pr(-6);
  }

  .table {
    height: pr(100);
    line-height: pr(100);
    padding-left: pr(24);
    vertical-align: middle;
  }

  .table_number {
    height: pr(100);
    vertical-align: middle;
  }

  .user_people {
    height: pr(100);
    line-height: pr(100);
    margin-left: pr(24);
    margin-right: pr(24);
    border-top: 1px solid #e1e1e1;
    .numberPeople {
      margin-left: pr(10);
      color: #252525;
      @include font-dpr(15px);
      outline: none;
      border: none;
      width: 50%;
    }
    .inputPeople {
      margin-right: pr(22);
      color: #252525;
      @include font-dpr(15px);
      outline: none;
      border: none;
      width: 50%;
    }
  }

  .num {
    margin-left: pr(10);
    color: #181818;
    line-height: pr(100);
    @include font-dpr(15px);
  }

  .phone {
    margin-left: pr(10);
    width: 86%;
    color: #181818;
    @include font-dpr(15px);
    outline: none;
    border: none;
    display: inline-block;
    span {
      margin-left: pr(22);
      color: #757575;
      @include font-dpr(15px);
    }
  }

  .detail_wrap {
    height: pr(90);
    width: 100%;
    line-height: pr(90);
    border-radius: pr(4);
    background-color: white;
    border-top: pr(12) solid #e8e8e8;
  }

  .detail {
    @include font-dpr(15px);
    color: #181818;
    padding-left: pr(24);
    text-align: center;
    height: pr(90);
    line-height: pr(90);
  }

  .detailNum {
    @include font-dpr(12px);
    color: #cecece;
    text-align: center;
    background: white;
    height: pr(90);
    line-height: pr(90);
  }

  .hasKb {
    opacity: 0;
    pointer-events: none;
  }

  .noKb {
    opacity: 1;
    pointer-events: auto;
  }
</style>
