<template>
  <div class="notice">
    <div class="img"></div>
    <div v-if="noticeInfo && noticeInfo.length >1" class="notice-wrap" :id="compId">
      <ul class="notice-list">
        <li v-for="item in noticeInfo">{{item.campContent}}</li>
        <li>{{noticeInfo[0].campContent}}</li>
      </ul>
    </div>
    <div v-else class="notice-single">
      <span>{{noticeInfo[0].campContent}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['noticeInfo'],
    data () {
      return {
        compId: '',  // 组件id，用于样式覆盖
        itemHeight: '1.2',
        unit: 'rem',
        time: '2'
      }
    },
    watch: {
      noticeInfo (newVal, oldVal) {
        this.dataChange(newVal)
      }
    },
    methods: {
      dataChange (data) {
        this.compId = 'compId_' + this.time + data.length
        this.init('#' + this.compId, this.noticeInfo.length, Number(this.time), 0.1)
      },
      //  初始化高度
      initHeight (selector, height) {
        return (selector + '{height:' + height + ';}' + selector + ' ul {line-height:' + height + ';}' + selector + ' ul li {height:' + height + ';}')
      },
      init (selector, length, gapTime, time) {
        let unit = this.unit
        let nod = document.createElement('style')
        let str = this.generateStyle(selector + ' ul', this.itemHeight, unit, length, gapTime, time)
        str += this.initHeight(selector, this.itemHeight + this.unit)
        nod.type = 'text/css'
        nod.innerHTML = str
        document.getElementsByTagName('head')[0].appendChild(nod)
      },
      /**
       function generateStyle   生成动画所需的样式
       @params
       selector  动画作用的dom的选择器
       height    每次滚动高度，数值
       unit      滚动高度的单位：px、rem、em
       length    数据的长度
       gapTime   轮播间隔时间，单位s
       time      切换时间，单位s
       */
      generateStyle (selector, height, unit, length, gapTime, time) {
        if (length < 2) return
        let gapTimes = gapTime || 3
        let times = time || 0.1
        // css3动画总时长
        let durationTime = length * (gapTimes + times)
        let curGap = times / (gapTimes + times) * 100
        let eachTime = 100 / length
        let animationName = 'name_' + length + '_' + gapTimes + '_' + times
        // animation-name不能带小数点
        animationName = animationName.replace('.', '')
        let style = 'keyframes ' + animationName + ' {' + this.genTransform(0, 0, '-webkit-')
        let step
        for (let i = 1; i <= length; i++) {
          step = eachTime * i
          style = style + this.genTransform(step - curGap, (-(i - 1) * height) + unit, '-webkit-') + this.genTransform(step, (-i * height) + unit, '-webkit-')
        }
        style += '}'
        style = '@-webkit-' + style + '@' + style
        // 将animation动画绑定到选择器上
        style += selector + ' {-webkit-animation: ' + animationName + ' ' + durationTime + 's linear 0s infinite;' + 'animation: ' + animationName + ' ' + durationTime + 's linear 0s infinite;}'
        return style
      },
      genTransform (percent, translateY, prefix) {
        return percent + '% {' + prefix + 'transform:translate(0,' + translateY + ');' + 'transform:translate(0,' + translateY + ');}'
      }
    },
    created () {
      this.dataChange(this.noticeInfo)
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  .img {
    background-size: 100% 100%;
    background-image: url('../../assets/img/gonggao@2x.png');
    height: pr(30);
    width: pr(30);
    margin-left: pr(24);
    margin-top: pr(30);
    float: left;
  }

  .notice-list {
    text-align: left;
    float: left;
    width: 100%;
  }

  li {
    list-style: none;
    color: #545454;
    margin-left: pr(14);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%
  }

  .notice-single {
    line-height: pr(90);
    float: left;
    margin-left: pr(14);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 85%
  }

  .notice {
    background: #fffbf2;
    height: pr(90);
    margin-bottom: pr(12);
  }

  .notice-wrap {
    padding: .025rem 0;
    text-align: center;
    overflow: hidden;
  }
</style>
