<!--呼叫服务员-->
<template>
  <div class="notice_expand" @click="closeShader" @touchmove.prevent>
    <toast v-if="isShowToast" :content="content"></toast>
    <div class="contains">
      <div class="main_notice">
        <div class="shop_logo">
          <img src="../../assets/img/shopHome/callwaiter.gif" v-if="isShowGif"/>
          <img src="../../assets/img/shopHome/xiaoericon_00002@2x.png" v-else/>
        </div>
        <div class="call_tip">{{callTip}}</div>
        <div class="wrap">
          <div v-for="(item,index) in callContentList" :key="item.id">
            <div class="wrap_content" @click="call(callContentList[index])">
              <div class="content">{{callContentList[index]}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="close_buttom" @click="closeShader">
        <img class="close_btn" src="../../assets/img/shopHome/guanbi@2x.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Toast from '../../components/common/ToastShow.vue'
  import Loading from '../../components/common/Loading'

  export default {
    data () {
      return {
        isShowToast: false,
        content: '',
        tableId: this.$store.getters.tableId,
        tableName: this.$store.getters.tableName,
        isShowGif: false,
        callTip: ''
      }
    },
    props: ['callContentList'],
    methods: {
      showToast (content) {
        this.content = content
        this.isShowToast = true
        setTimeout(() => {
          this.isShowToast = false
        }, 3000)
      },
      call (content) {
        if (!this.tableId) {
          this.showToast('桌号不可为空')
          return
        }
        let data = {
          callContent: content,
          shopDeskId: this.tableId
        }
        console.info(data)
        this.$http.post(this.$store.getters.getUrl('callWaiter', false), data).then((res) => {
          console.info(res)
          this.isShowGif = true
          this.callTip = res.data.code === 0 ? '服务员已收到您的呼叫' : res.data.message
          setTimeout(() => {
            this.callTip = ''
            this.isShowGif = false
          }, 2000)
        })
      },
      closeShader (e) {
        console.info(e.target.className)
        if (['close_btn', 'notice_expand', 'close_buttom'].includes(e.target.className)) {
          this.$emit('closeShader')
        }
      }
    },
    components: {
      Toast,
      Loading
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";
  .call_tip{
    color: #F74848;
    @include font-dpr(14px);
    height: pr(28);
  }
  .wrap {
    margin-top: pr(26);
  }

  .wrap_content {
    width: pr(400);
    height: pr(78);
    text-align: center;
    margin-bottom: pr(32);
  }

  .content {
    width: pr(400);
    height: pr(78);
    border-radius: pr(4);
    line-height: pr(78);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #F74848;
    @include font-dpr(15px);
    border: 1px solid #F74848;
  }

  .contains {
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 50%;
  }

  .notice_expand {
    z-index: 50;
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

  .main_notice {
    background: white;
    height: pr(752);
    width: pr(550);
    border-radius: pr(6);
    display: flex;
    flex-direction: column;
    align-items: center;
    .shop_logo {
      margin-top: pr(26);
      width: pr(494);
      height: pr(210);
      > img {
        object-fit: cover;
        height: pr(210);
        width: pr(210);
        margin-left: pr(142);
        border-radius: 50%;
      }

    }

    .shop_name {
      margin-top: pr(24);
      height: pr(28);
      line-height: pr(28);
      color: #252525;
      @include font-dpr(13px);
    }

    .shop_notice {
      margin-top: pr(30);
      height: pr(32);

      .line {
        display: inline-block;
        width: pr(210);
        color: #e1e1e1;
        height: pr(32);
        hr {
          margin-top: pr(23);
          margin-left: pr(28);
          margin-right: pr(28);
        }
      }
      font-weight: bold;
      @include font-dpr(15px);
      color: #252525;

    }

    .activity {
      margin-top: pr(28);
      line-height: pr(40);
      width: pr(490);
      color: #545454;
      @include font-dpr(13px);
    }
  }

  .close_buttom {
    margin-top: pr(50); // 部分手机放不下整个框  从72-->50
    text-align: center;
    > img {
      width: pr(86);
      height: pr(86);
    }
  }


</style>
