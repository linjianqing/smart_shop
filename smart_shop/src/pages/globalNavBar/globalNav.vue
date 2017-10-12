<template>
  <div>
    <div class="global-nav" v-show="isGlobalShow" @touchstart="startNavigator" ref="moveGlobalNav">
      <div class="shrink" v-show="isShrinkShow" @click="changeDisplay">
        <span>快速导航</span>
      </div>
      <ul v-show="!isShrinkShow" class="nav-list" @touchmove="stopEvent">
        <li v-for="list in lists" v-show="list.show" @click="handleUrl(list)">
          <div>
            <router-link :to="list.url" :class="list.className"></router-link>
            <p class="nav-tip">
              <span>{{list.title}}</span>
            </p>
          </div>
        </li>
      </ul>
      <div class="expand" v-show="!isShrinkShow" @click="changeDisplay()">
        <span>收起</span>
      </div>
    </div>
    <div class="full-shadow" v-show="isGlobalShow&&!isShrinkShow" @click="changeDisplay()" @touchmove="stopEvent"></div>
  </div>
</template>

<script>
  import $cache from '../../utils/cache.js'

  export default {
    data () {
      return {
        isGlobalShow: true,
        isShrinkShow: true,
        lists: [{title: '店铺', url: '/', index: 1, branchConfig: 1, show: false, className: 'shop'}, {
          title: '点菜', url: '/', index: 2, diancanConfig: 1, show: false, className: 'ask-order'
        }, {
          title: '我的', url: '/', index: 3, memberCenterConfig: 1, show: false, className: 'myself'
        }, {
          title: '订单', url: '/', index: 4, orderConfig: 1, show: false, className: 'order'
        }, {
          title: '排队', url: '/#', index: 5, queueConfig: 1, show: false, className: 'line-up'
        }, {
          title: '外卖', url: '/#', index: 6, waimaiConfig: 1, show: false, className: 'takeout'
        }]
      }
    },
    //    watch: {
    //      '$route': 'getNavInfo'
    //    },
    methods: {
      changeDisplay () {
        this.isShrinkShow = !this.isShrinkShow
      },
      getNavInfo () {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '全局导航 ', 'click', 'globalNav'])
          window._hmt.push(['_trackPageview', '/globalNav'])
        }
        let url = this.$store.getters.getUrl('getGlobalNav', false)
        this.$http.post(url).then(res => {
          if (res.data.code !== 0) {
            return false
          } else if (res.data.code === 0) {
            this.lists = this.handleResponse(this.lists, res.data.response).slice(0)
            this.getdiancanInfo()
            this.sortByIndex(this.lists, 'index')
          }
        })
      },
      getdiancanInfo () {
        let url = this.$store.getters.getUrl('getShopInfo')
        let diancan = this.lists.filter((item) => {
          return item.index === 2
        })[0]
        this.$http.post(url, {}).then((res) => {
          if (res.data.code === 0) {
            diancan.show = diancan.diancanConfig && res.data.response.diancanConfig
          } else {
            diancan.show = 1 // 万一请求不到了，给个默认值，默认开启
          }
        })
      },
      sortByIndex (arr, index) {
        arr.sort(function (a, b) {
          return a[index] - b[index]
        })
      },
      // 处理显示与隐藏的选项
      handleResponse (arr, obj) {
        let tempArr
        let result = []
        for (let key in obj) {
          tempArr = arr.filter((item) => {
            return item.hasOwnProperty(key)
          })[0]
          if (tempArr) {
            tempArr['show'] = (tempArr[key] && obj[key])
            result.push(tempArr)
          }
        }
        return arr
      },
      // 抽出来单独 处理每个需要跳转的 url 地址
      handleUrl (type) {
        switch (type.title) {
          case '店铺':
            this.$router.push({'name': 'shopIndex'})
            break
          case '点菜':
            this.$router.push({'name': 'index'})
            break
          case '我的':
            this.$router.push({'name': 'userHomePage'})
            break
          case '订单':
            this.$router.push({'name': 'userOrderList'})
            break
          case '排队':
            $cache.set('tableId', this.$store.getters.tableId, 60)
            $cache.set('tableName', this.$store.getters.tableName, 60)
            window.location.href = `http://${window.location.host}/wxQueue/takeShopConfigTable/${window.shopSerial}?shopBranchId=${window.branchId}&source=8`
            break
          case '外卖':
            window.alert('目前还没配置外卖选项')
            break
          default :
            break
        }
        this.changeDisplay()
      },
      // 移动 全局导航 “图标”
      startNavigator (e) {
        if (!this.isShrinkShow) {
          return false
        }
        let targetNav = this.$refs.moveGlobalNav
        let disY = e.touches[0].clientY - targetNav.offsetTop
        document.addEventListener('touchmove', moveNavigator, false)

        function moveNavigator (e) {
          let lastLocationY = e.touches[0].clientY - disY
          if (lastLocationY < 200) {
            lastLocationY = 200
          } else if (lastLocationY > document.documentElement.clientHeight - targetNav.clientHeight - 200) {
            lastLocationY = document.documentElement.clientHeight - targetNav.clientHeight - 200
          }
          targetNav.style.top = lastLocationY + 'px'
        }

        document.addEventListener('touchend', () => {
          document.removeEventListener('touchend', this.startNavigator, false)
          document.removeEventListener('touchmove', moveNavigator, false)
        }, false)
      },
      stopEvent (e) {
        e.preventDefault()
      }
    },
    created () {
      this.getNavInfo()
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
  @import "../../assets/css/base";

  .global-nav {
    position: fixed;
    /*top: pr(774);*/
    top: 65%;
    left: 0;
    z-index: 85;
    transform: translate3d(0, -50%, 0);
    .shrink {
      @include bg-image("../../assets/img/globalnav/zhankai");
    }
    .expand {
      @include bg-image("../../assets/img/globalnav/shouqi");
    }
    .shrink, .expand {
      position: absolute;
      top: 50%;
      right: pr(-90);
      margin-top: pr(-34);
      height: pr(68);
      width: pr(90);
      border-radius: 0 pr(34) pr(34) 0;
      background: rgba(0, 0, 0, 0.8) right pr(10) center no-repeat;
      background-size: pr(18) pr(24);
      span {
        display: table-cell;
        height: pr(68);
        width: 2.05em;
        padding-left: pr(12);
        @include font-dpr(11px);
        vertical-align: middle;
        text-align: center;
        color: #fff
      }
    }
    .nav-list {
      width: pr(418);
      /*height:pr(296);*/
      padding: pr(11) 0;
      font-size: 0;
      border-radius: 0 pr(8) pr(8) 0;
      background-color: rgba(255, 255, 255, .92);
      li {
        display: inline-block;
        box-sizing: border-box;
        width: 33.333%;
        height: 50%;
        & {
          a {
            display: inline-block;
            width: pr(48);
            height: pr(48);
            -webkit-animation: shake .3s steps(30);
            -o-animation: shake .3s steps(30);
            animation: shake .3s steps(30);
          }
          .nav-tip {
            margin-top: pr(8);
            color: #545454;
            @include font-dpr(11px);
            overflow: hidden;
            white-space: nowrap;
            & > span {
              display: inline-block;
              min-width: pr(48);
              text-align: center;
            }
          }
          .shop {
            @include bg-image("../../assets/img/globalnav/dianpu");
            &:active {
              @include bg-image("../../assets/img/globalnav/dianpu2@2x")
            }
          }
          .ask-order {
            @include bg-image("../../assets/img/globalnav/diancai");
            &:active {
              @include bg-image("../../assets/img/globalnav/diancai2@2x")
            }
          }
          .myself {
            @include bg-image("../../assets/img/globalnav/wode");
            &:active {
              @include bg-image("../../assets/img/globalnav/wode2@2x")
            }
          }
          .order {
            @include bg-image("../../assets/img/globalnav/dingdan");
            &:active {
              @include bg-image("../../assets/img/globalnav/dingdan2@2x")
            }
          }
          .line-up {
            @include bg-image("../../assets/img/globalnav/paidui");
            &:active {
              @include bg-image("../../assets/img/globalnav/paidui2@2x")
            }
          }
          .takeout {
            @include bg-image("../../assets/img/globalnav/waimai");
            &:active {
              @include bg-image("../../assets/img/globalnav/waimai2@2x")
            }
          }
        }
      }
      & li:nth-child(3n+1) {
        padding: pr(25) 0 pr(25) pr(38);
      }
      & li:nth-child(3n+2) {
        padding: pr(25) 0 pr(25) 0;
        text-align: center;
      }
      & li:nth-child(3n+0) {
        padding: pr(25) pr(38) pr(25) pr(0);
        text-align: right;
      }
    }
  }

  .full-shadow {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 84;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }

  @keyframes shake {
    0% {
      transform: rotateY(0)
    }
    25% {
      transform: rotateZ(-30deg)
    }
    50% {
      transform: rotateZ(0)
    }
    75% {
      transform: rotateZ(30deg)
    }
    100% {
      transform: rotateZ(0)
    }
  }
</style>
