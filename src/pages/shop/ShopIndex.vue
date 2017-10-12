<template>
  <div class="contain">
    <div class="header_wrap" ref="branch">
      <div class="img_wrap">
        <img v-lazy="branch.branchIcon" alt="">
      </div>
      <div class="shop_info">
        <div class="shop_name">{{branch.name}}</div>
        <div class="tel_wrap" @click="phoneCall">
          <div class="shop_tel"></div>
          <div class="tel_text">{{branch.phoneNumber}}</div>
        </div>
        <div class="map_wrap">
          <div class="shop_map"></div>
          <div class="map_text"><span>{{branch.address}}</span></div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="function_wrap" ref="function">
      <div class="wrap" @click="actionCall">
        <div class="call_img" v-if="isActionCall"></div>
        <div class="default_call_img" v-else></div>
        <div class="call_text" :class="isActionCall?'hasConfig':'noConfig'">呼叫店员</div>
      </div>
      <div class="wrap" @click="wifiConfig">
        <div class="wifi_img" v-if="isWifiConfig"></div>
        <div class="default_wifi_img" v-else></div>
        <div class="wifi_text" :class="isWifiConfig?'hasConfig':'noConfig'">店内wifi</div>
      </div>
      <div class="wrap" @click="actionOrder">
        <div class="food_img" v-if="isActionOrder"></div>
        <div class="default_food_img" v-else></div>
        <div class="food_text" :class="isActionOrder?'hasConfig':'noConfig'">堂食点菜</div>
      </div>
    </div>
    <ul class="tabs" ref="tabs" v-if="shopInfo.commentConfig===1">
      <li class="li-tab" v-for="(item,index) in tabsParam"
          @click="toggleTabs(index)"
          :class="{active:index==nowIndex}">{{item}}
        <div class="indexLine" v-show="index==nowIndex"></div>
      </li>
    </ul>
    <!--tab 1-->
    <div class="divTab" v-show="nowIndex===0">
      <shop-index-tab :shopInfo="shopInfo" :recommend="recommend" :headerHeight="headerHeight"></shop-index-tab>
    </div>
    <!--tab 2-->
    <div class="divTab" v-show="nowIndex===1" v-if="shopInfo.commentConfig===1">
      <shop-index-score-tab :shopScore="shopInfo.commentType" :headerHeight="headerHeight" :flag='nowIndex===1'></shop-index-score-tab>
    </div>
    <wifi-dialog v-if="isShowWifi" :loginName="shopInfo.wifiConfigList.loginName"
                 :password="shopInfo.wifiConfigList.password" @showWifiInfo="isShowWifi=false"></wifi-dialog>
    <ToastShow v-show="toasting" :content="content"></ToastShow>
    <loading v-if="isLoading"></loading>
    <call-waiter v-if="isSHowCallWaiter" :callContentList="shopInfo.callContentList"
                 @closeShader="closeShader"></call-waiter>
    <global-nav></global-nav>
    <popup-banner></popup-banner>
  </div>
</template>

