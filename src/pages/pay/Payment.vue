<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <!-- 新界面 -->
  <div class="content" :class="isSHowTime || isCommentContent?'hasTip':'noTip'">
    <header class="header">
      <div class="header_inner">
        <a id="back_btn" @click="goBack">
          <div class="detailBack"></div>
        </a>
      </div>
    </header>
    <div class="header_wrap" ref="headerHeight">
      <div class="status_wrap">
        <div class="status_pay">{{pay_status[orderStatus]}}</div>
        <div class="status_pay_content">{{status_content[orderStatus]}}</div>
      </div>
      <div class="right_header">
        <div class="pay_default_img" v-bind:style="{backgroundImage:'url('+status_img[orderStatus]+')'}"></div>
      </div>
    </div>
    <div class="contains" ref="contentHeight">
      <div class="detail_wrap">
        <span class="detail">已点{{orderInfo.goodsAmount}}个菜品</span>
        <span class="detailNum">桌号：{{orderInfo.tableName}}</span>
      </div>
      <order-pay-item v-for="(item,index) in cyOrderGoodsDtoList" :key="item.id" :items="item"
                      :payConfig="orderInfo.payConfig"></order-pay-item>

      <div class="price_wrap">
        <ul class="bottom-wrap-price">
          <li class="price-item">
            <span class="directory_price">菜品小计:</span>
            <span class="show-price">¥{{orderInfo.goodsFee | price}}</span>
          </li>
          <li class="middle-item">
            <span class="directory_price">茶位费<span class="tea-number">({{orderInfo.personAmount}}人)</span></span>
            <span class="show-price">+¥{{orderInfo.teaFee | price}}</span>
          </li>
          <li class="coupon-item" v-for="(item,index) in cyCampaignDtoList" :key="item.id"
              v-show="item.discountType===4 || item.discountType===1">
            <span class="directory_price">{{coupon_status[item.discountType]}}:</span>
            <span class="show-price">-¥{{item.discountFee | price}}</span>
          </li>
          <li class="total_wrap">
            <div class="total_price">合计:<span>¥{{allPrice | price}}</span></div>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <div class="shop-info_wrap">
          <div class="order-serial-number">订单编号：<span>{{orderId}}</span></div>
          <div class="order-serial-number">下单时间：<span>{{createTime}}</span></div>
          <div class="order-serial-number" v-if="orderStatus===3">支付方式：<span>{{pay_type[orderInfo.payType]}}</span>
          </div>
          <div class="order-serial-number">店铺名称：<span>{{orderInfo.branchName}}</span></div>
          <div class="order-serial-number">订单备注：<span>{{orderInfo.remark}}</span></div>
        </div>
      </div>
      <yunnex-info :style="yunnex_info" ref="yunnex"></yunnex-info>
    </div>
    <div class="comment_info" v-if="isCommentContent">
      <span class="showText">{{isCommentContent}}</span>
    </div>
    <div class="comment_info" v-if="isSHowTime">
      <span class="showText">15分钟内未支付系统将自动取消订单</span>
    </div>
    <div class="bottom-wrap" ref="bottomHeight">
      <div class="bottom-middle">
        <div class="check-pay" @click="goPay" v-if="isShowPay">支付买单</div>
        <div class="check-pay" v-if="isAgainToPay" @click="goUrl(false)">逛逛首页</div>
        <div class="go-comment" v-if="orderStatus===3 && commentSwitch" @click="goComment()">去评价</div>
        <div class="cancel-order" @click="isRemoveOrder = true" v-if="isShowCancel">取消订单</div>
        <div class="cancel-order" @click="addGood" v-if="isAddFood">加菜</div>
      </div>
    </div>
    <cancel-order v-if="isRemoveOrder" @confirmRemoveOrder="cancelOrder"
                  @removeOrderDialog="isRemoveOrder = false"></cancel-order>
    <loading v-if="isLoading"></loading>
    <toast-show v-show="toasting" :content="content"></toast-show>
    <confirm-order v-show="isConfirmOrder" @showTipInfo="isConfirmOrder=false"></confirm-order>
    <pay-order-dialog v-show="isAddDashPay" @cancelAddFood="isAddDashPay=false"
                      @confirmAddFood="postOrder"></pay-order-dialog>
  </div>
