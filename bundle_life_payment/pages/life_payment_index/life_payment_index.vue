<template>
  <view class="life-payment-page">
    <!-- 自定义导航栏 -->
    <custom-navbar title="生活缴费" bgColor="#cbfac5" textColor="#333" iconColor="#333"></custom-navbar>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 标题和特性 -->
      <view class="header-section">
        <view class="header-content">
          <view class="header-left">
            <view class="main-title">生活缴费</view>
            <view class="features">
              <view class="feature-item">
                <u-icon name="checkmark-circle" size="20" color="#646B67"></u-icon>
                <text class="feature-text">极速到账</text>
              </view>
              <view class="feature-item">
                <u-icon name="checkmark-circle" size="20" color="#646B67"></u-icon>
                <text class="feature-text">随时可缴</text>
              </view>
              <view class="feature-item">
                <u-icon name="checkmark-circle" size="20" color="#646B67"></u-icon>
                <text class="feature-text">到账通知</text>
              </view>
            </view>
          </view>
          <view class="header-right">
            <image src="https://pw3.yihaiguantao.com/static/picture/hand.png" mode="aspectFit" class="hand-icon"></image>
          </view>
        </view>
      </view>

      <!-- 缴费类型卡片 -->
      <view class="payment-cards">
        <view 
          class="payment-card" 
          v-for="(item, index) in paymentTypes" 
          :key="index"
          @click="goToPayment(item)"
        >
          <view class="card-icon">
            <image v-if="item.iconImage" :src="item.iconImage" mode="aspectFit" class="card-icon-img"></image>
            <u-icon v-else :name="item.icon" size="40" :color="item.iconColor"></u-icon>
          </view>
          <view class="card-content">
            <text class="card-title">{{ item.name }}</text>
            <view class="card-actions">
              <text class="action-link" @click.stop="viewDetails(item)">查看详情</text>
              <text class="action-rule" @click.stop="viewRules(item)">缴费规则</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Banner -->
      <view class="banner-section">
        <image src="https://pw3.yihaiguantao.com/static/picture/keji.png" mode="aspectFill" class="banner-img"></image>
        <!-- <view class="banner-content">
          <text class="banner-title">科技创享 遇见未来</text>
          <text class="banner-subtitle">TECHNOLOGY MEETS THE FUTURE</text>
        </view> -->
      </view>

      <!-- 新增缴费户号按钮 -->
      <view class="add-account-section">
        <button class="add-account-btn" @click="addAccount">
          <image src="/static/images/tianjia-fang-F 1.png" mode="aspectFit" class="add-icon"></image>
          <text class="btn-text">新增缴费户号</text>
        </button>
      </view>

      <!-- 功能卡片 -->
      <view class="function-cards">
        <view class="function-card" @click="goToAccountManagement">
          <view class="function-icon">
            <image src="/static/images/jiazhao 1.png" mode="aspectFit" class="function-icon-img"></image>
          </view>
          <text class="function-text">户号管理</text>
        </view>
        <view class="function-card" @click="goToPaymentRecords">
          <view class="function-icon">
            <image src="/static/images/dingdanchaxun 1.png" mode="aspectFit" class="function-icon-img"></image>
          </view>
          <text class="function-text">缴费记录</text>
        </view>
      </view>
    </scroll-view>

    <!-- 投诉/建议按钮 -->
    <!-- <view class="feedback-btn" @click="showFeedback">
      <u-icon name="shield" size="24" color="#FFFFFF"></u-icon>
    </view> -->
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
      paymentTypes: [
        {
          type: 'electricity',
          name: '电费',
          iconImage: '/static/images/dianfei.png',
          path: '/bundle_life_payment/pages/utility_payment/utility_payment?type=electricity'
        },
        {
          type: 'water',
          name: '水费',
          iconImage: '/static/images/shuifei.png',
          path: '/bundle_life_payment/pages/utility_payment/utility_payment?type=water'
        },
        {
          type: 'gas',
          name: '燃气费',
          iconImage: '/static/images/ranqi-2 1.png',
          path: '/bundle_life_payment/pages/utility_payment/utility_payment?type=gas'
        },
        {
          type: 'phone',
          name: '话费充值',
          iconImage: '/static/images/huafeichongzhi.png',
          path: '/bundle_life_payment/pages/phone_recharge/phone_recharge'
        }
      ]
    };
  },
  methods: {
    goToPayment(item) {
      if (item.type === 'phone') {
        uni.navigateTo({
          url: item.path
        });
      } else {
        uni.navigateTo({
          url: item.path
        });
      }
    },
    viewDetails(item) {
      uni.showToast({
        title: `查看${item.name}详情`,
        icon: 'none'
      });
    },
    viewRules(item) {
      uni.showToast({
        title: `查看${item.name}缴费规则`,
        icon: 'none'
      });
    },
    addAccount() {
      uni.navigateTo({
        url: '/bundle_life_payment/pages/account_management/account_management'
      });
    },
    goToAccountManagement() {
      uni.navigateTo({
        url: '/bundle_life_payment/pages/account_management/account_management'
      });
    },
    goToPaymentRecords() {
      uni.navigateTo({
        url: '/bundle_life_payment/pages/payment_records/payment_records'
      });
    },
    showFeedback() {
      uni.showToast({
        title: '投诉/建议',
        icon: 'none'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.life-payment-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #cbfac5 30%, #F5F5F5 45%);
  display: flex;
  flex-direction: column;
  padding-top: calc(130rpx + var(--status-bar-height));
}


.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.header-section {
  padding: 40rpx 30rpx 0rpx;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  flex: 1;
}

.header-right {
  width: 200rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hand-icon {
  width: 100%;
  height: 100%;
}

.main-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30rpx;
}

.features {
  display: flex;
  gap: 30rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  /deep/ .u-icon {
    font-size: 24rpx !important;
  }
  
  /deep/ .u-icon__icon {
    font-size: 24rpx !important;
    width: 24rpx !important;
    height: 24rpx !important;
  }
}

.feature-text {
  font-size: 26rpx;
  color: #666666;
}

.payment-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  padding: 0 30rpx 30rpx;
}

.payment-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20rpx;
}

.card-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-img {
  width: 60rpx;
  height: 60rpx;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 24rpx;
}

.action-link {
  color: #4CAF50;
}

.action-rule {
  color: #999999;
}

.banner-section {
  position: relative;
  margin: 0 30rpx 30rpx;
  border-radius: 16rpx;
  overflow: hidden;
  height: 200rpx;
}

.banner-img {
  width: 100%;
  height: 100%;
  display: block;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 30rpx;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 10rpx;
}

.banner-subtitle {
  font-size: 24rpx;
  color: #FFFFFF;
  opacity: 0.9;
}

.add-account-section {
  padding: 0 30rpx 30rpx;
}

.add-account-btn {
  width: 100%;
  height: 88rpx;
  background: #FFFFFF;
  border: 2rpx solid #4CAF50;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.add-icon {
  width: 40rpx;
  height: 40rpx;
}

.btn-text {
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: bold;
}

.function-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  padding: 0 30rpx 30rpx;
}

.function-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.function-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.function-icon-img {
  width: 64rpx;
  height: 64rpx;
}

.function-text {
  font-size: 28rpx;
  color: #333333;
}

.feedback-btn {
  position: fixed;
  right: 30rpx;
  bottom: 100rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
  z-index: 100;
}
</style>

