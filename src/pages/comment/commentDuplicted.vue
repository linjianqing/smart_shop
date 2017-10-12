<template>
  <div>
    <div class="repeat-comment">
      <div class="icon"></div>
      <p class="tips">你已点评过该订单，无法重复点评</p>
      <div class="tips-wrap">
        <button @click="to_home_page()">返回首页</button>
      </div>
    </div>
    <yunnex-info class="default-img"></yunnex-info>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .icon {
    width: pr(278);
    height: pr(218);
    margin: pr(130) auto pr(42);
    @include bg-image('../../assets/img/comment/yctb');
  }

  .tips {
    line-height: pr(28);
    @include font-dpr(14px);
    color: #adadad;
    text-align: center;
  }

  .tips-wrap {
    margin-top: pr(90);
    text-align: center;
    button {
      width: pr(232);
      height: pr(70);
      line-height: pr(70);
      border-radius: pr(6);
      border: 1px #e1e1e1 solid;
      @include font-dpr(15px);
      color: #545454;
      background: #fff;
      text-align: center;
    }
  }

  .default-img {
    position: fixed;
    bottom: pr(60);
  }
</style>

<script>
  import YunnexInfo from '../../components/common/YunnnexInfo'

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
