<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
      <div class="item_wrap">
        <div class="left">
          <div class="empty_default" v-show="items.soldStatus && items.soldStatus === 1">
            <img src="../../assets/img/yishouwan@2x.png">
          </div>
          <div class="img_wrap">
            <img class="dash_pic" v-lazy="items.pic" alt=""/>
          </div>
        </div>
        <div class="middle">
          <div class="name_wrap">
            <div class="vip_img" v-bind:style="{backgroundImage:'url('+status[items.priceType]+')'}" v-if="items.priceType && items.priceType!==1"></div>
            <div class="dash_name" :class="items.soldStatus && items.soldStatus === 1?'clearGoods':'hasGoods'">{{items.goodsName?items.goodsName:items.goodName}}</div> <!--返回字段不同名-->
          </div>
          <div class="dash_content" v-if="description">{{description}}</div>
          <div class="dash_content" v-if="items.isPackage === 1">{{packageContent}}</div>
          <div class="dash_num">x{{items.amount}}</div>
        </div>
        <div class="right">
          <div class="right_price">
            <div class="dash_special_price">¥{{items.price*items.amount|price}}</div>
            <div class="dash_original_price" v-if="items.originalPrice && items.priceType !== 1">
              ¥{{items.originalPrice*items.amount|price}}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import member from '../../assets/img/orderPay/Member--label@2x.png'
  import discount from '../../assets/img/orderPay/Discount--label@2x.png'
//  1是常态，2是特价  3是会员
  export default {
    data () {
      return {
        status: {
          3: member,
          2: discount
        }
      }
    },
    props: ['items'],
    computed: {
      description () {
        let str = ''
        if (!this.items.checkAttrs && !this.items.tasteVoList) return str
        if (this.items.checkAttrs) {
          for (let i of this.items.checkAttrs) {
            if (i.name) {
              str += i.name + ','
            }
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
        if (!this.items.packageGoods && !this.items.tastes) return str
        str += '套餐明细：'  // 三层数组取值
        let temp = this.items.packageGoods
        for (let z of temp) {
          let details = z.packageDetails
          for (let i of details) {
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
        }
        str = (str.slice(str.length - 1) === ';') ? str.slice(0, -1) : str
        return str
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";
  .clearGoods{
    color: #9d9d9d;
  }
  .hasGoods{
    color: #181818;
  }
  .right_price {
    float: right;
    margin-right: pr(24);
  }
  .status_img{
    background-size: 100% 100%;
    background-image: url('../../assets/img/orderPay/Label--Success@2x.png');
    height: pr(62);
    width: pr(84);
    line-height: pr(138);
    margin-top: pr(76);
    position: absolute;
  }
  .name_wrap{
    display: inline-block;
    line-height: pr(32);
    margin-top: pr(24);
    overflow: hidden;
    width: 97%;
  }
  .vip_img{
    background-size: 100% 100%;
    /*background-image: url('../../assets/img/orderPay/Member--label@2x.png');*/
    height: pr(28);
    width: pr(28);
    margin-right: pr(10);
    float: left;
    line-height: pr(32);
  }
  .right{
    height: 100%;
    width: 30%;
    display: inline-block;
    text-align: center;
  }
  .dash_special_price{
    color: #333333;
    margin-top: pr(14);
    line-height: pr(46);
    @include font-dpr(14px);
  }
  .dash_original_price{
    color: #ABABAB;
    @include font-dpr(10px);
    line-height: pr(38);
    text-decoration: line-through;
  }
  .dash_name{
    @include font-dpr(14px);
    line-height: pr(36);
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .dash_content{
    color: #9d9d9d;
    margin-top: pr(8);
    @include font-dpr(11px);
    line-height: pr(34);
    /*white-space: nowrap;*/
    /*text-overflow: ellipsis;*/
    /*overflow: hidden;*/
  }
  .dash_num{
    color: #9d9d9d;
    line-height: pr(34);
    @include font-dpr(10px);
    padding-bottom: pr(14);
  }
  .item_wrap{
    background-color: #f7f7f7;
    /*height: pr(138);*/
    display: flex;
    border-bottom: pr(6) solid white;
  }
  .left{
    display: inline-block;
    padding-left: pr(24);
    text-align: center;
    vertical-align: middle;
    .img_wrap{
      margin-top: pr(19);
      margin-bottom: pr(19);
      height: pr(100);
      width: pr(100);
      border: 1px solid #fff;
      overflow: hidden;
      .dash_pic{
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
    .empty_default {
      margin-top: pr(19);
      margin-bottom: pr(19);
      height: pr(100);
      width: pr(100);
      border: 1px solid #fff;
      overflow: hidden;
      background-size: 100% 100%;
      background: rgba(0, 0, 0, 0.6);
      position: absolute;
      z-index: 2;
      img{
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
  .middle{
    width: 60%;
    padding-left: pr(14);
    height: 100%;
    display: inline-block;
  }

</style>
