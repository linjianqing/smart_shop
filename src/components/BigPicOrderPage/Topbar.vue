<template>
  <ul class="topbar">
    <li v-for="item in category" @click="changeCategory(item.id)" :class="{active: showIndex === item.id}">
      <conrner-icon v-show="cornerNum(item.id)" class="corner" :categoryId="item.id" v-if="item.id > 0"></conrner-icon>
      <div class="bar_pic" v-else></div>
      <div class="bar_content">{{ item.name }}</div>
    </li>
  </ul>
</template>
<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .topbar {
    width: pr(750);
    height: pr(100);
    background: white;

    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    z-index: 5;

    > li {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: pr(100);
      height: pr(96);
      width: pr(170);
      position: relative;

      @include font-dpr(14px);

      .bar_pic {
        display: inline-block;
        width: pr(30);
        height: pr(30);
        margin-right: pr(8);
        @include bg-image('../../assets/img/tuijian');
      }
      .bar_content {
        display: inline-block;
        margin: pr(35) 0 auto;
        height: pr(30);
        line-height: pr(30);
        color: #181818;
        @include font-dpr(14px);
      }
      .corner {
        position: absolute;
        top: pr(16);
        right: 0;
      }
    }
    .active {
      border-bottom: pr(4) solid #F74848;
      font-weight: bold;
    }
  }
</style>

<script type="application/javascript">
  import ConrnerIcon from '../common/CornerIcon'

  export default {
    data () {
      return {}
    },
    components: {
      ConrnerIcon
    },
    props: ['category', 'recommend', 'showIndex'],
    methods: {
      // 待优化,里面也有这个逻辑，但没有正常展示
      cornerNum (id) {
        let data = this.$store.getters.getCartGoodsByCategory(id)
        let num = 0
        if (data) {
          for (let i of data) {
            num += i.quantity
          }
        }
        return num
      },
      changeCategory (id) {
        this.$emit('changeCategory', id)
      }
    }
  }
</script>
