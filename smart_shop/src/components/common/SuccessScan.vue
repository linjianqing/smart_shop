<template>
  <div class="item_shader" ref="SuccessScan">
    <div class="main">
      <div class="img"></div>
      <div class="table-number">成功入座{{ tableName }}</div>
      <div class="close-dialog" @click="closeTableDialog">关闭</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['tableName'],
    methods: {
      closeTableDialog () {
        this.$emit('closeTableDialog')
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .close-dialog {
    border-top: 1px solid #e1e1e1;
    height: pr(102);
    width: 100%;
    line-height: pr(102);
    color: #181818;
    @include font-dpr(15px);
    margin-top: pr(44);
    text-align: center;
  }

  .table-number {
    @include font-dpr(15px);
    height: pr(32);
    margin-top: pr(22);
    line-height: pr(32);
    text-align: center;
    color: #181818;
  }

  .img {
    height: pr(300);
    width: pr(300);
    background-size: 100% 100%;
    background-image: url('../../assets/img/ruzuochenggong@2x.png');
    vertical-align: middle;
    margin-top: pr(40);
    display: inline-block;
    align-items: center;
    margin-left: pr(146);
  }

  .item_shader {
    z-index: 20;
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
    width: pr(592);
    height: pr(540);
    background-color: white;
    border-radius: pr(6);
    position: relative;
    margin-top: pr(260);
  }

  .header {
    width: pr(618);
    border-bottom: 1px solid #e1e1e1;
  }

  .item_name {
    height: pr(168);
    line-height: pr(168);
    @include font-dpr(15px);
    color: #181818;
    text-align: center;
  }

</style>
