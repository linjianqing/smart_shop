<template>
  <div v-show="init">
    <div>
      <div class="tabbar">
        <div class="tab_item" v-for="tab in tabbar"
             @click="tabClick(tab.index)"
             v-text="tab.name"
             :class="{tab_active:tab.index === defaultTab }"></div>
      </div>
      <div ref="order_list">
        <div class="empty_list" v-if="!orderList.length">
          <div class="cat"></div>
          <div>暂无订单</div>
          <!--<div class="home">返回首页</div>-->
        </div>
        <div class="comment_item" v-for="item in orderList" @click="goToComment(item)">
          <div class="item_header">
            <div>
              <div class="item_pic"></div>
              <div class="item_name" v-text="item.title"></div>
            </div>
            <span class="item_status">{{ item.status | list_status }}</span>
          </div>
          <!--一个图的情况-->
          <div class="comment_show" v-if="item.goodsList.length === 1">
            <div class="i_pic_wrap">
              <img class="i_pic" :src="item.goodsList[0].goodsIcon"/>
              <img class="default_img"/>
            </div>
            <div class="flex_right">
              <div class="item_first">
                <span v-text="item.goodsList[0].goodsName" class="i_left"></span>
                <span class="i_right">￥{{ item.goodsList[0].goodsOriPrice | price}}</span>
              </div>
              <div class="item_second">
                <span class="i_left"></span>
                <span class="i_right">X{{ item.goodsList.length }}</span>
              </div>
            </div>
          </div>
          <!--其他情况-->
          <div class="comment_show" v-else>
            <div class="i_pic_wrap" v-for="four_item in item.goodsList.slice(0,4)">
              <img class="i_pic" :src="four_item.goodsIcon"/>
              <img class="default_img"/>
            </div>
            <div v-if="item.goodsList.length > 4" class="etc">...</div>
          </div>

          <div class="comment_sum">
            <span>共<span v-text="item.goodsList.length"></span>件</span>
            <span>合计：</span>
            <span>￥<span>{{ item.orderFee | get_int }}</span>.<span>{{ item.orderFee | get_minor }}</span></span>
          </div>

        </div>
      </div>
    </div>
    <loading v-show="loading"></loading>
    <yunnex-info :style="yunnex_info"></yunnex-info>
    <global-nav></global-nav>
    <popup-banner></popup-banner>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/base";

  .empty_list {
    display: flex;
    flex-direction: column;
    align-items: center;
    .cat {
      margin-top: pr(130);
      height: pr(224);
      width: pr(336);
      @include bg-image("../../assets/img/usercenter/initial-icon")
    }
    div:nth-of-type(2) {
      margin-top: pr(42);
      @include font-dpr(14px);
      color: #adadad;
    }
    div:nth-of-type(3) {
      margin-top: pr(90);
      background: #ffffff;
      height: pr(70);
      display: flex;
      justify-content: center;
      align-items: center;
      width: pr(232);
      border-radius: pr(6);
      border: 1px solid #adadad;
      @include font-dpr(15px);
      color: #545454;
      text-align: center;

    }
  }

  .tabbar {
    background: #ffffff;
    height: pr(100);
    display: flex;
    .tab_item {
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      @include font-dpr(14px);
      color: #adadad;
    }
    .tab_active {
      color: #f74848;
      border-bottom: pr(4) solid #F74848;
    }
  }

  .comment_item {
    margin-top: pr(12);
    background: #ffffff;
    .item_header {
      padding: 0 pr(24);
      display: flex;
      align-items: center;
      height: pr(78);
      justify-content: space-between;
      > div {
        display: flex;
      }
      .item_pic {
        display: inline-block;
        height: pr(34);
        width: pr(34);
        @include bg-image("../../assets/img/usercenter/listings-icon")
      }
      .item_name {
        display: inline-block;
        margin-left: pr(10);
        @include font-dpr(15px);
        color: #000000;
      }
      .item_status {
        @include font-dpr(14px);
        color: #f74848;
      }
    }
    .comment_show {
      background: #f8f8f8;
      height: pr(162);
      padding-top: pr(24);
      padding-left: pr(24);
      padding-right: pr(24);
      display: flex;

      .i_pic_wrap {
        position: relative;
        overflow: hidden;
        height: pr(136);
        width: pr(136);
        .i_pic {
          position: relative;
          top: 50%;
          left: 50%;
          z-index: 5;
          transform: translate3d(-50%, -50%, 0);
          height: 100%;
          width: auto;
          background-size: 100%;
          border: 1px solid rgba(225, 225, 225, 0.4);
        }
      }
      .i_pic_wrap + .i_pic_wrap {
        margin-left: pr(8);
      }
      .default_img {
        background-image: url('../../assets/img/shopHome/morencaipin@2x.png');
        position: absolute;
        top: 0;
        left: 0;
        background-size: 100%;
        height: pr(136);
        width: pr(136);
      }
      .etc {
        margin-left: pr(8);
        height: pr(138);
        width: pr(138);
        display: flex;
        justify-content: center;
        align-items: center;
        @include font-dpr(18px);
        font-weight: bold;
        color: #7d7d7d;
      }
      .flex_right {
        width: pr(540);
        margin-left: pr(24);
        .item_first {
          height: pr(36);
          width: pr(540);
          @include font-dpr(15px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #181818;
        }
        .item_second {
          margin-top: pr(16);
          width: pr(540);
          height: pr(26);
          @include font-dpr(12px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #7d7d7d;
        }
      }

    }
    .comment_sum {
      margin: 0 pr(24);
      height: pr(78);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      > span:nth-of-type(1) {
        margin-right: pr(24);
      }
      span:nth-of-type(1) > span {
        color: #f74848;
      }
      span:nth-of-type(3) {
        color: #f74848;
        @include font-dpr(13px);
        span:nth-of-type(1) {
          @include font-dpr(18px);
        }
      }
    }

    .comment_footer {
      padding: 0 pr(24);
      height: pr(110);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .go_comment {
        height: pr(56);
        width: pr(170);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #f74848;
        color: #f74848;
        @include font-dpr(14px);
        border-radius: pr(4);
      }
    }
  }
</style>

<script>
  import YunnexInfo from '../../components/common/YunnnexInfo'
  import ToastShow from '../../components/common/ToastShow'
  import Loading from '../../components/common/Loading'
  import popupBanner from '../../pages/globalNavBar/popupBanner'
  import globalNav from '../../pages/globalNavBar/globalNav'

  export default {
    data () {
      return {
        tabbar: [{index: 0, name: '全部'},
          {index: 1, name: '待付款'},
          {index: 3, name: '进行中'},
          {index: 4, name: '已完成'},
          {index: 5, name: '已关闭'}],
        defaultTab: +this.$route.query.index || 0,
        orderList: [],
        pageInfo: {},
        init: false,
        loading: false,
        menuHeight: 0
      }
    },
    computed: {
      yunnex_info () {
        let buttom = {
          'position': 'fixed',
          'bottom': '40px',
          'z-index': -1
        }
        let normal = {
          'margin-bottom': '40px',
          'z-index': -1
        }
        return window.innerHeight > this.menuHeight + 200 ? buttom : normal
      }
    },
    created () {
      this.getData()
    },
    filters: {
      get_int (val) {
        return parseInt(parseInt(val).toFixed(2) / 100) || 0
      },
      get_minor (val) {
        let tmp = parseInt(val).toString().slice(-2) || '0'
        if (tmp.length === 1) {
          tmp = '0' + tmp
        }
        return tmp
      },
      list_status (val) {
        return ['全部', '待付款', '进行中', '进行中', '已完成', '已关闭'][val]
      }
    },
    components: {
      YunnexInfo,
      ToastShow,
      Loading,
      popupBanner,
      globalNav
    },
    methods: {
      getData () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '统一订单列表', 'click', 'useOrderList'])
          window._hmt.push(['_trackPageview', '/useOrderList'])
        }
        let url = this.$store.getters.getUrl('getUnifiedOrder', false)
        let data = {
          orderStatus: this.defaultTab
        }
        this.$http.get(url, {params: data}).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error:${res.data.message}`)
            this.init = true
            this.loading = false
            return -1
          }
          if (res.data.response) {
            this.orderList = res.data.response.list
            this.pageInfo = res.data.response.page
          }
          this.loading = false
          this.init = true
        })
      },
      tabClick (index) {
        if (index !== this.defaultTab) {
          this.loading = true
          this.defaultTab = index
          this.getData()
          console.info(index)
        }
      },
      goToComment (item) {
        console.info('go to ' + item.productOrderDetailURL)
        window.location.href = item.productOrderDetailURL
      }
    },
    mounted () {
      this.menuHeight = this.$refs.order_list.scrollHeight
    },
    updated () {
      this.menuHeight = this.$refs.order_list.scrollHeight
    },
    deactivated () {
      this.$destroy(true)
    }
  }
</script>
