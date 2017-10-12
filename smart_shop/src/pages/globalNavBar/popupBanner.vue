<template>
    <div v-show="isShow">
      <div class="popup-banner" ref="popupWrap">
        <img :src="imgUrl" :class="{'width-img':widthHeightRatioBool,'height-img':!widthHeightRatioBool}"  @click="popupYunnexDialog" ref="bannerImg">
      </div>
      <div class="close-icon" @click="changeDisplay"></div>
      <div class="full-shadow" v-show="isShow"></div>
    </div>
</template>

<script>
    import $cache from '../../utils/cache'
    import $defaultImg from '../../assets/img/globalnav/getMember@2x.png'

    export default {
      data () {
        return {
          isShow: '',
          imgUrl: '',
          widthHeightRatioBool: false,
          isMemberBool: ''
        }
      },
      methods: {
        changeDisplay () {
          this.isShow = !this.isShow
        },
        getPopupBannerInfo () {
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '广告弹窗', 'click', 'advertPopup'])
            window._hmt.push(['_trackPageview', '/advertPopup'])
          }
          let url = this.$store.getters.getUrl('popupBanner', false)
          this.$http.post(url).then(res => {
            if (res.data.code !== 0) {
              return false
            } else {
              let adImage = res.data.response.adImage
              let vipImage = res.data.response.vipImage || $defaultImg
              let adConfig = res.data.response.adConfig
              let vipConfig = res.data.response.vipConfig
              let url = this.$store.getters.getUrl('getMemberStatus', false)
              this.$http.get(url).then(res => {
                if (res.data.code !== 0) {
                  console.warn(`error_pop: ${res.data}`)
                } else {
                  this.isMemberBool = res.data.response.memberStatus
                  if (this.isMemberBool) {
                    // 是会员的情况下
                    if (!adConfig) {
                      this.isShow = false
                    } else {
                      this.imgUrl = adImage
                    }
                  } else {
                    if (!vipConfig) {
                      this.isShow = false
                    } else {
                      this.imgUrl = vipImage
                    }
                  }
                  this.adjustSize()
                }
              })
            }
          })
        },
        adjustSize () {
          // adjustSize的功能是：根据原始照片及其父辈容器的宽高比例，动态调整照片剪切的范围
          let ratio = this.$refs.popupWrap.clientWidth / this.$refs.popupWrap.clientHeight
          let image = new Image()
          image.src = this.imgUrl
          let ratioImg = image.width / image.height
          if (ratio > ratioImg) {
            this.widthHeightRatioBool = !this.widthHeightRatioBool
          }
        },
        displayInLimitedTime () {
          // 第一次localStorage没有popupBanner字段，返回0，超过timeout，返回也是0，重新设置isShow状态
          // 另：set方法里面的 timeout参数是以‘秒’为单位的。。。。
          let gotData = $cache.get('popupBanner', 0)
          if (gotData === 0) {
            this.isShow = true
            $cache.set('popupBanner', 1, 30 * 60)
          }
        },
        popupYunnexDialog () {
          if (!this.isMemberBool) {
            if (window._hmt) {
              window._hmt.push(['_trackEvent', '会员引导弹窗', 'click', 'yunnexDialog'])
              window._hmt.push(['_trackPageview', '/yunnexDialog'])
            }
            let customerId = this.$store.getters.customerId
            let soureChannel = -17
            if (customerId) {
              this.$yunnexDialog({
                shopSerial: this.$store.getters.shopSerial,
                customerId: customerId,
                channel: 1,
                soureChannel: soureChannel,
                callBack: () => {
                  this.$store.dispatch('setResultMemberStatus', true) // 注册成功更新原有会员状态
                  location.reload()
                }
              }).ready()
            }
            this.isShow = !this.isShow
          }
        }
      },
      created () {
        this.getPopupBannerInfo()
        this.displayInLimitedTime()
      },
      mounted () {
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
  @import "../../assets/css/base";
  .popup-banner{
    position: fixed;
    top:50%;
    left:50%;
    z-index:92;
    margin-top:pr(-384);
    margin-left:pr(-295);
    width:pr(590);
    height:pr(768);
    -webkit-border-radius: pr(8);
    -moz-border-radius: pr(8);
    border-radius: pr(8);
    background-color: rgba(255,255,255,0.1);
    overflow: hidden;
    img{
      position: relative;
      top: 50%;
      left: 50%;
      -webkit-transform: translate3d(-50%,-50%,0);
      -moz-transform: translate3d(-50%,-50%,0);
      -ms-transform: translate3d(-50%,-50%,0);
      -o-transform: translate3d(-50%,-50%,0);
      transform: translate3d(-50%,-50%,0);
    }
    .width-img{
      width:100%;
    }
    .height-img{
      height:100%;
    }
    .popup-banner-loading{
      width: pr(70);
      height: pr(70);
      margin-left:45%;
      display: inline-block;
      vertical-align: middle;
      -webkit-animation: weuiLoading 1s steps(12, end) infinite;
      animation: weuiLoading 1s steps(12, end) infinite;
      background: transparent url('../../assets/img/loading.gif') no-repeat;
      background-size: 100%;
    }
  }
  .close-icon{
    position: fixed;
    top: 50%;
    right: 50%;
    z-index:106;
    width:pr(62);
    height:pr(62);
    margin-top:pr(-384-68-44);
    margin-right:pr(-295);
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0);
    @include bg-image("../../assets/img/globalnav/guanbi");
  }
  .close-icon::after{
    content: "";
    display: inline-block;
    position: absolute;
    left:50%;
    bottom: pr(-50);
    z-index:91;
    width:pr(2);
    height:pr(50);
    background-color: rgba(175, 175, 175, 1);
  }
  .full-shadow {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
</style>
