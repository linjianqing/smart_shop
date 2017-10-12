<template>
  <div :style='{height:listHeight}'
       v-infinite-scroll="onLoadMore"
       infinite-scroll-disabled="false"
       infinite-scroll-distance="1"
       ref="scrollContainer">
    <score-item v-for="(item,index) in commentList" :key="item.id" :commentItem="item"
                @goDetail="goDetail"></score-item>
    <div class="loading" v-if="loading">页面加载中...</div>
    <div class="loading" v-if="!loading && !hasNext" ref="noMoreScore">没有更多评论了</div>
    <yunnex-info ref="yunnex"></yunnex-info>
  </div>
</template>

<script>
  import ScoreItem from '../components/Detail/ScoreItem.vue'
  import YunnexInfo from '../components/common/YunnnexInfo'

  export default {
    data () {
      return {
        listHeight: '1200px',
        page: 1,
        loading: true,
        pageSize: 20,
        hasNext: false,
        itemHeight: 0,
        shopSerial: this.$store.getters.shopSerial,
        branchId: this.$store.getters.branchId,
        tableId: this.$route.query.tableId,
        tableName: this.$route.query.tableName,
        commentList: []
      }
    },
    components: {
      ScoreItem,
      YunnexInfo
    },
    computed: {
    },
    watch: {
      '$route': ['refreshData']
    },
    created () {
      this.refreshData()
    },
    methods: {
      goDetail (goodId) {
        let data = {
          goodId: goodId
        }
        this.$router.push({
          path: 'newDetail',
          query: data
        })
      },
      setHeight (height) {
        console.info(height)
        this.itemHeight = height * this.commentList.length
      },
      // 基本BaseUrl 有环境配置信息 shopSerial 商户Id  branchId 门店id
      parseUrl (methods) {
        return this.$store.getters.getBaseUrl + methods + '?shopSerial=' + this.shopSerial + '&branchId=' + this.branchId
      },
      params (page) {
        return {
          goodsId: this.$route.query.goodId,
          page: page,
          pageSize: this.pageSize
        }
      },
      fetchData (paramsPage) {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '商品详情全部评价页', 'click', 'score'])
          window._hmt.push(['_trackPageview', '/score'])
        }
        console.info('fetchData')
        let _tempArr = []
        this.loading = true
        console.info(this.params(paramsPage))
        this.$http.post(this.parseUrl('/comment/list'), this.params(paramsPage)).then((res) => {
          console.info(res)
          let result = res.data.response
          if (!result) return
          _tempArr = result.commentList
          this.commentList = (paramsPage === 1 ? _tempArr : this.commentList.concat(_tempArr))
          this.page = result.page.currentPage
          this.hasNext = result.page.hasNextPage
          this.loading = false
        })
      },
      onLoadMore () {
        console.info('onLoadMore')
        if (this.loading || !this.hasNext) { return -1 }
        this.fetchData(this.page + 1)
      },
      refreshData () {
        document.body.scrollTop = 0
        this.fetchData(1)
      },
      ListContainerHeight () {
        this.listHeight = window.innerHeight + 'px'
      }
    },
    deactivated () {
      this.$destroy(true)
    },
    mounted () {
      this.$nextTick(function () {
        this.ListContainerHeight()
      })
    }

  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../assets/css/base";

  $color: #fff;
  .contain {
    height: 100%;
    background-color: white;
  }

  .loading {
    @include font-dpr(13px);
    line-height: pr(24);
    padding: pr(36);
    color: #adadad;
    text-align: center;
    background-color: white;
  }
</style>
