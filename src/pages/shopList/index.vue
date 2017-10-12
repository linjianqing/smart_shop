<template>
  <div style='overflow: auto;' :style='{height:shopListHeight}' class="shoplists" v-infinite-scroll="onLoadMore"
       infinite-scroll-disabled="busy" infinite-scroll-distance="1" ref="scrollContainer">
    <!--定位完-->
    <div v-if="hasLocation||cityId">
      <!--有门店-->
      <div v-if="hasQueue">
        <Shop v-for="(shop, index) in shopBranchList" :key="shop.id"
              :shop="shop" :mark="getShopStar(shop.shopBranchId)"
              :first="index===0"></Shop>
        <div class="loading" v-if="loading">页面加载中...</div>
        <div class="loading" v-if="!loading&&!hasNext||specialNo">没有更多门店了</div>
      </div>

      <!--没门店-->
      <div v-else>
        <div class="icon-noQueue"></div>
        <div v-if="searchIn">
          <div>抱歉，没有您的搜索结果</div>
        </div>
        <div v-if="!searchIn&&cityIn">
          <div>没有更多门店</div>
        </div>
      </div>
    </div>
    <!--没有定位-->
    <div class="tips" v-else>
      <div>无法获取位置信息</div>
      <div>请重新开启定位或手动选择定位城市</div>
      <div class="btn-location" @click="location">开启定位</div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import Shop from '../../components/ShopList/Shop'
  // import axios from 'axios'
  //  import $util from '../../utils/index.js'
  import { bus } from '../../utils/bus.js'
  import $cache from '../../utils/cache.js'

  export default {
    components: {
      Shop
    },
    data () {
      return {
        shopListHeight: '1200px',
        loading: true,
        page: 1,
        pageSize: 10,
        hasNext: false,
        shopBranchList: [],
        busy: false,
        specialNo: false, // 商户列表过少时出现没有更多门店
        vagueShopBranchName: '',
        hasQueue: true, // false为没有队可排
        searchResult: true, // false为没搜索结果
        cityIn: false, // true为当前城市没门店
        searchIn: false, // true为搜索结果没有,
        starList: {}
        //        isHasNextPage:false, // 是否有下一页
      }
    },
    props: {},
    watch: {
      '$route': ['refreshData']
    },
    computed: {
      hasLocation () {
        return this.$store.getters.latitude || this.$store.getters.longitude
      },
      cityId () {
        return this.$store.getters.getCityId
      },
      cityName () {
        return this.$store.getters.city
      }
    },
    methods: {
      // 定位
      location () {
        console.log('手动开启定位')
        this.$router.go(0)
        //        bus.$emit('handLocation')
      },
      // 请求数据
      fetchData (params, type) {
        this.loading = true
        this.specialNo = false
        let url = this.$store.getters.getUrl('getShopList', false)

        let _tempArr = []
        let data = {
          page: params.page,
          pageSize: this.pageSize,
          userLon: this.$store.getters.longitude || '',
          userLat: this.$store.getters.latitude || '',
          cityId: this.$store.getters.cityId,
          fatherId: this.$store.getters.fatherId,
          cityName: this.$store.getters.cityName,
          vagueShopBranchName: this.$store.getters.vagueShopBranchName
        }
        data = this.$url.params(data)
        this.$http.post(url, data, {
          timeout: 30000,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((response) => {
          document.title = '门店列表'
          this.loading = false
          this.$store.dispatch('setCityList', response.data.shopBranchInfo.cityList)
          this.hasNext = response.data.shopBranchInfo.isHasNextPage
          // 缓存cityList(1天)
          let timeout = 60 * 60 * 24
          $cache.set('cityList', response.data.shopBranchInfo.cityList, timeout)
          // 返回空
          if ((typeof response.data) && Array.isArray(response.data)) {
            console.log('返回空')
            this.shopBranchList = []
            this.specialNo = true
            return
          }
          _tempArr = response.data.shopBranchInfo.shopBranchList

          if (_tempArr.length === 0) {
            // 搜索进来
            if (type === 'search') {
              this.hasQueue = false
              this.searchIn = true
            } else {
              console.log('非搜索')
              // 靠定位城市
              if (this.$store.getters.cityName) {
                this.hasQueue = false
                this.cityIn = true
              }
            }
          } else {
            this.hasQueue = true
            this.cityIn = true
          }
          this.specialNo = true
          if (params.page !== 1 && this.page + 1 !== params.page) {
            console.error('页数已经发生变化')
            return -1
          }
          // 8027 批量获取店铺评价
          let branchIdList = _tempArr.map(x => x.shopBranchId).join()
          let url = this.$store.getters.getUrl('shopStar', false)
          let data = {'branchIdList': branchIdList}
          this.$http.get(url, {params: data}).then(res => {
            console.info(`list rating: ${res}`)
            if (res.data.code !== 0) {
              console.error(res.data.message)
            } else {
              for (let i of this.shopBranchList) {
                let temp = res.data.response[i.shopBranchId]
                this.$set(i, 'mark', temp)
              }
              if (this.starList !== {}) {
                this.starList = Object.assign(this.starList, res.data.response)
              } else {
                this.starList = res.data.response
              }
            }
          })
          console.info('branchIdList: ' + branchIdList)
          this.shopBranchList = params.page === 1 ? _tempArr : this.shopBranchList.concat(_tempArr)
          this.page = params.page
        }).catch((err) => {
          console.warn(err)
        })
      },
      getShopStar (branchId) {
        return this.starList[branchId]
      },
      // 加载
      onLoadMore () {
        if (this.loading || !this.hasNext) { return -1 }
        console.log('加载更多')
        this.specialNo = false
        let params = {
          page: this.page + 1,
          pageSize: this.pageSize
        }
        this.fetchData(params)
      },
      // 刷新
      refreshData (type) {
        if (['shopDetail', 'queue', 'city', 'queueDetail'].includes(this.$route.name)) return

        let params = {
          page: 1,
          pageSize: this.pageSize
        }
        document.body.scrollTop = 0
        this.fetchData(params, type)
      },
      //            商店容器高度调整
      shopListContainerHeight () {
        console.log('子', window.innerHeight, this.$el.offsetHeight)
        this.shopListHeight = this.$el.offsetHeight + 'px'
      }
    },
    created () {
      this.refreshData()
      // 搜索框组件调用请求商户列表
      let _this = this
      bus.$on('requestShopList', function (type) {
        console.log('搜索结果')
        _this.shopBranchList = []
        _this.refreshData(type)
      })
    },
    mounted () {
      this.$nextTick(function () {
        this.shopListContainerHeight()
      })
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        document.title = '门店列表'
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  $color: #fff;

  .loading {
    @include font-dpr(13px);
    line-height: p2r(24px);
    padding: p2r(36px);
    color: #adadad;
    text-align: center;
    background-color: #f5f5f5;
  }

  .btn-my-odder {
    @include font-dpr(16px);
    $h: p2r(88px);
    width: 100%;
    height: $h;
    line-height: $h;
    color: #fff;
    background-color: $color;
    text-align: center;
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
  }

  .shim {
    height: p2r(100px);
    width: 100%;
    opacity: 0;
  }

  .tips {
    @include font-dpr(13px);
    color: #adadad;
    text-align: center;
    line-height: p2r(42px);
    margin-top: p2r(184px);
  }

  .btn-location {
    $h: p2r(60px);
    @include font-dpr(13px);
    color: #545454;
    width: p2r(198px);
    height: $h;
    line-height: $h;
    border: 1px solid #d0d0d0;
    margin: p2r(36px) auto;
    border-radius: p2r(6px);
  }

  .icon-noQueue {
    width: p2r(332px);
    height: p2r(258px);
    margin: p2r(120px) auto p2r(26px);
    & + div {
      @include font-dpr(13px);
      text-align: center;
      color: #adadad;
    }
  }
</style>
