<template>
  <div>
    <div class="coupon-bg" @click="closeBg"></div>
    <div class="contains">
      <div class="header">
        <div class="header_wrap">
          <div class="choice_coupon">可选优惠</div>
          <div class="right_img" @click="closeBg"></div>
        </div>
      </div>
      <div class="item_wrap" v-for="(item,i) in items" @click="clickHandler(i)">
        <div class="item_box" :class="(i === currentIndex)?'active':''"></div><span>{{item.title}}</span>
        <div class="coupon_price" v-if="item.deductibleAmount >0">-¥{{item.deductibleAmount | price}}</div>
      </div>
      <div class="bottom" @click="closeShowCoupon">
        确定
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        currentIndex: this.index
      }
    },
    props: ['items', 'index'],
    methods: {
      clickHandler (clickIndex) {
        this.currentIndex = clickIndex
      },
      closeBg () {
        this.$emit('closeShowCoupon', '', this.currentIndex)
      },
      closeShowCoupon (e) {
        if (['bottom'].includes(e.target.className)) {
          this.$emit('closeShowCoupon', this.items[this.currentIndex], this.currentIndex)
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .item_box {
    background-size: 100% 100%;
    background-image: url('../../assets/img/orderPay/controls-Unchecked@2x.png');
    height: pr(32);
    width: pr(32);
    display: inline-flex;
    margin-left: pr(30);
    margin-right: pr(10);
  }

  .item_wrap {
    height: pr(96);
    line-height: pr(96);
    max-height: pr(480);
    width: 100%;
    span {
      color: #727272;
      @include font-dpr(15px);
    }
    .coupon_price {
      float: right;
      margin-right: pr(24);
      color: #727272;
      @include font-dpr(14px);
    }
    .active{
      background-size: 100% 100%;
      background-image: url('../../assets/img/orderPay/controls--Selected@2x.png');
      height: pr(32);
      width: pr(32);
      display: inline-flex;
      margin-left: pr(30);
      margin-right: pr(10);
    }
  }

  .header {
    width: 100%;
    .header_wrap {
      height: pr(100);
      line-height: pr(100);
      width: 100%;
      text-align: center;
      border-bottom: 1px solid #e6e6e6;
      .choice_coupon {
        float: left;
        margin-left: pr(24);
      }
      .right_img {
        margin-right: pr(24);
        background-size: 100% 100%;
        background-image: url('../../assets/img/orderPay/close@2x.png');
        height: pr(20);
        width: pr(20);
        margin-top: pr(40);
        float: right;
        line-height: pr(100);

      }
    }
  }

  .coupon-bg {
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: pr(100);
    background: #000;
    opacity: 0.6;
    z-index: 10;
  }

  .contains {
    position: fixed;
    display: inline-table;
    bottom: 0;
    line-height: pr(100);
    color: #545454;
    width: 100%;
    background-color: white;
    height: pr(100);
    left: 0;
    z-index: 10;
    .bottom {
      height: pr(100);
      line-height: pr(100);
      width: 100%;
      background-color: #F74848;
      display: inline-block;
      text-align: center;
      color: white;
      @include font-dpr(15px)
    }
    .confirm {
      color: white;
      @include font-dpr(15px)
    }
  }
</style>
