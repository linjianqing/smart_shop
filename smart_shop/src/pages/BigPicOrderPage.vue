<template>
  <section class="container" ref="main_page" @scroll="scroll_action">
    <div ref="headNotice">
      <notice :noticeInfo="noticeInfo" v-if="noticeInfo && noticeInfo.length>0" @click.native="noticeStatus=true">
      </notice>
    </div>
    <div v-if="category.length">
      <div ref="topbar">
        <topbar :category="category"
                :recommend="recommend"
                :showIndex="showIndex"
                :style="topbar_fixed"
                @changeCategory="showChild"></topbar>
      </div>
      <div class="cont_ul" ref="cont_ul">
        <big-pic-list v-for="goods in currentGoods"
                      class="cont_li"
                      :key="goods.id"
                      :goods="goods"
                      :coordination.sync="coordination"
                      @openDetailShader="openDetail" @toast="toast" @optionClick="optionClick"></big-pic-list>
      </div>
    </div>
    <no-item v-else></no-item>

    <notice-shader v-show="noticeStatus" :noticeInfo="noticeInfo" @closeShader="closeShader"></notice-shader>
    <detail-shader v-if="detailStatus"
                   :goods="activeGoods"
                   @closeDetailShader="closeShader"></detail-shader>
    <yunnex-info :style="yunnex_info"></yunnex-info>
    <cart-bottom ref="cart"></cart-bottom>
    <flyAnimation :coordination="coordination" @movecart="movecart"></flyAnimation>
    <toast-show v-show="toasting" :content="content"></toast-show>
    <global-nav></global-nav>
    <popup-banner></popup-banner>
    <package-info v-if="packageInfo.isPackageShow" :packageInfo="packageInfo"
                  @packageClick="optionClick"></package-info>
  </section>
</template>

<style lang="scss" type="text/scss" scoped>
  @import "../assets/css/base";

  .container {
    height: pr(1344);
    margin: 0 auto;
    overflow-x: hidden;
  }

  .cont_ul {
    padding: pr(10) pr(10) 0 pr(10);
    display: flex;
    flex-wrap: wrap;
  }

  .cont_li {
    &:nth-child(even) {
      margin-left: pr(10);
    }
    &:last-child, &:nth-last-child(2) {
      margin-bottom: 0;
    }
  }
</style>

<script>
  import { mapGetters } from 'vuex'
  import Notice from '../components/shopcart/headernotice'
  import Topbar from '../components/BigPicOrderPage/Topbar'
  import BigPicList from '../components/BigPicOrderPage/BigPicList'
  import NoticeShader from '../components/NoticeShader'
  import DetailShader from '../components/Detail/DetailShader'
  import CartBottom from '../components/shopcart/cartbottom'
  import NoItem from '../components/noItem'
  import YunnexInfo from '../components/common/YunnnexInfo'
  import ToastShow from '../components/common/ToastShow'
  import popupBanner from '../pages/globalNavBar/popupBanner'
  import globalNav from '../pages/globalNavBar/globalNav'
  import PackageInfo from '../pages/packageInfo/packageInfo'
  import $cache from './../utils/cache'
  import flyAnimation from '../components/common/flyAnimation'

  export default {
    components: {
      Notice,
      Topbar,
      BigPicList,
      NoticeShader,
      DetailShader,
      CartBottom,
      NoItem,
      YunnexInfo,
      ToastShow,
      popupBanner,
      globalNav,
      PackageInfo,
      flyAnimation
    },
    data () {
      return {
        noticeStatus: false,
        detailStatus: false,
        showIndex: 0,        // 目前显示的tab的categoryId，推荐那些的另外设置
        activeGoods: null,   // 传给“选规格”弹窗的商品信息
        toasting: false,
        content: '',
        menuHeight: 0,
        scrollTop: 0,
        offsetTop: 0,
        topbarHeight: 0,
        windowHeight: window.innerHeight,
        packageInfo: {
          isPackageShow: false,
          goods: ''
        },
        isMoveCartIcon: false,
        coordination: {
          pageX: 0,
          pageY: 0,
          time: 0
        }
      }
    },
    computed: {
      topbar_fixed () {
        let fixTop = {
          position: 'fixed',
          top: 0
        }
        return this.scrollTop > this.offsetTop + 100 ? fixTop : {}
      },
      ...mapGetters(['category', 'recommend']),
      currentGoods () {
        return this.showIndex ? this.$store.getters.getGoodsByCategory(this.showIndex) : this.recommend
      },
      yunnex_info () {
        let buttom = {
          position: 'fixed',
          bottom: '1.5rem'
        }
        let normal = {
          'margin-bottom': '1.5rem'
        }
        return window.innerHeight > this.menuHeight + this.topbarHeight + 100 ? buttom : normal
      },
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
      }
    },
    watch: {
      '$route' (to, from) {
        if (from.name === 'Payment') {
          this.backRefresh()
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.name === 'Payment' || from.name === 'newDetail') {
          vm.backRefresh()
        }
      })
    },
    created () {
      this.backRefresh()
      this.isStatistical()
      this.initData()
    },
    mounted () {
      this.menuHeight = this.$refs.cont_ul.scrollHeight
      this.offsetTop = this.$refs.topbar.offsetTop
      this.topbarHeight = this.$refs.topbar.scrollHeight + this.$refs.headNotice.scrollHeight
    },
    updated () {
      this.menuHeight = this.$refs.cont_ul.scrollHeight
    },
    methods: {
      movecart (data) {
        this.isMoveCartIcon = data
      },
      backRefresh () {
        let needBack = $cache.get('needBack', false)
        $cache.del('needBack')
        if (needBack) {
//          location.reload() // 不做刷新，体验差 只返回订单界面，
          this.getOrderId()
        }
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
      scroll_action () {
        this.scrollTop = this.$refs.main_page.scrollTop
      },
      isStatistical () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '点餐双栏', 'click', 'bigPic'])
          window._hmt.push(['_trackPageview', '/bigPic'])
        }
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
      toastView: function (msg) {
        this.content = msg
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      toast (data) {
        if (data) {
          this.toastView(data)
        }
      },
      initData () {
        this.showIndex = this.category[0].id
      },
      //      子组件响应的方法
      showChild (data) {
        console.info(data)
        this.showIndex = data
      },
      closeShader () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '点击公告(大图)', 'click', 'notice'])
          console.info(window._hmt)
        }
        this.noticeStatus = false
        this.detailStatus = false
      },
      openDetail (goods) {
        this.activeGoods = goods
        this.detailStatus = true
      }
    },
    props: ['notice']
  }
</script>
