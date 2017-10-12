<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <Search class="search" ref="search" v-bind:isShow="isShowSearch" :positioning="positioning"
            :position="position"></Search>
    <loading v-show="isLoading"></loading>

    <keep-alive v-if="afterInit" :hasLoc='hasLoc'>
      <router-view class='router' :style="{height:containerHeight}" style="overflow: scroll;">
      </router-view>
    </keep-alive>
  </div>
</template>

<script>
  import Search from '../../components/shopList/search'
  import ShopList from '../shopList/index'
  import loading from '../../components/common/Loading'
  import $utils from '../../utils/index.js'

  export default {
    data () {
      return {
        isShow: true, // 搜索是否显示
        positionSuccess: false, //  是否定位成功
        containerHeight: '1200px',
        isLoading: true, // true:loading中
        positioning: true, // true:定位中
        afterInit: false, // 确保地理初始化才开始,
        hasLoc: false // true为已成功定位
      }
    },
    computed: {
      position () {
        if (!this.positionSuccess && this.positioning) {
          return '定位失败'
        }
        if (this.positioning) {
          return '定位中'
        }
        return this.$store.getters.cityName || '未知地区'
      },
      isShowSearch () {
        return this.$route.name === 'shopList'
      }
    },
    components: {
      Search,
      ShopList,
      loading
    },
    methods: {
      // 高度调整
      listContainerHeight () {
        console.log('高度是:', window.innerHeight)
        this.$nextTick(function () {
          this.containerHeight = window.innerHeight - this.$refs.search.$el.offsetHeight + 'px'
        })
      },

      // 经纬度转城市
      getAttr (latlon) {
        const params = {
          output: 'jsonp',
          key: 'GACBZ-FV5RI-WKJGG-5TVJZ-44SSE-IEFTO',
          location: latlon,
          coord_type: 5 // [默认]腾讯、google、高德坐标
        }
        const url = 'http://apis.map.qq.com/ws/geocoder/v1/'
        this.isLoading = true

        this.$http.jsonp(url, {params: params}, {jsonp: 'QQMap'}, {}).then((ret) => {
          console.log(ret.body.result)
          this.$store.dispatch('setCityName', ret.body.result.ad_info.city)
          this.positioning = false
          this.hasLoc = true
          this.afterInit = true
          this.isLoading = false
          this.positionSuccess = true
          this.$router.push({
            name: 'shopList',
            params: {city: ret.body.result.ad_info.city}
          })
        }).catch((error) => {
          console.info(error)
          alert('定位失败')
          this.positioning = false
          this.positionSuccess = false
          this.afterInit = true
          this.isLoading = false
        })
      },

      getLocation () {
        let _this = this
        this.$wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            console.log('地理回调成功')
            _this.$store.dispatch('setLocation', {latitude: res.latitude, longitude: res.longitude})
            let _location = _this.$store.getters.latitude + ',' + _this.$store.getters.longitude
            _this.getAttr(_location)
            console.log('done')
          },
          fail: function () {
            alert('获取地理位置失败')
            _this.getAttr('')
          },
          // 用户取消获取权限
          cancel: function () {
            _this.getAttr('')
          }
        })
      }
    },

    created () {
      if ($utils.isWeixinBrowser()) {
        this.$wx.ready(() => {
          console.log('ready')
          this.getLocation()
          this.$wx.hideAllNonBaseMenuItem()
        })
      } else {
        console.error('请在微信客户端中打开')
        //        以下是调试代码
        let _location = 23.129163 + ',' + 113.264435
        this.$store.dispatch('setLocation', {latitude: 23.129163, longitude: 23.129163})
        this.getAttr(_location)
      }
    },
    mounted () {
      this.listContainerHeight()
      window.addEventListener('resize', this.listContainerHeight)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/reset.scss";
  @import "../../assets/css/base.scss";
  @import "../../assets/css/_theme.scss";

  .search {
    $h: 100px;
    width: 100%;
    height: p2r($h);
    line-height: p2r($h);
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 0 p2r(24px);
    z-index: 2;
    border-bottom: pr(12) solid #f5f5f5;
  }

  .router {
    margin-top: p2r(88px);
  }

  .shoplists {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .btn-my-odder {
    @include font-dpr(15px);
    $h: p2r(100px);
    width: 100%;
    height: $h;
    line-height: $h;
    color: #fff;
    background-color: $color;
    text-align: center;
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
  }
</style>
