<template>
  <div class="main">
    <img src="../assets/img/wucaipin@2x.png"/>
    <div>当前无菜品</div>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/css/base";

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > img {
      margin-top: pr(100);
      width: pr(270);
      height: pr(270);
    }
    div {
      margin-top: pr(28);
      @include font-dpr(12px);
      height: pr(26);
      color: #adadad;
    }
  }
</style>
