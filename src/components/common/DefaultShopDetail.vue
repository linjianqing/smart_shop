<template>
  <div class="content">
    <div class="main">
      <div class="default-wrap">
        <div class="default-img"></div>
        <div class="default-content">商品过期不存在</div>
        <div class="back" @click="goBack"><span>返回</span></div>
        <yunnex-info class="yunnex_info"></yunnex-info>
      </div>
    </div>
  </div>
</template>

<script>
  import BackIcon from '../../components/common/BackIcon'
  import YunnexInfo from '../../components/common/YunnnexInfo'
  export default {
    data () {
      return {}
    },
    components: {
      BackIcon,
      YunnexInfo
    },
    methods: {
      goBack () {
        this.$emit('goBack')
      }
    }
  }

</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  * {
    -webkit-text-size-adjust: none;
  }

  .default-wrap {
    width: 100%;
    text-align: center;
    padding-top: 25%;
    .yunnex_info {
      padding-top: 50%;
      height: 100%;
    }
    .back {
      width: pr(200);
      height: pr(60);
      line-height: pr(60);
      text-align: center;
      border: 1px solid #181818;
      border-radius: pr(4);
      margin-top: pr(30);
      background-color: white;
      display: inline-block;
      .span {
        color: #181818;
        line-height: pr(60);
        @include font-dpr(14px);
      }
    }
    .default-content {
      @include font-dpr(12px);
      margin-top: pr(28);
      color: #adadad;
    }
    .default-img {
      display: inline-block;
      @include bg-image('../../assets/img/wucaipin');
      height: pr(270);
      width: pr(270);
    }
  }

  .content {
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
    pointer-events: auto;
    .main::-webkit-scrollbar {
      display: none
    }
    .main {
      position: relative;
      background-color: #f5f5f5;
      height: 100%;
      width: 100%;
    }
  }

</style>
