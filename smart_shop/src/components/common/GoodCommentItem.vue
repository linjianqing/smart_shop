<template>
  <div class="content" @click="goDetail">
    <span class="name">{{item.goodsName}}</span><span class="flag" :class="isLast?'isLast':''">,</span>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['item', 'isLast'],
    methods: {
      goDetail () {
        this.$emit('goDetail', this.item.goodsId)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";
  .isLast{
    display: none;
  }
  .flag{
    margin-right: pr(5);
  }
  .content{
    float: left;
  }
  .name {
    color: #27557F;
    height: pr(28);
    @include font-dpr(12px)
  }
</style>
