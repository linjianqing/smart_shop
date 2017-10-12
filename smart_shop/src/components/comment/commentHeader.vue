<template>
  <div>
    <div class="main_rating">
      <div class="top_image">
        <div class="promo_info" v-text="config.hint"></div>
      </div>
      <div class="info" v-text="rating_content[star_rating]"></div>
      <div class="eval_star" ref="eval_star">
        <i class="star" @click="add_main_rating(1)" :class="{star_active:star_rating>=1}"></i>
        <i class="star" @click="add_main_rating(2)" :class="{star_active:star_rating>=2}"></i>
        <i class="star" @click="add_main_rating(3)" :class="{star_active:star_rating>=3}"></i>
        <i class="star" @click="add_main_rating(4)" :class="{star_active:star_rating>=4}"></i>
        <i class="star" @click="add_main_rating(5)" :class="{star_active:star_rating>=5}"></i>
      </div>
    </div>

    <transition name="fade">
      <div class="more_rating" v-show="star_rating > 0">

        <div class="f_rating">
          <div class="face_rating"
               v-for="i in config.scoringItemsList"
               :key="i.type">
            <span class="rating_item">{{ i.name }}</span>
            <i class="face" @click="add_item_score(i.type, 1)" :class="face_object(i.type,1)"></i>
            <i class="face" @click="add_item_score(i.type, 2)" :class="face_object(i.type,2)"></i>
            <i class="face" @click="add_item_score(i.type, 3)" :class="face_object(i.type,3)"></i>
            <i class="face" @click="add_item_score(i.type, 4)" :class="face_object(i.type,4)"></i>
            <i class="face" @click="add_item_score(i.type, 5)" :class="face_object(i.type,5)"></i>
          </div>
        </div>

        <div class="bottom_comment">
          <div class="label_content" v-if="star_rating>2">
            <div class="label" v-for="j in config.goodLabelList"
                 :class="{good_label_active: label_comment.includes(j)}"
                 @click="toggle_label(j)"><span>{{ j }}</span>
              <div class="pic good_pic"></div>
            </div>
          </div>
          <div class="label_content" v-else>
            <div class="label" v-for="k in config.poorLabelList"
                 :class="{poor_label_active: label_comment.includes(k)}"
                 @click="toggle_label(k)"><span>{{ k }}</span>
              <div class="pic poor_pic"></div>
            </div>
          </div>
          <!--文字评语-->
          <div class="type_comment">
            <textarea placeholder="亲！菜品，服务还满意吗？" v-model="input_msg"></textarea>
            <div class="ta_label" :class="{ta_label_overflow:input_msg.length === 150}">{{ hint }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/base";

  hr {
    width: pr(748);
  }

  .main_rating {
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;

    .top_image {
      height: pr(140);
      width: 100%;
      @include bg-image("../../assets/img/comment/new/banner");
      display: flex;
      align-items: center;
      .promo_info {
        margin-left: pr(64);
        @include font-dpr(16px);
        color: #ffffff;
        line-height: pr(40);
      }
    }

    .info {
      margin-top: pr(64);
      @include font-dpr(15px);
      color: #181818;
    }
    .eval_star {
      margin-top: pr(32);
      margin-bottom: pr(20);
    }
    .star {
      @include bg-image("../../assets/img/comment/new/xx");
      background-size: 100%;
      height: pr(56);
      width: pr(56);
      display: inline-block;
    }
    .star_active {
      @include bg-image("../../assets/img/comment/new/xzxx");
    }
    .star + .star {
      margin-left: pr(14);
    }
  }

  .more_rating {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    .f_rating {
      background: #fffbf6;
      width: pr(702);
      padding: pr(30) 0;
    }
    .face_rating {
      display: flex;
      height: pr(48);
      .rating_item {
        width: pr(126);
        margin-left: pr(40);
        @include font-dpr(13px);
        line-height: pr(48);
        color: #757575;
        margin-right: pr(28);
      }
      .face {
        @include bg-image("../../assets/img/comment/pj");
        background-size: 100%;
        height: pr(48);
        width: pr(48);
        display: inline-block;
      }
      .face + .face {
        margin-left: pr(30);
      }

      .face1 {
        @include bg-image("../../assets/img/comment/yixing");
      }
      .face2 {
        @include bg-image("../../assets/img/comment/erxing");
      }
      .face3 {
        @include bg-image("../../assets/img/comment/sanx");
      }
      .face4 {
        @include bg-image("../../assets/img/comment/sixing");
      }
      .face5 {
        @include bg-image("../../assets/img/comment/wux");
      }
    }
    .face_rating + .face_rating {
      margin-top: pr(32);
    }

    .bottom_comment {
      margin-top: pr(30);
      background: #fffbf6;
      padding: pr(38) pr(40);
      width: pr(622);
    }
    .label_content {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: pr(18);
      .label {
        margin-right: pr(20);
        display: inline-flex;
        align-items: center;
        margin-bottom: pr(20);
        height: pr(52);
        line-height: pr(52);
        border-radius: pr(6);
        border: 1px solid #acacac;
        padding-left: pr(20);
        padding-right: pr(18);
        color: #acacac;
        @include font-dpr(13px);
        .pic {
          display: inline-block;
          margin-left: pr(8);
          height: pr(28);
          width: pr(28);
        }
        .good_pic {
          @include bg-image('../../assets/img/comment/new/dzwxz')
        }
        .poor_pic {
          @include bg-image('../../assets/img/comment/new/yb')
        }
      }
      .good_label_active {
        border-color: #f74848;
        color: #f74848;
        .pic {
          @include bg-image('../../assets/img/comment/new/dz')
        }
      }
      .poor_label_active {
        border-color: #ffc000;
        color: #ffc000;
        .pic {
          @include bg-image('../../assets/img/comment/ybxz')
        }
      }
    }
    .type_comment {
      border-top: 1px solid #e1e1e1;
      margin-bottom: pr(24);
      padding-top: pr(26);
      height: pr(188);
      @include font-dpr(14px);
      textarea {
        width: 100%;
        height: pr(152);
        line-height: pr(42);
        color: #181818;
        border: none;
        background: #fffbf6;
      }
      .ta_label {
        margin-top: pr(8);
        text-align: right;
        color: #adadad;
      }
      .ta_label_overflow {
        color: #f74848;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>

<script>
  export default {
    data () {
      return {
        rating_content: {
          '0': '感觉怎么样，打个分吧',
          '1': '非常差，不会再来',
          '2': '感觉很一般',
          '3': '满意，感觉不错',
          '4': '很满意，下次还要来',
          '5': '非常棒，值得推荐给朋友'
        },
        // 这些是提交需要用到的值
        input_msg: '',    // 手打的评论
        star_rating: 0,   // 总评分
        item_score: [],    // 每项的评分，方便过滤，提交的时候再处理一下
        label_comment: [],
        // 以下是状态值
        showDetail: false
      }
    },
    props: ['config'],
    computed: {
      hint () {
        let len = this.input_msg.length
        return len ? `(${len}/150)` : `再写8个字，加油哟`
      }
    },
    watch: {
      input_msg () {
        this.input_msg = this.input_msg.slice(0, 150)
        this.$emit('send_res', {'input_msg': this.input_msg})
      },
      star_rating (newVal, oldVal) {
        // 防止测试乱点的时候把奇怪的标签也提交上去
        if ((newVal < 3 && oldVal > 2) || (newVal > 2 && oldVal < 3)) {
          this.label_comment = []
        }
        this.$emit('send_res', {'star_rating': this.star_rating})
      },
      item_score () {
        this.$emit('send_res', {'item_score': this.item_score})
      },
      label_comment () {
        this.$emit('send_res', {'label_comment': this.label_comment})
      }
    },
    methods: {
      face_object (type, faceScore) {
        let item = this.item_score.find(x => x.type === type)
        if (item) {
          if (item.score >= faceScore) {
            return {['face' + item.score]: true}
          }
        }
      },
      img_show (type) {
        return {['showImg' + type]: true}
      },
      add_main_rating (mark) {
        this.star_rating = mark
      },
      add_item_score (type, score) {
        let item = this.item_score.find(x => x.type === type)
        if (item) {
          item.score = score
        } else {
          this.item_score.push({'type': type, 'score': score})
        }
      },
      toggle_label (label) {
        if (this.label_comment.includes(label)) {
          this.label_comment.splice(this.label_comment.indexOf(label), 1)
        } else {
          this.label_comment.push(label)
        }
      }
    }
  }
</script>

