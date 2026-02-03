<template>
<view class="user-coupon">
    <custom-navbar title="我的优惠券"></custom-navbar>
    <!-- <view style="height: 88px;width: 100%;"></view> -->
    <tabs
        style="margin-top: 120rpx;"
        :current="active"
        @change="onChange"
        :is-scroll="false"
        active-color="#29A50A"
        :bar-width="80"
        :bar-style="{ background: 'linear-gradient(90deg, #23A10A 0%, #ACFF01 100%)' }"
    >
        <tab v-for="(item, index) in coupons" :key="index" :name="item.title">
            <view class="coupon-content">
                <my-coupons :type="item.type" :btn-type="item.btnType" :i="index" :index="active"></my-coupons>
            </view>
        </tab>
    </tabs>
</view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
  components: {
    CustomNavbar
  },
  data() {
    return {
      active: 0,
      coupons: [{
        title: '可使用',
        btnType: 0,
		type: 'valid'
      }, {
        title: '已使用',
        btnType: 1,
		type: 'used'
      }, {
        title: '已过期',
        btnType: 2,
		type: 'expired'
      }]
    };
  },

  methods: {
    onChange(index) {
        this.active = index
    }
  }
};
</script>
<style lang="scss" scoped>
.user-coupon {
    padding-top: 88px; // Account for fixed navbar height (statusBar + navbar)
    background-color: #EEEEEE;

    .coupon-content {
        margin-top: 20rpx;
    }
}
</style>