<template>
    <view class="service-user-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 头部区域（红色/橙色渐变） -->
        <view class="header-section">
            <view class="header-top">
                <text class="switch-merchant" @click="switchIdentity">切换身份></text>
                <view class="settings-icon" @click="goToSettings">
                    <u-icon name="setting" size="20" color="#FFFFFF"></u-icon>
                </view>
            </view>
            <view class="user-info-section">
                <image 
                    :src="userInfo.avatar || '/static/images/portrait_empty.png'" 
                    mode="aspectFill" 
                    class="user-avatar"
                    @click="goToProfile"
                ></image>
                <view class="user-details">
                    <text class="user-name">{{ userInfo.nickname || '点击登录' }}</text>
                    <text class="user-id" v-if="userInfo.username">用户名: {{ userInfo.username }}</text>
                </view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 我的订单 -->
            <view class="order-section">
                <view class="section-header">
                    <text class="section-title">我的订单</text>
                    <text class="view-all" @click="goToOrderList">查看全部订单</text>
                </view>
                <view class="order-items">
                    <view class="order-item" @click="goToOrderList('pending_pay')">
                        <view class="order-icon-wrapper">
                            <u-icon name="minus" size="32" color="#FF9800"></u-icon>
                            <view class="order-badge" v-if="orderCount.pending_pay > 0">{{ orderCount.pending_pay }}</view>
                        </view>
                        <text class="order-label">待付款</text>
                    </view>
                    <view class="order-item" @click="goToOrderList('pending_accept')">
                        <view class="order-icon-wrapper">
                            <u-icon name="heart" size="32" color="#FF9800"></u-icon>
                            <view class="order-badge" v-if="orderCount.pending_accept > 0">{{ orderCount.pending_accept }}</view>
                        </view>
                        <text class="order-label">待接单</text>
                    </view>
                    <view class="order-item" @click="goToOrderList('pending_service')">
                        <view class="order-icon-wrapper">
                            <u-icon name="calendar" size="32" color="#FF9800"></u-icon>
                            <view class="order-badge" v-if="orderCount.pending_service > 0">{{ orderCount.pending_service }}</view>
                        </view>
                        <text class="order-label">待服务</text>
                    </view>
                    <view class="order-item" @click="goToOrderList('completed')">
                        <view class="order-icon-wrapper">
                            <u-icon name="checkmark-circle" size="32" color="#FF9800"></u-icon>
                            <view class="order-badge" v-if="orderCount.completed > 0">{{ orderCount.completed }}</view>
                        </view>
                        <text class="order-label">已完成</text>
                    </view>
                </view>
            </view>

            <!-- 家政工具 -->
            <view class="tools-section">
                <text class="section-title">家政工具</text>
                <view class="tools-grid">
                    <view class="tool-item" @click="goToFavorites">
                        <u-icon name="star" size="40" color="#333333"></u-icon>
                        <text class="tool-label">收藏</text>
                    </view>
                    <view class="tool-item" @click="goToAddress">
                        <u-icon name="map" size="40" color="#333333"></u-icon>
                        <text class="tool-label">我的地址</text>
                    </view>
                    <view class="tool-item" @click="goToWallet">
                        <u-icon name="wallet" size="40" color="#333333"></u-icon>
                        <text class="tool-label">我的钱包</text>
                    </view>
                    <view class="tool-item" @click="goToHistory">
                        <u-icon name="list" size="40" color="#333333"></u-icon>
                        <text class="tool-label">足迹</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部导航栏 -->
        <view class="bottom-navbar">
            <view class="nav-item" @click="goToHome">
                <u-icon name="home" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">家政</text>
            </view>
            <view class="nav-item" @click="goToOrderList">
                <u-icon name="list" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">订单</text>
            </view>
            <view class="nav-item" @click="goToMessage">
                <u-icon name="chat" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">消息</text>
            </view>
            <view class="nav-item active">
                <u-icon name="account" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">我的</text>
            </view>
        </view>
    </view>
</template>

