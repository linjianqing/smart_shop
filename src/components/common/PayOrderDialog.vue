<template>
  <div class="item_shader">
    <div class="main">
      <div class="header">
        <div class="item_name">发起支付将不可以继续加菜，<br/>请确认是否发起支付?</div>
      </div>
      <div class="action">
        <span class="cancel" @click="cancelAddFood()">取消</span>
        <span class="confirm" @click="confirmAddFood()">确认</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
      confirmAddFood () {
        this.$emit('confirmAddFood')
      },
      cancelAddFood () {
        this.$emit('cancelAddFood')
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
    color: #181818;
    width: 50%;
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
    z-index: 50;
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
    height: pr(270);
    background-color: white;
    border-radius: pr(6);
    position: relative;
    margin-top: pr(300);
  }

  .header {
    width: pr(618);
    border-bottom: 1px solid #e1e1e1;
  }

  .item_name {
    height: pr(128);
    padding-left: pr(24);
    padding-right: pr(24);
    padding-top: pr(40);
    @include font-dpr(15px);
    color: #181818;
    text-align: center;
  }

</style>
