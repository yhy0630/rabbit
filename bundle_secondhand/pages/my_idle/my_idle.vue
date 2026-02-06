<template>
  <view class="my-idle-page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header-navbar">
      <view class="navbar-title">我的</view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 用户信息区域 -->
      <view class="user-section">
        <view class="user-info">
          <image class="avatar" :src="userInfo.avatar || '/static/images/default_avatar.png'" mode="aspectFill"></image>
          <view class="user-details">
            <text class="nickname">{{ userInfo.nickname || '沈以诚' }}</text>
            <text class="welcome-text">Hi, 欢迎使用诚兔邦</text>
          </view>
        </view>
      </view>

      <!-- 我的交易 -->
      <view class="transaction-section">
        <view class="section-title">我的交易</view>
        <view class="transaction-list">
          <view class="transaction-item" @click="goToMyPublished">
            <view class="transaction-icon" style="background-color: #E8F5E9;">
              <u-icon name="file-text" size="24" color="#4CAF50"></u-icon>
            </view>
            <text class="transaction-text">我发布的 {{ stats.published_count || 2 }}</text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
          <view class="transaction-item" @click="goToMySold">
            <view class="transaction-icon" style="background-color: #FFF3E0;">
              <u-icon name="bag" size="24" color="#FF9800"></u-icon>
            </view>
            <text class="transaction-text">我卖出的 {{ stats.sold_count || 9 }}</text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
          <view class="transaction-item" @click="goToMyBought">
            <view class="transaction-icon" style="background-color: #E3F2FD;">
              <u-icon name="shopping-cart" size="24" color="#2196F3"></u-icon>
            </view>
            <text class="transaction-text">我买到的 {{ stats.bought_count || 242 }}</text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
        </view>
      </view>

      <!-- 常用工具 -->
      <view class="tools-section">
        <view class="section-title">常用工具</view>
        <view class="tools-list">
          <view class="tool-item" @click="goToMyAddress">
            <view class="tool-icon" style="background-color: #E8F5E9;">
              <u-icon name="map" size="24" color="#4CAF50"></u-icon>
            </view>
            <text class="tool-text">收货地址</text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
          <view class="tool-item" @click="goToCustomerService">
            <view class="tool-icon" style="background-color: #F3E5F5;">
              <u-icon name="chat" size="24" color="#9C27B0"></u-icon>
            </view>
            <text class="tool-text">联系客服</text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
          <view class="tool-item" @click="goToFeedback">
            <view class="tool-icon" style="background-color: #E1F5FE;">
              <u-icon name="edit-pen" size="24" color="#03A9F4"></u-icon>
            </view>
            <text class="tool-text">意见反馈</text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
          <view class="tool-item" @click="goToAbout">
            <view class="tool-icon" style="background-color: #FFF3E0;">
              <u-icon name="info-circle" size="24" color="#FF9800"></u-icon>
            </view>
            <text class="tool-text">关于我们</text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <view class="bottom-navbar">
      <view class="nav-item" @click="goToHome">
        <u-icon name="home" size="24" :color="currentNav === 'home' ? '#4CAF50' : '#999999'"></u-icon>
        <text class="nav-text" :class="{ active: currentNav === 'home' }">首页</text>
      </view>
      <view class="nav-item" @click="goToCategory">
        <u-icon name="grid" size="24" :color="currentNav === 'category' ? '#4CAF50' : '#999999'"></u-icon>
        <text class="nav-text" :class="{ active: currentNav === 'category' }">分类</text>
      </view>
      <view class="nav-item" @click="goToPublish">
        <view class="nav-publish-icon">
          <u-icon name="plus" size="32" color="#FFFFFF"></u-icon>
        </view>
        <text class="nav-text">发布</text>
      </view>
      <view class="nav-item" @click="goToMessage">
        <u-icon name="chat" size="24" :color="currentNav === 'message' ? '#4CAF50' : '#999999'"></u-icon>
        <text class="nav-text" :class="{ active: currentNav === 'message' }">消息</text>
      </view>
      <view class="nav-item" @click="goToMy">
        <u-icon name="account" size="24" :color="currentNav === 'my' ? '#4CAF50' : '#999999'"></u-icon>
        <text class="nav-text" :class="{ active: currentNav === 'my' }">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      currentNav: 'my',
      userInfo: {
        id: 12345,
        nickname: '沈以诚',
        avatar: ''
      },
      stats: {
        published_count: 2,
        sold_count: 9,
        bought_count: 242,
        favorite_count: 0
      }
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    this.loadUserInfo();
    this.loadStats();
  },
  onLoad() {
    this.loadUserInfo();
    this.loadStats();
  },
  onShow() {
    this.loadStats();
  },
  methods: {
    loadUserInfo() {
      // TODO: 从服务器加载用户信息
      // const userInfo = uni.getStorageSync('userInfo');
      // if (userInfo) {
      //   this.userInfo = userInfo;
      // }
    },
    loadStats() {
      // TODO: 从服务器加载统计数据
      // const res = await getMyStats();
      // if (res.code === 1) {
      //   this.stats = res.data;
      // }
    },
    goToSettings() {
      uni.showToast({
        title: '设置',
        icon: 'none'
      });
    },
    goToMyPublished() {
      uni.navigateTo({
        url: '/bundle_secondhand/pages/my_published_list/my_published_list'
      });
    },
    goToMySold() {
      uni.showToast({
        title: '已售出',
        icon: 'none'
      });
    },
    goToMyBought() {
      uni.showToast({
        title: '我买到的',
        icon: 'none'
      });
    },
    goToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    goToCategory() {
      uni.showToast({
        title: '分类',
        icon: 'none'
      });
    },
    goToPublish() {
      uni.navigateTo({
        url: '/bundle_secondhand/pages/publish_idle/publish_idle'
      });
    },
    goToMessage() {
      uni.showToast({
        title: '消息',
        icon: 'none'
      });
    },
    goToMy() {
      // 当前页面
    },
    goToMyAddress() {
      uni.navigateTo({
        url: '/bundle/pages/user_address/user_address'
      });
    },
    goToMyWallet() {
      uni.showToast({
        title: '我的钱包',
        icon: 'none'
      });
    },
    goToCustomerService() {
      uni.showToast({
        title: '客服中心',
        icon: 'none'
      });
    },
    goToAbout() {
      uni.showToast({
        title: '关于我们',
        icon: 'none'
      });
    },
    goToFeedback() {
      uni.showToast({
        title: '意见反馈',
        icon: 'none'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-idle-page {
  width: 100%;
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  padding-bottom: 120rpx;
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

.navbar-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  height: 88rpx;
  line-height: 88rpx;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.user-section {
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.welcome-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.transaction-section,
.tools-section {
  background: #FFFFFF;
  margin-bottom: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
}

.transaction-list,
.tools-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.transaction-item,
.tool-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.transaction-item:last-child,
.tool-item:last-child {
  border-bottom: none;
}

.transaction-icon,
.tool-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.transaction-text,
.tool-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #4CAF50 0%, #45A049 100%);
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  padding: 15rpx 0;
  padding-bottom: calc(15rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  position: relative;
}

.nav-publish-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -20rpx;
}

.nav-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
}

.nav-text.active {
  color: #FFFFFF;
  font-weight: bold;
}
</style>

