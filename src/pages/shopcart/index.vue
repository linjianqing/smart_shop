<template>
  <section>
    <!--头部 -->
    <div>
      <notice-shader v-show="noticeStatus" @closeShader="closeShader"
                     :noticeInfo="noticeInfo"></notice-shader>
      <HeaderNotice ref="HeaderNotice" @click.native="noticeStatus=true" :noticeInfo="noticeInfo"
                    v-if="noticeInfo && noticeInfo.length>0"></HeaderNotice>
      <div class="line" v-else></div>   <!--专用ios 滑动闪现-->
    </div>
    <!--中间-->
    <div v-show="menuData.length > 0" class="menus-container" :style="{height:menusContainerHeight + 'px'}">
      <!-- START 左边菜单-->
      <ul class="classify-wrap">
        <li v-for="(category, index) in menuData" @click="chooseCategory(index)"
            :class="{ active: currentIndex == index }"
            class="classify-item">
          <div class="n-wrap">
            <ConnerIcon v-show="cornerNum(category.id)" class="circle_num" :categoryId='category.id'
                        v-if="category.id > 0"></ConnerIcon>
            <!-- 左边图片 -->
            <span class="category-small-icon" v-if="category.id == 0"></span>
            <!--UI 待优化，可去掉一个-->
            <span class="recommendInfo" v-show="category.id == 0">{{category.name}}</span>
            <span class="info" v-show="category.id != 0">{{category.name}}</span>
          </div>
        </li>
      </ul>
      <!--   右边菜单-->
      <section class="goods-list-wrap">
        <div id="goods-list-scroll" ref="Container" class="scroller">
          <dl v-for="(category, index) in menuData">
            <div class="category-name" ref="headHeight"><span class="small_icon"></span><span>{{category.name}}</span>
            </div>
            <!---推荐-->
            <div v-for="recommend in recommends " :key="recommend.id" ref="recommendHeight">
              <Goods v-show="category.id== 0 " :goods="recommend" @itemClick="itemClick(recommend)"
                     @optionClick="optionClick" @toast="toast" ref="recommendOutHeight"
                     :coordination.sync="coordination"></Goods>
            </div>
            <!-- 其他 -->
            <div v-for="goods in shopData " :key="goods.id" ref="goodsHeight">
              <Goods v-if="goods.categoryId == category.id" :goods="goods" @itemClick="itemClick(goods)"
                     @optionClick="optionClick" @toast="toast" ref="goodOutHeight"
                     :coordination.sync="coordination"></Goods>
            </div>
          </dl>
          <yunnex-info :style="yunnex_info" ref="yunnex"></yunnex-info>
        </div>
      </section>
    </div>
    <cart-bottom ref="CartBottom" @summitOrder="summitOrder" :isMoveCartIcon="isMoveCartIcon"></cart-bottom>
    <detail-shader v-if="DialogGoods" :goods="DialogGoods" @closeDetailShader="closeDetailShader"></detail-shader>
    <popup-banner></popup-banner>
    <global-nav></global-nav>
    <toast-show v-show="toasting" :content="content"></toast-show>
    <!-- END   -->
    <!--当所有的数据为空时，显示默认图片-->
    <div v-show="menuData.length <= 0" class="menus-empty">
      <div class="cart-empty"></div>
      <div class="info">当前无菜品</div>
    </div>
    <package-info v-if="packageInfo.isPackageShow" :packageInfo="packageInfo"
                  @packageClick="optionClick"></package-info>
    <flyAnimation :coordination="coordination" @movecart="movecart"></flyAnimation>
  </section>
