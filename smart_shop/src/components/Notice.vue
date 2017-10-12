<!--小图模式和大图模式的公告栏-->
<template>
  <header class="header">
    <div class="header_inner">
      <div class="header_pic"></div>
      <div class="header_content">{{ notice }}</div>
    </div>
  </header>
</template>
<script>
  export default {
    props: ['notice']
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../assets/css/base";

  .header {
    height: pr(90);
    background: #fffbf2;
    border-bottom: 1px solid #e1e1e1;
    z-index: 10;
    display: flex;
    align-items: center;

    .header_inner {
      margin-left: pr(24);
      height: pr(30);

      .header_pic {
        width: pr(30);
        height: pr(30);
        background-size: 100% 100%;
        background-image: url('../assets/img/gonggao@2x.png');
        float: left;
      }
      .header_content {
        /*height: pr(30);*/

        margin-left: pr(14);
        float: left;

        @include font-dpr(14px);
        color: #545454;
        @include ellipsis(680px);
      }
    }
  }

</style>
