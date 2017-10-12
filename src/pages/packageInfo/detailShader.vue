<template>
  <div class="item_shader" ref="detailShader">
    <div class="main">
      <div class="item_name">{{propertyDetailInfo.goodsName}}</div>
      <div class="close_btn" @click="closeDetailShader"></div>
      <div class="flavor_list">
        <div class="option" v-for="(attr, i) in propertyDetailInfo.attrs" v-if="propertyDetailInfo.attrs.length">
          <div class="attr">{{attr.name}}</div>
          <ul>
            <li v-for="(attrItem, index) in attr.productAttrItems" :class="{active: currentIndexArray[i][index]}"
                @click="selectActive(i,index,attrItem)">{{attrItem.name}}
            </li>
          </ul>
        </div>
        <div class="option" v-if="propertyDetailInfo.tastes&&propertyDetailInfo.tastes.length">
          <div class="attr">口味</div>
          <ul>
            <li v-for="(tasteItem, i) in propertyDetailInfo.tastes" :class="{active: currentIndexArrayTaste[i]}"
                @click="selectActiveForTaste(i,tasteItem)">{{tasteItem.tasteName}}
            </li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <div class="price">
          <span class="selected_flavor" v-show="showWords.length"><span class="cell">( {{showWords.join(', ')}} )</span></span>
        </div>

        <div class="add_to_cart" v-show="isCartShow" @click="addToCart()">
          <div class="addInfo">加入购物车</div>
        </div>
        <!--<div class="handle-button " v-if="!isCartShow" :class="{deny:this.$parent.selectSpecifiedDish(this.propertyDetailInfo)['deny'], 'default-button': this.$parent.selectSpecifiedDish(this.propertyDetailInfo)['defaultButton']}">-->
        <div class="handle-button " v-if="!isCartShow"
             :class="{deny:this.$parent.selectSpecifiedDish(this.propertyDetailInfo)['deny']}">
          <span class="reduceIcon" @click.stop="reduceNum()"></span>
          <span class="dish-selected-num">{{amount}}</span>
          <span class="addIcon" @click.stop="addNum()"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        currentIndexArray: [],
        currentIndexArrayTaste: [],
        showWords: [],
        num: 0,
        selectDetailData: '',
        amount: 0,
        commitInfo: [],
        commitInfoTaste: [],
        isCartShow: true
      }
    },
    props: ['propertyDetailInfo', 'selectedTotalInfo'],
    computed: {
      tasteLength () {
        return this.propertyDetailInfo.tastes.length
      },
      attrLength () {
        return this.propertyDetailInfo.attrs.length
      }
    },
    methods: {
      max () {
        let maxNum
        if (!this.attrLength) {
          maxNum = Math.max(0, this.isAttrsTasteExist())
        } else if (!this.tasteLength) {
          maxNum = Math.max(this.isAttrsExist(), 0)
        } else {
          maxNum = Math.max(this.isAttrsExist(), this.isAttrsTasteExist())
        }
        return maxNum
      },
      selectSpecifiedDish () {
        return this.$parent.selectSpecifiedDish(this.propertyDetailInfo)
      },
      selectSpecifiedGroup () {
        return this.$parent.selectSpecifiedGroup(this.propertyDetailInfo)
      },
      closeDetailShader () {
        this.$emit('closeDetailShader', false)
      },
      // 以下这段代码是我写过的最挫的代码之一，解决的是vue无法很好追踪数组内容变化这个问题,解决的需求是动态切换
      selectActive (i, index, attrItem) {
        for (let j = 0; j < this.currentIndexArray[i].length; j++) {
          let start = (index === j)
          this.currentIndexArray[i].shift()
          this.currentIndexArray[i].push(start)
        }
        // 重新改变一下默认生成的提交信息
        this.showWords[i] = attrItem.name
        this.commitInfo[i].id = attrItem.id
        this.commitInfo[i].name = attrItem.name
        this.commitInfo[i].index = index
        // 重新选择属性的话， 数量置零；按钮为默认状态 ;数量为0 的时候，出现购物车图标
        if (!this.tasteLength) {
          if (this.isAttrsExist() === -1) {
            this.amount = 0
            this.isCartShow = true
          } else {
            this.amount = this.selectSpecifiedDish().selectAmountWithAttr[this.max()].amount
            this.selectSpecifiedDish().defaultButton = false
            this.isCartShow = false
          }
        }
        if (this.tasteLength) {
          if (this.isAttrsExist() === -1) {
            this.amount = 0
            this.isCartShow = true
          } else if (this.isAttrsTasteExist() !== -1 && (this.isAttrsExist() !== -1)) {
            this.amount = this.selectSpecifiedDish().selectAmountWithAttr[this.max()].amount
            this.selectSpecifiedDish().defaultButton = false
            this.isCartShow = false
          }
        }
      },
      selectActiveForTaste (i, tasteItem) {
        // 味千口味---满足多选, 重新改变提交信息
        this.$set(this.currentIndexArrayTaste, i, !this.currentIndexArrayTaste[i])
        if (!this.currentIndexArrayTaste[i]) {
          this.showWords.splice(this.showWords.findIndex(x => x === tasteItem.tasteName), 1)
          this.commitInfoTaste.splice(this.commitInfoTaste.findIndex(x => x.tasteName === tasteItem.tasteName), 1)
        } else {
          this.showWords.push(tasteItem.tasteName)
          this.commitInfoTaste.push({
            'tasteId': tasteItem.tasteId,
            'tasteName': tasteItem.tasteName,
            'categoryId': tasteItem.categoryId,
            'index': i
          })
          this.commitInfoTaste.sort(function (a, b) {
            return a.index - b.index
          })
        }
        // 重新选择属性的话， 数量置零；按钮为默认状态 ;数量为0 的时候，出现购物车图标
        // 兼容是否有属性--两种情况
        if (!this.attrLength) {
          if (this.isAttrsTasteExist() === -1) {
            this.amount = 0
            this.isCartShow = true
          } else if (this.isAttrsTasteExist() !== -2) {
            this.amount = this.selectSpecifiedDish().tastesList[this.max()].amount
            this.selectSpecifiedDish().defaultButton = false
            this.isCartShow = false
          }
        }
        if (this.attrLength) {
          if (this.isAttrsTasteExist() === -1) {
            this.amount = 0
            this.isCartShow = true
          } else if (this.isAttrsTasteExist() !== -1 && (this.isAttrsExist() !== -1)) {
            if (this.isAttrsTasteExist() === this.isAttrsExist()) {
              this.amount = this.selectSpecifiedDish().tastesList[this.max()].amount
              this.selectSpecifiedDish().defaultButton = false
              this.isCartShow = false
            } else {
              this.amount = 0
              this.isCartShow = true
            }
          }
        }
      },
      reduceNum () {
        let target = this.selectSpecifiedGroup()
        // 删除最后一个提交的
        // 只有口味时
        if (this.tasteLength && !this.attrLength) {
          this.amount = --this.selectSpecifiedDish().tastesList[this.isAttrsTasteExist()].amount
          if (this.amount <= 0) {
            this.isCartShow = true
            this.selectSpecifiedDish().tastesList.splice(this.max(), 1)
          }
        }
        // 只有属性时
        if (this.attrLength && !this.tasteLength) {
          this.amount = --this.selectSpecifiedDish().selectAmountWithAttr[this.max()].amount
          if (this.amount <= 0) {
            this.isCartShow = true
            this.selectSpecifiedDish().selectAmountWithAttr.splice(this.max(), 1)
          }
        }
        // 口味和属性都存在时
        if (this.attrLength && this.tasteLength) {
          this.amount = --this.selectSpecifiedDish().selectAmountWithAttr[this.max()].amount
          this.selectSpecifiedDish().tastesList[this.max()].amount = this.amount
          if (this.amount <= 0) {
            this.isCartShow = true
            this.selectSpecifiedDish().selectAmountWithAttr.splice(this.max(), 1)
            this.selectSpecifiedDish().tastesList.splice(this.max(), 1)
          }
        }
        // 有减少，则其他所有至灰的按钮，都要取消至灰；这是一个自然的过程，不需要判断
        this.$parent.noSelectedDishs(target, false)
        // 向父组件发送信息,先要组装一下信息
        this.$emit('getDtaFromShader', this.selectedTotalInfo)
      },
      addNum () {
        let target = this.selectSpecifiedGroup()
        if (this.$parent.eachGroupAmount(target) === target.maxSelectAmount - 1) {
          this.createAddInfo()
        } else if (this.$parent.eachGroupAmount(target) >= target.maxSelectAmount) {
          this.$parent.showToast('此分组已选够菜品')
        } else {
          this.createAddInfo()
        }
        this.$emit('getDtaFromShader', this.selectedTotalInfo)
      },
      createAddInfo () {
        // 向父组件发送信息,先要组装一下信息
        this.selectSpecifiedDish().defaultButton = false
        // 只有味千口味的时候;有没有选择口味要分开处理
        if (this.tasteLength && !this.attrLength) {
          if ([-1, -2].includes(this.isAttrsTasteExist())) {
            this.amount = 1
            let tastesAttrs = JSON.stringify({
              tastesAttrs: this.commitInfoTaste,
              amount: this.amount
            })
            !this.commitInfoTaste.length ? (this.handleEmptyTaste(this.selectSpecifiedDish().tastesList.length)) : (this.selectSpecifiedDish().tastesList.push(JSON.parse(tastesAttrs)))
          } else {
            // 当没有任何属性时，人为加上tastesList属性
            if (!this.selectSpecifiedDish().tastesList.length) {
              this.addEmptyTaste(0)
            }
            this.amount = ++this.selectSpecifiedDish().tastesList[this.max()].amount
          }
        }
        // 只有属性的时候
        if (this.attrLength && !this.tasteLength) {
          if (this.isAttrsExist() === -1) {
            this.amount = 1
            let attrs = JSON.stringify({
              attrs: this.commitInfo,
              amount: this.amount
            })
            this.selectSpecifiedDish().selectAmountWithAttr.push(JSON.parse(attrs))
          } else {
            this.amount = ++this.selectSpecifiedDish().selectAmountWithAttr[this.max()].amount
          }
        }
        // 当属性和口味都有的时候
        if (this.tasteLength && this.attrLength) {
          let attrs = JSON.stringify({
            attrs: this.commitInfo,
            amount: this.amount
          })
          let tastesAttrs = JSON.stringify({
            tastesAttrs: this.commitInfoTaste,
            amount: this.amount
          })
          // 只是属性变了,和下面式子是一样的,泪崩,有空了优化写法
          if (this.isAttrsExist() === -1 && !(this.isAttrsTasteExist() === -1)) {
            this.amount = 1
            this.selectSpecifiedDish().selectAmountWithAttr.push(JSON.parse(attrs))
            !this.commitInfoTaste.length ? (this.handleEmptyTaste(this.selectSpecifiedDish().tastesList.length)) : (this.selectSpecifiedDish().tastesList.push(JSON.parse(tastesAttrs)))
          }
          // 只是口味变了,和上面式子是一样的
          if (this.isAttrsTasteExist() === -1 && !(this.isAttrsExist() === -1)) {
            this.amount = 1
            this.selectSpecifiedDish().selectAmountWithAttr.push(JSON.parse(attrs))
            !this.commitInfoTaste.length ? (this.handleEmptyTaste(this.selectSpecifiedDish().tastesList.length)) : (this.selectSpecifiedDish().tastesList.push(JSON.parse(tastesAttrs)))
          }
          // 属性和口味都变了
          if (this.isAttrsTasteExist() === -1 && this.isAttrsExist() === -1) {
            this.amount = 1
            this.selectSpecifiedDish().selectAmountWithAttr.push(JSON.parse(attrs))
            !this.commitInfoTaste.length ? (this.handleEmptyTaste(this.selectSpecifiedDish().tastesList.length)) : (this.selectSpecifiedDish().tastesList.push(JSON.parse(tastesAttrs)))
          }
          // 属性和口味都没有变
          if (!(this.isAttrsTasteExist() === -1) && !(this.isAttrsExist() === -1)) {
            // 当没有任何属性时，加上tastesList属性
            if (!this.selectSpecifiedDish().tastesList.length) {
              this.addEmptyTaste(0)
            }
            this.amount = ++this.selectSpecifiedDish().selectAmountWithAttr[this.max()].amount
            this.selectSpecifiedDish().tastesList[this.max()].amount = this.amount
          }
        }
      },
      isAttrsExist () {
        // 找出已存在 属性配置 的位置
        let curDish = this.selectSpecifiedDish().selectAmountWithAttr
        let tempArr = []
        let currentIndexArr = []
        // 当没有属性，只有味千口味的时候，和isAttrsExist有关的所有判断都为 true
        if (!this.attrLength) {
          return true
        }
        if (!curDish.length) {
          return -1
        }
        curDish.filter(item => {
          let temp = []
          item.attrs.forEach(ele => {
            temp.push(ele.index)
          })
          tempArr.push(temp)
        })
        currentIndexArr = this.currentIndexArray.map(item => {
          return item.findIndex(x => x === true)
        })
        return tempArr.findIndex(x => x.join() === currentIndexArr.join())
      },
      isAttrsTasteExist () {
        // 为了兼容 味千口味 这个需求,找到是否有存在的口味
        let curDishTaste = this.selectSpecifiedDish().tastesList
        let tempArrTaste = []
        let currentIndexArr = []
        // 当没有味千口味的时候，和isAttrsTasteExist有关的所有判断都为 true
        if (!this.tasteLength) {
          return true
        }
        // 专门标识口味数组长度为0的情况
        if (!curDishTaste.length) {
          return -2
        }
        curDishTaste.filter(item => {
          let temp = []
          item.tastesAttrs.forEach(ele => {
            temp.push(ele.index)
          })
          tempArrTaste.push(temp)
        })
        this.currentIndexArrayTaste.forEach((item, index) => {
          if (item) {
            currentIndexArr.push(index)
          }
        })
        return tempArrTaste.findIndex(x => x.join() === currentIndexArr.join())
      },
      handleEmptyTaste (n) {
        // 当没有选择口味时，加上值为空数组的的数据
        if (this.commitInfoTaste.length) {
          return false
        }
        this.addEmptyTaste(n)
      },
      addEmptyTaste (n) {
        this.selectSpecifiedDish().tastesList[n] = {}
        this.selectSpecifiedDish().tastesList[n].tastesAttrs = []
        this.selectSpecifiedDish().tastesList[n].amount = this.amount
      },
      addToCart () {
        let target = this.selectSpecifiedGroup()
        if (this.$parent.eachGroupAmount(target) >= target.maxSelectAmount) {
          this.$parent.showToast('此分组已选够菜品')
        } else {
          this.isCartShow = false
          this.addNum()
        }
      }
    },
    created () {
      // 以下操作是为多个单选而设计的二维数组
      this.propertyDetailInfo.attrs.forEach((item, index) => {
        let temp = []
        item.productAttrItems.forEach((item, index) => {
          temp.push(index === 0)
        })
        this.currentIndexArray.push(temp)
      })
      // 以下操作是为口味多选而设计的一维数组
      this.propertyDetailInfo.tastes && this.propertyDetailInfo.tastes.forEach(() => {
        this.currentIndexArrayTaste.push(false)
      })
    },
    mounted () {
      //  选属性---初始化showWords 和 默认提交内容 ;默认最后一次提交选中
      let selectedAttrs = this.selectedTotalInfo.find(x => x.id === this.propertyDetailInfo.groupId).childDish
        .find(x => x.id === this.propertyDetailInfo.id).selectAmountWithAttr.slice(-1)[0]
      let selectedTaste = this.selectedTotalInfo.find(x => x.id === this.propertyDetailInfo.groupId).childDish
        .find(x => x.id === this.propertyDetailInfo.id).tastesList.slice(-1)[0]
      this.propertyDetailInfo.attrs.forEach((item, m) => {
        let attr = selectedAttrs && selectedAttrs.attrs[m]
        let selectedIndex = item.productAttrItems.findIndex(x => x.id === (attr && attr.id))
        selectedIndex = (selectedIndex === -1) ? 0 : selectedIndex
        let selectedEle = item.productAttrItems[selectedIndex]
        this.commitInfo.push({
          id: selectedEle.id,
          name: selectedEle.name,
          pid: selectedEle.attrId,
          pname: item.name,
          index: selectedIndex
        })
        // 重新选择最后一个
        this.selectActive(m, selectedIndex, selectedEle)
      })
      // 选口味
      this.propertyDetailInfo.tastes && this.propertyDetailInfo.tastes.forEach((item, m) => {
        let tastesAttrs = selectedTaste && selectedTaste.tastesAttrs
        tastesAttrs && tastesAttrs.forEach((elem) => {
          if (item.tasteId === elem.tasteId) {
            // 选择 已有口味
            this.selectActiveForTaste(m, elem)
          }
        })
      })
      // 判断购物车图标是否显示
      if (selectedAttrs) {
        this.isCartShow = false
        this.amount = selectedAttrs.amount
        this.selectSpecifiedDish()['deny'] = false
      } else if (!this.amount) {
        // 数量为0 的时候，出现购物车图标
        this.isCartShow = true
      }
      // 味千口味特殊添加 ,没有属性选项，没有口味选项且该菜品默认选中
      if (!selectedAttrs && this.propertyDetailInfo.hasSelect) {
        if (selectedTaste && !selectedTaste.tastesAttrs.length) {
          this.isCartShow = false
          this.amount = 1
          this.selectSpecifiedDish()['deny'] = false
        }
      }
      // 选口味，兼容处理---口味不包含任何值，但是有多份
      if (selectedTaste && !selectedTaste.tastesAttrs.length && selectedTaste.amount) {
        this.isCartShow = false
        this.amount = selectedTaste.amount
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  * {
    -webkit-text-size-adjust: none;
  }

  .item_shader {
    z-index: 55;
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
    .main {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      background-color: white;
      max-height: pr(700);
      width: pr(642);
      border-radius: pr(18);

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
        height: pr(40);
        width: pr(400);
        position: relative;
        .cell {
          display: block;
          height: pr(36);
          width: inherit;
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
    .handle-button {
      float: right;
      margin-top: pr(20);
      height: pr(80);
      line-height: pr(80);
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
  }
</style>

