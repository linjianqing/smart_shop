<template>
    <div class="container">
      <div class="default_img">
        <img v-lazy="img" alt=""/>
      </div>
      <div class="text">{{content}}</div>
    </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['img', 'content']
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/css/base';

  .default_img{
    margin-top: pr(40);
    width: 100%;
    height: pr(54);
    vertical-align: middle;
    display: -webkit-box;
    img{
      margin-left: pr(166);
      background-size: 100% 100%;
      width: pr(54);
      height: pr(54);
    }
  }
  .text{
    margin-top: pr(24);
    @include font-dpr(12);
    height: pr(24);
    color: white;
    text-align: center
  }
  .container{
    width: pr(386);
    height:pr(196);
    opacity: .7;
    z-index: 2;
    background-color: #000;
    top: 50%;
    left: 50%;
    position: fixed;
    border-radius: pr(10);
    transform: translate(-50%,-50%);
  }
</style>
