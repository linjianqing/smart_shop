<template>
  <div>
    <div :style='{height:listHeight}'
         v-infinite-scroll="onLoadMore"
         infinite-scroll-disabled="false"
         infinite-scroll-distance="1">
      <div class="total_wrap" ref="total">
        <div class="total_text">总评</div>
        <div class="halfHeight">
          <HalfStar :score="showAverageScore" :size="44"></HalfStar>
        </div>
        <div class="average_wrap">
          <div class="average_value">{{showAverageScore}}</div>
          <div class="average_score">分</div>
        </div>
      </div>
      <div class="customer_score" ref="customer">
        <div class="customer">顾客评价</div>
        <div class="score">({{sumComment}}条评论)</div>
      </div>
      <score-item
        @setHeight="setHeight"
        v-for="(item,index) in commentList"
        :key="item.id"
        :commentItem="item"
        @goDetail="goDetail"
      ></score-item>
      <div class="loading" v-if="loading">页面加载中...</div>
      <div class="loading" v-if="!loading && !hasNext" ref="noMoreScore">没有更多评论了</div>
      <yunnex-info ref="yunnex"></yunnex-info> <!--与预加载有冲突，暂不处理-->
    </div>
  </div>
</template>

<script>
  import ScoreItem from '../../components/Detail/ScoreItem'
  import HalfStar from '../../components/common/HalfStar.vue'
  import YunnexInfo from '../../components/common/YunnnexInfo'

  export default {
    data () {
      return {
        listHeight: '1200px',
        page: 1,
        loading: true,
        pageSize: 20,
        hasNext: false,
        commentList: [],
        shopInfo: {},
        commnetScore: 0,
        sumComment: 0,
        isBottomHeight: 0,
        itemHeight: 0
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.listHeight = window.innerHeight - this.headerHeight + 'px'
      })
    },
    components: {
      ScoreItem,
      HalfStar,
      YunnexInfo
    },
    props: ['shopScore', 'headerHeight', 'flag'],
    computed: {
      showAverageScore () {
        return this.shopScore > 0 ? this.shopScore : this.commnetScore
      }
    },
    created () {
      this.getCommentList(1)
    },
    methods: {
      setHeight (height) {
        this.itemHeight = height
      },
      goDetail (goodId) {
        let data = {}
        if (this.tableId) {
          data = {
            goodId: goodId,
            branchId: this.$store.getters.branchId,
            shopSerial: this.$store.getters.shopSerial,
            tableId: this.tableId,
            tableName: this.tableName
          }
        } else {
          data = {
            goodId: goodId,
            branchId: this.$store.getters.branchId,
            shopSerial: this.$store.getters.shopSerial
          }
        }
        this.$router.push({
          path: 'newDetail',
          query: data
        })
      },
      params (page) {
        return {
          page: page,
          pageSize: this.pageSize
        }
      },
      onLoadMore () {
        if (!this.flag) return
        if (this.loading || !this.hasNext) { return -1 }
        console.info('entry in onLoadMore')
        this.getCommentList(this.page + 1)
      },
      getCommentList (paramsPage) {
        let _tempArr = []
        this.loading = true
        console.info(this.params(paramsPage))
        this.$http.post(this.$store.getters.getUrl('xiaoerCommentList'), this.params(paramsPage)).then((res) => {
          console.info(res)
          let result = res.data
          if (!result.response) return
          this.shopInfo = result.response
          if (result.code === 0) {
            console.info(this.shopInfo)
            this.commnetScore = this.shopInfo.commnetScore
            this.sumComment = this.shopInfo.sumComment
            _tempArr = this.shopInfo.commentList
            this.commentList = (paramsPage === 1 ? _tempArr : this.commentList.concat(_tempArr))
            this.page = this.shopInfo.page.currentPage
            this.hasNext = this.shopInfo.page.hasNextPage
          }
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .loading {
    @include font-dpr(13px);
    line-height: pr(24);
    padding: pr(36);
    color: #adadad;
    text-align: center;
    background-color: #eeeeee;
  }

  .halfHeight {
    line-height: pr(178); // 需要添加星一半的高度
  }

  .average_wrap {
    float: right;
    margin-left: pr(124);
    display: inline-flex
  }

  .score {
    height: pr(44);
  }

  .score_wrap {
    height: 100%;
    width: 100%;
  }

  .customer_score {
    height: pr(90);
    line-height: pr(90);
    width: 100%;
    display: flex;
    background-color: white;
    border-bottom: 1px solid #eeeeee;
    .customer {
      color: #181818;
      margin-right: pr(16);
      margin-left: pr(24);
      @include font-dpr(15px)
    }
    .score {
      color: #999999;
      @include font-dpr(13px)
    }
  }

  .average_value {
    @include font-dpr(26px);
    height: pr(156);
    font-weight: bold;
    color: #F74848;
    line-height: pr(156);
  }

  .average_score {
    @include font-dpr(14px);
    height: pr(156);
    color: #181818;
    margin-top: pr(6);
    line-height: pr(156);
  }

  .total_text {
    color: #181818;
    margin-left: pr(64);
    @include font-dpr(15px);
    margin-right: pr(34);
  }

  .total_wrap {
    height: pr(156);
    width: 100%;
    line-height: pr(156);
    display: flex;
    background-color: white;
    border-bottom: pr(10) solid #eeeeee;
  }

</style>
