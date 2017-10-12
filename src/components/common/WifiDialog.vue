<template>
  <div class="item_shader">
    <div class="main">
      <div class="header">
        <div class="copy_wifi">请长按复制WIFI密码</div>
        <div class="password">{{password}}</div>
        <div class="ssid">(WIFI帐号：{{loginName}})</div>
      </div>
      <div class="action">
        <span class="confirm" @click="showWifiInfo">返回</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['loginName', 'password'],
    methods: {
      showWifiInfo () {
        this.$emit('showWifiInfo')
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
    @include font-dpr(15px);
    color: #181818;
    width: 100%;
    text-align: center;
    display: inline-block;
    line-height: pr(102);
  }

  .action {
    height: pr(102);
    line-height: pr(102);
    width: 100%;
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
    height: pr(360);
    background-color: white;
    border-radius: pr(6);
    position: relative;
    margin-top: pr(300);
  }

  .header {
    width: pr(618);
    border-bottom: 1px solid #e1e1e1;
  }

  .copy_wifi {
    height: pr(30);
    margin-top: pr(54);
    line-height: pr(34);
    @include font-dpr(17px);
    color: #181818;
    text-align: center;
  }

  .password {
    height: pr(44);
    margin-top: pr(46);
    margin-bottom: pr(14);
    @include font-dpr(21px);
    color: #F74848;
    text-align: center;
  }

  .ssid {
    height: pr(32);
    margin-bottom: pr(40);
    @include font-dpr(13px);
    color: #999999;
    text-align: center;
  }
</style>
