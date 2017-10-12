<template>
  <div>
    <div class="package-detail">
      <header>
        <i class="close-icon" @click="closeDialog()"></i>
        <p class="package-title">{{packageInfo.goods.name}}</p>
      </header>
      <section>
        <div class="package-content" v-show="packageDetail.length" v-for="species in packageDetail">
          <div class="species-title">
            <span>已选 <i class="active">{{eachGroupAmount(selectSpecifiedGroup(species))}}</i></span>
            <p>{{species.groupName}}（{{species.packageDtl.length}}选{{species.quantity}}）</p>
          </div>
          <ul class="species-content">
            <li v-for="item in species.packageDtl">
              <div class="handle-button"
                   v-if="(item.soldStatus ===2) && (item.attrs.length ===0) && (typeof item.tastes==='undefined'||(item.tastes && item.tastes.length===0))"
                   :class="{deny:selectSpecifiedDish(item)['deny'],
                   'default-button': selectSpecifiedDish(item)['defaultButton'] && !selectSpecifiedDish(item).isDefaultSelected}">
                <span class="reduceIcon" @click.stop="reduceNum(item)"></span>
                <span
                  class="dish-selected-num">{{dishAmount(item) || Number(selectSpecifiedDish(item).isDefaultSelected)}}</span>
                <span class="addIcon" @click.stop="addNum(item)"></span>
              </div>
              <div class="sold-out" v-if="item.soldStatus ===1">
                <span>已售罄</span>
              </div>
              <div class="select-spec"
                   v-if="(item.soldStatus ===2) && (item.attrs.length || (item.tastes && item.tastes.length))"
                   @click.stop="selectProperties(item)">
                <div class="select-spec-num" v-if="attrAmount(selectSpecifiedDish(item))">
                  {{attrAmount(selectSpecifiedDish(item))}}
                </div>
                <div class="select-spec-text">选属性</div>
              </div>
              <span class="dish-img">
                  <img :src="item.pic">
                </span>
              <span class="dish-name">{{item.goodsName}}</span>
            </li>
          </ul>
        </div>
        <!--当所有的数据为空时，显示默认图片-->
        <div v-show="!packageDetail.length && isShowDefaultImg" class="menus-empty">
          <div class="cart-empty"></div>
          <div class="info">当前无菜品</div>
        </div>
      </section>
      <footer>
        <span><i>￥</i><i class="total-price">{{Price | price}}</i>共需选{{mustSelectNum}}样,已选 <i
          class="active">{{allDishSelectedNum()}}</i>样</span>
        <span class="add-to-cart" @click="addTocart()">加入购物车</span>
      </footer>
    </div>
    <ToastShow v-show="toasting" :content="content"></ToastShow>
    <loading v-show="isLoading"></loading>
    <detailShader v-if="isDetailShaderShow" @closeDetailShader="closeDetailShader" @getDtaFromShader="getDtaFromShader"
                  :propertyDetailInfo="propertyDetailInfo" :selectedTotalInfo="selectedTotalInfo"></detailShader>
  </div>
</template>

