<template>
  <div class="item-bg">
    <div class="main">
      <div class="imgBack" @click="closeScan"></div>
      <div class="img"></div>
      <div class="title">请扫码店家二维码</div>
      <div class="text">您点的菜已存购物车</div>
      <div class="text">请扫餐桌或餐牌上桌号二维码下单</div>
      <div class="scan" @click="goScan()">开始扫码</div>
    </div>
    <toast-show v-show="toasting" :content="content"></toast-show>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
  import BackIcon from '../../components/common/BackIcon'
  import ToastShow from '../../components/common/ToastShow'
  import Loading from '../../components/common/Loading'

  export default {
    data () {
      return {
        toastins: false,
        content: '',
        tableId: 0,
        tableName: '',
        toasting: false,
        loading: false
      }
    },
    components: {
      BackIcon,
      ToastShow,
      Loading
    },
    methods: {
      showToast (content) {
        this.content = content
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 1000)
      },
      closeScan () {
        this.loading = false
        this.$emit('closeScan')
      },
      goScan () {
        console.info('start_scan')
        this.$wx.scanQRCode({
          needResult: 1,
          scanType: 'qrCode',
          success: (res) => {
            this.loading = true
            console.info('res.resultStr: ' + res.resultStr)
            let strList = res.resultStr.split('/')
            console.info(`strList: ${strList}`)
            // 这里是做匹配，匹配到weinin关键字就过
            if (!strList.includes('weixin')) {
              console.error('error 0')
              this.loading = false
              this.$emit('scanResult', {'code': -1, 'message': '请扫描正确的二维码'})
              return -1
            }
            let qrCodeNum = strList.pop()
            console.info(`qrCodeNum: ${qrCodeNum}`)
            if (qrCodeNum) {
              let url = this.$store.getters.getUrl('xiaoerQRCode', false)
              this.$http.post(url, {qrcode: qrCodeNum}).then(res => {
                console.info(`xiaoerQRCode result: ${JSON.stringify(res.data)}`)
                if (res.data.code !== 0) {
                  console.error('error 1: ' + res.data.message)
                  this.loading = false
                  this.$emit('scanResult', res.data)
                  return -1
                }
                if (!res.data.response) {
                  console.error('no data.reponse')
                  this.loading = false
                  this.$emit('scanResult', {'code': -1, 'message': '请扫正确的二维码'})
                  return -1
                }
                if (res.data.response.branchId !== this.$store.getters.branchId) {
                  this.loading = false
                  console.warn('请扫描该店的二维码')
                  this.$emit('scanResult', {'code': -1, 'message': '请扫描该店的二维码'})
                  return -1
                }
                console.info('get the qrcode')
                this.tableId = res.data.response.deskId
                this.tableName = res.data.response.deskName
                console.info(`tableId: ${this.tableId}, tableName: ${this.tableName}`)
                let updateTableUrl = this.$store.getters.getUrl('updateTable')
                this.$http.post(updateTableUrl, {tableId: this.tableId}).then(res => {
                  console.info('update table result')
                  if (res.data.code !== 0) {
                    console.error('error 2: ' + res.data.message)
                    this.loading = false
                    this.$emit('scanResult', res.data)
                    return -1
                  }
                  console.info('update table done')
                  this.$store.dispatch('setTableId', this.tableId)
                  this.$store.dispatch('setTableName', this.tableName)
                  this.loading = false
                  this.$emit('scanResult', {'code': 0, 'tableId': this.tableId, 'tableName': this.tableName})
                  return 0
                })
              })
            } else {
              console.error('no qrCodeNum')
              this.loading = false
              this.$emit('scanResult', {'code': -1, 'message': '请扫描正确的二维码.'})
              return -1
            }
          }
        })
        console.warn('not suppose to be here.')
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .item-bg {
    z-index: 11;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .text {
    width: 100%;
    @include font-dpr(13px);
    color: #545454;
  }

  .img {
    @include bg-image('../../assets/img/ruzuochenggong');
    width: pr(230);
    height: pr(230);
    display: inline-block;
    margin-top: pr(66);
  }

  .imgBack {
    width: pr(94);
    height: pr(94);
    position: absolute;
    display: inline-block;
    right: 0;
    background-size: 100% 100%;
    background-image: url('../../assets/img/guanbi2@2x.png');
  }

  .main {
    background-color: white;
    width: pr(592);
    height: pr(650);
    position: fixed;
    text-align: center;
    vertical-align: middle;
    top: 0;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .title {
    margin-top: pr(36);
    text-align: center;
    @include font-dpr(17px);
    color: #181818;
    width: 100%;
    margin-bottom: pr(28);
  }

  .scan {
    width: pr(348);
    height: pr(80);
    line-height: pr(80);
    vertical-align: middle;
    color: white;
    display: inline-block;
    margin-top: pr(42);
    background-image: linear-gradient(90deg, #f76049, #F74848);
    border-radius: pr(40);
  }
</style>
