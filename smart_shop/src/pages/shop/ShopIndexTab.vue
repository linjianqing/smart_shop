<template>
  <div>
    <div class="shop_coupon_wrap" v-if="isShowCoupon" ref="coupon_wrap">
      <div class="coupon_tips">
        <div class="text">本店优惠</div>
      </div>
      <div class="coupon_bg">
        <div class="coupon_wrap">
          <shop-index-coupon v-for="(item,index) in shopInfo.couponConfigist" :key="item.id" :coupon="item"
                             @clickCoupon="clickCoupon"></shop-index-coupon>
        </div>
      </div>
    </div>
    <div class="line_wrap" v-if="(isShowCoupon && isShowRecommend) || (isShowCoupon && isShowAdconfig)"></div>
    <div class="recommend_wrap" v-if="isShowRecommend" ref="recommend_wrap">
      <div class="recommend_tips">
        <div class="text">推荐单品</div>
        <div @click="goIndex">
          <div class="default_right"></div>
          <div class="check_more">查看更多</div>
        </div>
      </div>
      <div class="container">
        <ul class="ul_wrap">
          <li v-for="(item,index) in recommend" :key="item.id" v-if="index<6">
            <div class="bg_wrap" @click="goDetail(item)">
              <div class="bg_text">{{item.name}}</div>
              <img class="bg_img"/>
              <img v-lazy="item.pic" alt="" class="default_img"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="line_wrap" v-if="isShowRecommend && isShowAdconfig"></div>
    <div class="hot_wrap" v-if="isShowAdconfig" ref="hot_wrap">
      <div class="recommend_tips">
        <div class="text">热门活动</div>
      </div>
      <div class="hot_activity">
        <div v-for="(item,index) in shopInfo.adConfigList" :key="item.id">
          <img v-lazy="item.adPic" alt="" class="hot_img" @click="goAdvert(item.adUrl)">
        </div>
      </div>
    </div>
    <yunnex-info :style="yunnex_info" ref="yunnex"></yunnex-info>
    <toast-info :content="content" :img="toastImg" v-if="isShowToast"></toast-info>
  </div>
</template>

