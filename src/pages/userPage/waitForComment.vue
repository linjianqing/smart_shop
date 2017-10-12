<template>
  <div v-infinite-scroll="lock_loading" infinite-scroll-disabled="false" infinite-scroll-distance="300">
    <div v-show="!loading">
      <div class="empty_list" v-if="orderList.length === 0">
        <div class="cat"></div>
        <div>暂无待评价的订单哦~</div>
        <div class="home" @click="to_home_page()">返回首页</div>
      </div>
      <div v-else ref="comment_list">
        <div class="comment_item" v-for="item in orderList">
          <div class="item_header">
            <span class="item_pic"></span>
            <span class="item_name" v-text="item.branchName"></span>
          </div>
          <!--一个图的情况-->
          <div class="comment_show" v-if="item.goodsList.length === 1">

            <div class="i_pic_wrap">
              <img class="i_pic" :src="item.goodsList[0].pic"/>
              <img class="default_img"/>
            </div>
            <div class="flex_right">
              <div class="item_first">
                <span v-text="item.goodsList[0].goodsName" class="i_left"></span>
                <span class="i_right">￥{{ item.goodsList[0].goodsPrice | price }}</span>
              </div>
              <div class="item_second">
                <span v-text="item.goodsList[0].attr" class="i_left"></span>
                <span class="i_right">X{{ item.goodsList[0].quantity }}</span>
              </div>
            </div>
          </div>
          <!--其他情况-->
          <div class="comment_show" v-else>
            <div class="i_pic_wrap" v-for="four_item in item.goodsList.slice(0,4)">
              <img class="i_pic" :src="four_item.pic"/>
              <img class="default_img"/>
            </div>
            <div v-if="item.goodsList.length > 4" class="etc">...</div>
          </div>

          <div class="comment_sum">
            <span>共<span v-text="item.goodsList.length"></span>件</span>
            <span>合计：</span>
            <span>￥<span>{{ item.totalAmount | get_int }}</span>.<span>{{ item.totalAmount | get_minor }}</span></span>
          </div>

          <div class="comment_footer">
            <div class="go_comment" @click="go_comment(item.orderId)">去评价</div>
          </div>
        </div>
      </div>
      <div class="no_more_empty" v-show="orderList.length && !hasNext">没有更多待评价订单</div>
      <yunnex-info :style="yunnex_info"></yunnex-info>
    </div>
    <loading v-show="loading"></loading>
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
      .item_pic {
        height: pr(34);
        width: pr(34);
        @include bg-image("../../assets/img/usercenter/listings-icon")
      }
      .item_name {
        margin-left: pr(10);
        @include font-dpr(15px);
        color: #000000;
      }
    }
    .comment_show {
      background: #f8f8f8;
      height: pr(186);
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
      border-bottom: 1px dashed #e1e1e1;
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

  .no_more_empty {
    margin-top: pr(40);
    @include font-dpr(13px);
    color: #cbcbcb;
    text-align: center;
  }
</style>

<script>
  import YunnexInfo from '../../components/common/YunnnexInfo'
  import ToastShow from '../../components/common/ToastShow'
  import Loading from '../../components/common/Loading'

  export default {
    data () {
      return {
        orderList: [],
        listHeight: 0,
        page: 1,
        pageSize: 10,
        hasNext: true,
        lock: false,
        // 状态值
        loading: false,
        toast: false,
        content: ''
      }
    },
    created () {
      this.loading = true
      this.lock_loading()
    },
    components: {
      YunnexInfo,
      ToastShow,
      Loading
    },
    updated () {
      this.listHeight = this.$refs.comment_list ? this.$refs.comment_list.scrollHeight : 0
    },
    filters: {
      get_int (val) {
        return parseInt(val.toFixed(2) / 100)
      },
      get_minor (val) {
        let tmp = parseInt(val).toString().slice(-2) || '0'
        return tmp.length === 1 ? `0${tmp}` : tmp
      }
    },
    computed: {
      yunnex_info () {
        let buttom = {
          'position': 'fixed',
          'bottom': '40px'
        }
        let normal = {
          'margin': '40px 0'
        }
        return window.innerHeight > this.listHeight + 200 ? buttom : normal
      }
    },
    methods: {
      getData () {
        if (!this.hasNext) {
          console.warn('没有更多数据了')
          return -1
        }
        let url = this.$store.getters.getUrl('getUncommentOrder', false)
        this.$http.get(url, {params: {page: this.page}}).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data.message}`)
            this.loading = false
            return -1
          }
          this.page += 1
          if (res.data.response.list) {
            this.orderList = [...this.orderList, ...res.data.response.list]
          }
          this.hasNext = res.data.response.page.hasNextPage
          this.loading = false
          this.lock = false
        })
      },
      lock_loading () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '待评价订单列表', 'click', 'waitForComment'])
          window._hmt.push(['_trackPageview', '/waitForComment'])
        }
        if (!this.lock) {
          this.lock = true
          this.getData()
        }
      },
      go_comment (orderId) {
        console.info(`go to comment page, orderId: ${orderId}`)
        this.$router.push({name: 'Comment', query: {'orderId': orderId}})
      },
      to_home_page () {
        this.$router.push({name: 'shopIndex'})
      }
    }
  }
</script>