</template>

<script>
  import YunnexInfo from '../../components/common/YunnnexInfo'
  import CancelOrder from '../../components/common/CancelOrder'
  import Loading from '../../components/common/Loading'
  import ToastShow from '../../components/common/ToastShow'
  import ConfirmOrder from '../../components/common/NoConfirmOrder.vue'
  import OrderPayItem from '../../components/createOrder/orderPayItem.vue'
  import daizhifu from '../../assets/img/orderPay/bar-Handle@2x.png'
  import yixiadan from '../../assets/img/orderPay/bar-order@2x.png'
  import yiwancheng from '../../assets/img/orderPay/bar-complete@2x.png'
  import yiquxiao from '../../assets/img/orderPay/bar-cancel@2x.png'
  import daiqueding from '../../assets/img/orderPay/bar-payment@2x.png'
  import yitijiao from '../../assets/img/orderPay/bar-Submit@2x.png'
  import $cache from './../../utils/cache'
  import PayOrderDialog from '../../components/common/PayOrderDialog.vue'
  import $utils from '../../utils'

  export default {
    data () {
      return {
        orderStatus: 6,
        pay_status: {
          1: '待付款',
          2: '已下单',
          3: '交易成功',
          4: '交易关闭',
          5: '待商户处理',
          6: '已提交', //  前端专有 5分钟前是已提交状态，5分钟后是待商户处理，传标识来判断 (已通知店家处理，请耐心等待)
          7: '待结账'  // 发起支付的状态，后台不返回，内部状态
        },
        coupon_status: {
          1: '优惠活动', // 满减满折
          2: '赠送菜',
          3: '限时特价',
          4: '优惠劵'
        },
        status_content: {
          1: '支付完成后订单才会下到厨房哦',
          2: '您的订单已下单到厨房，请耐心等待',
          3: '谢谢您的光临，期待您下次再来',
          4: '订单已被取消，请重新下单',
          5: '店家未及时处理订单，请联系服务员',
          6: '已通知店家处理,请耐心等待',
          7: '您的订单已下单到厨房，请耐心等待'
        },
        pay_type: {
          0: '未知',
          1: '微信',
          2: '支付宝',
          5: '现金',
          6: '储值卡'
        },
        status_img: {
          1: daizhifu,
          2: yixiadan,
          3: yiwancheng,
          4: yiquxiao,
          5: daiqueding,
          6: yitijiao,
          7: yixiadan   // 待结账为已下单状态
        },
        orderInfo: {},
        remark: '',
        isRemoveOrder: false,
        isSHowTime: false, // 显示时间
        isShowCancel: false, // 显示取消订单
        isShowPay: false, // 显示支付买单
        isAgainToPay: false,
        isAddFood: false,
        zbOrderId: '',
        message: '',
        isLoading: false,
        interval: '', // 计时器 刷新已提交状态变更为待商户处理
        timeVal: '',
        orderId: this.$route.query.orderId,
        shopSerial: this.$store.getters.shopSerial || this.$route.query.shopSerial,
        branchId: this.$store.getters.branchId || this.$route.query.branchId,
        toasting: false,
        content: '',
        payStatus: 0, // 支付过的不能加菜
        commentSwitch: false,
        isConfirmOrder: false,
        cyOrderGoodsDtoList: [],
        cyCampaignDtoList: [],
        isCommentContent: '',
        payState: this.$route.query.payState,
        endTime: '', // 15分钟结束时间，先放外面
        isAddDashPay: false, // 加菜付款
        flag: false,  // 取消倒计时标识
        isFixBottomHeight: 0 // logo适应的动态高度
      }
    },
    components: {
      YunnexInfo,
      CancelOrder,
      Loading,
      ToastShow,
      ConfirmOrder,
      OrderPayItem,
      PayOrderDialog
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'createOrder' || to.name === 'index' || to.name === 'shopList' || to.name === 'newDetail') { // 竟返回存中shopList
        if (this.isAddFood) {
          $cache.set('needBack', false, 60)
        } else if ([1, 5, 6, 7].includes(this.orderStatus)) {
          $cache.set('needBack', true, 60)
        } else {
          $cache.set('needBack', false, 60)
        }
      }
      next()
    },
    computed: {
      allPrice () {
        let payFee = 0
        let discoutFee = 0
        if (this.orderInfo) {
          payFee = this.orderInfo.goodsFee + this.orderInfo.teaFee
        }
        // discountType 只支持类型1卡劵 和 4满减满折
        if (this.cyCampaignDtoList && this.cyCampaignDtoList.length > 0) {
          this.cyCampaignDtoList.forEach(function (i) {
            if (i.discountType === 1 || i.discountType === 4) {
              discoutFee += $utils.Math.mul(i.discountFee, 1, 2)
            }
          })
        }
        return payFee - discoutFee < 0 ? 0 : payFee - discoutFee
      },
      yunnex_info () {
        return this.isFixBottomHeight > 0 ? {'margin-top': this.isFixBottomHeight + 'px'} : {'margin-top': '0px'}
      },
      createTime () {
        if (this.orderInfo.createTime) {
          let time = new Date(this.orderInfo.createTime)
          let year = time.getFullYear()
          let month = time.getMonth() + 1
          let day = time.getDate()
          let hours = time.getHours()
          let minutes = time.getMinutes()
          if (minutes < 10) {
            minutes = '0' + minutes
          }
          if (month < 10) {
            month = '0' + month
          }
          if (day < 10) {
            day = '0' + day
          }
          return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
        }
      },
      tableId () {
        return this.orderInfo.tableId
      },
      tableName () {
        return this.orderInfo.tableName
      }
    },
    deactivated () {
      console.info('deactivated')
      clearTimeout(this.timeVal)
      clearInterval(this.interval)
      this.$destroy(true)
    },
    created () {
      //  shopSerialAndId 只能通过拉取20号单号返回branchId和shopSerial
      // a.20订单号进入需要添加 orderId和payState参数， payState服务器返回1为成功,暂用来作标识来源
      // b. 17只需要添加orderId、shopSerial、branchId 跳转回来的标识
      if (this.payState) {
        this.shopSerialAndId()
      } else {
        this.$store.dispatch('setShopSerial', this.shopSerial)
        this.$store.dispatch('setBranchId', this.branchId)
        this.OrderInfo(this.orderId, '')
      }
    },
    methods: {
      getOuterBaseUrl () {
        //        return `http://${window.location.host}/saofu-mobile/smart_shop/index/${this.shopSerial}?branchId=${this.branchId}`
        return `http://${window.location.host}/smart_shop/index/${this.shopSerial}?branchId=${this.branchId}`
      },
      goComment () {
        // 这里跳转的时候把url调整正常（带上shopSerial和branchId），之后就不用管了
        $cache.set('tableId', this.tableId, 60)
        $cache.set('tableName', this.tableName, 60)
        window.location.href = this.getOuterBaseUrl() + `#/comment?orderId=${this.orderId}`
      },
      isAddGoodFlag () {
        return this.payStatus === 0 && this.orderStatus === 2
      },
      // 有值是加菜
      goUrl (flag) {
        let url = this.getOuterBaseUrl() + `#/`
        $cache.set('tableId', this.tableId, 60)
        $cache.set('tableName', this.tableName, 60)
        console.info('tableId: ' + $cache.get('tableId'))
        console.info('tableName: ' + $cache.get('tableName'))
        if (flag) {
          $cache.set('orderId', this.orderId, 60)
        } else {
          url += 'shopIndex'  // 需求变更 ，跳转到店铺首页，加菜还是购物车首页
          $cache.del('orderId')
          this.$store.dispatch('setOrderId', '')
        }
        window.location.href = url
      },
      goBack () {
        if (this.isAddFood) {
          this.$store.dispatch('setOrderId', this.orderId)
          this.$router.push({name: 'index'})
          return
        }
        if (this.payState && this.payState === '2') {
          this.$router.go(-1)
          this.$store.dispatch('setOrderId', '')
          return
        }
        if ([1, 5, 6, 7].includes(this.orderStatus)) {
          location.reload()
        } else {
          this.goUrl(this.isAddGoodFlag())
        }
      },
      addGood () {
        if (this.isAddFood) {
          this.$store.dispatch('setOrderId', this.orderId)
          this.$store.dispatch('setBack', false)
          this.$router.push({name: 'index'})
        }
      },
      showToast (content) {
        this.content = content
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      // 基本BaseUrl 有环境配置信息 shopSerial 商户Id branchId 门店id  orderId 是生成的订单id
      parseUrl (methods) {
        return this.$store.getters.getBaseUrl + methods + '?shopSerial=' + this.shopSerial + '&branchId=' + this.branchId
      },
      setRefreshTime (time) {
        this.timeVal = setTimeout(() => {
          location.reload()
        }, time)
      },
      postOrder: function () {
        let data = {
          orderId: this.orderId,
          payType: '',  // 注意：payType 不填默认为收银台支付
          userFee: ''  // 不填写
        }
        this.isLoading = true
        console.info(data)
        this.$http.post(this.parseUrl('/order/post'), data).then((res) => {
          console.info(res)
          this.isLoading = false
          this.isAddDashPay = false // 加菜状态专用
          let result = res.data
          this.$store.dispatch('setOrderId', '') // 不管成功失败，支付后不能加菜
          if (result.code === 0) {
            let url = result.response.url
            this.zbOrderId = result.response.zbOrderId
            window.location.href = url
          } else {
            this.showToast(result.message)
          }
        })
      },
      goPay () {
        //  已下单且有待确认订单的处理 加菜状态下，
        // a.点击发起支付时，存在待确认订单弹出提示（有待确认提示联系服务员，
        // b.无待确认订单时，提示发起支付后不可加菜（确认、取消））
        if (this.orderStatus === 2) {
          let goodsList = this.cyOrderGoodsDtoList
          console.info('已下单状态')
          for (let i of goodsList) {
            if (i.goodsStatus === 5) {
              this.isConfirmOrder = true
              return
            }
          }
          this.isAddDashPay = true
          return
        }
        this.postOrder()
      },
      cancelOrder () {
        let data = {
          orderId: this.orderId
        }
        this.isLoading = true
        console.info(data)
        this.$http.post(this.parseUrl('/cancel/order'), data).then((res) => {
          console.info(res)
          this.isRemoveOrder = false
          this.isLoading = false
          if (res.data.code === 0) {
            this.showToast('取消成功')
            location.reload()
          } else {
            this.showToast(res.data.message)
          }
        })
      },
      bottomShowStatus () {
        // 智慧餐厅内部订单状态 1待支付 2已下单 3成功 4关闭 5待审核 6 已提交  7 已下单且发起过支付
        if (this.orderStatus === 1) {
          this.isSHowTime = true
          this.isShowCancel = true
          this.isShowPay = true
        } else if (this.orderStatus === 2) {
          if (this.payStatus === 0) { // 待支付状态
            this.isAddFood = true
          } else if (this.payStatus === 2) {
            this.orderStatus = 7
          }
          this.isShowPay = true
        } else if (this.orderStatus === 3 || this.orderStatus === 4) {
          this.isAgainToPay = true
        } else if (this.orderStatus === 5 || this.orderStatus === 6) {
          this.isShowCancel = true
        }
      },
      headerShowStatus () {
        // 拉取部分配置信息
        this.$http.post(this.parseUrl('/config/get_config_info'), {}).then((res) => {
          let result = res.data.response
          let _this = this
          if (res.data.code === 0) {
            // 刷新5状态，开始服务器返回5，符合条件5分钟内条件是6(内部处理的状态), 5分钟后 已提交===>待商户处理
            let timeOut = 5 * 60
            let currentTime = Date.parse(new Date()) / 1000
            let createTime = this.orderInfo.createTime / 1000
            let isRefreshStatusTime = createTime + timeOut - currentTime
            // 正餐且不需要先付款的模式下单成功后订单状态为“已提交”  payType  0 后付款  1 先付款  businessType 0  正餐 1 快餐
            if (result.businessType === 0 && result.payType === 0 && this.orderStatus === 5 && isRefreshStatusTime > 0) {
              _this.orderStatus = 6
              this.interval = setInterval(() => {
                if (isRefreshStatusTime <= 0) {
                  isRefreshStatusTime = 0
                  clearInterval(_this.interval)
                  _this.orderStatus = 5
                  console.info('-----状态变更----->' + _this.orderStatus)
                }
                isRefreshStatusTime--
              }, 1000)
            }
          }
        })
      },
      shopSerialAndId () {
        let parseUrl = this.$store.getters.getShopBranch + '?orderId=' + this.orderId
        this.$http.post(parseUrl, {}).then(res => {
          console.info(res)
          this.shopSerial = res.data.shopSerial
          this.branchId = res.data.branchId
          this.$store.dispatch('setShopSerial', this.shopSerial)
          this.$store.dispatch('setBranchId', this.branchId)
          if (this.shopSerial && this.branchId) {
            this.OrderInfo('', this.orderId)
          }
        })
      },
      countdownCancelOrder () {
        let addTime = 15 * 60 * 1000
        let timestamp = (new Date()).valueOf()
        let temp = timestamp - this.orderInfo.createTime
        if (temp <= addTime) {
          this.endTime = (addTime - temp) + timestamp
        }
        console.info('进来15分钟倒计时')
        let time = setInterval(() => {
          if (this.flag === true) {
            clearInterval(time)
          }
          this.timeDown()
        }, 500)
      },
      // 待审核与已下单 已提交  待支付 45s 直接加载刷新 不做倒计时
      refreshStatus () {
        if ([1, 2, 5, 6].includes(this.orderStatus)) {
          this.setRefreshTime(45 * 1000)
        }
        if (this.orderStatus === 1) {
          // 倒计时
          // 获取当前时间戳
          this.countdownCancelOrder()
        }
      },
      autoHeight: function () {
        this.$nextTick(function () {
          let bottomHeight = this.$refs.bottomHeight ? this.$refs.bottomHeight.clientHeight : 0
          let headerHeight = this.$refs.headerHeight ? this.$refs.headerHeight.clientHeight : 0
          let contentHeight = this.$refs.contentHeight ? this.$refs.contentHeight.clientHeight : 0
          this.isFixBottomHeight = window.innerHeight - headerHeight - contentHeight - bottomHeight
        })
      },
      // orderId 17开头 专用于创建订单 zbOrderId 20开头的 专用支付成功
      OrderInfo (orderId, zbOrderId) {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '订单详情页', 'click', 'Payment'])
          window._hmt.push(['_trackPageview', '/Payment'])
        }
        let data = {
          orderId: orderId,
          zbOrderId: zbOrderId,
          type: 1  // 1 订单详情 2为加菜单详情
        }
        this.isLoading = true
        console.info(data)
        this.$http.post(this.parseUrl('/orders/order_info'), data).then((res) => {
          console.info(res)
          let detail = res.data
          let orderDetail = detail.response
          if (detail.code === 0) {
            this.isLoading = false
            if (!orderDetail) return
            this.orderInfo = orderDetail.cyOrderDto
            if (this.orderInfo.orderId) {
              this.orderId = this.orderInfo.orderId

              // 这里就存一下tableId和tableName
              this.$store.dispatch('setTableId', this.orderInfo.tableId)
              this.$store.dispatch('setTableName', this.orderInfo.tableName)
            }
            this.payStatus = this.orderInfo.payStatus
            this.orderStatus = this.orderInfo.orderStatus
            // 评价开关与提示语
            let comment = orderDetail.commentSwitch
            if (comment) {
              this.commentSwitch = comment.commentSwitch === 1
              this.isCommentContent = comment.hint
            }
            //            this.cyOrderGoodsDtoList = this.orderInfo.cyOrderGoodsDtoList
            // START
            let _temp = []
            // 重组套餐的数据
            for (let i of this.orderInfo.cyOrderGoodsDtoList) {
              if (i.isPackage === 1) {
                if (i.packageGoodsId === 0) {
                  i['packAgeDetails'] = this.orderInfo.cyOrderGoodsDtoList.filter(x => x.packageGoodsId === i.id)
                  _temp.push(i)
                }
              } else {
                _temp.push(i)
              }
            }
            this.cyOrderGoodsDtoList = _temp
            // END
            this.cyCampaignDtoList = this.orderInfo.cyCampaignDtoList  // 拆出赠品
            document.title = this.orderInfo.branchName  // 从公众号推送过来，显示店铺名称
            // 控制头部文件显示
            this.headerShowStatus()
            // 底部按钮显示
            this.bottomShowStatus()
            // 已下单和待审核
            this.refreshStatus()
            // 高度
            setTimeout(() => {
              this.autoHeight()
            }, 500)
          } else {
            this.showToast(detail.message)
          }
        })
      },
      // 倒计时
      timeDown () {
        const endTime = new Date(this.formatDate(this.endTime))
        const nowTime = new Date()
        let leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000)
        let m = this.formate(parseInt(leftTime / 60 % 60))
        let s = this.formate(parseInt(leftTime % 60))
        if (!m) m = 0
        if (!s) s = 0
        if (leftTime === 0) {
          this.flag = true
          console.info('倒计时结束')
          this.cancelOrder()
        } else {
          //          console.info(`${m}分${s}秒`)
        }
      },
      formate (time) {
        if (time < 10) {
          return `0${time}`
        }
        return time
      },
      formatDate (now) {
        let time = new Date(now)
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let date = time.getDate()
        let hour = time.getHours()
        let minute = time.getMinutes()
        let second = time.getSeconds()
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .detailBack {
    background-image: url('../../assets/img/fanhui2@2x.png');
    background-size: 100% 100%;
    width: pr(100);
    height: pr(100);
  }

  .header_inner {
    position: fixed;
    top: 0;
    left: 0;
    width: pr(100);
    height: pr(100);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    #back_btn {
      > img {
      }
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

  .show-price {
    color: #F74848;
    float: right;
    height: pr(30);
    @include font-dpr(15px);
  }

  .directory_price {
    color: #181818;
    height: pr(30);
    @include font-dpr(15px);
    .tea-number {
      color: #cecece;
      height: pr(30);
      @include font-dpr(15px);
      margin-left: pr(3);
    }
  }

  .price-item {
    margin-top: pr(16);
    width: 100%;
    line-height: pr(48);
    height: pr(48);
    display: block;
  }

  .coupon-item {
    margin-top: pr(8);
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

  .bottom-wrap-price {
    width: 100%;
    height: 100%;
    margin-left: pr(24);
    margin-right: pr(24);
  }

  .price_wrap {
    height: 100%;
    width: 100%;
    background-color: white;
    display: inline-flex;
  }

  .line_wrap {
    width: 100%;
    text-align: center;
    display: flex;
    background-color: white;
    border-top: pr(18) solid white;
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

  .contains {
    margin-bottom: pr(100);
    /*background-color: #e8e8e8;*/
  }

  .detail_wrap {
    height: pr(90);
    width: 100%;
    line-height: pr(90);
    border-radius: pr(4);
    background-color: white;
  }

  .detail {
    @include font-dpr(15px);
    color: #181818;
    padding-left: pr(24);
    text-align: center;
    height: pr(90);
    line-height: pr(90);
    float: left;
  }

  .detailNum {
    @include font-dpr(15px);
    color: #999999;
    text-align: center;
    background: white;
    height: pr(90);
    line-height: pr(90);
    padding-right: pr(24);
    float: right;
  }

  .header_wrap {
    height: pr(166);
    line-height: pr(166);
    background-color: #F74848;
    display: flex;
    .status_wrap {
      width: 70%;
      padding-top: pr(40);
      padding-left: pr(100);
    }
    .status_pay {
      color: white;
      @include font-dpr(16px);
      height: pr(46);
      line-height: pr(46);
    }
    .status_pay_content {
      color: white;
      @include font-dpr(12px);
      height: pr(38);
      line-height: pr(38);
    }
    .right_header {
      width: 30%;
      .pay_default_img {
        background-size: 100% 100%;
        height: pr(122);
        width: pr(152);
        float: right;
        margin-top: pr(24);
        margin-right: pr(68);
      }
    }
  }

  .showText {
    text-align: center;
    width: 100%;
    color: #7F5901;
    @include font-dpr(14px);
  }

  .notice {
    @include font-dpr(10px);
    color: #7d7d7d;
    font-weight: bold;
    line-height: pr(36);
    margin-left: pr(24);
  }

  .order-wrap {
    border-top: pr(12) solid #e8e8e8;
    display: inline-block;
    background-color: white;
    width: 100%;
    .shop-info_wrap {
      margin-top: pr(30);
      margin-bottom: pr(26);
    }
  }

  .shop-name {
    display: block;
    line-height: pr(30);
    height: pr(30);
    margin-left: pr(24);
    @include font-dpr(14px);
    color: #adadad;
  }

  .order-serial-number {
    display: block;
    line-height: pr(38);
    height: pr(38);
    @include font-dpr(13px);
    color: #ABABAB;
    margin-bottom: pr(4);
    margin-left: pr(24);
    span {
      color: #333333;
      height: pr(38);
      @include font-dpr(13px);
    }
  }

  .content {
    overflow: hidden;
  }

  .hasTip {
    margin-bottom: pr(130);
  }

  .noTip {
    margin-bottom: pr(60);
  }

  .remark {
    padding-left: pr(24);
    padding-right: pr(24);
    width: 100%;
    height: pr(90);
    line-height: pr(90);
    color: #7d7d7d;
    outline: none;
    border: none;
    background-color: white;
    @include font-dpr(13px);
    border-top: 1px solid #eeeeee;
    border-bottom: 12px solid #eeeeee;
  }

  .bottom-left {
    width: 30%;
    height: pr(100);
    display: inline-block;
    line-height: pr(100);

  }

  .bottom-wrap {
    width: 100%;
    height: pr(124);
    line-height: pr(124);
    display: flex;
    background-color: white;
    bottom: 0;
    position: fixed;
  }

  .time-remain {
    line-height: pr(36);
    @include font-dpr(10px);
    margin-left: pr(24);
    color: #7d7d7d;
    margin-top: pr(13);
    height: pr(36);
  }

  .check-pay {
    color: white;
    width: pr(214);
    height: pr(81);
    line-height: pr(81);
    @include font-dpr(14px);
    display: inline-block;
    border-radius: pr(4);
    text-align: center;
    float: right;
    margin-top: pr(23);
    background-image: linear-gradient(90deg, #f76049, #F74848);
  }

  .cancel-order {
    width: pr(214);
    height: pr(80);
    border-radius: pr(4);
    float: right;
    display: inline-block;
    @include font-dpr(14px);
    color: #f74848;
    margin-top: pr(22);
    line-height: pr(80);
    margin-right: pr(24);
    border: 1px solid #f74848;
  }

  .go-comment {
    color: white;
    width: pr(214);
    height: pr(81);
    line-height: pr(81);
    @include font-dpr(14px);
    display: inline-block;
    border-radius: pr(4);
    text-align: center;
    float: right;
    margin-top: pr(23);
    margin-right: pr(24);
    background-image: linear-gradient(90deg, #f76049, #F74848);
  }

  .bottom-middle {
    width: 70%;
    height: pr(100);
    line-height: pr(100);
    text-align: center;
    position: absolute;
    right: pr(30);
  }

  .comment_info {
    width: 100%;
    height: pr(88);
    line-height: pr(88);
    display: flex;
    background-color: #fff4dc;
    bottom: pr(124);
    position: fixed;
  }

</style>
