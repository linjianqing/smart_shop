<template >
  <div class="foot_item" ref="foot_item">
    <span class="foot_modify" @click="goBack">继续点菜</span>
    <span class="foot_summit" @click="uploadOrder">提交订单</span>
  </div>
</template>


<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .foot_item {
    width: 100%;
    line-height: pr(90);
    height: pr(90);
    display: inline-flex;
    position: fixed;
    bottom: 0;
    left: 0
  }

  .foot_modify {
    color: white;
    width: 50%;
    @include font-dpr(15px);
    font-weight: bold;
    text-align: center;
    background-image: linear-gradient(90deg, #727272, #595959);
  }

  .foot_summit {
    color: white;
    width: 50%;
    @include font-dpr(15px);
    font-weight: bold;
    text-align: center;
    background-image: linear-gradient(90deg, #f76049, #F74848);
  }

</style>
<script type="text/ecmascript-6">
  export default{
    methods: {
      uploadOrder () {
        this.$emit('uploadOrder')
      },
      goBack () {
        this.$emit('goBack')
      }
    }
  }
</script>
