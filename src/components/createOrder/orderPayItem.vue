<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <div class="item_wrap">
      <div class="left">
        <div class="img_wrap">
          <img class="dash_pic" v-lazy="items.pic" alt=""/>
        </div>
      </div>
      <div class="middle">
        <div class="name_wrap">
          <div class="vip_img" v-if="items.priceSource===3||items.priceSource===2 || items.priceSource===999"
               v-bind:style="{backgroundImage:'url('+dashStatus[items.priceSource]+')'}"></div>
          <div class="dash_name">{{items.goodsName}}</div>
        </div>
        <div class="dash_content" v-if="description">{{description}}</div>
        <div class="dash_content" v-if="items.isPackage ===1">{{packageContent}}
        </div>
        <div class="dash_num">x{{items.amount}}</div>
      </div>
      <div class="right-img">
        <div class="status_img" v-bind:style="{backgroundImage:'url('+img[items.goodsStatus]+')'}"></div>
      </div>
      <div class="right_text">
        <div class="dash_special_price">¥{{items.price*items.amount|price}}</div>
        <div class="dash_original_price" v-if="payConfig===1 && items.priceSource !==1">¥{{items.originalPrice*items.amount|price}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import waitCheck from '../../assets/img/orderPay/Label--confirmed@2x.png'  // 待确认
  import summitOrder from '../../assets/img/orderPay/Label--Success@2x.png'  // 已下单
  import failOrder from '../../assets/img/orderPay/Label--fail@2x.png'  // 未成功
  import ytc from '../../assets/img/orderPay/Label--Retreat@2x.png'  // 已退菜
  import dxt from '../../assets/img/orderPay/Label--Place-order@2x.png' //  待下单
  import giveFlag from '../../assets/img/orderPay/Complimentary-label@2x.png' //  赠菜
  import memberFlag from '../../assets/img/orderPay/Member--label@2x.png' //  会员
  import specialFlag from '../../assets/img/orderPay/Discount--label@2x.png' //  特惠
  // priceSource  价格来源：999赠菜 1常价 2 单品特价 3会员
  export default {
    data () {
      return {
        img: {1: dxt, 2: summitOrder, 3: ytc, 4: failOrder, 5: waitCheck},
        dashStatus: {3: memberFlag, 2: specialFlag, 999: giveFlag}
      }
    },
    props: ['items', 'payConfig'], // payConfig  0后付款 1先付款
    computed: {
      description () {
        let str = ''
        if (!this.items.checkAttrs && !this.items.tastes) return str
        for (let i of this.items.checkAttrs) {
          if (i.name) {
            str += i.name + ','
          }
        }
        if (this.items.tastes) {
          for (let i of this.items.tastes) {
            if (i.tasteName) {
              str += i.tasteName + ','
            }
          }
        }
        str = (str.slice(str.length - 1) === ',') ? str.slice(0, -1) : str
        return str
      },
      packageContent () {
        let str = ''
        if (!this.items.packAgeDetails && !this.items.tastes) return str
        str += '套餐明细：'
        let packageItem = this.items.packAgeDetails
        for (let i of packageItem) {
          str += i.goodsName + i.amount + i.goodsUnit
          str += ((i.checkAttrs && i.checkAttrs.length > 0) || (i.tastes && i.tastes.length > 0)) ? '(' : ';'
          if (i.checkAttrs) {
            for (let j of i.checkAttrs) {
              if (j.name) {
                str += j.name + ','
              }
            }
          }
          if (i.tastes) {
            for (let h of i.tastes) {
              if (h.tasteName) {
                str += h.tasteName + ','
              }
            }
          }
          str = (str.slice(str.length - 1) === ',') ? str.slice(0, -1) + ');' : str
        }
        str = (str.slice(str.length - 1) === ';') ? str.slice(0, -1) : str
        return str
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .right_price {
    float: right;
    margin-right: pr(24);
  }

  .img_bottom {
    bottom: 0;
    height: auto;
  }

  .status_img {
    background-size: 100% 100%;
    height: pr(62);
    width: pr(84);
    position: absolute;
  }

  .name_wrap {
    display: inline-block;
    line-height: pr(32);
    margin-top: pr(24);
    overflow: hidden;
    width: 97%;
  }

  .vip_img {
    background-size: 100% 100%;
    height: pr(28);
    width: pr(28);
    margin-right: pr(10);
    float: left;
    line-height: pr(32);
  }
  .right-img{
    height: pr(62);
    width: pr(84);
    display: inline-block;
    text-align: center;
    right: 16%;
    bottom: 0;
    position: absolute;
  }
  .right_text {
    height: 100%;
    width: 20%;
    padding-left: pr(24);
    display: inline-block;
    text-align: right;
  }

  .dash_special_price {
    color: #333333;
    margin-top: pr(14);
    line-height: pr(46);
    @include font-dpr(14px);
  }

  .dash_original_price {
    color: #ABABAB;
    @include font-dpr(10px);
    line-height: pr(38);
    text-decoration: line-through;
  }

  .dash_name {
    color: #181818;
    @include font-dpr(13px);
    line-height: pr(30);
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .dash_content {
    color: #9d9d9d;
    margin-top: pr(8);
    @include font-dpr(11px);
    /*line-height: pr(34);*/
    /*height: pr(34);*/
    /*white-space: nowrap;*/
    /*text-overflow: ellipsis;*/
    /*overflow: hidden;*/
  }

  .dash_num {
    color: #9d9d9d;
    line-height: pr(34);
    @include font-dpr(10px);
    padding-bottom: pr(14);
  }

  .item_wrap {
    background-color: #f7f7f7;
    /*height: pr(138);*/
    display: flex;
    border-bottom: pr(6) solid white;
    position: relative;
  }

  .left {
    display: inline-block;
    padding-left: pr(24);
    text-align: center;
    vertical-align: middle;
    .img_wrap {
      margin-top: pr(19);
      margin-bottom: pr(19);
      height: pr(100);
      width: pr(100);
      border: 1px solid #fff;
      overflow: hidden;
      .dash_pic {
        background-size: 100% 100%;
        height: 100%;
        border-radius: pr(4);
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: auto
      }
    }
  }

  .middle {
    width: 55%;
    padding-left: pr(14);
    height: 100%;
    display: inline-block;
  }

  .dash_pic {
    background-size: 100% 100%;
    height: pr(100);
    width: pr(100);
    line-height: pr(138);
    border-radius: pr(4);
    border: 1px solid #fff;
  }

</style>
