<template>
  <div ref="scroll">
    <!--侧边索引-->
    <nav class="catalogsContainer">
      <ul class="catalogs">
        <li class="catalog" v-for="item in letter" @click="goIndex(item)">{{item}}</li>
      </ul>
    </nav>
    <!--城市列表-->
    <div class="citys">
      <ul v-for="item in citys">
        <li class="city-index" :id='"item"+item.index'>{{item.index}}</li>
        <li v-for="i in item.data" class="city-list" @click="chooseCity(i.name,i.city_id,i.father_id)">{{i.name}}</li>
      </ul>
    </div>
    <Loading v-show="isLoading"></Loading>
  </div>
</template>
<script>
  import Loading from '../../components/common/Loading'
  import $cache from '../../utils/cache.js'

  export default {
    components: {
      Loading
    },
    data () {
      return {
        isLoading: true, // loading状态
        citys: [],
        letter: [] // 侧边索引栏
      }
    },

    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        let url = this.$store.getters.getUrl('getCityList', false)
        let _this = this
        let _city = []
        let data = {
          cityIdList: this.$store.getters.getCityList || $cache.get('cityList')
        }
        data = this.$url.params(data)
        this.$http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
          _city = response.data.cityList
          _this.dealCity(_city, 'firstLetter')
          _this.isLoading = false
        }).catch((error) => {
          console.warn(error)
        })
      },
      // 数组，分类字段（如firstLetter首字母）
      dealCity (arr, index) {
        let map = {}
        let dest = []
        let _letter = []
        for (let i = 0, len = arr.length; i < len; ++i) {
          let ai = arr[i]
          let letter = ai[index][0].toUpperCase()
          if (!map[letter]) {
            dest.push({
              index: letter,
              data: [ai]
            })
            map[letter] = true
            _letter.push(letter)
          } else {
            for (let j = 0, len2 = dest.length; j < len2; ++j) {
              let dj = dest[j]
              let letter = ai[index][0].toUpperCase()
              if (dj.index === letter) {
                dj.data.push(ai)
                break
              }
            }
          }
        }
        // 根据字母顺序排序
        let _dest = dest.sort(function (a, b) {
          return a['index'].charCodeAt() - b['index'].charCodeAt()
        })
        this.citys = _dest
        this.letter = _dest.map(function (item) {
          return item.index
        })
      },
      // 点击相应城市
      chooseCity (name, cityId, fatherId) {
        this.$store.dispatch('setCityId', cityId)
        this.$store.dispatch('setVagueShopBranchName', '')
        this.$store.dispatch('setCityName', name)
        this.$store.dispatch('setFatherId', fatherId)

        this.$router.push({
          name: 'shopList',
          params: {city: name}
        })
      },
      // 点击索引跳到相应字母位置
      goIndex (index) {
        this.$refs.scroll.scrollTop = document.getElementById('item' + index).offsetTop - this.$refs.scroll.offsetTop
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        document.title = '城市列表'
      })
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  ul {
    padding: 0;
    margin: 0;
  }

  .catalogsContainer {
    width: p2r(28px);
    height: 100%;
    position: fixed;
    z-index: 3;
    right: 0;
    top: 0;
    background-color: #fff;
    /*pointer-events: none;*/
  }

  .catalogs {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .catalog {
      @include font-dpr(12px);
      color: #545454;
      line-height: p2r(30px);
      list-style: none;
      text-align: center;
    }
  }

  .citys {
    background-color: #fff;
    li {
      &:last-child {
        border-bottom: 0;
      }
    }
  }

  .city-index {
    $h: p2r(50px);
    height: $h;
    line-height: $h;
    background-color: #f4f4f4;
    @include font-dpr(14px);
    color: #adadad;
    padding-left: p2r(24px);
  }

  .city-list {
    $h: p2r(90px);
    height: $h;
    line-height: $h;
    border-bottom: 1px solid #d0d0d0;
    background-color: #fff;
    margin-left: p2r(24px);
    @include font-dpr(15px);
  }
</style>
