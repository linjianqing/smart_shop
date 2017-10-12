<template>
  <div>
    <div v-show="showStatus" class="fly-dot" :style="flyDotStyle" ref="flyDot"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showStatus: false
      }
    },
    props: ['coordination'],
    watch: {
      'coordination.time': {
        handler: function () {
          this.flyToHigh()
          this.showStatus = true
          this.$refs.flyDot.addEventListener('animationend', this.animationend, false)
        }
      }
    },
    computed: {
      flyDotStyle () {
        return {
          top: this.coordination.pageY - this.dotSelfPx.height + 'px',
          left: this.coordination.pageX - this.dotSelfPx.width + 'px'
        }
      },
      dotSelfPx () {
        return {
          width: Math.floor(30 / 2),
          height: Math.floor(30 / 2)
        }
      },
      cartSelfPx () {
        let windowHeight = document.documentElement.clientHeight
        return {
          width: Math.floor(36 + 70),
          height: windowHeight - Math.floor(15 + 70)
        }
      },
      delta () {
        return {
          deltaX: Math.abs(parseInt(this.flyDotStyle.left, 10) - this.cartSelfPx.width),
          deltaY: Math.abs(parseInt(this.flyDotStyle.top, 10) - this.cartSelfPx.height)
        }
      },
      step () {
        return {
          step: {
            x: -(Math.pow(this.delta.deltaX, 2) - Math.pow(this.delta.deltaY, 2)) / 2 / this.delta.deltaX + 'px',
            y: this.delta.deltaY + 'px',
            angle: -(180 - 2 * Math.atan2(this.delta.deltaY, this.delta.deltaX) / Math.PI * 180)
          }
        }
      },
      keyFrames () {
        let broswerPre = ['', '-moz-', '-webkit-', '-o-']
        broswerPre.forEach((item, index) => {
          let temp = `@${item}keyframes clockwise {` +
            `0% {transform: rotate(0deg);transform-origin: 0px 0px;}` +
            `100% {transform: rotate(${this.step.step.angle}deg);transform-origin: ${this.step.step.x} ${this.step.step.y};}`
          broswerPre.fill(temp, index, index + 1)
        })
        return broswerPre.join()
      }
    },
    methods: {
      flyToHigh () {
        let keyFrames = this.keyFrames
//        setTimeout(() => {
        this.$emit('movecart', true)
//        }, 50)
        let flyAnimationById = document.querySelector('#flyAnimation')
        flyAnimationById ? this.changeStyle() : this.addStyle(keyFrames)
      },
      addStyle (str) {
        // 动态样式，注意兼容写法
        let head = document.getElementsByTagName('head')[0]
        let firstStyle = head.querySelectorAll('style')[0]
        let style = document.createElement('style')
        style.type = 'text/css'
        style.id = 'flyAnimation'
        try {
          style.appendChild(document['createTextNode'](str))
        } catch (ex) {
          style.styleSheet.cssText = str
        }
        head.insertBefore(style, firstStyle)
      },
      changeStyle () {
        let flyAnimationById = document.querySelector('#flyAnimation')
        flyAnimationById.innerHTML = this.keyFrames
      },
      animationend () {
        this.showStatus = false
        this.$emit('movecart', false)
      }
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  .fly-dot {
    position: fixed;
    z-index: 100;
    width: pr(30);
    height: pr(30);
    border-radius: 50%;
    background: #e3ae28;
    animation: clockwise 0.5s linear;
  }
</style>
