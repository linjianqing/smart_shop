<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

<script>
  import $cache from './utils/cache'

  export default {
    data () {
      return {}
    },
    created () {
      console.info('init smart shop')
      // 首页进来之后做店铺信息获取，会员信息获取和微信授权
      // 如果是支付完成回来的话就不用读这些了，在payment页面重新通过orderId来获取shopSerial和branchId
      //      if (window.location.href.indexOf('Payment') < 0) {
      if (!window.location.href.includes('Payment')) {
        console.info('not payment')
        this.initJSSDK()
        this.memberStatus()
      }
      this.getHeaderInfo()
      this.getTableInfo()
    },
    methods: {
      initJSSDK () {
        console.info('init wx jssdk')
        let shopSerial = window.shopSerial
        let url = this.$store.getters.getUrl('getJSAPI', false)
        this.$http.get(url, {params: {shopSerialId: shopSerial}}).then(res => {
          let _jsApi = res.data.jsApi
          this.$wx.config({
            appId: _jsApi.appId,
            timestamp: _jsApi.timestamp,
            nonceStr: _jsApi.noncestr,
            signature: _jsApi.signature,
            jsApiList: ['checkJsApi', 'openLocation', 'getLocation', 'hideAllNonBaseMenuItem', 'scanQRCode', 'closeWindow'],
            fail: function () {
              console.error('wx config error')
            }
          })
          this.$wx.ready(() => {
            console.log('ready')
            this.$wx.hideAllNonBaseMenuItem()
          })
          this.$wx.error((res) => {
            console.error(`wx jssdk config error: ${JSON.stringify(res)}`)
          })
        }).catch((error) => {
          console.warn(error)
        })
      },
      // 这里拿一下shopSerial、BranchId和tableInfo等信息
      getHeaderInfo () {
        let shopSerial = window.shopSerial
        let branchId = parseInt(window.branchId) || 0
        let tableInfo = window.tableInfo

        let orderId = $cache.get('orderId', '')
        $cache.del('orderId')
        let tableId = $cache.get('tableId', 0)
        $cache.del('tableId')
        let tableName = $cache.get('tableName', '')
        $cache.del('tableName')

        console.info(`shopSerial:${shopSerial},branchId:${branchId}`)
        console.info(`tableInfo:${tableInfo},tableId:${tableId},tableName:${tableName},orderId:${orderId}`)
        this.shopSerial = shopSerial
        this.branchId = branchId
        this.$store.dispatch('setShopSerial', shopSerial)
        this.$store.dispatch('setBranchId', branchId)
        this.$store.dispatch('setTableId', tableId)
        this.$store.dispatch('setTableName', tableName)
        this.$store.dispatch('setOrderId', orderId)
      },
      getTableInfo () {
        let tableInfo = window.tableInfo
        if (tableInfo !== null && tableInfo !== '0' && tableInfo) {
          let url = this.$store.getters.getUrl('xiaoerQRCode', false)
          this.$http.post(url, {'qrcode': tableInfo}).then(res => {
            console.info(res)
            if (res.data.code !== 0) {
              console.error(`获取桌号信息错误: ${JSON.stringify(res.data)}`)
            } else if (res.data.response.branchId !== this.branchId) {
              console.error(`门店不一致: ${JSON.stringify(res.data.response)}, branchId: ${this.branchId}`)
            } else {
              // 这里会更新一下桌子信息
              this.$store.dispatch('setTableId', res.data.response.deskId)
              this.$store.dispatch('setTableName', res.data.response.deskName)
            }
          })
        }
      },
      memberStatus () {
        this.$http.get(this.$store.getters.getUrl('getMemberStatus', false), {params: {shopSerial: window.shopSerial}}).then(res => {
          console.info(res)
          if (res.data.code !== 0) {
            console.error(`获取会员接口信息报错: ${res.data.message}`)
            console.error(res.data.message)
          } else {
            this.$store.dispatch('setMemberStatus', res.data.response)
            console.info('memberStatus: ' + this.$store.getters.memberStatus)
          }
        })
      }
    }
  }
</script>
