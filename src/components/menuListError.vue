<template>
  <div>
    <div class="main">
      <div class="icon"></div>
      <p class="tips">无法获取门店菜品，请稍后重试</p>
      <div class="tips-wrap">
        <button @click="to_home_page()">返回首页</button>
      </div>
    </div>
    <yunnex-info class="default-img"></yunnex-info>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/base";

  .main {
    .icon {
      width: pr(278);
      height: pr(278);
      margin: pr(130) auto pr(42);
      @include bg-image('../assets/img/wucaipin');
    }
    .tips {
      line-height: pr(28);
      @include font-dpr(14px);
      color: #adadad;
      text-align: center;
    }
    .tips + .tips {
      margin-top: pr(10);
    }
    .tips-wrap {
      margin-top: pr(90);
      text-align: center;
      button {
        width: pr(232);
        height: pr(70);
        line-height: pr(70);
        border-radius: pr(6);
        border: pr(1) #e1e1e1 solid;
        @include font-dpr(15px);
        color: #545454;
        background: #fff;
        text-align: center;
      }
    }
  }

  .default-img {
    position: fixed;
    bottom: pr(60);
  }
</style>

<script>
  import YunnexInfo from '../components/common/YunnnexInfo'

  export default {
    data () {
      return {}
    },
    components: {
      YunnexInfo
    },
    methods: {
      to_home_page () {
        this.$router.push({name: 'shopIndex'})
      }
    }
  }
</script>