<script>
import { getUser } from '@/api/user'
import { mapGetters } from 'vuex'
import { getHomeServiceOrderList, checkHomeServiceMasterStatus } from '@/api/store'

export default {
    name: 'ServiceUser',
    data() {
        return {
            statusBarHeight: 0,
            userInfo: {
                nickname: '',
                username: '',
                avatar: ''
            },
            signinDays: 2,
            orderCount: {
                pending_pay: 0,
                pending_accept: 0,
                pending_service: 0,
                completed: 0
            },
            masterInfo: null // 师傅信息
        }
    },
    computed: {
        ...mapGetters(['isLogin'])
    },
    onLoad() {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        this.loadUserInfo();
        this.loadOrderCount();
        this.checkMasterStatus();
    },
    onShow() {
        // 页面显示时刷新用户信息和订单数量
        this.loadUserInfo();
        this.loadOrderCount();
        this.checkMasterStatus();
    },
    methods: {
        async loadUserInfo() {
            if (this.isLogin) {
                try {
                    const res = await getUser();
                    if (res.code === 1 && res.data) {
                        this.userInfo = {
                            nickname: res.data.nickname || '',
                            username: res.data.username || res.data.sn || '',
                            avatar: res.data.avatar || '/static/images/portrait_empty.png'
                        };
                    }
                } catch (error) {
                    console.error('加载用户信息失败:', error);
                }
            }
        },
        goToHome() {
            uni.switchTab({
                url: '/bundle_home_service/pages/home_service_index/home_service_index'
            });
        },
        goToOrderList(type = '') {
            let url = '/bundle_home_service/pages/service_order_list/service_order_list';
            if (type === 'pending_pay') {
                // 跳转到待付款
                uni.navigateTo({
                    url: url + '?status=0'
                });
            } else if (type === 'pending_service') {
                // 跳转到待服务
                uni.navigateTo({
                    url: url + '?status=1'
                });
            } else if (type === 'pending_accept') {
                // 跳转到待验收（已完成）
                uni.navigateTo({
                    url: url + '?status=3'
                });
            } else {
                uni.navigateTo({
                    url: url
                });
            }
        },
        goToRefund() {
            // 跳转到退款/售后页面
            uni.showToast({
                title: '功能开发中',
                icon: 'none'
            });
        },
        goToFavorites() {
            // 跳转到收藏页面
            uni.navigateTo({
                url: '/bundle/pages/user_collection/user_collection'
            });
        },
        goToAddress() {
            // 跳转到地址管理页面
            uni.navigateTo({
                url: '/bundle/pages/user_address/user_address'
            });
        },
        goToWallet() {
            // 跳转到钱包页面
            uni.navigateTo({
                url: '/bundle/pages/user_wallet/user_wallet'
            });
        },
        goToHistory() {
            // 跳转到足迹页面
            uni.showToast({
                title: '功能开发中',
                icon: 'none'
            });
        },
        goToProfile() {
            if (this.isLogin) {
                uni.navigateTo({
                    url: '/bundle/pages/user_profile/user_profile'
                });
            } else {
                uni.navigateTo({
                    url: '/pages/login/login'
                });
            }
        },
        goToSettings() {
            uni.navigateTo({
                url: '/bundle/pages/user_set/user_set'
            });
        },
        async loadOrderCount() {
            if (!this.isLogin) return;
            try {
                // 获取待付款订单数量（status=0且pay_status=0）
                const pendingPayRes = await getHomeServiceOrderList({
                    status: 0,
                    pay_status: 0,
                    page: 1,
                    limit: 1
                });
                if (pendingPayRes.code === 1 && pendingPayRes.data) {
                    this.orderCount.pending_pay = pendingPayRes.data.count || 0;
                }

                // 获取待接单订单数量（status=0且pay_status=1，即已支付但未接单）
                const pendingAcceptRes = await getHomeServiceOrderList({
                    status: 0,
                    pay_status: 1,
                    page: 1,
                    limit: 1
                });
                if (pendingAcceptRes.code === 1 && pendingAcceptRes.data) {
                    this.orderCount.pending_accept = pendingAcceptRes.data.count || 0;
                }

                // 获取待服务订单数量
                const pendingServiceRes = await getHomeServiceOrderList({
                    status: 1,
                    page: 1,
                    limit: 1
                });
                if (pendingServiceRes.code === 1 && pendingServiceRes.data) {
                    this.orderCount.pending_service = pendingServiceRes.data.count || 0;
                }

                // 获取已完成订单数量
                const completedRes = await getHomeServiceOrderList({
                    status: 3,
                    page: 1,
                    limit: 1
                });
                if (completedRes.code === 1 && completedRes.data) {
                    this.orderCount.completed = completedRes.data.count || 0;
                }
            } catch (error) {
                console.error('加载订单数量失败:', error);
            }
        },
        async checkMasterStatus() {
            if (!this.isLogin) return;
            try {
                const res = await checkHomeServiceMasterStatus();
                if (res.code === 1 && res.data) {
                    this.masterInfo = res.data;
                }
            } catch (error) {
                console.error('检查师傅状态失败:', error);
            }
        },
        switchIdentity() {
            // 检查是否已入驻师傅
            if (this.masterInfo && this.masterInfo.audit_status === 2) {
                // 已审核通过，切换到师傅端
                uni.showToast({
                    title: '切换到师傅端',
                    icon: 'success'
                });
                // TODO: 跳转到师傅端页面
            } else {
                // 未入驻或未审核通过，跳转到入驻页面
                // 使用redirectTo避免路由循环
                uni.redirectTo({
                    url: '/bundle_home_service/pages/master_apply/master_apply',
                    fail: (err) => {
                        console.error('跳转失败:', err);
                        uni.showToast({
                            title: '页面不存在',
                            icon: 'none'
                        });
                    }
                });
            }
        },
        goToMessage() {
            uni.showToast({
                title: '功能开发中',
                icon: 'none'
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-user-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.status-bar {
    width: 100%;
    background: linear-gradient(180deg, #FF3D00 0%, #FF6D00 50%, #FF9100 100%);
}

.header-section {
    background: linear-gradient(180deg, #FF3D00 0%, #FF6D00 50%, #FF9100 100%);
    padding: 20rpx 20rpx 40rpx 20rpx;
    padding-top: calc(20rpx + env(safe-area-inset-top));
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
}

.switch-merchant {
    font-size: 24rpx;
    color: #FFFFFF;
}

.settings-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-info-section {
    display: flex;
    align-items: center;
    gap: 30rpx;
}

.user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
}

.user-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.user-name {
    font-size: 44rpx;
    color: #FFFFFF;
    font-weight: bold;
}

.user-id {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
}

.content-scroll {
    flex: 1;
    width: 100%;
    padding: 20rpx 20rpx 200rpx 20rpx;
}

.order-section {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    margin-bottom: 20rpx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
}

.section-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
}

.view-all {
    font-size: 24rpx;
    color: #999999;
}

.order-items {
    display: flex;
    justify-content: space-around;
}

.order-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
}

.order-icon-wrapper {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.order-label {
    font-size: 24rpx;
    color: #333333;
}

.order-icon-wrapper {
    position: relative;
}

.order-badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    min-width: 32rpx;
    height: 32rpx;
    padding: 0 8rpx;
    background-color: #FF5722;
    color: #FFFFFF;
    font-size: 20rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.tools-section {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    margin-bottom: 20rpx;
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40rpx 20rpx;
    margin-top: 30rpx;
}

.tool-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
}

.tool-label {
    font-size: 24rpx;
    color: #333333;
}

.bottom-navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 120rpx;
    background: linear-gradient(180deg, #4CAF50 0%, #45A049 100%);
    border-radius: 30rpx 30rpx 0 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20rpx 0;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
}

.nav-item.active {
    position: relative;
    
    .nav-text {
        font-weight: bold;
    }
    
    &::before {
        content: '';
        position: absolute;
        top: -10rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 2rpx;
    }
}

.nav-text {
    color: #FFFFFF;
    font-size: 24rpx;
}
</style>

