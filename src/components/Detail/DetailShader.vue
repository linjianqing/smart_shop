<template>
  <div class="item_shader" ref="detailShader" @click="closeDetailShader" @touchmove="stopScroll">
    <div class="main">
      <div class="item_name">{{ goods.name }}</div>
      <div class="close_btn" @click="closeDetailShader"></div>
      <div class="flavor_list">
        <!--这里是选属性的（单选）-->
        <div class="option"
             v-for="flavor in goods.productAttrsList"
             :key="flavor.id">
          <div class="attr">{{ flavor.name }}</div>
          <ul>
            <li v-for="choice in flavor.productAttrItems"
                :key="choice.id"
                :class="{ active: isSelected(flavor.id, choice.id) }"
                @click="chooseFlavor(flavor.id, choice.id, choice.name)">{{ choice.name }}
            </li>
          </ul>
        </div>
        <!--这里是显示味千的属性（多选）-->
        <div class="option" v-if="menuTaste && menuTaste.length">
          <div class="attr">口味</div>
          <ul>
            <li v-for="taste in menuTaste"
                :key="taste.tasteId"
                :class="{ active: hasTaste(taste.tasteId)}"
                @click="toggleTaste(taste.tasteId)">{{taste.tasteName}}
            </li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <div class="price">
          <div>¥{{ goods.price | price}}</div>
          <div class="selected_flavor" v-show="showWords!='()'">
            <div class="cell">{{ showWords }}</div>
          </div>
        </div>

        <div class="wrap_number" v-show="goodsNum">
          <div @click="action(-1)" v-show="goodsNum" class="reduceImg"></div>
          <span v-show="goodsNum" class="num">{{ goodsNum }}</span>
          <div @click="action(1)" class="addImg"></div>
        </div>
        <div v-show="!goodsNum" class="add_to_cart" @click="createGoods">
          <div class="addInfo">加入购物车</div>
        </div>
      </div>
    </div>
    <toast-show v-show="toasting" :content="content"></toast-show>
  </div>
</template>

