<template>
  <div class="bg">
    <div class="comment-toast">
      <div class="main-pic">
        <img src="../../assets/img/comment/yixing@3x.png"/>
      </div>
      <div class="toast-info">
        <div v-if="rewardType === 0">评价成功啦</div>
        <div v-else>
          <div>评价成功~获得
            <span v-if="rewardType === 1">{{ allConfig.couponName}}</span>
            <span v-else-if="rewardType === 2">{{ allConfig.points}}积分</span>
            奖励
          </div>
          <div>奖励领取可能存在短暂延时，请注意查收</div>
        </div>
      </div>
      <div class="footer-bottom">
        <div @click="to_home_page()">回到首页</div>
        <!--一个按钮-->
        <div v-if="rewardType > 0" @click="to_user_center()">查看奖励</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .bg {
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .comment-toast {
    position: relative;
    display: flex;
    background: white;
    width: pr(600);
    height: pr(300);
    border-radius: pr(10);
    flex-direction: column;
    align-items: center;
    .main-pic {
      $pic-height: 72;
      background: white;
      width: pr($pic-height);
      margin-top: pr(-$pic-height/2);
    }
    .toast-info {
      flex: 1;
    }
    .footer-bottom {
      height: pr(70);
      width: inherit;
      border-top: 1px solid #e1e1e1;
      bottom: 0;
      display: flex;
      > div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      div + div {
        border-left: 1px solid #e1e1e1;
      }
    }
  }
</style>

<script>
  export default {
    data () {
      return {
        rewardType: this.allConfig.commentReward
      }
    },
    props: ['allConfig'],
    created () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '评价成功页面', 'click', 'CommentResult'])
        window._hmt.push(['_trackPageview', '/CommentResult'])
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
