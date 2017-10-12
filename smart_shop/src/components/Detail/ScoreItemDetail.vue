<template>
  <div class="item_wrap" ref="item">
    <div class="line_wrap">
      <div class="img_wrap">
        <img class="default_img" v-if="commentItem.hasAnonymous || !commentItem.customerAvatar" src="../../assets/img/comment/mrtx@2x.png"/>
        <img class="wechat_img" v-lazy="commentItem.customerAvatar" v-else/>
      </div>
      <div class="contain">
        <div class="name_date">
          <div class="name" v-if="commentItem.hasAnonymous">匿名</div>
          <div class="name" v-else>{{commentItem.customerName}}</div>
          <div class="date">{{showTime}}</div>
        </div>
        <div class="more_score">
          <div class="score_star">
            <score :score="commentItem.majorScore" :size="30"></score>
          </div>
        </div>
        <div class="comment_description" v-show="commentItem.commentContent">{{commentItem.commentContent}}</div>
        <div class="thumb" v-show="commentItem.goodsList.length>0">
          <div class="thumb_img"></div>
          <div class="thumb_content">
            <good-comment-item v-for="(item,index) in commentItem.goodsList"
                               :key="item.id"
                               :item="item"
                               :isLast="(commentItem.goodsList.length-1)==index"
                               @goDetail="goDetail"
            ></good-comment-item>
          </div>
        </div>
        <div class="service" v-show="service">
          <div class="service_img"></div>
          <div class="service_text">
            <span>{{service}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Score from '../../components/common/HalfStar.vue'
  import GoodCommentItem from '../../components/common/GoodCommentItem.vue'
  export default {
    data () {
      return {
        isShowLabel: false
      }
    },
    computed: {
      showTime () {
        let time = new Date(this.commentItem.createTime.replace(/-/g, '/'))
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let date = time.getDate()
        return year + '.' + month + '.' + date
      },
      service () {
        let item = this.commentItem.labelList
        let str = ''
        for (let i of item) {
          str += i + ','
        }
        str = (str.slice(str.length - 1) === ',') ? str.slice(0, -1) : str
        return str
      },
      thumbGoods () {
        let item = this.commentItem.goodsList
        let str = ''
        for (let i of item) {
          str += i.goodsName + ','
        }
        str = (str.slice(str.length - 1) === ',') ? str.slice(0, -1) : str
        return str
      }
    },
    components: {
      Score,
      GoodCommentItem
    },
    props: ['commentItem'],
    mounted () {
      this.$nextTick(() => {
        this.$emit('setHeight', this.$refs.item.clientHeight)
      })
    },
    methods: {
      goDetail (data) {
        this.$emit('goDetail', data)
      },
      moreScore () {
        this.isShowLabel = !this.isShowLabel
        this.$emit('moreScore', this.commentItem.customerName)
      }
    }
  }

</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  @mixin main_text {
    line-height: pr(38);
    @include font-dpr(14px);
  }

  .description {
    margin-top: pr(12);
    @include main_text;
    color: #252525;
    text-align: justify;
  }

  .comment_description {
    @include font-dpr(13px);
    color: #181818;
    min-height: pr(38);
    text-align: justify;
    display: flex;
    width: 100%;
    word-break: break-all;
  }

  ul {
    margin-top: pr(28);
    line-height: pr(26);
    display: flex;
    flex-wrap: wrap;
    li {
      height: pr(54);
      padding-left: pr(10);
      padding-right: pr(10);
      border-radius: pr(8);
      border: solid 1px #adadad;
      text-align: center;
      line-height: pr(54);
      margin-right: pr(20);
      margin-bottom: pr(20);
      align-content: flex-start;
      @include font-dpr(13px);
    }
  }

  .item_wrap {
    background: white;
    width: 100%;
    height: auto;
    padding-top: pr(24);
    padding-bottom: pr(24);
    display: inline-flex;
    border-bottom: 1px solid #eeeeee;
    .line_wrap{
      display: inline-flex;
      width: 100%;
      height: auto;
    }
  }
  .img_wrap{
    width: 15%;
    float: left;
    padding-left: pr(24);
    .wechat_img {
      background-size: 100% 100%;
      background-color: #f5f5f5;
      width: pr(80);
      height: pr(80);
      border-radius: 50%;
    }
    .default_img{
      background-size: 100% 100%;
      width: pr(80);
      height: pr(80);
      border-radius: 50%;
    }
  }
  .contain {
    width: 85%;
    float: right;
    padding-right: pr(24);
    display: inline-block;
    .name_date {
      line-height: pr(26);
      height: pr(26);
      .name {
        color: #181818;
        @include font-dpr(14);
        height: pr(36);
        line-height: pr(36);
        float: left;
      }
      .date {
        color: #757575;
        float: right;
      }
    }
  }

  .more_score {
    margin-top: pr(14);
    margin-bottom: pr(18);
    height: pr(30);
    line-height: pr(30);
    width: 100%;
    float: left;
    .score_star {
      margin-top: pr(-7);
      line-height: pr(30);
      height: pr(30);
    }
  }

  .thumb {
    margin-top: pr(16);
    width: 100%;
    display: block;
    .thumb_img {
      background-size: 100% 100%;
      background-image: url('../../assets/img/comment/chaozan@2x.png');
      height: pr(28);
      width: pr(28);
      float: left;
      margin-right: pr(18);
    }
    .thumb_content{
      margin-left: pr(48);
    }
  }
  .service {
    margin-top: pr(12);
    width: 100%;
    display: inline-block;
    .service_img {
      background-size: 100% 100%;
      background-image: url('../../assets/img/comment/bq2@2x.png');
      height: pr(28);
      margin-top: pr(12);
      width: pr(28);
      float: left;
    }
    .service_text{
      margin-left: pr(18);
      margin-top: pr(12);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      span {
        margin-left: pr(18);
        height: pr(34);
        color: #757575;
      }
    }

  }
</style>
