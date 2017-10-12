<!--显示在角标上面的数字-->

<template>
  <div class="num" v-show="isShow">{{ cornerNum }}</div>
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
    position: absolute;
    top: pr(16);
    right: 0;
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
    props: ['categoryId'],
    computed: {
      cornerNum () {
        let data = this.$store.getters.getCartGoodsByCategory(this.categoryId)
        let num = 0
        if (data) {
          for (let i of data) {
            num += i.quantity
          }
        }
        return num
      }
    },
    watch: {
      cornerNum (num) {
        this.isShow = num > 0
      }
    }
  }
</script>
