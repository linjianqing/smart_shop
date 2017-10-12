<template>
  <!-- 底部 -->
  <section>
    <scan-error v-if="isScanError" @showErrorInfo="isScanError = false"></scan-error>
    <scan-time-out v-if="isScanTimeOut" @cancelScan="isScanTimeOut = false" @retryScan="retryScan"></scan-time-out>
    <start-scan v-if="isShowScan" @scanResult="scanResult" @closeScan="isShowScan = false"></start-scan>
    <loading v-if="isLoading"></loading>
    <common v-show="isShowClear" @clearAllShop="clearAllShop" @hide="isShowClear = false"></common>
    <div class="card-bg" v-show="isShowDetail" @click="closeBg" @touchmove.prevent></div>
    <div class="cart-wrap" ref="cartWrap">
      <transition name="fold">
        <div class="cart-detail" v-show="isShowDetail">
          <div class="card_select_alert" @touchmove.prevent>
            <span class="select-shop">已点商品</span>
            <span class="clear-shop" @click="isShowClear = true">
            <span class="clear-img"></span>
            <span class="clear-text">清除所有</span>
          </span>
          </div>

          <ul class="scroll-wrap" :style="isShowDetail?bottomLine:{}" ref="itemHeight" @touchmove="stopScroll">
            <li v-for="(goods,index) in allGoods">
              <div :class="(allGoods.length-1)==index ?'hide_line':'line'">
                <div class="name">{{goods.name}}</div>
                <cart-content :goods="goods"></cart-content>
                <div class="good—item">
                  <div class="good-price">
                    <!--1 常态 2 特价 3会员-->
                    <div class="price-cart">
                      <span>¥</span>{{isMember ? goods.price : (goods.priceType === 2 ? goods.price : goods.originalPrice) | price}}
                    </div>
                    <span class="member-price" v-show="goods.priceType===3" v-if="isMember">会员价</span>
                    <span class="special-price" v-show="goods.priceType===2">特惠价</span>
                  </div>
                  <div class="operation-wrap">
                    <div @click="action(goods,-1)" class="reduceImg"></div>
                    <div class="num">{{goods.quantity}}</div>
                    <div @click="action(goods,1)" class="addImg"></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

        </div>
      </transition>
      <div class="member-register" v-show="!isShowDetail" v-if="isShowRegister">
        <div class="register_img" @click="isShowRegister = false"></div>
        <div class="close_register"></div>
        <div class="register_content" @click="openRegister">注册成为会员享受更多优惠<span>马上注册></span></div>
      </div>
      <div class="cartBottom">
        <div v-if="allGoods.length > 0" @click="showDetail" class="icon" :class="{move_in_cart:isMoveCartIcon}"></div>
        <div v-else class="defaultIcon"></div>
        <div class="num-tip" v-show="allGoods.length>0" ref="numberCount"> <span>{{goodsCount}}</span></div>
        <div class="info-part" v-if="allGoods.length > 0">
          <div class="total-price" v-if="!showCampain">合计<span class="price"><span>¥</span>{{ allPrice | price}}</span>
          </div>
          <div class="total-price-top" v-if="showCampain">合计<span
            class="price"><span>¥</span>{{ allPrice | price}}</span></div>
          <div class="coupon-wrap-action" v-if="showCampain">{{showCampain}}</div>
        </div>
        <div class="info-part" v-else><span class="priceGray">未选购商品</span></div>
        <div v-show="allGoods.length>0" class="btn-part" @click="summitOrder()">{{ showStatus }}</div>
      </div>
    </div>

  </section>

</template>

