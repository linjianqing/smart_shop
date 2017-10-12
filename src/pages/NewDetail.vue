<!-- Detail.vue -->
<template>
  <div class="detail" id="scroll" :style="isStopScroll?hasScroll:noScroll">
    <detail-shader v-if="hasAttribute"
                   v-show="detailStatus"
                   :goods="goods"
                   @closeDetailShader="closeDetailShader"></detail-shader>
    <back-icon></back-icon>
    <div class="li_pic">
      <img class="item_pic" :src="goods.pic" ref="itemPic"/>
      <div class="sold_out_class" v-if="goods.soldStatus === 1" :style="{ height:itemPidClassHeight + 'px' }">
        <img class="sold_out" :style="{ height:itemPicHeight + 'px',width:itemPicHeight + 'px' }"
             src="../assets/img/yishouqin-da@2x.png"/>
      </div>
    </div>
    <div class="item_detail" ref="content">
      <div class="name_wrap">
        <div class="good_flag" v-if="goods.tagName">{{goods.tagName}}</div>
        <div class="item_name" v-show="isStatistical">{{ goods.name }}</div>
      </div>
      <div class="likeNum">已售 {{likeNums}}</div>
      <div class="sub_info">
        <div class="price_wrap">
          <span class="price" v-if="goods.price"><span>¥</span>{{ goods.price | price }}</span>
          <span class="members-content" v-if="goods.priceType===3">会员价</span>
          <span class="special-content" v-if="goods.priceType===2">特惠价</span>
        </div>
        <div class="original-price" v-if="goods.originalPrice && goods.priceType!==1">
          原价 <span>¥</span>{{goods.originalPrice | price
          }}
        </div>
        <div v-if="goods.soldStatus === 2">
          <div class="num_ti" v-if="goods.isPackage" @click.stop="optionClick({isPackageShow: true})">
            <div class="num_tip" v-show="goodsNum">{{goodsNum}}</div>
            <div class="select">选套餐</div>
          </div>
          <div v-else>
            <div v-if="hasAttribute">
              <div class="num_tip" v-show="goodsNum">{{goodsNum}}</div>
              <div class="select" :goods="goods" @click="dialog">选规格</div>
            </div>
            <cart-buy-num :goods="goods" @coordination="resultPosition" @toast="errorToast" v-else></cart-buy-num>
          </div>
        </div>

      </div>
      <div class="description_wrap">
        <div class="intro">商品描述</div>
        <div class="description">{{ goods.description }}</div>
      </div>
    </div>
    <div class="score_wrap" ref="score_header">
      <div class="customer_score">顾客评价</div>
      <div class="right_img"></div>
      <div class="total_score" @click="totalScore">{{sumComment}}条评论</div>
    </div>
    <score-item
      v-for="(item,index) in commentList"
      :key="item.id"
      :commentItem="item"
      @goDetail="goDetail"
    ></score-item>
    <yunnex-info :style="yunnex_info" ref="yunnex"></yunnex-info>
    <toast-show v-show="toasting" :content="content"></toast-show>
    <flyAnimation :coordination="coordination" @movecart="movecart"></flyAnimation>
    <cart-bottom ref="CartBottom" @isShowDetail="isShowDetail" :isMoveCartIcon="isMoveCartIcon"></cart-bottom>
    <Loading v-if="isLoading"></Loading>
    <package-info v-if="packageInfo.isPackageShow" :packageInfo="packageInfo"
                  @packageClick="optionClick"></package-info>
    <default-detail @goBack="goBack" v-if="isShowDefault"></default-detail>
  </div>
