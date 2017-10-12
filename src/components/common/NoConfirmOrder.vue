<template>
  <div class="item_shader">
    <div class="main">
      <div class="header">
        <div class="order_dash">您的订单还有待确认的菜品</div>
        <div class="contact_waiter">结账请联系服务员</div>
      </div>
      <div class="action">
        <span class="confirm" @click="showTipInfo">我知道了</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      showTipInfo () {
        this.$emit('showTipInfo')
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .cancel {
    @include font-dpr(16px);
    color: #7d7d7d;
    width: 50%;
    display: inline-block;
    text-align: center;
    font-size: pr(30);
    line-height: pr(102);
  }

  .confirm {
    @include font-dpr(16px);
    color: #33CC00;
    width: 100%;
    text-align: center;
    display: inline-block;
    font-size: pr(30);
    line-height: pr(102);
  }

  .action {
    height: pr(102);
    width: 100%;
    font-size: 0;
  }

  .item_shader {
    z-index: 10;
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

  .main {
    width: pr(618);
    height: pr(370);
    background-color: white;
    border-radius: pr(6);
    position: relative;
    margin-top: pr(300);
  }

  .header {
    width: pr(618);
    border-bottom: 1px solid #e1e1e1;
  }

  .order_dash {
    height: pr(30);
    margin-top: pr(100);
    line-height: pr(30);
    @include font-dpr(15px);
    color: #181818;
    text-align: center;
  }

  .contact_waiter {
    height: pr(30);
    line-height: pr(30);
    margin-top: pr(10);
    margin-bottom: pr(100);
    @include font-dpr(15px);
    color: #181818;
    text-align: center;
  }
</style>
