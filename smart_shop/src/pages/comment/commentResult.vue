<template>
  <div>
    <div class="publish-success" v-if="!isRepeated">
      <div class="icon"></div>
      <p class="state-words" v-show="isShowStatistics">发表成功</p>
      <div class="tips-wrap">
        <div class="default" v-if="!hasPersonCenter">
          <p class="tips">感谢你的用心评价</p>
          <button @click="to_home_page()">完成</button>
        </div>
        <div class="has-person-center" v-if="hasPersonCenter">
          <p class="tips">奖励已经发放至你的账户中，可在个人中心查看</p>
          <button @click="to_user_center()">个人中心</button>
          <button @click="to_home_page()">完成</button>
        </div>
      </div>
      <div class="ads"></div>
    </div>
    <div class="repeat-comment" v-else>
      <div class="icon"></div>
      <p class="tips">你已点评过该订单，无法重复点评</p>
      <div class="tips-wrap">
        <button @click="to_home_page()">返回首页</button>
      </div>
    </div>
    <yunnex-info class="default-img"></yunnex-info>
  </div>
</template>

<script>
  import YunnexInfo from '../../components/common/YunnnexInfo'

  export default {
    data () {
      return {
        isRepeated: this.$route.query.isRepeated,
        hasPersonCenter: this.$route.query.hasPersonCenter
      }
    },
    components: {
      YunnexInfo
    },
    computed: {
      isShowStatistics () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '评价成功页面', 'click', 'CommentResult'])
          window._hmt.push(['_trackPageview', '/CommentResult'])
        }
        return true
      }
    },
    methods: {
      to_home_page () {
        this.$router.push({name: 'shopIndex'})
      },
      to_user_center () {
        this.$router.push({name: 'userHomePage'})
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  .publish-success {
    padding: pr(90) 0 pr(76);
    background-color: #fff;
    border-bottom: 1px #e1e1e1 solid;
    .icon {
      width: pr(130);
      height: pr(130);
      margin: 0 auto pr(30);
      @include bg-image('../../assets/img/comment/cg');
    }
    .state-words {
      line-height: pr(40);
      @include font-dpr(20px);
      color: #181818;
      text-align: center;
    }
    .tips-wrap {
      text-align: center;
      .tips {
        margin: pr(20) 0 pr(76) 0;
        line-height: pr(28);
        @include font-dpr(14px);
        color: #adadad;
      }
      button {
        width: pr(232);
        height: pr(70);
        line-height: pr(70);
        border-radius: pr(6);
        border: pr(1) #1aad19 solid;
        @include font-dpr(15px);
        color: #fff;
        background: #1aad19;
        text-align: center;
      }
      button:focus {
        outline: none;
      }
      .has-person-center button:last-child {
        margin-left: pr(26);
        color: #1aad19;
        background: #fff;
      }
    }
  }

  .repeat-comment {
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