<script>
  import ShopIndexCoupon from '../shop/ShopIndexCoupon.vue'
  import ToastInfo from '../../components/common/ToastInfo.vue'
  import successCoupon from '../../assets/img/shopHome/Coupon@2x.png'
  import failCoupon from '../../assets/img/shopHome/membershipcardfail@2x.png'
  import YunnexInfo from '../../components/common/YunnnexInfo'
  import $cache from './../../utils/cache'

  export default {
    data () {
      return {
        isShowToast: false,
        content: '',
        toastImg: '',
        isBottomHeight: 0,
        tableId: this.$store.getters.tableId || this.$route.query.tableId,
        tableName: this.$store.getters.tableName || this.$route.query.tableName
      }
    },
    components: {
      ShopIndexCoupon,
      ToastInfo,
      YunnexInfo
    },
    computed: {
      isShowAdconfig () {
        return this.shopInfo.adConfigList && this.shopInfo.adConfigList.length > 0
      },
      yunnex_info () {
        let height = this.isBottomHeight - this.headerHeight
        let data = {
          'position': 'absolute',
          'bottom': '0px',
          'background-color': '#eeeeee'
        }
        return height > 0 ? data : {}
      },
      isShowCoupon () {
        return this.shopInfo.couponConfig === 1 && this.shopInfo.couponConfigist.length > 0
      },
      isShowRecommend () {
        return this.shopInfo.recommendConfig === 1 && this.recommend.length > 0
      }
    },
    props: ['shopInfo', 'recommend', 'headerHeight'],
    updated () {
      this.$nextTick(() => {
        let couponHeight = this.$refs.coupon_wrap ? this.$refs.coupon_wrap.clientHeight : 0
        let recommendHeight = this.$refs.recommend_wrap ? this.$refs.recommend_wrap.clientHeight : 0
        let hotHeight = this.$refs.hot_wrap ? this.$refs.hot_wrap.clientHeight : 0
        let logoHeight = this.$refs.yunnex ? this.$refs.yunnex.$el.clientHeight : 0
        this.isBottomHeight = window.innerHeight - couponHeight - recommendHeight - hotHeight - logoHeight
      })
    },
    methods: {
      showToastInfo (content, toastImg) {
        this.content = content
        this.toastImg = toastImg
        this.isShowToast = true
        setTimeout(() => {
          this.isShowToast = false
        }, 3000)
      },
      goAdvert (url) {
        $cache.set('tableId', this.tableId, 60)
        $cache.set('tableName', this.tableName, 60)
        window.location.href = url
      },
      clickCoupon (result) {
        if (!result) return
        if (result.code === 0) {
          this.showToastInfo('成功领取优惠劵', successCoupon)
        } else {
          this.showToastInfo(result.message, failCoupon)
        }
      },
      goIndex () {
        this.$router.push({name: 'index'})
      },
      goDetail (item) {
        let data = {
          goodId: item.id
        }
        if (this.tableId) {
          data['tableId'] = this.tableId
        }
        if (this.tableName) {
          data['tableName'] = this.tableName
        }
        this.$router.push({
          path: 'newDetail',
          query: data
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";
  /*.yunnex {*/
  /*background-color: #eeeeee;*/
  /*}*/
  .line_wrap{
    height: pr(10);
    width: 100%;
    background-color: #eeeeee;
  }
  .coupon_bg {
    background-color: white;
    height: 100%;
  }

  .coupon_wrap {
    width: 100%;
    margin-bottom: pr(46);
  }

  .shop_coupon_wrap {
    width: 100%;
    height: auto;
    background-color: white;
    /*border-bottom: pr(10) solid #eeeeee;*/
  }

  .hot_wrap {
    background-color: white;
    height: 100%;
    width: 100%;
  }

  .hot_img {
    height: pr(300);
    width: pr(700);
    line-height: pr(300);
    margin-bottom: pr(16);
    border-radius: pr(2);
    border: 1px solid #e1e1e1;
  }

  .hot_activity {
    height: 100%;
    width: pr(700);
    margin-left: 3.5%;
    display: inline-block;
    margin-bottom: pr(46);
  }

  .coupon_tips {
    height: pr(122);
    width: 100%;
    display: flex;
    line-height: pr(122);
    .text {
      width: 100%;
      height: pr(122);
      color: #181818;
      @include font-dpr(15px);
      line-height: pr(122);
      margin-left: pr(24);
    }
  }

  .recommend_wrap {
    background-color: white;
  }

  .recommend_tips {
    height: pr(122);
    display: inline-block;
    width: 100%;
    .text {
      height: pr(90);
      color: #252525;
      line-height: pr(122);
      margin-left: pr(24);
      @include font-dpr(15px);
      float: left;
    }
    .check_more {
      float: right;
      @include font-dpr(14px);
      color: #999999;
      line-height: pr(122);
    }
    .default_right {
      margin-right: pr(24);
      background-image: url('../../assets/img/shopHome/zhankai@2x.png');
      width: pr(20);
      height: pr(34);
      margin-top: pr(42);
      margin-left: pr(10);
      float: right;
      background-size: 100% 100%;
      line-height: pr(122);
      border: 0;
    }
  }

  .container {
    margin: 0 auto;
    overflow-x: hidden;
    width: 100%;
  }

  .ul_wrap {
    display: flex;
    flex-wrap: wrap;
    margin-left: 3.5%;
    margin-bottom: pr(30);
    li {
      width: pr(228);
      margin-right: pr(8);
      margin-bottom: pr(8);
      text-align: center;
    }
  }

  .bg_text {
    height: pr(48);
    width: pr(228);
    line-height: pr(48);
    margin-top: 24%;
    position: absolute;
    z-index: 3;
    color: white;
    @include font-dpr(13px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .default_img {
    background-image: url('../../assets/img/shopHome/morencaipin@2x.png');
    background-size: 100% 100%;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    height: 100%;
    width: auto
  }

  .bg_img {
    height: pr(48);
    width: pr(228);
    border-radius: pr(2);
    background-size: 100% 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 2;
    margin-top: 24%;
  }

  .bg_wrap {
    height: pr(228);
    line-height: pr(228);
    left: 20%;
    overflow: hidden;
  }

</style>