<script>
  import ToastShow from '../../components/common/ToastShow'

  export default {
    data () {
      return {
        selectedFlavor: [],
        fullFlavor: [],
        theLock: true,
        content: '',
        toasting: false,
        tasteList: []
      }
    },
    components: {
      ToastShow
    },
    computed: {
      menuTaste () {
        let tasteList = this.$store.getters.tastes.filter(x => x.categoryId === this.goods.categoryId)
        return tasteList.length ? tasteList : this.goods.tastes
      },
      // 已选择的口味展示
      showWords () {
        let tmp = []
        for (let i of this.selectedFlavor) {
          tmp.push(i.productAttrItems[0].name)
        }
        for (let i of this.tasteList) {
          tmp.push(i.tasteName)
        }
        return `(${tmp.join(', ')})`
      },
      goods_mod () {
        let tmp = JSON.parse(JSON.stringify(this.goods))
        tmp.productAttrsList = JSON.parse(JSON.stringify(this.selectedFlavor))
        tmp.tastes = JSON.parse(JSON.stringify(this.tasteList))
        return tmp
      },
      goodsNum () {
        let num = this.$store.getters.getCartGoodsById(this.goods.id)
        if (num.length) {
          let data = num.filter(x => JSON.stringify(x.productAttrsList) === JSON.stringify(this.selectedFlavor))
            .filter(x => JSON.stringify(x.tastes) === JSON.stringify(this.tasteList))
          return data.length ? data[0].quantity : 0
        }
        return 0
      }
    },
    watch: {},
    props: ['goods'],
    methods: {
      toastView (msg) {
        this.content = msg
        this.toasting = true
        setTimeout(() => {
          this.toasting = false
        }, 3000)
      },
      //      这个只存一个当前口味
      chooseFlavor (option, flavorId, flavorName) {
        let i = this.selectedFlavor.find(x => x.id === option)
        if (i) {
          i.productAttrItems[0].id = flavorId
          i.productAttrItems[0].name = flavorName
        } else {
          this.selectedFlavor.push({'id': option, 'productAttrItems': [{'id': flavorId, 'name': flavorName}]})
        }
      },
      hasTaste (tasteId) {
        return this.tasteList.map(x => x.tasteId).includes(tasteId)
      },
      toggleTaste (tasteId) {
        let postion = this.tasteList.map(x => x.tasteId).indexOf(tasteId)
        if (postion !== -1) {
          this.tasteList.splice(postion)
        } else {
          let item = this.menuTaste.find(x => x.tasteId === tasteId)
          this.tasteList.push(JSON.parse(JSON.stringify({tasteId: tasteId, tasteName: item.tasteName})))
          this.tasteList.sort((a, b) => a.tasteId - b.tasteId)
        }
      },
      createGoods () {
        if (this.theLock) {
          this.theLock = false
          let attrs = []
          if (this.goods_mod.productAttrsList) {
            for (let i of this.goods_mod.productAttrsList) {
              attrs.push(
                {
                  id: i.productAttrItems[0].id,
                  name: i.productAttrItems[0].name,
                  pid: i.id,
                  pname: i.name
                })
            }
          }
          let data = {
            amount: !this.goods_mod.quantity ? 1 : this.goods_mod.quantity,
            goodsId: this.goods_mod.id,
            attrs: attrs,
            tastes: this.tasteList
          }
          let tableId = this.$store.getters.tableId
          if (tableId) {
            data['tableId'] = tableId
          }
          this.$http.post(this.$store.getters.getUrl('createCart'), data).then((res) => {
            let result = res.data
            if (result.code === 0) {
              this.$store.dispatch('addToCart', {products: this.goods_mod, id: result.response.cyShoppingCart.id})
              let campain = result.response.nextLevelCampaign
              if (campain && campain[0]) {
                this.$store.dispatch('setNextLevelCampaign', campain[0])
              }
            } else {
              this.toastView(res.data.message)
            }
            this.theLock = true
          })
        }
      },
      action (num) {
        if (this.theLock) {
          let hasGoods = this.$store.getters.allGoods.find(x => x.id === this.goods.id && JSON.stringify(x.productAttrsList) === JSON.stringify(this.selectedFlavor) && JSON.stringify(x.tastes) === JSON.stringify(this.tasteList))
          let a = hasGoods.goodsId
          // update
          let updateData = {
            id: a,
            amount: hasGoods.quantity + num
          }
          this.theLock = false
          this.$http.post(this.$store.getters.getUrl('updateAmount'), updateData).then((res) => {
            if (res.data.code === 0) {
              if (num > 0) {
                this.$store.dispatch('addToCart', {products: hasGoods, id: hasGoods.id})
              } else {
                this.$store.dispatch('reduceFromCart', hasGoods)
              }
              let campain = res.data.response.nextLevelCampaign
              if (campain && campain[0]) {
                this.$store.dispatch('setNextLevelCampaign', campain[0])
              }
            } else {
              this.toastView(res.data.message)
            }
            this.theLock = true
          })
        }
      },
      closeDetailShader (e) {
        if (['close_btn', 'item_shader'].includes(e.target.className)) {
          this.$emit('closeDetailShader')
        }
      },
      isSelected (optionId, choiceId) {
        if (this.selectedFlavor.length) {
          let temp = this.selectedFlavor.find(x => x.id === optionId)
          if (temp) {
            return temp.productAttrItems[0].id === choiceId
          }
        }
        return false
      },
      initSettings () {
        //        如果原来有选择的话默认加载第一个选项，没有的话默认选择每个选项的第一个
        let cartGoods = this.$store.getters.getCartGoodsById(this.goods.id)
        if (!cartGoods.length) {
          // 这是找不到的情况
          if (this.goods.productAttrsList.length) {
            this.selectedFlavor = JSON.parse(JSON.stringify(this.goods.productAttrsList))
            for (let i of this.selectedFlavor) {
              i.productAttrItems = [i.productAttrItems[0]]
            }
          }
        } else {
          this.selectedFlavor = JSON.parse(JSON.stringify(cartGoods[0].productAttrsList))
          // 这里是判断口味是否选中
          this.tasteList = JSON.parse(JSON.stringify(cartGoods[0].tastes))
        }
      },
      stopScroll (e) {
        console.info(e.target.className)
        if (e.target.className === 'item_shader') {
          e.preventDefault()
        }
      }
    },
    created () {
      this.initSettings()
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  * {
    -webkit-text-size-adjust: none;
  }

  .item_shader {
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: auto;

  }

  .main {
    margin-top: pr(210);
    background-color: white;
    max-height: pr(700);
    width: pr(642);

    border-radius: pr(18);
    position: relative;

    .close_btn {
      position: absolute;
      right: 0;
      top: 0;
      background-size: 100% 100%;
      width: pr(94);
      height: pr(94);
      background-image: url('../../assets/img/guanbi2@2x.png');
    }
  }

  .main::-webkit-scrollbar {
    display: none
  }

  .flavor_list {
    overflow: scroll;
    height: pr(410);
    margin: 0 pr(30);
  }

  .item_name {
    margin-top: pr(32);
    margin-bottom: pr(52);
    line-height: pr(32);
    @include font-dpr(15px);
    color: #252525;
    font-weight: bold;
    text-align: center;
  }

  .option {
    margin-top: pr(34);
    margin-bottom: pr(14);
  }

  .option:nth-of-type(1) {
    margin-top: 0;
    margin-bottom: pr(32);
  }

  .attr {
    @include font-dpr(13px);
    color: #7d7d7d;
  }

  .red {
    background-color: #f74848;
  }

  ul {
    margin-top: pr(28);
    line-height: pr(26);

    display: flex;
    flex-wrap: wrap;
  }

  li {
    height: pr(54);
    min-width: pr(78);
    padding: 0 pr(27);
    border-radius: pr(27);

    border: solid 1px #adadad;
    text-align: center;
    line-height: pr(54);
    margin-right: pr(20);
    margin-bottom: pr(20);

    @include font-dpr(11px);
  }

  .active {
    background-color: #e45650;
    border: none;
    color: #ffffff;
  }

  .footer {
    height: pr(114);
    position: relative;
    background-color: #f5f5f5;
    padding: 0 pr(30);
    border-bottom-left-radius: pr(18);
    border-bottom-right-radius: pr(18);
    .price {
      width: pr(380);
      height: pr(36);
      position: absolute;
      @include font-dpr(18px);
      color: #f74848;
      font-weight: bold;
      margin-top: pr(39);
      display: inline-flex;
      align-items: flex-end;
    }
    .selected_flavor {
      margin-left: pr(10);
      display: table;
      @include font-dpr(12px);
      color: #252525;
      height: pr(36);
      width: pr(260);
      position: relative;
      .cell {
        display: block;
        height: pr(28);
        width: pr(260);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .wrap_number {
      right: pr(30);
      line-height: pr(50);
      margin-top: pr(32);
      position: absolute;
      float: right;
      height: pr(50);
      width: pr(184);
      display: flex;
      img {
        width: pr(50);
        height: pr(50);
      }
      .num {
        @include font-dpr(14px);
        color: #545454;
        width: pr(82);
        text-align: center;
        @include ellipsis(80);
      }
    }
    .add_to_cart {
      position: absolute;
      right: pr(30);
      margin-top: pr(32);
      border-radius: pr(25);
      background: #e45650;
      height: pr(50);
      width: pr(184);
      line-height: pr(50);
      color: white;
      display: flex;
      justify-content: center;
      align-content: center;
      @include font-dpr(14px);
    }
    .reduceImg {
      background-size: 100% 100%;
      background-image: url('../../assets/img/jianshao@2x.png');
      height: pr(46);
      width: pr(46);
      line-height: pr(46);
    }
    .addImg {
      background-size: 100% 100%;
      background-image: url('../../assets/img/tianjia@2x.png');
      height: pr(46);
      width: pr(46);
      line-height: pr(46);
    }
  }
</style>
