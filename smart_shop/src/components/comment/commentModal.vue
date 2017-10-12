<template>
  <div class="modal">
    <div class="main_notice">
      <div class="info">{{ info }}</div>
      <div class="confirm" @click="close_modal">确定</div>
    </div>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/base";

  .modal {
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
    .main_notice {
      margin-top: pr(352);
      background: white;
      height: pr(270);

      width: pr(618);
      border-radius: pr(6);
      display: flex;
      flex-direction: column;
      align-items: center;
      @include font-dpr(15px);
      .info {
        height: pr(170);
        line-height: pr(170);
        color: #181818;
      }
      .confirm {
        height: pr(98);
        line-height: pr(98);
        width: pr(618);
        border-top: 1px solid #e1e1e1;
        color: #f74848;
        text-align: center;
      }
    }
  }

</style>

<script>
  export default {
    data () {
      return {}
    },
    props: ['info'],
    methods: {
      close_modal () {
        this.$emit('close_modal')
      }
    }
  }
</script>
