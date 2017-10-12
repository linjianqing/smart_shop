<template>
  <div class="loadingContainer">
    <div class="load">
      <i class="weui-loading"></i>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/css/base.scss';
  .loadingContainer{
    width:100%;
    height: 100%;
    position: fixed;
    left:0;
    top:0;
    z-index:50;
    background-color: rgba(0,0,0,.4);
  }
  .load{
    position: absolute;
    z-index: 5000;
    width: 4.26667rem;
    min-height: 2.29333rem;
    left: 50%;
    margin-top: pr(426);
    margin-left: -2.13333rem;
    background-color: rgba(0, 0, 0, 0);
    text-align: center;
    border-radius: 0.16rem;
    color: #FFFFFF;
  }
  .weui-loading{
    width: pr(70);
    height: pr(70);
    display: inline-block;
    vertical-align: middle;
    -webkit-animation: weuiLoading 1s steps(12, end) infinite;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url('../../assets/img/loading.gif') no-repeat;
    background-size: 100%;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 0;
    bottom: 0;
  }
  @-webkit-keyframes weuiLoading {
    0% {
      transform: rotate3d(0, 0, 1, 0deg);
    }

    100% {
      transform: rotate3d(0, 0, 1, 360deg);
    }
  }
  @keyframes weuiLoading {
    0% {
      transform: rotate3d(0, 0, 1, 0deg);
    }

    100% {
      transform: rotate3d(0, 0, 1, 360deg);
    }
  }
</style>
