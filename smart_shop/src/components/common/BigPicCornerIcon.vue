<!--显示在角标上面的数字-->

<template>
  <div class="num" v-show="isShow">{{ num }}</div>
</template>


<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .num {
    height: pr(30);
    line-height: pr(30);
    width: pr(30);
    color: white;
    background-color: #f74848;
    border-radius: 50%;
    border: solid 1px white;
    text-align: center;
    z-index: 2;

    @include font-dpr(9px);

  }
</style>

<script>
  export default {
    data () {
      return {
        isShow: false
      }
    },
    props: ['num'],
    computed: {},
    watch: {
      num (num) {
        this.isShow = num > 0
      }
    }
  }
</script>