</template>
<script>
  import Goods from './goods.vue'
  import HeaderNotice from '../../components/shopcart/headernotice'
  import ConnerIcon from '../../components/common/CornerIcon'
  import NoticeShader from '../../components/NoticeShader'
  import DetailShader from '../../components/Detail/DetailShader'
  import YunnexInfo from '../../components/common/YunnnexInfo'
  import ToastShow from '../../components/common/ToastShow'
  import CartBottom from '../../components/shopcart/cartbottom'
  import popupBanner from '../../pages/globalNavBar/popupBanner'
  import globalNav from '../../pages/globalNavBar/globalNav'
  import PackageInfo from '../../pages/packageInfo/packageInfo'
  import $cache from './../../utils/cache'
  import flyAnimation from '../../components/common/flyAnimation'

  export default {
    components: {
      Goods,
      HeaderNotice,
      ConnerIcon,
      NoticeShader,
      DetailShader,
      YunnexInfo,
      ToastShow,
      CartBottom,
      popupBanner,
      globalNav,
      PackageInfo,
      flyAnimation
    },
    data () {
      return {
        menusContainerHeight: 1200,
        currentIndex: 0,
        categoryTops: [],
        menuData: [],
        shopData: [],
        isShowNumber: false,
        noticeStatus: false,
        DialogGoods: '',
        toasting: false,
        content: '',
        isBottomHeight: 0,
        announce: this.$store.getters.announce,
        recommends: this.$store.getters.recommend,
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
    watch: {
      currentIndex (oldValue, newValue) {
        this.$forceUpdate()
      },
      '$route' (to, from) {
        if (from.name === 'newDetail' || from.name === 'createOrder' || from.name === 'shopIndex') {
          // 由详情页返回，恢复滚动条的位置
          this.resetCgPoint()
          this.resetPageHeight()
          if (document.getElementById('goods-list-scroll')) {
            document.getElementById('goods-list-scroll').scrollTop = this.$store.getters.goodsScrollTop
          }
        } else if (from.name === 'Payment') {
          this.backRefresh()
          this.initData()
          if (document.getElementById('goods-list-scroll')) {
            document.getElementById('goods-list-scroll').scrollTop = 0
          }
        } else {
          if (document.getElementById('goods-list-scroll')) {
            document.getElementById('goods-list-scroll').scrollTop = 0
          }
        }
      }
    },
    computed: {
      noticeInfo () {
        let announce = this.$store.getters.announce
        let noticeInfo = this.$store.getters.noticeInfo
        let temp = []
        for (let i of noticeInfo) {
          if ([1, 2].includes(i.discountType)) {
            temp.push({
              campContent: i.campContent,
              discountType: i.discountType
            })
          }
        }
        // 多个接口拼接数据 ，定义类型99为公告信息
        if (announce) {
          temp.push({
            campContent: announce,
            discountType: 99
          })
        }
        return temp
      },
      yunnex_info () {
        return this.isBottomHeight > 0 ? {'margin-top': this.isBottomHeight + 'px'} : {}
      }
    },
    created () {
      this.backRefresh()
      this.initData()
    },
    methods: {
      movecart (data) {
        this.isMoveCartIcon = data
      },
      getOrderId () {
        this.$http.post(this.$store.getters.getUrl('getOrderId')).then(res => {
          console.info(res.data)
          if (res.data.code === 0) {
            let orderId = res.data.response
            if (orderId) {
              this.$router.push({name: 'Payment', query: {'orderId': orderId}})
            }
          }
        })
      },
      backRefresh () {
        let needBack = $cache.get('needBack', false)
        $cache.del('needBack')
        if (needBack) {
          this.getOrderId()
        }
      },
      toastView: function (msg) {
        this.content = msg
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      closeDetailShader () {
        this.DialogGoods = ''
      },
      optionClick (obj) {
        // 区分是套餐弹窗还是选择规格弹窗
        if (obj.isPackageShow !== undefined) {
          this.packageInfo = {
            isPackageShow: obj.isPackageShow,
            goods: obj.goods
          }
        } else {
          this.DialogGoods = obj
          console.log('this.DialogGoods:', this.DialogGoods)
        }
      },
      toast (msg) {
        if (msg) {
          this.toastView(msg)
        }
      },
      cornerNum (id) {
        let data = this.$store.getters.getCartGoodsByCategory(id)
        let num = 0
        if (data) {
          for (let i of data) {
            num += i.quantity
          }
        }
        return num
      },
      closeShader () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '点击公告(小图)', 'click', 'notice'])
        }
        this.noticeStatus = false
      },
      summitOrder () {
        this.$store.dispatch('setGoodsScrollTop', document.getElementById('goods-list-scroll').scrollTop)
      },
      detailUrl: function (goods) {
        let tableId = this.$store.getters.tableId
        let tableName = this.$store.getters.tableName
        console.info(' index tableId-->' + tableId + 'tableName' + tableName)
        let data = {
          goodId: goods.id
        }
        if (tableId) {
          data['tableId'] = tableId
        }
        if (tableName) {
          data['tableName'] = tableName
        }
        return data
      },
      itemClick (goods) {
        // 保存之前跳转的滑动距离
        this.$store.dispatch('setGoodsScrollTop', document.getElementById('goods-list-scroll').scrollTop)
        let data = this.detailUrl(goods)
        console.info(data)
        this.$router.push({
          path: 'newDetail',
          query: data
        })
      },
      initData () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '点餐首页(小图)', 'click', 'smallPic'])
          window._hmt.push(['_trackPageview', '/smallPic'])
        }
        this.menuData = this.$store.getters.category
        this.shopData = this.$store.getters.goods
        this.resetCgPoint()
        this.resetPageHeight()
      },
      logoExitBottom () {
        let classHeight = 0
        let goodHeight = 0
        let logoHeight = 0
        let recommendHeight = 0
        if (this.$refs.headHeight && this.$refs.headHeight[0]) {
          classHeight = this.$refs.headHeight[0].clientHeight
        }
        if (this.$refs.goodOutHeight && this.$refs.goodOutHeight[0]) {
          goodHeight = this.$refs.goodOutHeight[0].$refs.goodInHeight.offsetHeight
        }
        if (this.$refs.recommendOutHeight && this.$refs.recommendOutHeight[0]) {
          recommendHeight = this.$refs.recommendOutHeight[0].$refs.goodInHeight.offsetHeight
        }
        if (this.$refs.yunnex) {
          logoHeight = this.$refs.yunnex.$el.clientHeight
        }
        let allClassHeight = this.menuData.length * classHeight
        let generalGoodsHeight = this.shopData.length * goodHeight
        let recommendGoodsHeight = this.$store.getters.recommend.length * recommendHeight
        let allHeight = allClassHeight + generalGoodsHeight + recommendGoodsHeight + logoHeight // 所有高度
        this.isBottomHeight = this.menusContainerHeight - allHeight
      },
      setScroll: function (_this) {
        let y
        document.addEventListener('touchend', function (e) {
          if (_this.$route.name === 'index') {
            document.body.scrollTop = document.documentElement.scrollTop = y - e.changedTouches[0].pageY
          }
        }, false)
        document.addEventListener('touchstart', function (e) {
          if (_this.$route.name === 'index') {
            y = e.touches[0].pageY
          }
        }, false)
      },
      setHeight: function () {
        let cartBottomHeight = 0
        let noticeHeight = 0
        if (this.$refs.CartBottom) {
          cartBottomHeight = this.$refs.CartBottom.$refs.cartWrap.offsetHeight
        }
        if (this.$refs.HeaderNotice) {
          noticeHeight = this.$refs.HeaderNotice.$el.offsetHeight
        }
        this.menusContainerHeight = window.innerHeight - cartBottomHeight - noticeHeight
        this.logoExitBottom()
      },
      setMenusContainHeight () {
        this.setHeight()
        let _this = this
        this.setScroll(_this) // 滚动卡顿1s暂时处理方案
      },
      listenCategoryChange () {
        let $curItem
        let $Container = this.$refs.Container
        this.categoryTops.some(function (item, index) {
          if (item <= $Container.scrollTop) return void ($curItem = index)
          if ($Container.scrollTop < 0) return void ($curItem = 0)
        })
        if (this.currentIndex !== $curItem) {
          this.currentIndex = $curItem
        }
      },
      chooseCategory: function (index) {
        this.currentIndex = index
        let $Container = this.$refs.Container
        let toOffsetTop = this.categoryTops[index]
        let curTop = $Container.scrollTop
        let direct = toOffsetTop - curTop > 0 ? 'bottom' : 'top'
        $Container.removeEventListener('scroll', this.listenCategoryChange)
        let interval = setInterval(() => {
          if (Math.abs(curTop - toOffsetTop) <= 20) {
            clearInterval(interval)
            $Container.scrollTop = toOffsetTop
            $Container.addEventListener('scroll', this.listenCategoryChange)
          } else {
            let rate = (toOffsetTop - curTop) / 3
            rate = Math.abs(rate) > 20 ? rate : direct === 'bottom' ? 20 : -20
            curTop += rate
            $Container.scrollTop = curTop
          }
        }, 16.7)
      },
      resetPageHeight () {
        // 页面加载好后
        this.$nextTick(() => {
          this.setMenusContainHeight()
        })
      },
      resetCgPoint () {
        // 在下个dom刷新后, 刷新每个节点的位置
        this.$nextTick(() => {
          let $Container = this.$refs.Container
          if ($Container) {
            this.categoryTops = [].slice.call($Container.querySelectorAll('dl')).map(function (el) {
              return el.offsetTop
            })
            $Container.scrollTop = this.categoryTops[this.currentIndex]
            $Container.addEventListener('scroll', this.listenCategoryChange)
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.name === 'Payment' || from.name === 'newDetail') {
          vm.backRefresh()
        }
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.setMenusContainHeight()
        window.addEventListener('resize', setTimeout(() => {
          this.setMenusContainHeight()
        }, 100))
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";
  body {
    height: 100%;
  }
  .line{
    height: pr(2);
  }
  .menus-empty {
    margin-top: pr(100);
    text-align: center;
    width: 100%;
    .cart-empty {
      @include bg-image('../../assets/img/wucaipin');
      height: pr(270);
      width: pr(270);
      margin-bottom: pr(28);
      display: inline-flex;
    }
    .info {
      @include font-dpr(12px);
      color: #adadad;
      line-height: pr(26);
    }
  }

  .menu-color {
    background: #fff;
  }

  .page-loading {
    width: 100%;
    color: #d0d0d0;
    padding-top: pr(500);
    text-align: center;
  }

  .menus-container {
    display: inline-flex;
    width: 100%;
    position: relative;
    .classify-wrap {
      height: 100%;
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      width: pr(160);
      background: #f0f0f0;
      .classify-item {
        height: pr(108);
        text-align: center;
        line-height: pr(104);
        color: #545454;
        display: block;
        @include font-dpr(13px);
        background: #f0f0f0;
        position: relative;
        border-bottom: 1px solid #e1e1e1;
        .n-wrap {
          vertical-align: middle;
        }
        .circle-bg {
          height: pr(36);
          line-height: pr(36);
          min-width: pr(35);
          float: right;
          margin-right: pr(6);
          margin-top: pr(14);
          border-radius: 50%;
          border: pr(1) solid #ffffff;
          text-align: center;
        }
        .circle_num {
          position: absolute;
          top: pr(16);
          margin-right: pr(6);
        }
        .category-small-icon {
          background-size: 100% 100%;
          background-image: url('../../assets/img/tuijian@2x.png');
          line-height: pr(32);
          width: pr(32);
          height: pr(32);
          display: inline-block;
          vertical-align: middle;
          margin-left: -12%;
        }
        .info {
          line-height: pr(38);
          vertical-align: middle;
          width: pr(104);
          @include font-dpr(12px);
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          display: inline-block;
          text-align: justify;
        }
        .recommendInfo {
          line-height: pr(38);
          vertical-align: middle;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          @include font-dpr(12px);
          display: inline-block;
        }
        &.active + .classify-item {
          &:after {
            background-color: #e1e1e1;
          }
        }
        &.active {
          background: white;
          font-weight: bold;
          &:before {
            content: "";
            width: pr(4);
            height: pr(50);
            display: block;
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: pr(-25);
          }
          &:after {
            background-color: #ffffff;
          }
        }
      }
    }
    .goods-list-wrap {
      flex: 1;
      height: 100%;
      width: 100%;
      position: relative;
      overflow-x: hidden;
      .scroller {
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        height: 100%;
        background: #fff;
        .category-name {
          color: #545454;
          @include font-dpr(12px);
          padding-left: pr(24);
          height: pr(70);
          box-sizing: border-box;
          line-height: pr(70);
          background-color: white;
          @include ellipsis(100%)
        }
        .small_icon {
          width: pr(4);
          margin-right: pr(12);
          background: #f74848;
          height: pr(24);
          margin-top: pr(-6);
          vertical-align: middle;
          display: inline-block;
        }

      }
    }
  }
</style>