<script>
  import ShopIndexTab from '../shop/ShopIndexTab.vue'
  import ShopIndexScoreTab from '../shop/ShopIndexScoreTab.vue'
  import WifiDialog from '../../components/common/WifiDialog.vue'
  import ToastShow from '../../components/common/ToastShow'
  import Loading from '../../components/common/Loading'
  import CallWaiter from '../../components/common/CallWaiter.vue'
  import popupBanner from '../../pages/globalNavBar/popupBanner'
  import globalNav from '../../pages/globalNavBar/globalNav'

  export default {
    data () {
      return {
        tabsParam: ['店铺首页', '店铺评价'],
        nowIndex: 0, // 默认第一个tab为激活状态
        isShowWifi: false,
        wifiConfigList: {},
        branch: {},
        shopInfo: {},
        toasting: false,
        isLoading: false,
        content: '',
        shopSerial: this.$store.getters.shopSerial || this.$route.query.shopSerial,
        branchId: this.$store.getters.branchId || this.$route.query.branchId,
        tableId: this.$store.getters.tableId,
        tableName: this.$store.getters.tableName,
        isSHowCallWaiter: false,
        recommend: [],
        headerHeight: 0
      }
    },
    created () {
      this.getHome()
    },
    components: {
      ShopIndexTab,
      ShopIndexScoreTab,
      WifiDialog,
      ToastShow,
      Loading,
      CallWaiter,
      popupBanner,
      globalNav
    },
    computed: {
      isActionOrder () {
        return this.shopInfo && this.shopInfo.actionOrder === 1
      },
      isActionCall () {
        return this.shopInfo && this.shopInfo.actionCall === 1 && this.shopInfo.callContentList.length > 0 && this.$store.getters.businessType === 0 && this.$store.getters.tableId !== 0
      },
      isWifiConfig () {
        return this.shopInfo && this.shopInfo.wifiConfig === 1 && this.wifiConfigList.loginName
      }
    },
    mounted () {
      this.$nextTick(() => {
        let brachHeight = 0
        let functionHeight = 0
        let tabsHeight = 0
        if (this.$refs.branch) {
          brachHeight = this.$refs.branch.clientHeight
        }
        if (this.$refs.function) {
          functionHeight = this.$refs.function.clientHeight
        }
        if (this.$refs.tabs) {
          tabsHeight = this.$refs.tabs.clientHeight
        }
        this.headerHeight = brachHeight + functionHeight + tabsHeight
      })
    },
    watch: {
      '$route' (to, from) {
        if (from.name === 'newDetail') {
          this.getHome()
        }
      }
    },
    methods: {
      showToast (content) {
        this.content = content
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      getRecommend (shopInfo) {
        console.info('请求推荐的开关(1开启0关闭) --->' + shopInfo.recommendConfig)
        // 开关是开启状态才请求 1是开启  0是关闭
        if (shopInfo.recommendConfig === 1) {
          this.$http.post(this.$store.getters.getUrl('getMenuList'), {}).then((res) => {
            console.info(res)
            let result = res.data
            if (result.code === 0) {
              this.recommend = result.response.recommend
            } else {
              this.showToast(res.data.message)
            }
          })
        }
      },
      shopHomeInfo () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '店铺道页', 'click', 'shopIndex'])
          window._hmt.push(['_trackPageview', '/shopIndex'])
        }
        this.$http.post(this.$store.getters.getUrl('shopHome', false), {}).then((res) => {
          console.info(res)
          let result = res.data
          this.isLoading = false
          if (result.code === 0) {
            this.shopInfo = result.response
            this.branch = this.shopInfo.branch
            this.wifiConfigList = this.shopInfo.wifiConfigList
            this.getRecommend(this.shopInfo)
          } else {
            this.showToast(result.message)
          }
        })
      },
      getHome () {
        console.info(`shopSerial:${this.shopSerial},branchId:${this.branchId},tableId:${this.tableId},tableId:${this.tableId},tableName:${this.tableName},`)
        this.isLoading = true
        if (this.shopSerial && this.branchId) {
          this.$store.dispatch('setShopSerial', this.shopSerial)
          this.$store.dispatch('setBranchId', this.branchId)
        } else {
          console.error('shopIndex shopSerial or branchId  error')
        }
        this.shopHomeInfo()
      },
      toggleTabs (index) {
        this.nowIndex = index
      },
      phoneCall () {
        window.location.href = 'tel:' + this.branch.phoneNumber
      },
      actionCall () {
        if (this.isActionCall) {
          this.isSHowCallWaiter = true
        } else {
          this.showToast('商户未开启此功能')
        }
      },
      closeShader () {
        this.isSHowCallWaiter = false
      },
      wifiConfig () {
        if (this.isWifiConfig) {
          this.isShowWifi = true
        } else {
          this.showToast('商户未开启此功能')
        }
      },
      actionOrder () {
        if (this.isActionOrder) {
          this.$router.push({name: 'index'})
        } else {
          this.showToast('商户未开启此功能')
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";
  .hasConfig{
    color: #181818;
  }
  .noConfig{
    color: #999999;
  }
  .line {
    display: flex;
    height: 1px;
    width: 93%;
    background-color: #e1e1e1;
    margin-left: pr(24);
    margin-right: pr(24);
  }

  .indexLine {
    height: pr(4);
    width: 30%;
    left: 35%;
    background-color: #F74848;
    position: relative;
    margin-top: pr(-2)
  }

  .active {
    /*background: white;*/
    @include font-dpr(15px);
    color: #181818;
    font-weight: bold;
  }

  .tabs {
    width: 100%;
    height: pr(100);
    line-height: pr(100);
    @include font-dpr(15px);
    padding: 0;
    color: #999999;
    border-bottom: 1px solid #e1e1e1;
  }

  .li-tab {
    width: 50%;
    height: 100%;
    display: inline-block;
    text-align: center;
    @include font-dpr(15px)
  }

  .divTab {
    width: 100%;
    background-color: #eeeeee;
    /*display: inline-block;*/
  }

  .function_wrap {
    height: pr(190);
    line-height: pr(190);
    width: 100%;
    display: flex;
    border-bottom: pr(12) solid #eeeeee;
  }

  .wrap_test {
    width: 33.33%;
    text-align: center;
    display: -webkit-box;
    line-height: pr(150);
    background-color: rebeccapurple;
  }

  .wrap {
    width: 33.33%;
    text-align: center;
    display: inline-block;
    height: pr(190);
    line-height: pr(190);
    .call_img {
      background-image: url('../../assets/img/shopHome/hjdy@2x.png');
      background-size: 100% 100%;
      height: pr(78);
      width: pr(78);
      line-height: pr(78);
      position: relative;
      left: 36%;
      top: 12%;
    }
    .default_call_img {
      background-image: url('../../assets/img/shopHome/hjdy2@2x.png');
      background-size: 100% 100%;
      height: pr(78);
      width: pr(78);
      line-height: pr(78);
      position: relative;
      left: 36%;
      top: 12%;
    }
    .call_text {
      height: pr(26);
      margin-top: 20%;
      line-height: pr(26);
      @include font-dpr(13px)
    }
    .wifi_img {
      background-image: url('../../assets/img/shopHome/dnwf@2x.png');
      background-size: 100% 100%;
      height: pr(78);
      width: pr(78);
      line-height: pr(78);
      position: relative;
      left: 36%;
      top: 12%;
    }
    .default_wifi_img {
      background-image: url('../../assets/img/shopHome/dnwf2@2x.png');
      background-size: 100% 100%;
      height: pr(78);
      width: pr(78);
      line-height: pr(78);
      position: relative;
      left: 36%;
      top: 12%;
    }
    .wifi_text {
      height: pr(26);
      margin-top: 20%;
      line-height: pr(26);
      @include font-dpr(13px)
    }
    .food_img {
      background-image: url('../../assets/img/shopHome/tsdc@2x.png');
      background-size: 100% 100%;
      height: pr(78);
      width: pr(78);
      line-height: pr(78);
      position: relative;
      left: 36%;
      top: 12%;
    }
    .default_food_img {
      background-image: url('../../assets/img/shopHome/tsdc2@2x.png');
      background-size: 100% 100%;
      height: pr(78);
      width: pr(78);
      line-height: pr(78);
      position: relative;
      left: 36%;
      top: 12%;
    }
    .food_text {
      height: pr(26);
      margin-top: 20%;
      line-height: pr(26);
      @include font-dpr(13px)
    }
  }

  .contain {
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .header_wrap {
    width: 100%;
    height: pr(214);
    display: flex;
  }

  .img_wrap {
    height: pr(214);
    line-height: pr(214);
    text-align-last: center;
    padding-left: pr(24);
    img {
      margin-top: pr(42);
      height: pr(130);
      width: pr(130);
      border: 1px solid #e1e1e1;
      float: left;
      border-radius: pr(4);
      background-size: 100% 100%;
    }
  }

  .tel_wrap {
    margin-top: pr(20);
    display: -webkit-box;
    height: pr(36);
    line-height: pr(36);
    .shop_tel {
      background-image: url('../../assets/img/shopHome/dianhua@2x.png');
      background-size: 100% 100%;
      width: pr(22);
      height: pr(36);
      margin-right: pr(10);
      line-height: pr(36);
    }
    .tel_text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #999999;
      height: pr(34);
      @include font-dpr(13px);
      line-height: pr(36);
    }
  }

  .map_wrap {
    margin-top: pr(4);
    display: inline-flex;
    width: 100%;
    height: pr(36);
    line-height: pr(36);
    .shop_map {
      background-image: url('../../assets/img/shopHome/dizhi@2x.png');
      background-size: 100% 100%;
      width: pr(22);
      height: pr(36);
      margin-right: pr(10);
      line-height: pr(36);
    }
    .map_text {
      width: 95%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: pr(36);
      height: pr(36);
      span {
        @include font-dpr(13px);
        color: #999999;
      }
    }
  }
  .shop_info {
    padding-left: pr(24);
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: pr(42);
    overflow: hidden;
    .shop_name {
      height: pr(40);
      line-height: pr(40);
      @include font-dpr(16px);
      color: #181818;
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: bold;
    }
  }

</style>
