<template>
  <div class="dialogContainer">
    <!--手机验证弹窗-->
    <div>
      <div class="dialog">
        <header>输入手机号</header>
        <div class="codeContainer">
          <input placeholder="请输入您的手机号码" v-model="phone"/>
          <span class="btn-sendCode" @click="sendCode()" v-if="time==second">获取验证码</span>
          <span class="count" v-else>重新获取({{time}}s)</span>
        </div>
        <div class="codeContainer">
          <input placeholder="请输入验证码" v-model="code"/>
        </div>
        <div class="action">
          <span class="cancel" @click="cancel()">取消</span>
          <span class="confirm" @click="confirm()">确定</span>
        </div>
      </div>
    </div>
    <ToastShow v-show="toasting" :content="content"></ToastShow>
  </div>
</template>
<script>
  import ToastShow from '../common/ToastShow'
  export default {
    data () {
      return {
        time: 60, // 倒数实时默认60s
        second: 60, // 倒数的时间(s)
        phone: '', // 验证码框手机
        code: '', // 验证码框验证码
        toasting: false,
        content: ''
      }
    },
    components: {
      ToastShow
    },
    methods: {
      showToast (content) {
        this.content = content
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },

      // 检验手机号码合法性
      checkPhone (phone) {
        return (/^1[34578]\d{9}$/.test(phone))
      },
      sendCode () {
        if (!this.checkPhone(this.phone)) {
          this.showToast('请输入正确的手机号')
          return
        }

        // 调接口
        let url = this.$store.getters.getUrl('sendSms', false)
        this.$http.get(url, {
          params: {'mobile': this.phone}
        }).then((res) => {
          this.showToast(res.data.msg)
          if (res.data.code === 0) {
            // 返回成功才倒数
            this.time = this.second
            this.timer()
          }
        })
      },
      cancel () {
        this.$emit('cancel')
      },
      confirm () {
        if (this.code.trim() === '') {
          this.showToast('请输入验证码')
          return -1
        }
        // check code
        let url = this.$store.getters.getUrl('validateCode', false)
        this.$http.get(url, {params: {'code': this.code, 'mobile': this.phone}}).then((res) => {
          console.info(res.data)
          this.showToast(res.data.msg)
          if (res.data.code !== 0) {
          // 报错
          } else {
            this.$store.dispatch('setPhone', this.phone)
            this.$emit('cancel', this.phone)
          }
        })
      }, // 倒计时
      timer () {
        if (this.time > 0) {
          `${this.time--}S后重发`
          setTimeout(this.timer, 1000)
        } else this.time = this.second
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import '../../assets/css/base.scss';

  .action {
    height: pr(102);
    width: 100%;
    font-size: 0;
    margin-top: pr(52);
    border-top: 1px solid #e1e1e1;
  }

  .cancel {
    @include font-dpr(15px);
    color: #7d7d7d;
    width: 50%;
    height: pr(102);
    display: inline-block;
    text-align: center;
    line-height: pr(102);
  }

  .confirm {
    @include font-dpr(15px);
    color: #181818;
    width: 50%;
    height: pr(102);
    text-align: center;
    display: inline-block;
    line-height: pr(102);
  }

  @mixin placeholder() {
    color: #adadad;
    @include font-dpr(14px);
  }

  .dialogContainer {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
  }

  .dialog {
    width: pr(618);
    height: pr(464);
    border-radius: pr(6);
    background-color: #fff;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    header {
      @include font-dpr(15px);
      text-align: center;
      color: #181818;
      height: pr(34);
      margin: pr(42) auto;
    }
    input {
      @include font-dpr(13px);
      width: pr(540);
      height: pr(84);
      box-sizing: border-box;
      border-radius: pr(4);
      border: 1px solid #e1e1e1;
      background-color: #f5f5f5;
      color: #adadad;
      display: block;
      margin: 0 auto;
      outline: none;
      padding: 0 pr(24);
    }
    .btn-bind {
      $h: pr(84);
      width: pr(540);
      height: $h;
      line-height: $h;
      border-radius: pr(6);
      color: #fff;
      @include font-dpr(16px);
      background-color: #F74749;
      text-align: center;
      margin: pr(24) auto;
    }
  }

  .btn-close {
    $size: pr(32);
    width: $size;
    height: $size;
    @include bg-image('../../assets/img/guanbi');
    position: absolute;
    right: pr(24);
    top: pr(28);
  }

  .codeContainer {
    position: relative;
    margin-bottom: pr(24);
    input {
      margin-bottom: 0;
      color: #181818;
      @include font-dpr(13px);
    }
    ::-webkit-input-placeholder {
      @include font-dpr(13px);
      color: #adadad;
    }
  }

  .btn-sendCode, .count {
    @include font-dpr(13px);
    height: 100%;
    line-height: pr(84);
    color: white;
    position: absolute;
    top: 0;
    right: pr(40);
  }

  .btn-sendCode {
    background: #f74848;
    width: pr(184);
    padding-right: pr(20);
    padding-left: pr(20);
    text-align: center;
  }

  .count {
    color: white;
    @include font-dpr(13px);
    width: pr(220);
    text-align: center;
    background: #D7d7d7;
  }
</style>
