<template>
  <div class="yunnex-info" @click="logoRedirect()">
    <img class="logo" :src="logoUrl"/>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    created () {
      if (!this.$store.getters.logoUrl) {
        this.initLogo()
      }
    },
    computed: {
      logoUrl () {
        return this.$store.getters.logoUrl
      },
      logoRedirectUrl () {
        return this.$store.getters.logoRedirectUrl
      }
    },
    methods: {
      initLogo () {
        let url = '/user-web-mobile/common/oem-brand/getWeixinBrandConfig/' + this.$store.getters.shopSerial
        this.$http.post(url).then(res => {
          this.$store.dispatch('setLogoInfo', res.data)
        })
      },
      logoRedirect () {
        if (this.logoRedirectUrl.length) {
          window.location.href = this.logoRedirectUrl
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .yunnex-info {
    width: 100%;
    display: inline-block;
    text-align: center;
    margin-bottom: pr(20);
    .logo {
      margin-top: pr(20);
      height: pr(64);
    }
  }
</style>
