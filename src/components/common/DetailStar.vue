<template>
  <div>
    <p class="list_score">
      <input type="radio" value="0" v-model="value" disabled="disabled"/>
      <span>★</span>
      <input type="radio" value="1" v-model="value" disabled="disabled"/>
      <span>★</span>
      <input type="radio" value="2" v-model="value" disabled="disabled"/>
      <span>★</span>
      <input type="radio" value="3" v-model="value" disabled="disabled"/>
      <span>★</span>
      <input type="radio" value="4" v-model="value" disabled="disabled"/>
      <span>★</span>
      <input type="radio" value="5" v-model="value" disabled="disabled"/>
      <span>★</span>
    </p>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['value']
  }

</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/css/base";

  .list_score {
    input {
      opacity: 0;
      position: absolute;
      margin: 0;
    }
    input:nth-of-type(1),
    span:nth-of-type(1) {
      display: none;
    }
    span {
      font-size: pr(30);
      color:  #ffc000;
      -webkit-transition: color .2s;
      transition: color .2s;
    }
    input:checked ~ span {
      color: #e1e1e1;
    }
    input:checked + span {
      color: #ffc000;
    }
  }
</style>
