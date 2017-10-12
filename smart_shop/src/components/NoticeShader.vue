<!--公告栏展开-->
<template>
  <div class="notice_expand" @click="closeShader" @touchmove.prevent>
    <div class="contains">
      <div class="main_notice">
        <div class="shop_logo"><img :src="shopLogo"/></div>
        <div class="shop_name">{{ shopName }}</div>
        <div class="shop_notice" v-if="showDiscount && showDiscount.length > 0">
          <span class="line"></span><span class="content_tip">优惠信息</span><span class="line"></span>
        </div>
          <div class="coupon_wrap" v-for="(item,index) in showDiscount" v-if="showDiscount && showDiscount.length > 0">
            <div class="minus_flag" v-if="item.discountType===1">惠</div>
            <div class="gift_flag" v-else>赠</div>
            <div class="coupon_content">{{item.campContent}}</div>
          </div>
        <div class="shop_notice" v-if="noticeTip">
          <span class="line"></span><span class="content_tip">商家公告</span><span class="line"></span>
        </div>
        <div class="activity" v-if="noticeTip">{{ noticeTip }}</div>
      </div>
      <div class="close_buttom" @click="closeShader"><img class="close_btn" src="../assets/img/guanbi@2x.png"/></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        shopName: '',
        shopLogo: ''
      }
    },
    props: ['noticeInfo'],
    computed: {
      showDiscount () {
        let temp = []
        for (let i of this.noticeInfo) {
          if ([1, 2].includes(i.discountType)) {
            temp.push(i)
          }
        }
        return temp
      },
      noticeTip () {
        for (let i of this.noticeInfo) {
          if (i.discountType === 99) {
            return i.campContent
          }
        }
        return ''
      }
    },
    methods: {
      closeShader (e) {
        if (['close_btn', 'notice_expand', 'close_buttom'].includes(e.target.className)) {
          this.$emit('closeShader')
        }
      },
      getBasicInfo () {
        let url = this.$store.getters.getUrl('getBasicInfo', false)
        this.$http.post(url, {params: {'branchId': this.$store.getters.branchId}}).then((res) => {
          if (res.data.code !== 0) {
            console.info(res.data.msg)
          } else {
            this.shopName = res.data.name
            this.shopLogo = res.data.shopLogo
          }
        })
      }
    },
    created () {
      this.getBasicInfo()
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../assets/css/base";
  .coupon_wrap{
    height: pr(40);
    width: 95%;
    margin-top: pr(30);
    line-height: pr(40);
    display: inline-flex;
    .fold_flag{
      margin-left: pr(24);
      width: pr(28);
      height: pr(28);
      color: white;
      background-color: #ffae00;
      padding: pr(4);
      text-align: center;
      line-height: pr(28);
      border-radius: pr(3);
    }
    .gift_flag{
      margin-left: pr(24);
      width: pr(28);
      height: pr(28);
      color: white;
      background-color: #c3a2ff;
      padding: pr(4);
      text-align: center;
      line-height: pr(28);
      border-radius: pr(3);
    }
    .minus_flag{
      border-radius: pr(3);
      margin-left: pr(24);
      width: pr(28);
      height: pr(28);
      color: white;
      background-color: #ff7373;
      padding: pr(4);
      text-align: center;
      line-height: pr(28);
    }
    .coupon_content{
      margin-left: pr(18);
      height: pr(40);
      @include font-dpr(13px);
      color: #545454;
      line-height: pr(40);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .contains {
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 50%;
  }

  .notice_expand {
    z-index: 86;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .main_notice {
    background: white;
    height: pr(864);
    width: pr(642);
    border-radius: pr(8);
    display: flex;
    flex-direction: column;
    align-items: center;
    .shop_logo {
      margin-top: pr(56);
      border-radius: 50%;
      border: solid 2px #F74848;
      > img {
        object-fit: cover;
        height: pr(144);
        width: pr(144);
        border-radius: 50%;
      }

    }

    .shop_name {
      margin-top: pr(36);
      height: pr(27);
      line-height: pr(27);
      color: #181818;
      @include font-dpr(13px);
    }

    .shop_notice {
      margin-top: pr(40);
      height: pr(32);
      width: 90%;
      text-align: center;
      line-height: pr(32);
      display: inline-flex;
      .line {
        width: 35%;
        line-height: pr(32);
        margin-top: pr(16.5);
        border-top: 1px solid #e1e1e1;
        display: inline;
      }
      .content_tip{
        width: 30%;
        display: inline;
        line-height: pr(32);
        @include font-dpr(16px);
        color: #181818;
        height: pr(32);
      }
    }

    .activity {
      margin-top: pr(26);
      line-height: pr(40);
      width: 90%;
      color: #545454;
      @include font-dpr(13px);
      word-break: break-all;
    }
  }

  .close_buttom {
    margin-top: pr(50);
    text-align: center;
    > img {
      width: pr(70);
      height: pr(70);
    }
  }


</style>