<script>
  import StartScan from '../../pages/scan/ScanStart'
  import Common from '../common/CancelCartDialog'
  import Loading from '../common/Loading'
  import ScanTimeOut from '../common/ScanTimeOut'
  import ScanError from '../common/ScanError'
  import ToastShow from '../../components/common/ToastShow'
  import CartContent from '../../components/common/CartContent'

  // 购物车, 所有状态通过 store传递
  export default {
    data () {
      return {
        isShowDetail: false,
        hasCreateCart: false,
        isShowClear: false,
        isShowScan: false,
        isLoading: false,
        tableName: '',
        tableId: 0,
        isScanTimeOut: false,
        isScanError: false,
        theLock: true,
        isShowRegister: null,
        containerHeight: window.innerHeight * 0.6,
        isFixTouch: false
      }
    },
    components: {
      CartContent,
      Common,
      StartScan,
      Loading,
      ScanTimeOut,
      ScanError,
      ToastShow
    },
    props: ['isMoveCartIcon'],
    watch: {
      goodsCount (newValue) {
        if (newValue === 0) {
          this.isShowDetail = false
        }
      }
    },
    computed: {
      bottomLine () {
        return {
          'border-bottom': '1px solid #e1e1e1',
          'max-height': this.containerHeight + 'px'
        }
      },
      //       0、正餐模式
      //       无桌号信息，按钮显示为扫码入座
      //       有桌号信息，按钮显示为立即下单
      //       1、快餐模式按钮显示为立即下单
      showStatus () {
        if (!this.$store.getters.tableId && this.$store.getters.businessType === 0) {
          return '扫码入座'
        } else {
          return '立即下单'
        }
      },
      allGoods () {
        return this.$store.getters.allGoods
      },
      goodsCount () {
        return this.$store.getters.goodsCount
      },
      allPrice () {
        return this.$store.getters.allPrice
      },
      showCampain () {
        let nextLevelCampaign = this.$store.getters.nextLevelCampaign
        return nextLevelCampaign.campContent ? nextLevelCampaign.campContent : ''
      },
      isMember () {
        return this.$store.getters.memberStatus
      }
    },
    methods: {
      stopScroll (e) {
        if (this.isFixTouch) {
          e.preventDefault()
        }
      },
      openRegister () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '会员引导弹窗', 'click', 'yunnexDialog'])
          window._hmt.push(['_trackPageview', '/yunnexDialog'])
        }
        let customerId = this.$store.getters.customerId
        let soureChannel = -17
        if (customerId) {
          this.$yunnexDialog({
            shopSerial: this.$store.getters.shopSerial,
            customerId: customerId,
            channel: 1,
            soureChannel: soureChannel,
            callBack: () => {
              this.isShowRegister = false
              this.$store.dispatch('setResultMemberStatus', true) // 注册成功更新原有会员状态
              location.reload()
            }
          }).ready()
        }
      },
      closeBg () {
        this.isShowDetail = false
        this.$emit('isShowDetail', this.isShowDetail)
      },
      showToast (content) {
        this.content = content
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      retryScan () {
        this.isScanTimeOut = false
        this.goScan()
      },
      scanResult (res) {
        this.isShowScan = false
        if (res.code !== 0) {
          console.info('error: ' + res.message)
          this.isScanError = true
          return -1
        }
        this.tableName = res.tableName
        this.tableId = res.tableId
        console.info(this.tableId)
        console.info(this.tableName)
        if (this.allGoods.length > 0) {
          this.$router.push({name: 'createOrder'})
        }
      },
      clearAllShop () {
        this.$http.post(this.$store.getters.getUrl('delAllCart'), {}).then((res) => {
          this.isShowClear = false
          this.$store.dispatch('clearAllCart')
        })
      },
      //       0、正餐模式
      //         无桌号信息，按钮显示为扫码入座
      //         有桌号信息，按钮显示为立即下单
      //       1、快餐模式按钮显示为立即下单
      summitOrder () {
        if (!this.$store.getters.tableId && this.$store.getters.businessType === 0) {
          this.isShowScan = true
        } else {
          this.$router.push({name: 'createOrder'})
          this.$emit('summitOrder')
        }
      },
      showDetail () {
        if (this.allGoods.length > 0) {
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '点击购物车', 'click', 'shopCart'])
          }
          this.isShowDetail = !this.isShowDetail
        }
        this.$emit('isShowDetail', this.isShowDetail)
      },
      action (goods, num) {
        if (this.theLock) {
          this.theLock = false
          let data = {
            id: goods.goodsId,
            amount: goods.quantity + num
          }
          this.$http.post(this.$store.getters.getUrl('updateAmount'), data).then((res) => {
            if (res.data.code === 0) {
              if (num > 0) {
                this.$store.dispatch('addToCart', {products: goods, id: goods.goodsId})
              } else {
                this.$store.dispatch('reduceFromCart', goods)
              }
              let campain = res.data.response.nextLevelCampaign
              if (campain && campain[0]) {
                this.$store.dispatch('setNextLevelCampaign', campain[0])
              }
            }
            this.theLock = true
          })
        }
      },
      getCartInfo () {
        this.$http.post(this.$store.getters.getUrl('queryList'), {}).then(res => {
          console.info(res)
          let obj = res.data.response
          if (!obj || !obj.goods) {
            return
          }
          this.$store.dispatch('clearAllCart')
          for (let i of res.data.response.goods) {
            let items = []
            let toGoods = {}
            for (let j of i.checkAttrs) {
              items.push({
                id: j.pid, name: j.pname, productAttrItems: [{id: j.id, name: j.name}]
              })
            }
            toGoods = {
              id: i.goodsId,
              name: i.goodsName,
              price: i.price,
              categoryId: i.categoryId,
              productAttrsList: items,
              amount: i.amount,
              goodsId: i.shoppingId,
              unit: i.goodsUnit,
              priceType: i.priceType,
              isPackage: i.isPackage,
              tastes: i.tastes || []
            }
            //  购物车记录，后付款只返回price字段，没有原价，前端显示要取值替换
            if (i.originalPrice) {
              toGoods['originalPrice'] = i.originalPrice
            } else {
              toGoods['originalPrice'] = i.price
            }
            if (i.isPackage) {
              toGoods.packageGoods = i.packageGoods
            }
            this.$store.dispatch('addToCart', {products: toGoods, id: toGoods.goodsId})
          }
          if (obj.nextLevelCampaign && obj.nextLevelCampaign[0]) {
            this.$store.dispatch('setNextLevelCampaign', obj.nextLevelCampaign[0])
          }
        })
      },
      memberStatus () {
        this.$http.get(this.$store.getters.getUrl('getMemberStatus', false)).then(res => {
          console.info(res)
          if (res.data.code !== 0) {
            console.error(`获取会员接口信息报错: ${res.data.message}`)
            console.error(res.data.message)
          } else {
            this.$store.dispatch('setMemberStatus', res.data.response)
            this.isShowRegister = !res.data.response.memberStatus
          }
        })
      }
    },
    updated () {
      this.$nextTick(() => {
        if (this.isShowDetail) {
          this.containerHeight = window.innerHeight * 0.6
          let itemHeight = 0
          if (this.$refs.itemHeight) {
            itemHeight = this.$refs.itemHeight.clientHeight
          }
          this.isFixTouch = (this.containerHeight >= itemHeight)
        }
      })
    },
    created () {
      this.getCartInfo()
      this.memberStatus()
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  .cartBottom {
    height: pr(100);
    line-height: pr(100);
    width: 100%;
    border-top: 1px solid #e1e1e1;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    display: flex;
  }

  .reduceImg {
    background-size: 100% 100%;
    background-image: url('../../assets/img/jianshao@2x.png');
    height: pr(46);
    width: pr(46);
    line-height: pr(46);
    position: relative;
    top: 50%;
    margin-top: pr(-25);
  }

  .addImg {
    background-size: 100% 100%;
    background-image: url('../../assets/img/tianjia@2x.png');
    height: pr(46);
    width: pr(46);
    line-height: pr(46);
    position: relative;
    top: 50%;
    margin-top: pr(-25);
  }

  .good—item {
    height: pr(30);
    line-height: pr(30);
  }

  .good-price {
    float: left;
    margin-top: pr(26);
    width: 70%;
  }

  .clear-text {
    height: pr(30);
    line-height: pr(30);
    vertical-align: middle;
  }

  .card_select_alert {
    height: pr(100);
    line-height: pr(100);
    padding-left: pr(24);
    padding-right: pr(24);
    border-bottom: 1px solid #e1e1e1;
  }

  .select-shop {
    @include font-dpr(15px);
    color: #545454;
  }

  .clear-shop {
    float: right;
    color: #adadad;
    @include font-dpr(15px)
  }

  .clear-img {
    width: pr(30);
    height: pr(30);
    line-height: pr(30);
    display: inline-block;
    vertical-align: middle;
    background-image: url('../../assets/img/qingchu@2x.png');
    background-size: 100% 100%;
    margin-bottom: pr(3);
  }

  .card-bg {
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: pr(100);
    background: #000;
    opacity: 0.6;
    z-index: 10;
  }

  .cart-wrap {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
    height: pr(100);
    z-index: 10;
    .icon {
      position: absolute;
      width: pr(70);
      @include bg-image('../../assets/img/gouwuche');
      height: pr(70);
      bottom: pr(15);
      left: pr(36);
    }
    .defaultIcon {
      position: absolute;
      width: pr(70);
      @include bg-image('../../assets/img/gouwucheweikong');
      height: pr(70);
      bottom: pr(15);
      left: pr(36);
    }
    .member-register {
      background-color: #fff4dc;
      position: absolute;
      bottom: pr(100);
      width: 100%;
      box-sizing: border-box;
      display: flex;
      line-height: pr(90);
      left: 0;
      .register_img {
        @include bg-image('../../assets/img/register/gb');
        height: pr(32);
        width: pr(32);
        margin-top: pr(30);
        margin-left: pr(24);
      }
      .register_content {
        width: 100%;
        color: #c8a045;
        margin-right: pr(24);
        @include font-dpr(14px);
        span {
          margin-left: pr(30);
          color: #9d7211;
          float: right;
        }
        line-height: pr(90);
      }
      .close_register {
        background-size: 100% 100%;
        background-image: url('../../assets/img/register/zchy@3x.png');
        height: pr(36);
        width: pr(36);
        margin-left: pr(24);
        margin-top: pr(27);
        margin-right: pr(10);
      }
    }
    .cart-detail {
      background-color: #ffffff;
      position: absolute;
      width: 100%;
      transform: translate3d(0, -100%, 0);
      &.fold-enter-active, &.fold-leave-active {
        transition: all 0.3s;
        opacity: 1;
      }
      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0, 0, 0);
        opacity: 0;
      }
      .scroll-wrap {
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        padding-bottom: pr(5);
      }

      .angle {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 pr(11) pr(10) pr(11);
        border-color: transparent transparent #fff transparent;
        position: absolute;
        top: pr(-10);
        left: pr(70);
      }

      li {
        padding-right: pr(24);
        padding-left: pr(24);
      }
      .line {
        padding-bottom: pr(50);
        border-bottom: 1px solid #e1e1e1;
      }
      .hide_line {
        padding-bottom: pr(50);
      }
      .name {
        width: 100%;
        height: pr(36);
        color: #181818;
        @include font-dpr(15px);
        line-height: pr(36);
        margin-top: pr(28);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .price-cart {
        float: left;
        @include font-dpr(16px);
        color: #f74848;
        span {
          color: #f74848;
          @include font-dpr(12px);
        }
      }
      .priceGray {
        float: left;
        color: gray;
        font-weight: bold;
      }
      .price-number {
        color: #adadad;
        @include font-dpr(12px)
      }
      .member-price {
        border: 1px solid #F74848;
        padding: pr(3);
        color: #F74848;
        @include font-dpr(9px);
        vertical-align: top;
        margin-left: pr(12);
        border-radius: pr(4);
      }
      .special-price {
        border: 1px solid #ffa200;
        padding: pr(3);
        color: #ffA200;
        @include font-dpr(9px);
        border-radius: pr(4);
        vertical-align: top;
        margin-left: pr(12);
      }
    }
    .operation-wrap {
      height: pr(30);
      line-height: pr(30);
      float: right;
      display: flex;
      margin-top: pr(26);
      .num {
        @include font-dpr(14px);
        color: #545454;
        width: pr(50);
        text-align: center;
        height: pr(30);
        line-height: pr(30);
      }
    }
    .num-tip {
      height: pr(30);
      line-height: pr(30);
      width: pr(30);
      color: white;
      background-color: #e3ae28;
      border-radius: 50%;
      border: solid 1px white;
      position: absolute;
      top: pr(8);
      left: pr(85);
      right: 0;
      text-align: center;
      z-index: 11;
      @include font-dpr(9px);
      span{
        height: pr(30);
        line-height: pr(30);
        width: pr(30);
        text-align: center;
        /*position: relative;*/
        /*top: 50%;*/
        /*left: 50%;*/
      }
    }

    .info-part {
      flex: 1;
      padding-left: 17%;
      @include font-dpr(12px);
      color: #252525;
      .coupon-wrap-action {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: pr(10);
        height: pr(30);
        color: #999999;
        line-height: pr(30);
        @include font-dpr(12px)
      }
      .total-price {
        @include font-dpr(14px);
        color: #181818;
      }
      .total-price-top {
        @include font-dpr(14px);
        color: #181818;
        margin-top: pr(16);
        line-height: pr(32);
      }
      .price {
        margin-left: pr(10);
        color: #f74848;
        height: pr(32);
        font-weight: bold;
        @include font-dpr(19px);
        > span {
          @include font-dpr(14px);
          margin-right: pr(4);
        }
      }
    }
    .btn-part {
      width: pr(260);
      color: #f5f5f5;
      background-color: #f74848;
      text-align: center;
      @include font-dpr(14px);
    }
    .move_in_cart{
      animation: movecart .5s ease-in-out;
    }
    @keyframes movecart{
      0%   { transform: scale(1) }
      25%  { transform: scale(.8) }
      50%  { transform: scale(1.1) }
      75%  { transform: scale(.9) }
      100% { transform: scale(1) }
    }
    @-moz-keyframes movecart{
      0%   { transform: scale(1) }
      25%  { transform: scale(.8) }
      50%  { transform: scale(1.1) }
      75%  { transform: scale(.9) }
      100% { transform: scale(1) }
    }
    @-webkit-keyframes movecart{
      0%   { transform: scale(1) }
      25%  { transform: scale(.8) }
      50%  { transform: scale(1.1) }
      75%  { transform: scale(.9) }
      100% { transform: scale(1) }
    }
    @-o-keyframes movecart{
      0%   { transform: scale(1) }
      25%  { transform: scale(.8) }
      50%  { transform: scale(1.1) }
      75%  { transform: scale(.9) }
      100% { transform: scale(1) }
    }
  }
</style>
