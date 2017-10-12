<template>
  <div ref="comment_list">
    <div class="user_header">
      <div class="back_icon" @click="goBack"></div>
      <img class="user_logo" :src="userInfo.headImgUrl" @click="goCard">
      <div class="user_name" v-text="user_name"></div>
    </div>
    <div class="user_info">
      <div class="member_exist" v-if="userIsMember">
        <div>
          <div v-if="!showBalance">暂无</div>
          <div v-else @click="goBalance()">
            <span>￥</span><span></span>{{ memberData.balanceTotal | price }}
          </div>
          <div>余额</div>
        </div>
        <div class="hr"></div>
        <div>
          <div v-if="!showBonus">暂无</div>

          <div v-else v-text="memberData.bonus" @click="goBonus()"></div>
          <div>积分</div>
        </div>
        <div class="hr"></div>
        <div>
          <div v-if="!showDiscount">暂无</div>
          <div v-else v-text="memberData.discount" @click="goDiscount()"></div>
          <div>折扣</div>
        </div>
      </div>
      <div v-else class="member_not_exist">
        <div class="register" @click="popupYunnexDialog()">领卡享会员权益</div>
      </div>
    </div>
    <div class="comment">
      <div class="comment_header">
        <div class="comment_info_left">
          <span>待评价</span>
          <span v-if="uncommentList.length" v-text="uncommentList[0].prompt"></span>
        </div>
        <div class="comment_info_right" @click="toUncommentList()">
          <span v-if="uncommentList.length">
            <span v-text="uncommentList.length"></span>条
          </span>
          <span class="arrow_pic"></span>
        </div>
      </div>
      <div class="comment_brief" v-if="uncommentList.length">
        <div class="comment_left">
          <img class="dishes_pic" :src="uncommentList[0].goodsList[0].pic"/>
          <div class="dishes_info">
            <div class="dishes_main">
              <span>{{ uncommentList[0].createTime | date_format }}</span>
              消费￥<span>{{ uncommentList[0].totalAmount | price }}</span>
            </div>
            <div class="address" v-text="uncommentList[0].branchName"></div>
          </div>
        </div>
        <div class="go_comment" @click="goComment(uncommentList[0].orderId)">去评价</div>
      </div>
    </div>

    <div class="order">
      <div class="order_header">
        <div>我的订单</div>
        <div @click="toUnifiedOrderList(0)">
          <span>所有订单</span>
          <span class="arrow_pic"></span>
        </div>
      </div>
      <div class="order_info">
        <div @click="toUnifiedOrderList(1)">
          <div class="wait_for_pay">
            <div class="corner" v-text="payStatus(1)" v-show="payStatus(1)"></div>
          </div>
          <span>待付款</span>
        </div>
        <div @click="toUnifiedOrderList(3)">
          <div class="paying">
            <div class="corner" v-text="payStatus(3)" v-show="payStatus(3)"></div>
          </div>
          <span>进行中</span>
        </div>
        <div @click="toUnifiedOrderList(4)">
          <div class="finish_pay">
          </div>
          <span>已完成</span>
        </div>
      </div>
    </div>

    <div class="coupon" @click="goCoupon()">
      <div>我的优惠券</div>
      <div>
        <span v-if="coupon_num">
          <span v-text="coupon_num"></span>
          <span>张</span>
        </span>
        <span class="arrow_pic"></span>
      </div>
    </div>
    <yunnex-info :style="yunnex_info"></yunnex-info>
    <global-nav></global-nav>
    <popup-banner></popup-banner>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/base";

  .user_header {
    @include bg-image("../../assets/img/usercenter/txbj");
    height: pr(300);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    .back_icon {
      position: absolute;
      top: pr(20);
      left: pr(30);
      height: pr(34);
      width: pr(22);
      z-index: 5;
      @include bg-image("../../assets/img/usercenter/return");
    }
    .user_logo {
      margin-top: pr(60);
      width: pr(136);
      height: pr(136);
      background-image: url('../../assets/img/comment/mrtx@2x.png');
      background-size: pr(136) pr(136);
      border-radius: pr(68);
      border: pr(4) solid #7d7d7d;
      z-index: 5;
    }
    .user_name {
      margin-top: pr(22);
      font-weight: bold;
      color: #ffffff;
      @include font-dpr(15px);
      z-index: 5;
    }
  }

  .user_info {
    background: #ffffff;
    height: pr(180);
    .member_exist {
      display: flex;
      align-items: center;
      height: inherit;
      > div {
        width: pr(248);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        div:nth-of-type(1) {
          @include font-dpr(18px);
          color: #545454;
          span:nth-of-type(1) {
            @include font-dpr(13px);
          }
        }
        div:nth-of-type(2) {
          margin-top: pr(32);
          @include font-dpr(13px);
          color: #7d7d7d;
        }
      }
      .hr {
        display: block;
        width: 1px;
        color: #e1e1e1;
        height: pr(60);
        background: #e1e1e1;
      }
    }
    .member_not_exist {
      display: flex;
      align-items: center;
      justify-content: center;
      height: inherit;
      .register {
        height: pr(60);
        width: pr(278);
        border: 1px solid #f74848;
        border-radius: pr(4);
        color: #f74848;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .comment {
    margin-top: pr(12);
    background: #ffffff;
    padding: 0 pr(24);
    .comment_header {
      display: flex;
      align-items: center;
      height: pr(110);
      justify-content: space-between;
      .comment_info_left {
        display: flex;
        align-items: flex-end;
        span:first-child {
          @include font-dpr(15px);
          color: #181818;
        }
        span:nth-child(2) {
          margin-left: pr(20);
          @include font-dpr(13px);
          color: #f98e8e;
        }
      }
      .comment_info_right {
        color: #999999;
        @include font-dpr(13px);
        display: flex;
        align-items: center;
        .arrow_pic {
          display: inline-block;
          width: pr(16);
          height: pr(26);
          margin-left: pr(8);
          @include bg-image('../../assets/img/comment/zk')
        }
      }
    }
    .comment_brief {
      height: pr(170);
      background: #ffffff;
      border-top: 1px solid #f8f8f8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .comment_left {
        display: flex;
      }
      .dishes_pic {
        height: pr(90);
        width: pr(90);
        border-radius: pr(2);
      }
      .dishes_info {
        display: inline-flex;
        flex-direction: column;
        margin-left: pr(20);
        justify-content: center;
        .dishes_main {
          @include font-dpr(15px);
          color: #181818;
          span:nth-of-type(1) {
            margin-right: pr(14);
          }
        }
        .address {
          @include font-dpr(13px);
          color: #7d7d7d;
          margin-top: pr(6);
        }
      }
      .go_comment {
        width: pr(150);
        height: pr(50);
        border: 1px solid #f74848;
        color: #f74848;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: pr(4);
      }
    }
  }

  .order {
    margin-top: pr(12);
    background: #ffffff;
    padding: 0 pr(24);
    .order_header {
      display: flex;
      align-items: center;
      height: pr(110);
      justify-content: space-between;
      div:nth-of-type(1) {
        @include font-dpr(15px);
        color: #181818;
      }
      div:nth-of-type(2) {
        @include font-dpr(13px);
        color: #999999;
        display: flex;
        align-items: center;
        .arrow_pic {
          display: inline-block;
          width: pr(16);
          height: pr(26);
          margin-left: pr(8);
          @include bg-image('../../assets/img/comment/zk')
        }
      }
    }
    .order_info {
      display: flex;
      align-items: center;
      height: pr(190);
      border-top: 1px solid #f8f8f8;
      position: relative;
      > div {
        width: pr(234);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > div {
          width: pr(74);
          height: pr(74);
          position: relative;
          .corner {
            position: absolute;
            top: 0;
            right: pr(-12);
            width: pr(24);
            height: pr(24);
            background: #f74848;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            @include font-dpr(9px);
            border-radius: pr(12);
          }
        }
        .wait_for_pay {
          @include bg-image("../../assets/img/usercenter/obligation");
        }
        .paying {
          @include bg-image("../../assets/img/usercenter/under");
        }
        .finish_pay {
          @include bg-image("../../assets/img/usercenter/finish");
        }
        span {
          margin-top: pr(22);
          @include font-dpr(14px);
          color: #999999;
        }
      }
    }
  }

  .coupon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 pr(24);
    margin-top: pr(12);
    background: #ffffff;
    height: pr(110);
    div:nth-of-type(1) {
      @include font-dpr(15px);
      color: #181818;
    }
    div:nth-of-type(2) {
      @include font-dpr(13px);
      color: #999999;
      display: flex;
      align-items: center;
    }
    .arrow_pic {
      display: inline-block;
      width: pr(16);
      height: pr(26);
      margin-left: pr(8);
      @include bg-image('../../assets/img/comment/zk')
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
        userInfo: {},  // 用户头像和名称
        memberData: {}, // 会员数据，积分折扣啥的
        userData: {},
        comment: {},
        showComment: true,
        unifiedOrder: [],
        uncommentList: [],
        userIsMember: false,
        coupon_num: 0,
        // 会员卡信息，跳转用
        cardSerial: '',
        bg_color: '',
        // 窗口属性
        listHeight: 0,
        // 基本属性
        shopSerial: this.$store.getters.shopSerial,
        showConent: false,
        // 头像下面三个栏的显示
        showBalance: false,
        showBonus: false,
        showDiscount: false
      }
    },
    components: {
      YunnexInfo,
      ToastShow,
      Loading,
      popupBanner,
      globalNav
    },
    computed: {
      yunnex_info () {
        let buttom = {
          'position': 'fixed',
          'bottom': '40px'
        }
        let normal = {
          'margin-bottom': '40px',
          'margin-top': '40px'
        }
        return window.innerHeight > this.listHeight + 200 ? buttom : normal
      },
      user_name () {
        return this.userInfo.memberName || this.userInfo.weixinNickname || '匿名用户'
      }
    },
    filters: {
      date_format (val) {
        let date = new Date(val)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      }
    },
    created () {
      this.isMember()
      this.getUncommentOrder()
      this.getOrderInfo()
      this.get_wx_user_info()
      this.getCoupon()
    },
    deactivated () {
      this.$destroy(true)
    },
    mounted () {
      this.listHeight = this.$refs.comment_list ? this.$refs.comment_list.scrollHeight : 0
    },
    updated () {
      this.$nextTick(() => {
        this.listHeight = this.$refs.comment_list ? this.$refs.comment_list.scrollHeight : 0
      })
    },
    methods: {
      payStatus (status) {
        // WAITING(1, "待支付"),
        // PAYED(2, "已支付"),
        // UNDERWAY(3, "进行中"),
        // FINISH(4, "已完成"),
        // CLOSED(5, "订单关闭");
        if (this.unifiedOrder.length) {
          return this.unifiedOrder.filter(x => x.status === status).length || 0
        }
        return 0
      },
      // 判断是不是会员
      isMember () {
        console.info('is member')
        let url = this.$store.getters.getUrl('getMemberStatus', false)
        this.$http.get(url).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data}`)
          } else {
            this.userIsMember = res.data.response.memberStatus
            if (res.data.response.memberStatus) {
              // 是会员的情况下
              this.getUserCenterInfo()
              this.getCardSerial()
            }
          }
          console.info('is member done')
        })
      },
      // 获取微信头像和昵称
      get_wx_user_info () {
        console.info('get_wx_user_info')
        let url = this.$store.getters.getUrl('getWXUserInfo', false)
        this.$http.get(url).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error:${res.data.message}`)
            return -1
          }
          this.userInfo = res.data.response
        })
      },
      // 获取个人中心头部接口的基本信息（积分，优惠啥的，是会员的时候才需要拉）
      getUserCenterInfo () {
        console.info('getUserCenterInfo')
        let url = this.$store.getters.getUrl('getUserCenterInfo', false)
        this.$http.get(url).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data.message}`)
            return -1
          }
          this.memberData = res.data.response
        })
      },
      // 获取统一订单信息，主要用来显示角标数量
      getOrderInfo () {
        console.info('getOrderInfo')
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '个人中心', 'click', 'userHomePage'])
          window._hmt.push(['_trackPageview', '/userHomePage'])
        }
        let url = this.$store.getters.getUrl('getUnifiedOrder', false)
        let data = {'orderStatus': 0}
        this.$http.get(url, {params: data}).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data.message}`)
            return -1
          }
          this.unifiedOrder = res.data.response.list
        })
      },
      // 获取未评价的订单列表
      getUncommentOrder () {
        console.info('getUncommentOrder')
        let url = this.$store.getters.getUrl('getUncommentOrder', false)
        let data = {'page': 1, 'pageSize': 999}
        this.$http.get(url, {params: data}).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data.message}`)
            return -1
          }
          this.uncommentList = res.data.response.list || []
        })
      },
      // 获取优惠券信息
      getCoupon () {
        console.info('getCoupon')
        let url = this.$store.getters.getUrl('getCoupon', false)
        this.$http.get(url).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data.message}`)
            return -1
          }
          this.coupon_num = res.data.response || 0
        })
      },
      // 获取cardSerial
      getCardSerial () {
        console.info('getCoupon')
        let url = this.$store.getters.getUrl('getCardSerial', false)
        this.$http.get(url).then(res => {
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data.message}`)
            return -1
          }
          console.info('get coupon success: ' + res.data.response.cardSerial)
          this.cardSerial = res.data.response.cardSerial || 0
          this.bg_color = res.data.response.bg_color || 'f74848'
          this.showBalance = res.data.response.showBalance
          this.showBonus = res.data.response.showBonus
          this.showDiscount = res.data.response.showDiscount
        })
      },
      toUncommentList () {
        this.$router.push({name: 'waitForComment'})
      },
      toUnifiedOrderList (index) {
        console.info(`go to unified order,index: ${index}`)
        this.$router.push({name: 'userOrderList', query: {'index': index}})
      },
      goComment (orderId) {
        console.info(`go to comment page, orderId: ${orderId}`)
        this.$router.push({name: 'Comment', query: {'orderId': orderId}})
      },
      // 余额
      goBalance () {
        window.location.href = `http://${window.location.host}/account/balance/record/show/${this.shopSerial}?color=${this.bg_color}`
      },
      // 积分
      goBonus () {
        window.location.href = `http://${window.location.host}/account/bonus/record/show_v2/${this.shopSerial}`
      },
      // 折扣
      goDiscount () {
        window.location.href = `http://${window.location.host}/customer/account/discount/${this.shopSerial}`
      },
      goCoupon () {
        window.location.href = `http://${window.location.host}/kqlist/${this.shopSerial}?tab=2`
      },
      goCard () {
        window.location.href = `http://${window.location.host}/master-card/${this.shopSerial}`
      },
      goBack () {
        this.$router.go(-1)
      },
      popupYunnexDialog () {
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
              window.location.reload()
            }
          }).ready()
        }
      }
    }
  }
</script>
