<template>
  <div class="item">
    <div class="item_pic"><img :src="item.pic"/></div>
    <div class="item_detail">
      <div class="item_basic_info">
        <div class="item_name" v-text="item.goodsName"></div>
        <div class="item_price">￥{{item.price | price}}</div>
      </div>
      <div class="comment">
        <div class="comment_icon" @click="thumb_select(1)" :class="{thumb_up_active:status === 1}">
          <div class="thumb thumb_up"></div>
          <span>超赞</span>
        </div>
        <div class="comment_icon" @click="thumb_select(2)" :class="{thumb_down_active:status === 2}">
          <div class="thumb thumb_down"></div>
          <span>一般</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/base";

  .item {
    height: pr(90);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    .item_pic {
      height: pr(90);
      width: pr(90);
      > img {
        border-radius: pr(2);
        height: 100%;
        width: auto;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        background-size: 100%;
      }
    }
    .item_detail {
      height: pr(90);
      width: pr(560);
      margin-left: pr(24);
      display: flex;
      justify-content: space-between;

      .item_basic_info {
        display: flex;
        flex-direction: column;
      }
      .item_name {
        display: inline-block;
        @include font-dpr(15px);
        color: #181818;
        line-height: pr(46);
      }
      .item_price {
        display: inline-block;
        margin-top: pr(10);
        @include font-dpr(14px);
        line-height: pr(34);
        color: #7d7d7d;
      }
      .comment {
        display: inline-flex;
        align-items: center;
        color: #c4c4c4;
        .comment_icon {
          display: inline-flex;
          border-radius: pr(4);
          height: pr(50);
          width: pr(106);
          border: 1px solid #e1e1e1;
          @include font-dpr(13px);
          align-items: center;
          padding-left: pr(14);
          > span {
            margin-left: pr(8);
          }
          .thumb {
            height: pr(28);
            width: pr(28);
          }
          .thumb_up {
            @include bg-image('../../assets/img/comment/new/dzwxz')
          }
          .thumb_down {
            @include bg-image('../../assets/img/comment/new/yb')
          }
        }
        .thumb_up_active {
          border-color: #f74848;
          color: #f74848;
          .thumb_up {
            @include bg-image('../../assets/img/comment/new/dz')
          }
        }
        .thumb_down_active {
          border-color: #616161;
          color: #616161;
          .thumb_down {
            @include bg-image('../../assets/img/comment/new/ybxz')
          }
        }
        div + div {
          margin-left: pr(14);
        }
      }
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        // 以下是状态值
        status: 0
      }
    },
    props: ['item'],
    methods: {
      thumb_select (res) {
        this.status = res
        this.$emit('item_res', {'goodsId': this.item.goodsId, 'commentType': res})
      }
    }
  }
</script>
