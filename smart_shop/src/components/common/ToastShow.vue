<template>
    <div class="container">
       {{content}}
    </div>

</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['content']
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/css/base';

  .container {
    z-index: 200;
    background-color: #000;
    border-radius: pr(8);
    opacity: .7;
    position: fixed;
    color: #fff;
    top: 80%;
    left: 50%;
    padding: pr(18);
    transform: translate(-50%,-50%);
  }
</style>
