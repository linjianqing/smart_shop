<template>
  <div>
    <div class="operation-wrap">
      <transition name="move">
        <div @click.stop="action(goods,-1,$event)" v-show="goodsNum" class="reduceImg">
          <img src="../../assets/img/jianshao@2x.png"/>
        </div>
      </transition>
      <div v-show="goodsNum" class="num">{{goodsNum}}</div>
      <div @click.stop="add(goods,$event)" class="addImg">
        <img src="../../assets/img/tianjia@2x.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import $utils from '../../utils'

  export default {
    data () {
      return {
        theLock: true
      }
    },
    props: {
      goods: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      goodsNum () {
        let goods = this.$store.getters.getCartGoodsById(this.goods.id)
        return $utils.combineByKey(goods, 'quantity')
      }
    },
    methods: {
      add (goods, e) {
        if (this.theLock) {
          if (this.goodsNum > 0) {
            this.action(goods, 1, e)
          } else {
            this.createGoods(goods, e)
          }
        }
      },
      action (goods, num, e) {
        if (this.theLock) {
          let hasGoods = this.$store.getters.allGoods.find(x => x.id === goods.id)
          let updateData = {
            id: hasGoods.goodsId,
            amount: hasGoods.quantity + num
          }
          this.theLock = false
          this.$http.post(this.$store.getters.getUrl('updateAmount'), updateData).then((res) => {
            if (res.data.code === 0) {
              if (num > 0) {
                this.$emit('coordination', {pageX: e.pageX, pageY: e.pageY, time: +new Date()})
                this.$store.dispatch('addToCart', {products: hasGoods, id: hasGoods.goodsId})
              } else {
                this.$store.dispatch('reduceFromCart', hasGoods)
              }
              let campain = res.data.response.nextLevelCampaign
              if (campain && campain[0]) {
                this.$store.dispatch('setNextLevelCampaign', campain[0])
              }
            } else {
              this.$emit('toast', res.data.message)
            }
            this.theLock = true
          })
        }
      },
      createGoods (goods, e) {
        this.theLock = false
        let attrs = []
        if (goods.productAttrsList.length > 0) {
          for (let i of goods.productAttrsList) {
            attrs.push({
              id: i.productAttrItems[0].id,
              name: i.productAttrItems[0].name,
              pid: i.id,
              pname: i.name
            })
          }
        }
        let data = {
          amount: !goods.quantity ? 1 : goods.quantity,
          goodsId: goods.id,
          attrs: attrs
        }
        // 如果扫码进来的时候，每一次createCart 都要带上桌号
        let tableId = this.$store.getters.tableId
        if (tableId) {
          data['tableId'] = tableId
        }
        this.$http.post(this.$store.getters.getUrl('createCart'), data).then((res) => {
          console.info(res)
          let result = res.data
          if (result.code === 0) {
            this.$emit('coordination', {pageX: e.pageX, pageY: e.pageY, time: +new Date()})
            this.$store.dispatch('addToCart', {products: goods, id: result.response.cyShoppingCart.id})
            let campain = result.response.nextLevelCampaign
            if (campain && campain[0]) {
              this.$store.dispatch('setNextLevelCampaign', campain[0])
            }
          } else {
            this.$emit('toast', result.message)
          }
          this.theLock = true
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .operation-wrap {
    float: right;
    line-height: pr(48);
    height: pr(48);
    display: flex;
    margin-top: pr(-40);
    img {
      width: pr(48);
      height: pr(48);
    }
    .num {
      @include font-dpr(14px);
      color: #545454;
      width: pr(50);
      text-align: center;
      @include ellipsis(80);
    }
  }

  .reduceImg {
    background-size: 100% 100%;
    height: pr(46);
    width: pr(46);
    line-height: pr(46);
  }

  .addImg {
    background-size: 100% 100%;
    height: pr(46);
    width: pr(46);
    line-height: pr(46);
  }

  .move-enter-active, .move-leave-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: all .4s;
    img {
      transform: rotate(0);
      transition: all .4s;
    }
  }

  .move-enter, .move-leave-to {
    opacity: 0;
    transform: translate3d(24px, 0, 0);
    transition: all .4s;
    img {
      transform: rotate(360deg);
      transition: all .4s;
    }
  }
</style>
