<!--这里是主要入口,判断商户的显示模式-->
<template>
  <div>
    <div v-if="isLoadingDone">
      <shop-list v-if="!branchId" :shopSerial="shopSerial"></shop-list>
      <div v-else>
        <no-order v-if="showNoOrder"></no-order>
        <menu-list-error v-else-if="showMenuListError"></menu-list-error>
        <div v-else>
          <small-mode v-if="smallMode" :notice="notice"></small-mode>
          <big-mode v-else :notice="notice"></big-mode>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import SmallMode from './pages/shopcart/index'
  import BigMode from './pages/BigPicOrderPage'
  import ShopList from './pages/shopListIndex/index'
  import NoOrder from './pages/NoOpenWxOrder'
  import Loading from './components/common/Loading'
  import menuListError from './components/menuListError'

  export default {
    data () {
      return {
        smallMode: null,
        notice: '',
        isLoadingDone: false,
        branchId: this.$store.getters.branchId,               // 如果这个值没有的话就代表用户是从公众号进来的入口
        shopSerial: this.$store.getters.shopSerial,
        orderId: this.$store.getters.orderId,
        showNoOrder: null,
        showMenuListError: null
      }
    },
    components: {
      BigMode,
      SmallMode,
      ShopList,
      NoOrder,
      Loading,
      menuListError
    },
    created () {
      // 没有branchId直接跳门店列表
      if (this.branchId === 0) {
        this.isLoadingDone = true
      } else {
        // 这里的逻辑是如果没有orderId的话就先查有没有未完成的订单,查到就跳到payment页（有orderId回来的情况是加菜的情况）
        if (!this.orderId) {
          this.getOrderId()
        }
        // 这里的判断顺序是 “是否开通微信点餐服务”（如果未开通的话会打开空页面）——“是快餐模式/正餐模式”——“判断显示模式”
        this.getPicMode()
        this.getBasicInfo()
        this.getNoticeInfo()
      }
    },
    methods: {
      getOrderId: function () {
        this.$http.post(this.$store.getters.getUrl('getOrderId')).then(res => {
          console.info(res.data)
          if (res.data.code !== 0) {
            console.info(res.data.message)
          } else {
            let orderId = res.data.response
            if (orderId) {
              this.$store.dispatch('setOrderId', orderId)
              this.$router.push({
                name: 'Payment',
                query: {'orderId': orderId}
              })
              return 0
            }
          }
        })
      },
      getPicMode () {
        // 获取商户信息
        this.$http.post(this.$store.getters.getUrl('getMenuList'), {}).then(res => {
          console.info(res)
          if (res.data.code !== 0) {
            // 新增一个读取菜单异常页
            console.error(`getMenuList返回错误: ${res.data.message}`)
            this.showMenuListError = true
            this.isLoadingDone = true
          } else {
            this.$store.dispatch('setShopData', res.data.response)
            // 判断大小图模式和记录公告
            let url = this.$store.getters.getUrl('getShopInfo')
            this.$http.post(url, {}).then(res => {
              console.info(res)
              this.$store.dispatch('setShopInfo', res.data.response)
              let displayType = res.data.response.displayType
              this.notice = res.data.response.announce
              // 这里是微信点餐的开关（1开启，0关闭）
              let diancanConfig = res.data.response.diancanConfig
              if (diancanConfig) {
                // 这里要先判断用户有没有开通微信点餐，再判断有没有已存在的单号（有的话就跳转到Payment页），最后判断大小图模式
                this.smallMode = [0, 2].includes(displayType)
              } else {
                this.isLoadingDone = true
                this.showNoOrder = true
                return -1
              }
              this.isLoadingDone = true
            })
          }
        })
      },
      // 这里只拿一个名字感觉有点奇怪
      getBasicInfo () {
        let url = this.$store.getters.getUrl('getBasicInfo', false)
        this.$http.post(url, {params: {'branchId': this.branchId}}).then((res) => {
          if (res.data.code !== 0) {
            console.info(res.data.msg)
          } else {
            document.title = res.data.name
          }
        })
      },
      getNoticeInfo () {
        this.$http.post(this.$store.getters.getUrl('getNotice'), {}).then(res => {
          console.info(res)
          let result = res.data
          if (result.code === 0) {
            if (result.response) {
              this.$store.dispatch('setNoticeInfo', result.response)
            }
          } else {
            console.error(`获取公告异常: ${JSON.stringify(res.data)}`)
          }
        })
      }
    }
  }
</script>
