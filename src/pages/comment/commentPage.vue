<template>
  <div>
    <div ref="commentPage">
      <comment-header :config="allConfig" @send_res="set_data"></comment-header>
      <div class="main_item">
        <div class="item_header">
          <span>给好吃的菜点评</span>
          <span class="item_expand" @click="showItem=!showItem">
          <span>{{ itemList.length }}道菜</span>可选
          <span class="arrow_pic"></span>
        </span>
        </div>
        <transition name="fade">
          <div class="item_list" v-if="showItem">
            <item v-for="item in itemList"
                  :key="item.id"
                  :item="item"
                  @item_res="get_res"
            ></item>
          </div>
        </transition>
      </div>
      <!--TODO:这里记得改回来-->
      <div class="anonymous" @click="showCommentToast=!showCommentToast">
        <!--<div class="anonymous" @click="isAnonymous=!isAnonymous">-->
        <div class="anonymous_selector" :class="{is_anon:isAnonymous}"></div>
        <span>匿名评价</span>
      </div>
      <div class="footer">
        <div class="notice" v-if="memberOnly">只有会员才可以领取积分哦~立即<span>注册会员</span></div>
        <div class="send_rating" @click="sendRating">发表评论</div>
      </div>
    </div>
    <yunnex-info :style="yunnex_info"></yunnex-info>
    <comment-modal v-show="showModal" :info="modalInfo" @close_modal="close_modal"></comment-modal>
    <loading v-if="isLoading"></loading>
    <comment-toast v-if="showCommentToast" :allConfig="allConfig"></comment-toast>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/base";

  body {
    background: #adadad;
  }

  hr {
    border: 1px solid #e1e1e1;
  }

  .main_item {
    background: #ffffff;
    margin-top: pr(18);
    .item_header {
      padding: 0 pr(24);
      height: pr(114);
      line-height: pr(114);
      border-bottom: 1px solid #e1e1e1;
      > span {
        @include font-dpr(15px);
        color: #181818;
        > span {
          color: #f74848;
        }
        img {
          margin-left: pr(12);
          margin-top: pr(2);
        }
      }
      .item_expand {
        float: right;
        .arrow_pic {
          display: inline-block;
          height: pr(16);
          width: pr(30);
          @include bg-image('../../assets/img/comment/xlzk')
        }
      }
    }
    .item_list {
      padding: pr(40) pr(24);
    }
    .item + .item {
      margin-top: pr(50);
    }
  }

  .anonymous {
    margin: pr(26) 0 pr(86) pr(24);
    color: #adadad;
    @include font-dpr(13px);
    .anonymous_selector {
      display: inline-block;
      height: pr(26);
      width: pr(26);
      @include bg-image('../../assets/img/comment/nimingpingjia')
    }
    .is_anon {
      @include bg-image('../../assets/img/comment/nmpjxz')
    }
    > span {
      margin-left: pr(12);
    }
  }

  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    .notice {
      @include font-dpr(14px);
      margin-bottom: pr(32);
      color: #adadad;
      > span {
        color: orange
      }
    }

    .send_rating {
      width: pr(702);
      height: pr(88);
      line-height: pr(88);
      border-radius: pr(4);
      text-align: center;
      background-color: #f76148;
      color: white;
      margin-bottom: pr(24);
      @include font-dpr(16px);
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>

<script>
  import CommentHeader from '../../components/comment/commentHeader'
  import commentModal from '../../components/comment/commentModal'
  import Item from '../../components/comment/commentItem'
  import YunnexInfo from '../../components/common/YunnnexInfo'
  import Loading from '../../components/common/Loading'
  import commentToast from '../../components/comment/commentToast'

  export default {
    components: {
      CommentHeader,
      commentModal,
      Item,
      YunnexInfo,
      Loading,
      commentToast
    },
    data () {
      return {
        // 这里有可能是支付完成后跳回来或者是个人中心页跳过来
        shopSerial: this.$store.getters.shopSerial || this.$route.query.shopSerial,
        branchId: this.$store.getters.branchId || this.$route.query.branchId,

        orderId: this.$route.query.orderId || this.$store.getters.orderId,
        memberOnly: false,      // 是不是显示注册信息
        // 这两个是主要的数值
        allConfig: {},
        itemList: [],
        // 以下是状态值
        menuHeight: 0,
        showItem: true,
        isLoading: false,
        toasting: false,
        showModal: false,
        modalInfo: '',
        content: '',
        showCommentToast: false,
        // 以下是需要提交的值
        itemRating: {},
        isAnonymous: false,
        // 以下是header 传过来的值
        input_msg: '',    // 手打的评论
        star_rating: 0,   // 总评分
        item_score: [],    // 总评下面的每项的评分，方便过滤，提交的时候再处理一下
        label_comment: [],
        // 一下是item 传过来的值
        dishes_rating: []
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
      this.shopSerialAndId()
      this.getCommentConfig()
      this.getCommentGood()
    },
    mounted () {
      this.menuHeight = this.$refs.commentPage.scrollHeight
    },
    updated () {
      this.menuHeight = this.$refs.commentPage.scrollHeight
    },
    methods: {
      getCommentConfig () {
        let url = this.$store.getters.getUrl('getCommentConfig')
        this.$http.post(url).then(res => {
          console.info(res.data)
          if (res.data.code !== 0) {
            console.warn(`error: ${res.data.message}`)
            return -1
          }
          this.allConfig = res.data.response
        })
      },
      getCommentGood () {
        let url = this.$store.getters.getUrl('getCommentGood')
        this.$http.post(url, {'orderId': this.orderId}).then(res => {
          if (res.data.code !== 0) {
            console.warn(res.data)
            return -1
          }
          this.itemList = res.data.response
          this.dishes_rating = []
          for (let i of res.data.response) {
            this.dishes_rating.push({'goodsId': i.goodsId, 'goodsName': i.goodsName, 'commentType': 0})
          }
        })
      },
      get_res (itemRate) {
        console.info(itemRate)
        this.dishes_rating.find(x => x.goodsId === itemRate.goodsId).commentType = itemRate.commentType
      },
      set_data (data) {
        let x = Object.keys(data)[0]
        this.$data[x] = data[x]
      },
      close_modal () {
        this.showModal = false
      },
      // 这里提交的订单信息不一定是该店的，有可能是该商户下其他店的（从个人中心进来的时候）
      sendRating () {
        console.info('send comment')
        if (this.star_rating === 0 || this.item_score.length !== this.allConfig.scoringItemsList.length) {
          this.showModal = true
          this.modalInfo = '你需要先评分再提交评价哦'
          return -1
        }
        this.isLoading = true
        let url = this.$store.getters.getBaseUrl + this.$store.getters.getShopApi.saveComment + `?shopSerial=${this.shopSerial}&branchId=${this.branchId}`
        console.info('url: ' + url)
        let data = {
          'orderId': this.orderId,
          'majorScore': this.star_rating,
          'scoringItems': this.item_score,
          'label': this.label_comment,
          'commentContent': this.input_msg,
          'hasAnonymous': this.isAnonymous,
          'orderGoods': this.dishes_rating
        }
        this.$http.post(url, data).then(res => {
          console.info(res.data)
          this.isLoading = false
          if (res.data.code !== 0) {
            this.showModal = true
            this.modalInfo = res.data.message
            return -1
          }
          // commentReward:评价奖励 0 不奖励 1 优惠券 2 积分
          // 增加评论奖励
          // showToast
          //          this.$router.push({
          //            name: 'CommentResult',
          //            query: {'isRepeated': false, 'hasPersonCenter': this.allConfig.commentReward > 0}
          //          })
        })
      },
      shopSerialAndId () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '提交评价页面', 'click', 'commentPage'])
          window._hmt.push(['_trackPageview', '/commentPage'])
        }
        let url = this.$store.getters.getUrl('newGetOrderInfo')
        this.$http.post(url, {orderId: this.orderId}).then(res => {
          if (res.data.code !== 0) {
            console.warn('error: ' + res.data.message)
          } else {
            console.info(res)
            // 这里不能存到vuex里面，因为只是评价这里用一下，店还是那个店
            this.branchId = res.data.response.cyOrderDto.branchId
            if (res.data.response.commentSwitch.commentSwitch === 2) {
              this.$router.push({name: 'commentDuplicted'})
            }
          }
        })
      }
    },
    deactivated () {
      this.$destroy(true)
    }
  }
</script>

