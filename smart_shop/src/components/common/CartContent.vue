<template>
  <div class="content">{{ content }}</div>
</template>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .content {
    color: #adadad;
    @include font-dpr(12px);
    width: pr(560);
    margin-top: pr(10);
    line-height: pr(30);
  }
</style>

<script>
  export default {
    data () {
      return {}
    },
    props: ['goods'],
    computed: {
      content () {
        if (this.goods.isPackage) {
          let res = []
          let tmp = ``
          let attrs = ``
          for (let item of this.goods.packageGoods) {
            res.push(item.packageDetails.reduce((pre, cur, index) => {
              // 这里拿属性
              attrs = cur.checkAttrs.reduce((pre, cur, index) => { return index === 0 ? cur.name || '' : `${pre}, ${cur.name}` }, '')
              if (cur.tastes && cur.tastes.length) {
                for (let i of cur.tastes) {
                  attrs = attrs + ', ' + i.tasteName
                }
              }
              if (attrs.startsWith(',')) {
                attrs = attrs.slice(2)
              }
              attrs = attrs.length ? ` (${attrs}) ` : attrs
              // 这里拼接每一项的返回
              tmp = `${cur.goodsName}${cur.amount}${cur.goodsUnit}${attrs}`
              return index === 0 ? tmp : `${pre}, ${tmp}`
            }, ''))
          }

          return `套餐明细：${res.join(', ')}`
        }
        let tmp = []
        for (let i of this.goods.productAttrsList) {
          tmp.push(i.productAttrItems[0].name)
        }
        if (this.goods.tastes && this.goods.tastes.length) {
          for (let i of this.goods.tastes) {
            tmp.push(i.tasteName)
          }
        }
        return `${tmp.join(', ')}`
      },
      isShow () {
        return this.goods.productAttrsList ? this.goods.productAttrsList.length > 0 : false
      }
    }
  }
</script>
