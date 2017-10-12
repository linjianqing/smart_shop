<template>
  <div>
    <div class="star" :class="starSize">
      <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
    </div>
  </div>
</template>

<script>
  // 设置常量
  const LENGTH = 5
  const ON = 'on'
  const HALF = 'half'
  const OFF = 'off'
  export default {
    data () {
      return {}
    },
    props: ['size', 'score'],
    computed: {
      starSize () { // 通过计算属性,返回组装过的类型,用来对应class类型
        return 'star-' + this.size
      },
      itemClasses () {
        let result = []
        let score = Math.floor(this.score) // 计算所有星星的数量
        let hasDecimal = this.score > score // 非整数星星判断
        let integer = Math.floor(score) // 整数星星判断
        for (let i = 0; i < integer; i++) {
          result.push(ON)
        }
        if (hasDecimal) {
          result.push(HALF)
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(OFF)
        }
        return result
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .star {
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-44 {
      height: pr(44);
      background-size: pr(44) pr(44);
      .star-item {
        &:last-child {
          margin-right: 0;
        }
        &.on {
          background-image: url('../../assets/img/shopHome/xingx@2x.png');
          background-size: 100% 100%;
          height: pr(44);
          width: pr(44);
        }
        &.half {
          background-image: url('../../assets/img/shopHome/xingx2@2x.png');
          background-size: 100% 100%;
          height: pr(44);
          width: pr(44);
        }
        &.off {
          background-image: url('../../assets/img/shopHome/xingx3@2x.png');
          background-size: 100% 100%;
          height: pr(44);
          width: pr(44);
        }
      }
    }
    &.star-30 {
      height: pr(30);
      background-size: pr(30) pr(30);
      .star-item {
        &:last-child {
          margin-right: 0;
        }
        &.on {
          background-image: url('../../assets/img/shopHome/xingx@2x.png');
          background-size: 100% 100%;
          height: pr(30);
          width: pr(30);
        }
        &.half {
          background-image: url('../../assets/img/shopHome/xingx2@2x.png');
          background-size: 100% 100%;
          height: pr(30);
          width: pr(30);
        }
        &.off {
          background-image: url('../../assets/img/shopHome/xingx3@2x.png');
          background-size: 100% 100%;
          height: pr(30);
          width: pr(30);
        }
      }
    }
    // 可以copy设置自己需要的样式
  }
</style>