</template>
<style lang="scss" type="text/scss" scoped>
  @import "../assets/css/base";

  .likeNum {
    color: #adadad;
    @include font-dpr(13px);
    height: pr(26);
    margin-top: pr(10);
  }

  .item_pic {
    width: 100%;
    height: pr(564);
  }

  .name_wrap {
    height: pr(38);
    display: inline;
    .good_flag {
      margin-top: pr(4);
      float: left;
      border-radius: pr(4);
      padding: pr(2) pr(4) pr(2) pr(4);
      text-align: center;
      border: solid 1px #f74848;
      vertical-align: text-top;
      color: #F74848;
      margin-right: pr(12);
      @include font-dpr(10px);
      line-height: pr(25);
    }
    .item_name {
      line-height: pr(38);
      @include font-dpr(15px);
      color: #252525;
      font-weight: bold;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .original-price {
    margin-top: pr(8);
    color: #adadad;
    @include font-dpr(11px);
    > span {
      margin-right: pr(2);
      @include font-dpr(9px);
    }
  }

  .detail {
    margin-bottom: pr(100);
    width: 100%;
    position: relative;
  }

  .score_wrap {
    text-align: center;
    height: pr(90);
    line-height: pr(90);
    background: white;
    margin-top: pr(12);
    border-bottom: 1px solid #e1e1e1;
    .customer_score {
      @include font-dpr(14px);
      color: #181818;
      float: left;
      padding-left: pr(24);
    }
    .right_img {
      background-size: 100% 100%;
      background-image: url('../assets/img/comment/zk@2x.png');
      float: right;
      height: pr(30);
      width: pr(16);
      margin-top: pr(30);
      margin-right: pr(24);
      margin-left: pr(12);
    }
    .total_score {
      float: right;
      @include font-dpr(13px);
      color: #757575;
    }
  }
  .num_tip {
    height: pr(30);
    line-height: pr(30);
    width: pr(30);
    color: white;
    background-color: #f74848;
    border-radius: 50%;
    border: solid 1px white;
    position: absolute;
    top: pr(-7);
    right: 0;
    text-align: center;
    z-index: 2;
    @include font-dpr(9px);
  }

  .li_pic {
    position: relative;
  }

  img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }

  .sold_out_class {
    position: absolute;
    top: 0;
    left: 0;
    width: pr(750);
    max-width: 100%;
    max-height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .sold_out {
    justify-content: center;
  }

  .item_detail {
    background-color: white;
    padding: pr(30) pr(24) pr(24) pr(24);
  }

  .sub_info {
    position: relative;
    height: pr(62);
    .price_wrap {
      height: pr(38);
      margin-top: pr(18);
      display: inline-flex;
      align-items: center;
      .price {
        line-height: pr(38);
        @include font-dpr(19px);
        color: #f74848;
        font-weight: bold;
        > span {
          margin-right: pr(6);
          @include font-dpr(14px);
        }
      }
      .members-content {
        line-height: pr(26);
        height: pr(26);
        margin-left: pr(6);
        color: #f74848;
        @include font-dpr(10px);
        border: 1px solid #f74848;
        vertical-align: text-top;
        display: inline;
        border-radius: pr(4);
        padding: pr(2) pr(4) pr(2) pr(4);
        background: #ffe9e8;
      }
      .special-content {
        line-height: pr(26);
        height: pr(26);
        margin-left: pr(6);
        color: #fe9500;
        @include font-dpr(10px);
        border: 1px solid #fe9500;
        vertical-align: text-top;
        display: inline;
        border-radius: pr(4);
        padding: pr(2) pr(4) pr(2) pr(4);
        background: #fff4d8;
      }
    }
    .select {
      position: absolute;
      bottom: pr(4);
      right: 0;
      display: inline-block;
      background-image: url("../assets/img/xuanguige-da-@2x.png");
      background-size: 100% 100%;
      width: pr(124);
      height: pr(50);
      line-height: pr(50);
      text-align: center;
      color: #ffffff;
      @include font-dpr(12px);
    }
  }

  @mixin main_text {
    line-height: pr(38);
    @include font-dpr(14px);
  }

  .intro {
    margin-top: pr(24);
    @include main_text;
    color: #7d7d7d;
  }

  .description_wrap {
    margin-top: pr(50);
    border-top: 1px solid #e1e1e1;
  }

  .description {
    margin-top: pr(12);
    @include main_text;
    color: #252525;
    @include font-dpr(14px);
    text-align: justify;
    word-break: break-all;
  }

  .move-enter-active, .move-leave-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: all .4s;
    div {
      transform: rotate(0);
      transition: all .4s;
    }
  }

  .move-enter, .move-leave-to {
    opacity: 0;
    transform: translate3d(24px, 0, 0);
    transition: all .4s;
    div {
      transform: rotate(360deg);
      transition: all .4s;
    }
  }
</style>
<script>
  import $utils from '../utils/index'
  import BackIcon from '../components/common/BackIcon'
  import DetailShader from '../components/Detail/DetailShader'
  import ToastShow from '../components/common/ToastShow'
  import CartBottom from '../components/shopcart/cartbottom'
  import ScoreItem from '../components/Detail/ScoreItemDetail'
  import YunnexInfo from '../components/common/YunnnexInfo'
  import Loading from '../components/common/Loading'
  import PackageInfo from '../pages/packageInfo/packageInfo'
  import DefaultDetail from '../components/common/DefaultShopDetail'
  import cartBuyNum from '../components/common/CartBuyNum'
  import flyAnimation from '../components/common/flyAnimation'

  export default {
    data () {
      return {
        detailStatus: false,
        theLock: true,
        itemPidClassHeight: 0,
        itemPicHeight: 0,
        toasting: false,
        content: '',
        shopSerial: this.$store.getters.shopSerial,
        branchId: this.$store.getters.branchId,
        tableId: this.$route.query.tableId || this.$store.getters.tableId,
        tableName: this.$route.query.tableName || this.$store.getters.tableName,
        commentList: [],
        goods: {},
        likeNums: 0,
        sumComment: 0,
        isBottomHeight: 0,
        itemHeight: 0,
        isLoading: false,
        isShowDefault: false,
        isStopScroll: false, // 是否禁用滚动条
        packageInfo: {
          isPackageShow: false,
          goods: ''
        },
        coordination: {
          pageX: 0,
          pageY: 0,
          time: 0
        },
        isMoveCartIcon: false
      }
    },
    computed: {
      hasScroll () {
        return {
          'position': 'fixed',
          'overflow-y': 'initial',
          'height': this.windowHeight + 'px'
        }
      },
      noScroll () {
        return {
          'position': 'relative',
          'overflow-y': 'auto',
          'height': this.windowHeight + 'px'
        }
      },
      yunnex_info () {
        let height = this.isBottomHeight - this.itemHeight
        return height > 0 ? {'margin-top': height + 'px'} : {}
      },
      isStatistical () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '商品详情界面', 'click', 'detail'])
          window._hmt.push(['_trackPageview', '/detail'])
        }
        return true
      },
      hasAttribute () {
        if (this.goods && (this.goods.productAttrsList || this.goods.tastes)) {
          return (this.goods.productAttrsList.length > 0 || this.goods.tastes.length > 0) && this.goods.soldStatus !== 1
        }
      },
      goodsNum () {
        let goods = this.$store.getters.getCartGoodsById(this.goods.id)
        return $utils.combineByKey(goods, 'quantity')
      }
    },
    components: {
      BackIcon,
      DetailShader,
      ToastShow,
      CartBottom,
      ScoreItem,
      YunnexInfo,
      Loading,
      PackageInfo,
      DefaultDetail,
      cartBuyNum,
      flyAnimation
    },
    watch: {
      '$route' (to, from) {
        if (from.name === 'newDetail') {
          this.getDetailInfo()
        }
      }
    },
    mounted () {
      let picHeight = 0
      if (this.$refs.itemPic) {
        picHeight = this.$refs.itemPic.clientHeight
      }
      this.itemPicHeight = picHeight > 750 ? 750 : picHeight
      this.itemPidClassHeight = picHeight
      this.$nextTick(() => {
        let contentHeight = this.$refs.content.clientHeight
        let scoreHeight = this.$refs.score_header.clientHeight
        let bottomHeight = 0
        if (this.$refs.CartBottom) {
          bottomHeight = this.$refs.CartBottom.$refs.cartWrap.offsetHeight * 2
        }
        let logoHeight = this.$refs.yunnex.$el.clientHeight
        this.isBottomHeight = window.innerHeight - contentHeight - scoreHeight - bottomHeight - logoHeight - picHeight
        this.windowHeight = window.innerHeight
      })
    },
    created () {
      this.getDetailInfo()
      // 如果是从店铺首页直接进来商品详情页的话，这里要拉一次菜单获取“tastes”字段
      if (this.$store.getters.goods.length === 0) {
        this.getMenuList()
      }
    },
    deactivated () {
      this.$destroy(true)
    },
    methods: {
      // 底部图标动一下标识
      movecart (data) {
        this.isMoveCartIcon = data
      },
      // 异常提示，兼容其它手机，抛出来处理
      errorToast (msg) {
        if (msg) {
          this.toastView(msg)
        }
      },
      // 动画位置信息
      resultPosition (data) {
        this.coordination = {pageX: data.pageX, pageY: data.pageY, time: data.time}
      },
      goBack () {
        this.$router.go(-1)
      },
      optionClick (obj) {
        // 以下两句代码很挫，只是为了兼容其他套餐弹窗
        this.packageInfo.goods = this.goods
        this.packageInfo.isPackageShow = obj.isPackageShow
      },
      isShowDetail (isShowDetail) {
        this.isStopScroll = isShowDetail
        if (isShowDetail) {
          this.$store.dispatch('setGoodsScrollTop', document.getElementById('scroll').scrollTop)
          document.getElementById('scroll').style.top = -this.$store.getters.goodsScrollTop + 'px'
        } else {
          document.getElementById('scroll').style.top = '0px'
        }
      },
      dialog () {
        this.$store.dispatch('setGoodsScrollTop', document.getElementById('scroll').scrollTop)
        this.detailStatus = this.isStopScroll = true
        document.getElementById('scroll').style.top = -this.$store.getters.goodsScrollTop + 'px'
        //        document.getElementById('scroll').style.scrollTop = this.$store.getters.goodsScrollTop + 'px'
      },
      setHeight (height) {
        console.info(height)
        this.itemHeight = height
      },
      goDetail (goodId) {
        this.$router.push({
          path: 'newDetail',
          query: {
            goodId: goodId
          }
        })
      },
      totalScore () {
        if (this.sumComment < 1) {
          return this.toastView('暂无评论')
        }
        this.$router.push({
          name: 'commentList',
          query: {
            goodId: this.goods.id
          }
        })
      },
      getGoodsInfo () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '下单页', 'click', 'detail'])
          window._hmt.push(['_trackPageview', '/detail'])
        }
        let id = this.$route.query.goodId
        this.$http.post(this.parseUrl('/menu/goods_info'), {goodsId: id}).then((res) => {
          console.info(res)
          this.isLoading = false
          let result = res.data.response
          if (res.data.code === 0) {
            this.goods = result.goodsInfo
            this.commentList = result.commentList
            this.likeNums = this.goods.saleCount
            this.sumComment = result.sumComment
            document.body.scrollTop = 0
            this.isShowDefault = false
          } else {
            this.isShowDefault = true
            //            this.toastView(res.data.message)
          }
        })
      },
      getShopInfo () {
        this.$http.post(this.parseUrl('/config/get_config_info'), {}).then((res) => {
          console.info(res)
          if (res.data.code === 0) {
            this.$store.dispatch('setShopInfo', res.data.response)
            this.getGoodsInfo()
          } else {
            this.isLoading = false
          }
        })
      },
      getDetailInfo () {
        // 刷新时数据被清需要判断
        let shopInfo = this.$store.getters.shopInfo
        if (this.tableId && this.tableName) {
          this.$store.dispatch('setTableId', this.tableId)
          this.$store.dispatch('setTableName', this.tableName)
        }
        this.isLoading = true
        if (shopInfo && shopInfo.branchId) {
          this.getGoodsInfo()
        } else {
          this.getShopInfo()
        }
      },
      // 基本BaseUrl 有环境配置信息 shopSerial 商户Id  branchId 门店id  orderId 是生成的订单id
      parseUrl (methods) {
        return this.$store.getters.getBaseUrl + methods + '?shopSerial=' + this.shopSerial + '&branchId=' + this.branchId
      },
      toastView: function (msg) {
        this.content = msg
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      closeDetailShader () {
        this.isStopScroll = this.detailStatus = false
        document.getElementById('scroll').style.top = '0px'
      },

      getMenuList () {
        this.$http.post(this.$store.getters.getUrl('getMenuList'), {}).then(res => {
          if (res.data.code !== 0) {
            console.error(`getMenuList返回错误: ${res.data.message}`)
            return -1
          }
          this.$store.dispatch('setShopData', res.data.response)
        })
      }
    }
  }
</script>
