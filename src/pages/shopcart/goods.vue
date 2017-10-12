<template xmlns:v-lazy="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <!--菜单内容框架 ，此容器容易引起布局滑动-->
  <div>
    <div :class="{'origin':dType===0,'huge':dType===2}">
      <div class="wrap" ref="goodInHeight">
        <div class="goods-wrap">
          <div class="img" @click="itemClick(goods)">
            <div class="image-new-desc" v-show="goods.tagName">{{goods.tagName}}</div>
            <div class="empty_default" v-bind:style="{background:'rgba(0, 0, 0, 0.6)'}" v-show="goods.soldStatus ==1"
                 ref="imageDefault">
              <img src="../../assets/img/yishouwan@2x.png">
            </div>
            <div class="image-wrap" ref="imageWrap">
              <img v-lazy="goods.pic" alt="" v-if="dType==0">
              <img v-lazy="goods.bigPic" alt="" v-else>
            </div>
          </div>
          <div class="goods-info-wrap">
            <p class="goods-name">{{goods.name}}</p>
            <div class="like-people">已售 {{goods.saleCount ? goods.saleCount : 0}}</div>
            <footer class="footer-wrap">
              <span class="price"><span class="price-symbol">¥</span>{{goods.price | price}}</span>
              <!--1 常态 2 特价 3会员-->
              <span class="members-content" v-if="goods.priceType===3">会员价</span>
              <span class="special-content" v-if="goods.priceType===2">特惠价</span>
              <div class="big-original-price" v-if="dType===2 && goods.originalPrice && goods.priceType!==1 ">
                <span>原价</span>¥{{goods.originalPrice | price}}
              </div>
              <!-- 普通添加-->
              <div v-if="goods.soldStatus === 2">
                <!--套餐-->
                <div class="operation-standard operation-package" v-if="goods.isPackage"
                     @click.stop="optionClick(isPackageShow)">
                  <div class="num_tip" v-show="goodsNum">{{goodsNum}}</div>
                  <div class="standard-text">选套餐</div>
                </div>
                <div v-else>
                  <!-- 规格 -->
                  <div class="operation-standard"
                       v-if="goods.productAttrsList.length||categoryTaste.includes(goods.categoryId)"
                       @click.stop="optionClick(goods)">
                    <div class="num_tip" v-show="goodsNum">{{goodsNum}}</div>
                    <div class="standard-text">选规格</div>
                  </div>
                  <cart-buy-num :goods="goods" @coordination="coordination" @toast="errorToast" v-else></cart-buy-num>
                </div>
              </div>
            </footer>
            <div class="original-price" v-if="dType===0 && goods.originalPrice && goods.priceType!==1 ">
              ¥{{goods.originalPrice | price}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import detailShader from '../../components/Detail/DetailShader'
  import $utils from '../../utils'
  import cartBuyNum from '../../components/common/CartBuyNum.vue'

  export default {
    data () {
      return {
        showDialog: false,
        theLock: true,
        dType: this.$store.getters.displayType,
        isPackageShow: false
      }
    },
    mounted () {
      // 保持图片宽高比为2:1
      this.adjustImgSize()
    },
    components: {
      detailShader,
      cartBuyNum
    },
    computed: {
      categoryTaste () {
        return this.$store.getters.tastes.filter(x => x.categoryId === this.goods.categoryId).map(x => x.categoryId)
      },
      allGoods () {
        return this.$store.getters.allGoods
      },
      goodsNum () {
        let goods = this.$store.getters.getCartGoodsById(this.goods.id)
        return $utils.combineByKey(goods, 'quantity')
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
    methods: {
      errorToast (msg) {
        if (msg) {
          this.$emit('toast', msg)
        }
      },
      coordination (e) {
        this.$emit('update:coordination', {pageX: e.pageX, pageY: e.pageY, time: e.time})
      },
      // iphone 6 以上异常 往上级传，放同级处理
      optionClick (goods) {
        // 区分套餐与选择规格
        if (typeof goods === 'boolean') {
          this.$emit('optionClick', {goods: this.goods, isPackageShow: !this.isPackageShow})
        } else if (typeof goods === 'object') {
          this.$emit('optionClick', this.goods)
        }
      },
      itemClick (goods) {
        this.$emit('itemClick', goods)
      },
      adjustImgSize () {
        if (this.dType === 2) {
          let imageWrapWidth = this.$refs.imageWrap.clientWidth
          this.$refs.imageWrap.style.height = imageWrapWidth * 0.5 + 'px'
          this.$refs.imageDefault.style.height = imageWrapWidth * 0.5 + 'px'
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  .origin, .huge {
    -webkit-text-size-adjust: none;
  }

  .origin {
    .wrap {
      margin: 0 pr(24);
    }
    .like-people {
      margin-top: pr(10);
      height: pr(24);
      line-height: pr(24);
      color: #adadad;
      @include font-dpr(11px);
    }
    .goods-wrap {
      background-color: #fff;
      height: pr(198);
      width: 100%;
      box-sizing: border-box;
      padding: pr(24) 0;
      display: inline-flex;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 2px solid #e1e1e1;
        -webkit-transform: scaleY(.5);
        -webkit-transform-origin: 0 0;
      }
      .goods-name {
        width: 5.1rem;
        color: #181818;
        white-space: nowrap;
        @include font-dpr(14px);
        display: inline-block;
        line-height: pr(36);
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .img {
        height: pr(136);
        width: pr(136);
        .image-new-desc {
          position: absolute;
          top: 0.32rem;
          left: pr(6);
          z-index: 10;
          height: pr(55);
          width: 2.5em;
          padding-top: pr(5);
          @include font-dpr(9px);
          text-align: center;
          color: #fff;
          @include bg-image("../../assets/img/comment/xiaotujiaobiao");
        }
        .empty_default {
          height: pr(150);
          width: pr(150);
          border-radius: pr(4);
          background-size: 100% 100%;
          /*background: rgba(0, 0, 0, 0.6);*/
          position: absolute;
          z-index: 9;
          overflow: hidden;
          img {
            position: relative;
            top: 50%;
            left: 50%;
            z-index: 5;
            transform: translate3d(-50%, -50%, 0);
            height: 100%;
            width: auto;
          }
        }
        .image-wrap {
          height: pr(150);
          width: pr(150);
          border-radius: pr(4);
          background-size: 100% 100%;
          background-color: #f5f5f5;
          overflow: hidden;
          img {
            position: relative;
            top: 50%;
            left: 50%;
            z-index: 5;
            transform: translate3d(-50%, -50%, 0);
            height: 100%;
            width: auto;
          }
        }
      }
      .goods-info-wrap {
        flex: 1;
        margin-left: pr(24);
        height: pr(136);
        position: relative;
      }
      .original-price {
        color: #adadad;
        @include font-dpr(11px);
      }
      .footer-wrap {
        /*position: absolute;*/
        margin-top: pr(18);
        line-height: pr(40);
        height: pr(40);
        width: 100%;
        .price {
          @include font-dpr(16px);
          margin-right: pr(6);
          color: #f74848;
          .price-symbol {
            @include font-dpr(12px);
            color: #f74848;
          }
        }
        .special-content {
          line-height: pr(26);
          height: pr(26);
          color: #fe9500;
          @include font-dpr(10px);
          border: 1px solid #fe9500;
          vertical-align: top;
          letter-spacing: pr(-1);
          border-radius: pr(4);
          padding: pr(2) pr(4) pr(2) pr(4);
          background: #fff4d8;
        }
        .members-content {
          line-height: pr(26);
          height: pr(26);
          color: #f74848;
          @include font-dpr(10px);
          border: 1px solid #f74848;
          vertical-align: top;
          letter-spacing: pr(-1);
          border-radius: pr(4);
          padding: pr(2) pr(4) pr(2) pr(4);
          background: #ffe9e8;
        }
        .operation-standard {
          width: pr(90);
          height: pr(40);
          line-height: pr(40);
          float: right;
          display: inline-block;
          border-radius: 25px;
          background-size: 100% 100%;
          background-image: url('../../assets/img/xuanguige-da-@2x.png');
          text-align: center;
          margin-top: pr(-40);
        }
        .standard-text {
          color: #ffffff;
          @include font-dpr(9px);
          line-height: pr(40);
          height: pr(40);
        }
        .num_tip {
          height: pr(30);
          line-height: pr(30);
          width: pr(30);
          color: white;
          background-color: #f74848;
          border-radius: pr(15);
          border: solid 1px white;
          position: absolute;
          top: pr(70);
          right: 0;
          text-align: center;
          z-index: 2;
          @include font-dpr(9px);
        }
      }
    }
  }

  .huge {
    .wrap {
      margin: 0 pr(24) pr(24);
      border-bottom: pr(2) #e1e1e1 solid;
    }
    .like-people {
      margin-top: pr(8);
      height: pr(26);
      line-height: pr(26);
      color: #adadad;
      @include font-dpr(11px);
    }
    .goods-wrap {
      width: 100%;
      .img {
        position: relative;
        width: 100%;
        .image-new-desc {
          position: absolute;
          top: 0;
          left: pr(6);
          z-index: 10;
          height: 2.94em;
          width: 2.5em;
          padding-top: pr(5);
          @include font-dpr(9px);
          text-align: center;
          color: #fff;
          /*background-color: #f74848;*/
          border-radius: pr(4) pr(4) 0 0;
          @include bg-image("../../assets/img/comment/xiaotujiaobiao");
          background-size: contain;
          background-repeat: no-repeat;
        }
        .empty_default {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 9;
          transform: translate3d(-50%, -50%, 0);
          height: pr(250);
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          background-size: contain;
          img {
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            height: 100%;
            width: auto;
          }
        }
        .image-wrap {
          overflow: hidden;
          img {
            border-radius: pr(4);
            position: relative;
            top: 50%;
            left: 50%;
            z-index: 5;
            transform: translate3d(-50%, -50%, 0);
            height: 100%;
            width: auto;
          }
        }
      }
    }
    .footer-wrap {
      margin-top: pr(12);
    }
    .goods-info-wrap {
      margin-bottom: pr(22);
      margin-left: pr(12);
      /*margin: pr(16) 0 pr(22) pr(12);*/
      .goods-name {
        margin-top: pr(16);
        line-height: pr(30);
        @include font-dpr(15px);
        color: #181818;
      }
      .special-content {
        color: #ffA200;
        @include font-dpr(9px);
        border: 1px solid #ffA200;
        vertical-align: text-top;
        text-align: center;
        letter-spacing: -1;
        border-radius: pr(4);
        padding: pr(2) pr(4) pr(2) pr(4); // 上右下左*/
        display: inline;
        line-height: pr(26);
        height: pr(26);
      }
      .members-content {
        line-height: pr(26);
        height: pr(26);
        color: #f74848;
        letter-spacing: -1;
        @include font-dpr(10px);
        border: 1px solid #f74848;
        vertical-align: text-top;
        text-align: center;
        border-radius: pr(4);
        padding: pr(2) pr(4) pr(2) pr(4);
        background: #ffe9e8;
      }
      .big-original-price {
        vertical-align: text-top;
        color: #adadad;
        @include font-dpr(11px);
        margin-top: pr(1);
        display: inline-block;
        span {
          margin-right: pr(5);
          margin-left: pr(18);
        }
      }
      .price {
        display: inline-block;
        margin-right: pr(6);
        line-height: pr(32);
        color: #f74848;
        @include font-dpr(16px);
        .price-symbol {
          @include font-dpr(12px);
          color: #f74848;
        }
      }
      .operation-standard, .operation-wrap {
        float: right;
        margin-top: pr(-40);
      }
      .operation-standard {
        position: relative;
        width: pr(90);
        height: pr(40);
        line-height: pr(40);
        border-radius: pr(20);
        background: #f74848;
        /*background-image: url('../../assets/img/xuanguige-da-@2x.png');*/
        text-align: center;
        .standard-text {
          color: #ffffff;
          @include font-dpr(9px);
        }
        .num_tip {
          height: pr(30);
          line-height: pr(30);
          width: pr(30);
          color: white;
          background-color: #f74848;
          border-radius: pr(15);
          border: solid 1px white;
          position: absolute;
          top: pr(-22);
          right: 0;
          text-align: center;
          z-index: 2;
          @include font-dpr(9px);
        }
      }
    }
  }
</style>
