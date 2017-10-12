<template>
  <header class="header">
    <div class="header_inner">
      <a id="back_btn" @click="goBack"><div class="detailBack" ></div>
      </a>
    </div>
  </header>
</template>

<script>
  export default {
    methods: {
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";
 .detailBack{
   background-image: url('../../assets/img/fanhui2@2x.png');
   background-size: 100% 100%;
   width: pr(100);
   height: pr(100);
 }
  .header_inner {
    position: absolute;
    top: 0;
    left: 0;
    width: pr(100);
    height: pr(100);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    #back_btn {
      > img {
      }
    }
  }
</style>
