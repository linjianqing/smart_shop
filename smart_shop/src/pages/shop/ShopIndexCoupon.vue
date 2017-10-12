<template>
  <div>
    <div class="contain">
       <!--虚线-->
      <div class="coupon_line">
        <div>
          <div class="top_big_circle"></div>
          <div class="top_small_circle"></div>
          <div class="while_line"></div>
        </div>
        <div class="bottom_wrap">
          <div class="bottom_big_circle"></div>
          <div class="bottom_small_circle"></div>
          <div class="bottom_while_line"></div>
        </div>
        <div class="dash_line"></div>
      </div>
      <!--布局 DISCOUNT 劵  CASH 折 GIFT 礼品劵 GENERAL_COUPON 通用劵-->
      <div class="coupon_wrap">
        <div class="coupon_value" v-if="coupon.couponType === 'DISCOUNT' ||coupon.couponType === 'CASH' ">
          <div class="money">{{coupon.price}}</div>
          <div class="symbol">{{coupon.couponType === 'DISCOUNT'?'折':'元'}}</div>
        </div>
        <div class="coupon_value" v-if="coupon.couponType === 'GIFT' ||coupon.couponType === 'GENERAL_COUPON' ">
          <div class="coupon_content">{{coupon.couponType === 'GIFT'?'礼品劵':'优惠劵'}}</div>
        </div>
        <div class="coupon_text">
          <div class="coupon_name">{{coupon.couponName}}</div>
          <div class="coupon_condition">{{coupon.remark}}</div>
          <div class="coupon_time">{{coupon.couponDate}}</div>
        </div>
        <div class="btn_wrap">
          <div class="coupon_btn" @click="clickCoupon" >领取</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['coupon'],
    methods: {
      clickCoupon () {
        this.$http.post(this.$store.getters.getUrl('receiveCoupon', false), {serial: this.coupon.serial}).then((res) => {
          let result = res.data
          console.info(res)
          this.$emit('clickCoupon', result)
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";
  .bottom_wrap{
    bottom: 0;
    left: 0;
    position: absolute;
  }
  .bottom_big_circle{
    height: pr(18);
    width: pr(36);
    margin-left: pr(-5);
    -webkit-border-radius:pr(36) pr(36) 0 0 ;
    border: 1px solid transparent;
    background-color: white;
    position: absolute;
    margin-top: pr(-22);
  }
  .bottom_small_circle{
    height: pr(13);
    width: pr(26);
    -webkit-border-radius:pr(26) pr(26) 0 0 ;
    border: 1px solid #e1e1e1;
    background-color: white;
    position: absolute;
    margin-top: pr(-15);
  }
  .bottom_while_line{
    height: pr(10);
    width: pr(26);
    -webkit-border-radius:pr(24) pr(24) 0 0 ;
    background-color: white;
    margin-top: pr(-6);
    margin-left: pr(1.2);
    position: absolute;
  }
  .dash_line{
    border-left: pr(2) dashed #e1e1e1;
    width: 1px;
    margin-left: pr(13.5);
    height: pr(148);
    margin-top: pr(16);
    position: absolute;
  }
  .top_big_circle {
    height: pr(18);
    width: pr(36);
    margin-left: pr(-5);
    margin-top: pr(2);
    -webkit-border-radius: 0 0 pr(36) pr(36);
    border: 1px solid transparent;
    background-color: white;
    position: absolute;
  }
  .while_line{
    height: pr(10);
    width: pr(26);
    -webkit-border-radius: 0 0 pr(24) pr(24);
    background-color: white;
    margin-top: pr(-3);
    margin-left: pr(1.8);
    position: absolute;
  }
  .top_small_circle {
    height: pr(13);
    width: pr(26);
    margin-top: pr(-2);
    -webkit-border-radius: 0 0 pr(26) pr(26);
    border: 1px solid #e1e1e1;
    background-color: white;
    position: absolute;
  }
  .coupon_line{
    width: pr(26);
    height: pr(180);
    line-height: pr(180);
    position: absolute;
    margin-left: 68%;
  }
  .contain{
    width: pr(700);
    height: pr(180);
    margin-left: pr(24);
    line-height: pr(180);
    background-color: white;
    border: 1px solid #e1e1e1;
    border-radius: pr(2);
    margin-bottom: pr(16);
  }

  .coupon_wrap {
    border-radius: pr(2);
    height: pr(164);
    line-height: pr(164);
    width: pr(686);
    background-color: #fff8f8;
    border: 1px solid transparent;
    display: inline-flex;
    margin-left: pr(5.5);
    margin-top: pr(6.7);
  }

  .coupon_value {
    width: 25%;
    height: pr(164);
    text-align: center;
    line-height: pr(164);
    display: flex;
    .coupon_content{
      margin-left: pr(13);
      line-height: pr(164);
      height: pr(164);
      @include font-dpr(18px);
      color: #F74749;
    }
    .money{
      margin-left: pr(13); // 44
      line-height: pr(164);
      height: pr(164);
      @include font-dpr(20px);
      color: #F74749;
    }
    .symbol{
      margin-top: pr(4);
      @include font-dpr(13px);
      color: #F74749;
      line-height: pr(164);
      height: pr(164);
    }
  }
  .coupon_text {
    width: 50%;
    height: pr(164);
    line-height: pr(164);
    .coupon_name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-top: pr(20);
      color: #181818;
      height: pr(38);
      line-height: pr(38);
      @include font-dpr(15px)
    }
    .coupon_condition {
      margin-top: pr(23);
      color: #999999;
      height: pr(36);
      line-height: pr(36);
      @include font-dpr(13px)
    }
    .coupon_time {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #999999;
      height: pr(36);
      line-height: pr(36);
      @include font-dpr(13px)
    }
  }

  .btn_wrap {
    width: 25%;
    height: pr(164);
    text-align: center;
    line-height: pr(164);
    .coupon_btn {
      color: white;
      height: pr(50);
      margin-left: pr(23);
      line-height: pr(50);
      @include font-dpr(13px);
      /*padding: pr(8) pr(15) pr(8) pr(15); // TOP RIGHT BOTTOM LEFT*/
      width: pr(96);
      display: inline-block;
      border-radius: pr(2);
      text-align: center;
      background-image: linear-gradient(90deg, #f76049, #F74848);
    }
  }
</style>
