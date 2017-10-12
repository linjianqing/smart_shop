<template>
  <div class="shop">
    <img class="shop-logo" :src="shop.shoplogo" @click="goShop(shop.shopBranchId)">
    <div class="shop-info">
      <div class="shop-name" @click="goShop(shop.shopBranchId)">{{shop.name}}</div>
      <div class="shop_star">
        <span class="star" :class="star_object(mark,1)"></span>
        <span class="star" :class="star_object(mark,2)"></span>
        <span class="star" :class="star_object(mark,3)"></span>
        <span class="star" :class="star_object(mark,4)"></span>
        <span class="star" :class="star_object(mark,5)"></span>
      </div>
      <div class="shop_distance">
        <span class="distance_pic"></span>
        <span class="distance">{{shop.distance}}km</span>
        <span class="nearest" v-if="first">离你最近</span>
      </div>
      <div class="shop_address" @click="mapGuide(shop)"><span class="address_pic"></span>
        <span class="address">{{shop.location}}</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['shop', 'mark', 'first'],
    methods: {
      goShop (shopBranchId) {
        location.href = location.pathname + '?branchId=' + shopBranchId
      },
      // 进入高德导航
      mapGuide (o) {
        let longitude = o.longitude
        let latitude = o.latitude
        let destName = o.location
        let url = 'http://m.amap.com/navi/?dest=' + longitude + ',' + latitude + '&destName=' + destName + '&key=7b7eb0bb7ce95a52668cf22e55748b0a'
        window.location.href = url
      },
      star_object (mark, place) {
        if (mark >= place) {
          return 'full_star'
        } else if (mark + 1 > place) {
          return 'half_star'
        } else {
          return 'empty_star'
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/css/base";

  .shop {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: pr(24);
    overflow: hidden;
    background-color: #fff;
    height: pr(184);
    border-bottom: 1px solid #f5f5f5;
  }

  .shop-logo {
    width: p2r(136px);
    height: p2r(136px);
    border-radius: p2r(2px);
    object-fit: cover;
  }

  .shop-info {
    height: p2r(136px);
    margin-left: p2r(24px);
    @include font-dpr(12px);
    color: #999999;
    .shop-name {
      @include font-dpr(14px);
      color: #181818;
    }

    .shop_star {
      margin-top: pr(8);
      .star {
        height: pr(24);
        width: pr(24);
        display: inline-block;
      }
      .star + .star {
        margin-left: pr(2);
      }
    }
    .shop_distance {
      margin-top: pr(10);
      display: flex;
      align-items: center;
      .distance_pic {
        display: inline-block;
        width: pr(21);
        height: pr(22);
        @include bg-image("../../assets/img/shoplist/juli")
      }
    }
    .shop_address {
      margin-top: pr(8);
      display: flex;
      align-items: center;
      .address_pic {
        display: inline-block;
        width: pr(21);
        height: pr(22);
        @include bg-image("../../assets/img/shoplist/dizhi")
      }
    }

    .address, .distance {
      display: inline-block;
      margin-left: pr(10);
    }
    .address {
      width: pr(512);
      @include ellipsis(512);
    }
    .nearest {
      display: inline-block;
      margin-left: pr(10);
      line-height: pr(24);
      height: pr(24);
      text-align: center;
      background: #f75656;
      color: white;
      border-radius: pr(2);
      @include font-dpr(9px);
      width: pr(90);
    }
  }

  .full_star {
    @include bg-image("../../assets/img/shopHome/xingx");
  }

  .half_star {
    @include bg-image("../../assets/img/shopHome/xingx2");
  }

  .empty_star {
    @include bg-image("../../assets/img/shopHome/xingx3");
  }

</style>