<script>
  import detailShader from '../../pages/packageInfo/detailShader'
  import ToastShow from '../../components/common/ToastShow'
  import loading from '../../components/common/Loading'

  export default {
    data () {
      return {
        isDetailShaderShow: false,
        packageDetail: '',
        mustSelectNum: 0,
        alreadySelectNum: 0,
        selectedTotalInfo: [],
        toasting: false,
        content: '',
        propertyDetailInfo: '',
        dataFromShader: '',
        isLoading: true,
        isShowDefaultImg: false,
        memberStatus: this.$store.getters.memberStatus
      }
    },
    components: {
      detailShader,
      ToastShow,
      loading
    },
    props: ['packageInfo'],
    computed: {
      Price () {
        return !this.memberStatus && this.$store.getters.payType === 1 ? this.packageInfo.goods.originalPrice : this.packageInfo.goods.price
      }
    },
    methods: {
      addTocart () {
        if (this.hasAllSoldoutGroup()) {
          this.showToast('抱歉，套餐内有菜品卖完了')
        } else if (this.allDishSelectedNum() < this.mustSelectNum) {
          this.showToast('你还没有选够菜品哦')
        } else if (this.allDishSelectedNum() === undefined || this.mustSelectNum === 0) {
          this.showToast('网络差，请稍后再试')
        } else {
          // 这里需要自己组装数据
          let data = {
            amount: 1,
            goodsId: this.packageInfo.goods.id,
            attrs: []
          }
          let tableId = this.$store.getters.tableId
          if (tableId) {
            data.tableId = tableId
          }
          let packageGoods = []
          this.selectedTotalInfo.forEach(item => {
            let packageDetails = []
            let temp = {
              groupId: item.id,
              groupName: item.groupName,
              packageDetails
            }
            item.childDish.forEach((elem) => {
              if (elem.selectAmount > 0 || elem.selectAmountWithAttr.length > 0 || elem.tastesList.length > 0) {
                let checkAttrs = elem.selectAmountWithAttr.map(item => {
                  return item.attrs
                }) || []
                let tastes = elem.tastesList.map(item => {
                  return item.tastesAttrs
                }) || []
                if (elem.tastesList.length) {
                  elem.tastesList.forEach((attr, index) => {
                    packageDetails.push({
                      id: elem.id,
                      amount: attr.amount,
                      goodsName: elem.goodsName,
                      goodsUnit: elem.goodsUnit,
                      remark: '',
                      price: '',
                      checkAttrs: checkAttrs && checkAttrs[index] || [],
                      tastes: tastes && tastes[index] || []
                    })
                  })
                } else {
                  // 仅有属性
                  if (elem.selectAmountWithAttr.length) {
                    elem.selectAmountWithAttr.forEach((attr, index) => {
                      packageDetails.push({
                        id: elem.id,
                        amount: attr.amount,
                        goodsName: elem.goodsName,
                        goodsUnit: elem.goodsUnit,
                        remark: '',
                        price: '',
                        checkAttrs: attr.attrs || [],
                        tastes: elem.tastesList.map(item => {
                          return item.tastesAttrs
                        })[0] || []
                      })
                    })
                  } else {
                    // 无属性无口味
                    packageDetails.push({
                      id: elem.id,
                      amount: elem.selectAmount,
                      goodsName: elem.goodsName,
                      goodsUnit: elem.goodsUnit,
                      remark: '',
                      price: '',
                      checkAttrs: elem.selectAmountWithAttr.map(item => {
                        return item.attrs
                      })[0] || [],
                      tastes: elem.tastesList.map(item => {
                        return item.tastesAttrs
                      })[0] || []
                    })
                  }
                }
              }
            })
            packageGoods.push(temp)
          })
          data.packageGoods = packageGoods
          // 添加购物车
          let hasAllGoods = this.$store.getters.allGoods.filter(x => {
            return x.id === this.packageInfo.goods.id
          })
          // 如下写法为了兼容
          let hasGoods = hasAllGoods.length && hasAllGoods.filter(x => {
            return x.packageGoods.groupId === packageGoods.groupId && x.packageGoods.groupName === packageGoods.groupName &&
              JSON.stringify(x.packageGoods.packageDetails) === JSON.stringify(packageGoods.packageDetails)
          })
          if (!hasAllGoods.length || !hasGoods.length) {
            // 新建购物车
            this.createGoods(data)
          } else {
            // 更新数量
            this.handleAmount(hasGoods[0])
          }
        }
      },
      createGoods (data) {
        // 发送请求/shopping_cart/create
        this.$http.post(this.$store.getters.getUrl('createCart'), data).then((res) => {
          let result = res.data
          if (result.code === 0) {
            let GoodPackage = this.getGoodPackage(data)
            this.$store.dispatch('addToCart', {products: GoodPackage, id: result.response.cyShoppingCart.id})
            let campain = result.response.nextLevelCampaign
            if (campain && campain[0]) {
              this.$store.dispatch('setNextLevelCampaign', campain[0])
            }
            // 添加购物车后，套餐详情页消失
            this.closeDialog()
          } else {
            this.showToast(result.message)
          }
        })
      },
      handleAmount (hasGoods) {
        let updateData = {
          id: hasGoods.goodsId,
          amount: hasGoods.quantity + 1
        }
        this.$http.post(this.$store.getters.getUrl('updateAmount'), updateData).then((res) => {
          if (res.data.code === 0) {
            this.$store.dispatch('addToCart', {products: hasGoods, id: hasGoods.goodsId})
            let campain = res.data.response.nextLevelCampaign
            if (campain && campain[0]) {
              this.$store.dispatch('setNextLevelCampaign', campain[0])
            }
            // 更新完数量后，套餐详情页消失
            this.closeDialog()
          } else {
            this.$emit('toast', res.data.message)
          }
        })
      },
      getGoodPackage (data) {
        return {
          originalPrice: this.packageInfo.goods.originalPrice ? this.packageInfo.goods.originalPrice : 0,
          price: this.packageInfo.goods.price,
          priceType: this.packageInfo.goods.priceType,
          id: this.packageInfo.goods.id,
          name: this.packageInfo.goods.name,
          categoryId: this.packageInfo.goods.categoryId,
          unit: this.packageInfo.goods.unit,
          productAttrsList: [],
          isPackage: 1,
          packageGoods: data.packageGoods,
          goodsName: this.packageInfo.goods.name
        }
      },
      allDishSelectedNum () {
        let totalNum = 0
        if (this.selectedTotalInfo) {
          this.selectedTotalInfo.forEach(species => {
            totalNum += this.eachGroupAmount(species)
          })
          return totalNum
        }
      },
      // 挑选出满足条件的单个菜品
      selectSpecifiedDish (item) {
        return this.selectedTotalInfo.filter(ele => {
          return ele.id === item.groupId
        })[0].childDish.filter(elem => {
          return elem.productId === item.productId
        })[0]
      },
      // 通过单个菜品或整个group挑选出满足条件的菜品分组group,group必有groupName
      selectSpecifiedGroup (item) {
        return this.selectedTotalInfo.filter(ele => {
          return ele.id === (item.groupName ? item.id : item.groupId)
        })[0]
      },
      dishAmount (item) {
        return this.selectSpecifiedDish(item).selectAmount
      },
      eachGroupAmount (group) {
        let totalNum = 0
        group.childDish.forEach(ele => {
          if (ele.selectAmountWithAttr.length !== 0) {
            totalNum += this.attrAmount(ele)
          } else if (!ele.selectAmountWithAttr.length && ele.tastesList.length) {
            totalNum += this.attrAmount(ele)
          } else {
            totalNum += ele.selectAmount
          }
        })
        return totalNum
      },
      attrAmount (ele) {
        let attrsAmount = ele.selectAmountWithAttr.length && ele.selectAmountWithAttr.map(item => {
          return item.amount
        }).reduce((pre, cur) => {
          return pre + cur
        })
        let tastesAmount = ele.tastesList.length && ele.tastesList.map(item => {
          return item.amount
        }).reduce((pre, cur) => {
          return pre + cur
        })
        return attrsAmount || tastesAmount
      },
      // 一个group内部所选菜品数量达到最大值的时候，其余未选菜品 样式至灰；或者相反情况，取消至灰
      noSelectedDishs (group, bool) {
        group.childDish.filter(ele => {
          return (ele.selectAmount === 0)
        }).forEach(ele => {
          ele.deny = bool
        })
      },
      addNum (item) {
        this.selectSpecifiedDish(item).isDefaultSelected = false // 取消默认选中状态，以下reduceNum也是同样的操作
        let target = this.selectSpecifiedGroup(item)
        if (this.eachGroupAmount(target) === target.maxSelectAmount - 1) {
          this.selectSpecifiedDish(item).selectAmount += 1
          this.selectSpecifiedDish(item).defaultButton = false
          this.noSelectedDishs(target, true)
        } else if (this.eachGroupAmount(target) >= target.maxSelectAmount) {
          this.showToast('此分组已选够菜品')
        } else {
          this.selectSpecifiedDish(item).defaultButton = false
          this.selectSpecifiedDish(item).selectAmount += 1
        }
      },
      reduceNum (item) {
        this.selectSpecifiedDish(item).isDefaultSelected = false
        let target = this.selectSpecifiedGroup(item)
        this.selectSpecifiedDish(item).selectAmount -= 1
        if (this.selectSpecifiedDish(item).selectAmount <= 0) {
          this.selectSpecifiedDish(item).defaultButton = true
        }
        this.noSelectedDishs(target, false) // 有减少取消至灰，自然过程，不需要判断
      },
      selectProperties (item) {
        this.isDetailShaderShow = !this.isDetailShaderShow
        this.propertyDetailInfo = item
      },
      closeDialog () {
        this.$emit('packageClick', {isPackageShow: false})
      },
      getPackageInfo (productId) {
        this.isLoading = true
        this.isShowDefaultImg = true
        this.$http.post(this.$store.getters.getUrl('getPackageInfo'), {'productId': productId}).then(res => {
          this.isLoading = false
          this.packageDetail = res.data.response
          let tastes = this.$store.getters.tastes
          for (let group of this.packageDetail) {
            for (let i of group.packageDtl) {
              i.tastes = Object.assign(tastes.filter(x => x.categoryId === i.categoryId))
            }
          }
          // 初步处理应该提交的数据的格式
          this.packageDetail.forEach(item => {
            let eachGroupData = {
              productId: item.productId,
              id: item.id,
              groupName: item.groupName,
              maxSelectAmount: item.quantity,
              childDish: []
            }
            item.packageDtl.forEach(item => {
              let eachDishData = {
                productId: item.productId,
                groupId: item.groupId,
                id: item.id,
                selectAmountWithAttr: [],
                tastesList: [],
                selectAmount: 0,
                goodsName: item.goodsName,
                goodsUnit: item.goodsUnit,
                defaultButton: true,
                deny: false,
                isDefaultSelected: item.hasSelect,
                soldStatus: item.soldStatus
              }
              // 默认选中第一个，且数量为1
              if (eachDishData.isDefaultSelected) {
                if (item.attrs.length) {
                  eachDishData.selectAmountWithAttr[0] = {}
                  eachDishData.selectAmountWithAttr[0].attrs = []
                  item.attrs.forEach(elem => {
                    eachDishData.selectAmountWithAttr[0].attrs.push({
                      id: elem.productAttrItems[0].id,
                      name: elem.productAttrItems[0].name,
                      pid: elem.productAttrItems[0].attrId,
                      pname: elem.name,
                      index: 0
                    })
                  })
                  // 沽清但是又默认选中的，默认数量修改为0，而不是1
                  eachDishData.selectAmountWithAttr[0].amount = (eachDishData.soldStatus === 2 ? 1 : 0)
                } else if (!item.attrs.length && !item.tastes.length) {
                  eachDishData.selectAmount = (eachDishData.soldStatus === 2 ? 1 : 0)
                  eachDishData.defaultButton = false
                } else if (!item.attrs.length && item.tastes.length) {
                  eachDishData.selectAmount = (eachDishData.soldStatus === 2 ? 0 : 0)
                }
                // 口味默认值
                if (item.tastes.length) {
                  eachDishData.tastesList[0] = {}
                  eachDishData.tastesList[0].tastesAttrs = []
                  // 沽清但是又默认选中的，默认数量修改为0，而不是1
                  eachDishData.tastesList[0].amount = (eachDishData.soldStatus === 2 ? 1 : 0)
                }
              }
              eachGroupData.childDish.push(eachDishData)
              if (this.eachGroupAmount(eachGroupData) === eachGroupData.maxSelectAmount) {
                this.noSelectedDishs(eachGroupData, true)
              }
            })
            this.selectedTotalInfo.push(eachGroupData)
            // 以下是确定必须要选择几个
            this.mustSelectNum += item.quantity
          })
        }).catch(() => {
          this.showToast('网络差，请稍后再试')
        })
      },
      hasAllSoldoutGroup () {
        return this.packageDetail.some(item => {
          return (() => {
            return item.packageDtl.every(elem => {
              return elem.soldStatus === 1
            })
          })() === true
        })
      },
      closeDetailShader (bool) {
        this.isDetailShaderShow = bool
      },
      showToast (content) {
        this.content = content
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 1000)
      },
      getDtaFromShader (data) {
        this.selectedTotalInfo = data
      }
    },
    created () {
      this.getPackageInfo(this.packageInfo.goods.productId)
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/css" lang="scss">
  @import "../../assets/css/base";

  .package-detail {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 100%;
    color: #181818;
    background: rgba(255, 255, 255, 1);
    i {
      font-style: normal;
    }
    i.active {
      color: #f74848;
    }
    header {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      height: pr(100);
      width: 100%;
      line-height: pr(100);
      background-color: #f2f2f2;
      .close-icon {
        float: right;
        display: inline-block;
        width: pr(34);
        height: pr(34);
        margin: pr(37) pr(24) 0 0;
        transform: rotate(180deg);
        @include bg-image("../../assets/img/package/shouqi");
      }
      .package-title {
        margin-left: pr(24);
        @include font-dpr(15px);
        font-weight: bold;
      }
    }
    section {
      box-sizing: border-box;
      height: 100%;
      padding: pr(132) pr(24) pr(110) pr(24);
      background-clip: content-box;
      overflow-y: auto;
      &::-webkit-scrollbar {
        border-radius: pr(4);
        width: pr(8);
        background-color: #ccc;
      }
      &::-webkit-scrollbar-track {
        border-radius: pr(4);
        background-color: #eee;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #ccc;
      }
      .package-content {
        padding: 0 pr(24);
        margin-bottom: pr(24);
        background-color: #f2f2f2;
      }
      .species-title {
        height: pr(88);
        line-height: pr(88);
        @include font-dpr(14px);
        border-bottom: 1px #e1e1e1 dashed;
        & > span {
          float: right;
        }
      }
      .species-content {
        padding-bottom: pr(24);
        & > li {
          margin-top: pr(24);
          height: pr(80);
          line-height: pr(80);
          vertical-align: middle;
          .handle-button {
            float: right;
            text-align: center;
            span {
              display: inline-block;
            }
            .reduceIcon {
              float: left;
              width: pr(48);
              height: pr(48);
              margin-top: pr(16);
              @include bg-image("../../assets/img/jianshao")
            }
            .addIcon {
              width: pr(48);
              height: pr(48);
              float: right;
              margin-top: pr(16);
              @include bg-image("../../assets/img/tianjia")
            }
            .dish-selected-num {
              min-width: pr(60);
            }
          }
          .deny {
            span {
              display: none;
            }
            .addIcon {
              display: block;
              pointer-events: none;
              @include bg-image("../../assets/img/package/tianjiajy")
            }
          }
          .default-button {
            span {
              display: none;
            }
            .addIcon {
              display: block;
            }
          }
          .sold-out {
            float: right;
            @include font-dpr(14px);
            color: #999;
          }
          .select-spec {
            position: relative;
            top: 50%;
            margin-top: pr(-21);
            float: right;
            .select-spec-text {
              width: pr(98);
              height: pr(42);
              line-height: pr(42);
              @include font-dpr(10px);
              color: #fff;
              text-align: center;
              border-radius: pr(21);
              background-color: #f74848;
            }
            .select-spec-num {
              position: absolute;
              top: pr(-20);
              right: 0;
              min-width: pr(30);
              height: pr(30);
              line-height: pr(35);
              text-align: center;
              color: #fff;
              border-radius: 50%;
              border: 1px white solid;
              @include font-dpr(9px);
              background-color: #f74848;
            }
          }
          .dish-img {
            float: left;
            display: inline-block;
            width: pr(80);
            height: pr(80);
            margin-right: pr(24);
            overflow: hidden;
            img {
              position: relative;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              height: 100%;
              width: auto;
            }
          }
          .dish-name {
            display: inline-block;
            @include font-dpr(14px);
          }
        }
      }
    }
    footer {
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      left: 0;
      height: pr(110);
      line-height: pr(110);
      width: 100%;
      padding: 0 pr(24);
      background-color: #f9f9f9;
      & span:first-child {
        & i:first-child {
          @include font-dpr(11px);
          color: #f74848;
        }
        @include font-dpr(13px);
        .total-price {
          margin-right: 0.4em;
          @include font-dpr(18px);
          color: #f74848;
        }
      }
      .add-to-cart {
        float: right;
        box-sizing: border-box;
        display: inline-block;
        width: pr(200);
        height: pr(60);
        margin-top: pr(25);
        line-height: pr(60);
        padding-left: pr(56);
        color: #fff;
        @include font-dpr(12px);
        background: #e45650;
      }
    }
    .menus-empty {
      margin-top: pr(100);
      text-align: center;
      width: 100%;
      .cart-empty {
        @include bg-image('../../assets/img/wucaipin');
        height: pr(270);
        width: pr(270);
        margin-bottom: pr(28);
        display: inline-flex;
      }
      .info {
        @include font-dpr(12px);
        color: #adadad;
        line-height: pr(26);
      }
    }
  }
</style>
