<template>
  <view class="life-payment-page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header-navbar">
      <view class="navbar-content">
        <view class="back-btn" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
        </view>
        <view class="navbar-title">生活缴费</view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 标题和特性 -->
      <view class="header-section">
        <view class="main-title">生活缴费</view>
        <view class="features">
          <view class="feature-item">
            <u-icon name="checkmark" size="16" color="#4CAF50"></u-icon>
            <text class="feature-text">极速到账</text>
          </view>
          <view class="feature-item">
            <u-icon name="checkmark" size="16" color="#4CAF50"></u-icon>
            <text class="feature-text">随时可缴</text>
          </view>
          <view class="feature-item">
            <u-icon name="checkmark" size="16" color="#4CAF50"></u-icon>
            <text class="feature-text">到账通知</text>
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
          <view class="card-icon" :style="{ backgroundColor: item.iconBg }">
            <u-icon :name="item.icon" size="40" :color="item.iconColor"></u-icon>
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
        <image src="/static/images/life_payment_banner.jpg" mode="aspectFill" class="banner-img"></image>
        <view class="banner-content">
          <text class="banner-title">科技创享 遇见未来</text>
          <text class="banner-subtitle">TECHNOLOGY MEETS THE FUTURE</text>
        </view>
      </view>

      <!-- 新增缴费户号按钮 -->
      <view class="add-account-section">
        <button class="add-account-btn" @click="addAccount">
          <u-icon name="plus" size="20" color="#4CAF50"></u-icon>
          <text class="btn-text">新增缴费户号</text>
        </button>
      </view>

      <!-- 功能卡片 -->
      <view class="function-cards">
        <view class="function-card" @click="goToAccountManagement">
          <view class="function-icon">
            <u-icon name="account" size="32" color="#4CAF50"></u-icon>
          </view>
          <text class="function-text">户号管理</text>
        </view>
        <view class="function-card" @click="goToPaymentRecords">
          <view class="function-icon">
            <u-icon name="list" size="32" color="#4CAF50"></u-icon>
          </view>
          <text class="function-text">缴费记录</text>
        </view>
      </view>
    </scroll-view>

    <!-- 投诉/建议按钮 -->
    <view class="feedback-btn" @click="showFeedback">
      <u-icon name="shield" size="24" color="#FFFFFF"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      paymentTypes: [
        {
          type: 'electricity',
          name: '电费',
          icon: 'bolt',
          iconColor: '#FFC107',
          iconBg: '#FFF9E6',
          path: '/bundle_life_payment/pages/utility_payment/utility_payment?type=electricity'
        },
        {
          type: 'water',
          name: '水费',
          icon: 'info-circle',
          iconColor: '#2196F3',
          iconBg: '#E3F2FD',
          path: '/bundle_life_payment/pages/utility_payment/utility_payment?type=water'
        },
        {
          type: 'gas',
          name: '燃气费',
          icon: 'star',
          iconColor: '#F44336',
          iconBg: '#FFEBEE',
          path: '/bundle_life_payment/pages/utility_payment/utility_payment?type=gas'
        },
        {
          type: 'phone',
          name: '话费充值',
          icon: 'phone',
          iconColor: '#4CAF50',
          iconBg: '#E8F5E9',
          path: '/bundle_life_payment/pages/phone_recharge/phone_recharge'
        }
      ]
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
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
  background: linear-gradient(180deg, #E8F5E9 0%, #F5F5F5 100%);
  display: flex;
  flex-direction: column;
}

.status-bar {
  width: 100%;
  background-color: #4CAF50;
}

.header-navbar {
  width: 100%;
  background: linear-gradient(180deg, #4CAF50 0%, #45A049 100%);
  padding: 10rpx 0;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 88rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.navbar-right {
  width: 60rpx;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.header-section {
  padding: 40rpx 30rpx 30rpx;
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
  flex-direction: column;
  align-items: center;
}

.card-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
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

