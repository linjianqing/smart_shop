<template>
  <div class="pic_list">
    <div class="li_pic" @click.stop="goDetail">
      <img class="shop_pic" :src="goods.pic"/>
      <img class="sold_out" v-if="goods.soldStatus === 1" src="../../assets/img/yishouwan@2x.png"/>
    </div>
    <div class="li_content">
      <div class="li_content_name">{{ goods.name }}</div>
      <div class="li_like_people">已售 {{goods.saleCount ? goods.saleCount : 0}}</div>
      <div class="li_content_price">
        <span class="li-price-symbol">¥</span>
        <span class="the_price">{{ goods.price | price}}</span>
        <span class="li-members-content" v-if="goods.priceType===3">会员价</span>
        <span class="li-special-content" v-if="goods.priceType===2">特惠价</span>
      </div>
      <div v-if="goods.soldStatus === 2">
        <big-pic-corner-icon class="li_content_corner_num"
                             v-if="hasAttribute"
                             v-show="goodsCount > 0"
                             :num="goodsCount"></big-pic-corner-icon>

        <div class="li_content_select" v-if="goods.isPackage "
             @click="optionClick(isPackageShow)">选套餐
        </div>
        <div v-else>
          <div class="li_content_select" v-if="hasAttribute || categoryTaste.includes(goods.categoryId)"
               @click="openDetailShader">选规格
          </div>
          <cart-buy-num :goods="goods" @coordination="coordination" @toast="errorToast" v-else></cart-buy-num>
        </div>
        <div class="li-original-price" v-if="goods.originalPrice && goods.priceType!==1">¥{{goods.originalPrice | price}}</div>
      </div>

    </div>
  </div>
</template>

<script>
  import BigPicCornerIcon from '../common/BigPicCornerIcon'
  import DetailShader from '../../components/Detail/DetailShader'
  import $util from '../../utils/index'
  import cartBuyNum from '../../components/common/CartBuyNum.vue'

  export default {
    data () {
      return {
        detailStatus: false,
        goods_mods: JSON.parse(JSON.stringify(this.goods)),    // 这里是要创建一个可以修改的goods供修改口味用
        theLock: true,
        isPackageShow: false,
        categoryTaste: this.$store.getters.tastes.filter(x => x.categoryId === this.goods.categoryId).map(x => x.categoryId)
      }
    },
    computed: {
      hasAttribute () {
        return this.goods.productAttrsList.length || this.goods.isPackage === 1 || this.categoryTaste.length > 0
      },
      goodsCount () {
        let goods = this.$store.getters.getCartGoodsById(this.goods.id)
        return goods ? $util.combineByKey(goods, 'quantity') : 0
      }
    },
    props: ['goods'],
    components: {
      BigPicCornerIcon,
      DetailShader,
      cartBuyNum
    },
    methods: {
      errorToast (msg) {
        if (msg) {
          this.$emit('toast', msg)
        }
      },
      coordination (e) {
        this.$emit('update:coordination', {pageX: e.pageX, pageY: e.pageY, time: e.time})
      },
      // 增加的方法
      optionClick (goods) {
        // 区分套餐与选择规格
        if (typeof goods === 'boolean') {
          this.$emit('optionClick', {goods: this.goods, isPackageShow: !this.isPackageShow})
        } else if (typeof goods === 'object') {
          this.$emit('optionClick', this.goods)
        }
      },
      goDetail () {
        let tableId = this.$store.getters.tableId
        let tableName = this.$store.getters.tableName
        let data = {
          goodId: this.goods.id
        }
        if (tableId) {
          data['tableId'] = tableId
        }
        if (tableName) {
          data['tableName'] = tableName
        }
        this.$router.push({
          path: 'newDetail',
          query: data
        })
      },
      openDetailShader () {
        return this.$emit('openDetailShader', this.goods_mods)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .pic_list {
    position: relative;
    width: pr(360);
    box-sizing: border-box;
    margin-bottom: pr(10);
    height: 100%;

    border: 1px solid #e1e1e1;
    background: white;

    .li_pic {
      height: pr(354);
      width: pr(354);
      position: relative;
      overflow: hidden;
      > img {
        height: 100%;
        width: auto;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        background-size: 100%;
        border: 1px solid rgba(225, 225, 225, 0.4);
      }
      .shop_pic {
        z-index: 1;
      }
      .sold_out {
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 2;
      }
    }

    .li_content {
      width: pr(312);
      height: pr(140);
      margin: pr(14) pr(12) pr(14) pr(12);
      position: relative;
      .li-original-price {
        margin-top: pr(4);
        color: #ABABAB;
        @include font-dpr(11px);
      }
      .li_like_people {
        margin-top: pr(8);
        color: #adadad;
        @include font-dpr(11px);
      }
      .li_content_name {
        color: #181818;
        @include font-dpr(14px);
        line-height: pr(30);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .li_content_price {
        letter-spacing: -1px;
        margin-top: pr(14);
        line-height: pr(30);
        .li-price-symbol {
          color: #f74848;
          @include font-dpr(12px);
        }
        .the_price {
          color: #f74848;
          @include font-dpr(15px);
          margin-right: pr(6);
        }
      }
      .li-special-content {
        line-height: pr(26);
        height: pr(26);
        color: #fe9500;
        @include font-dpr(10px);
        border: 1px solid #fe9500;
        vertical-align: top;
        border-radius: pr(4);
        padding: pr(3);
        background: #fff4d8;
      }
      .li-members-content {
        line-height: pr(26);
        height: pr(26);
        color: #f74848;
        @include font-dpr(10px);
        border: 1px solid #f74848;
        border-radius: pr(4);
        vertical-align: top;
        padding: pr(3);
        background: #ffe9e8;
      }

      .li_content_corner_num {
        position: absolute;
        right: 0;
        bottom: pr(55);
      }

      .li_content_select {
        position: absolute;
        right: 0;
        bottom: pr(27);
        background-size: 100% 100%;
        background-image: url("../../assets/img/xuanguige-xiao@2x.png");
        color: white;
        height: pr(36);
        width: pr(90);
        text-align: center;
        line-height: pr(36);
        border-radius: pr(18);
        @include font-dpr(9px);
      }
    }
  }
</style>
