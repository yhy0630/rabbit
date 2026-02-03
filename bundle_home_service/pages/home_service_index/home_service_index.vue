<template>
    <view class="home-service-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">家政服务</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 促销横幅 -->
            <view class="promo-banner">
                <view class="banner-location">
                    <view class="location-tag" @click="goToCity">
                        <text class="location-text">{{ cityInfo.name || '河北' }}</text>
                        <u-icon name="arrow-down" size="12" color="#FFFFFF"></u-icon>
                    </view>
                </view>
                <view class="banner-content">
                    <view class="banner-title">
                        <text class="title-text">大扫除</text>
                        <view class="title-number">7</view>
                    </view>
                    <view class="banner-subtitle">
                        <view class="gift-badge">
                            <text class="gift-text">预定就送</text>
                        </view>
                        <text class="subtitle-text">年末狂抢价</text>
                    </view>
                    <view class="banner-footer">
                        <text class="footer-text">免费送任意一台家电清洗!</text>
                    </view>
                    <view class="banner-icon">
                        <image src="/static/picture/cleaning-icon.png" mode="aspectFit" class="icon-img"></image>
                    </view>
                </view>
                <view class="ad-label">广告</view>
            </view>

            <!-- 搜索框 -->
            <view class="search-bar">
                <view class="search-input-wrapper">
                    <u-icon name="search" size="18" color="#999999" class="search-icon"></u-icon>
                    <input 
                        class="search-input" 
                        type="text" 
                        placeholder="输入搜索关键词" 
                        placeholder-style="color: #999999;"
                    />
                    <view class="search-btn">搜索</view>
                </view>
            </view>

            <!-- 服务分类 -->
            <view class="service-categories">
                <view 
                    class="category-item" 
                    v-for="(item, index) in categories" 
                    :key="index"
                    @click="goToCategory(item)"
                >
                    <view class="category-icon" :style="{ backgroundColor: item.color }">
                        <u-icon :name="item.icon" size="40" color="#FFFFFF"></u-icon>
                    </view>
                    <text class="category-name">{{ item.name }}</text>
                </view>
            </view>

            <!-- 最新入驻 -->
            <view class="latest-entry">
                <view class="entry-badge">最新入驻</view>
                <view class="entry-content">
                    <text class="entry-text">03/12 欢迎</text>
                    <text class="entry-phone">152****3231</text>
                    <text class="entry-text">的店铺成功入驻</text>
                </view>
                <view class="entry-right">
                    <view class="shield-icon">
                        <u-icon name="checkmark-circle" size="24" color="#4CAF50"></u-icon>
                    </view>
                    <text class="complaint-text">投诉/建议</text>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-buttons">
                <view class="action-btn publish-btn" @click="publishService">
                    <text class="btn-text">发布服务</text>
                </view>
                <view class="action-btn merchant-btn" @click="joinMerchant">
                    <text class="btn-text">入驻商家</text>
                </view>
            </view>

            <!-- 广告位 -->
            <view class="ad-slots">
                <view class="ad-slot">
                    <text class="ad-slot-text">广告位</text>
                </view>
                <view class="ad-slot">
                    <text class="ad-slot-text">广告位</text>
                    <view class="ad-plus">+</view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部导航栏 -->
        <view class="bottom-navbar">
            <view class="nav-item active">
                <u-icon name="home" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">首页</text>
            </view>
            <view class="nav-item">
                <u-icon name="plus" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">发布</text>
            </view>
            <view class="nav-item">
                <u-icon name="chat" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">消息</text>
            </view>
            <view class="nav-item">
                <u-icon name="account" size="24" color="#FFFFFF"></u-icon>
                <text class="nav-text">我的</text>
            </view>
        </view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHomeServiceCategoryList } from '@/api/store'

export default {
    name: 'HomeServiceIndex',
    data() {
        return {
            statusBarHeight: 0,
            categories: []
        }
    },
    onLoad() {
        // 获取状态栏高度
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        // 加载分类数据
        this.loadCategories();
    },
    computed: {
        ...mapGetters(['cityInfo'])
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        goToCity() {
            uni.navigateTo({
                url: '/bundle_b/pages/city/city'
            });
        },
        async loadCategories() {
            try {
                const res = await getHomeServiceCategoryList();
                if (res.code === 1 && res.data) {
                    // 只显示前9个分类，第10个显示"更多服务"
                    const categoryList = res.data.slice(0, 9);
                    categoryList.push({ 
                        id: 0, 
                        name: '更多服务', 
                        icon: 'grid', 
                        color: '#FFA726' 
                    });
                    this.categories = categoryList;
                } else {
                    // 如果接口失败，使用默认数据
                    this.setDefaultCategories();
                }
            } catch (error) {
                console.error('加载分类失败:', error);
                // 如果接口失败，使用默认数据
                this.setDefaultCategories();
            }
        },
        setDefaultCategories() {
            this.categories = [
                { id: 1, name: '保姆月嫂', icon: 'account', color: '#FF6B9D' },
                { id: 2, name: '保洁清洗', icon: 'setting', color: '#4ECDC4' },
                { id: 3, name: '搬家货运', icon: 'car', color: '#FFA726' },
                { id: 4, name: '家电维修', icon: 'setting', color: '#AB47BC' },
                { id: 5, name: '开锁换锁', icon: 'lock', color: '#42A5F5' },
                { id: 6, name: '鲜花绿植', icon: 'heart', color: '#66BB6A' },
                { id: 7, name: '医护健康', icon: 'heart', color: '#AB47BC' },
                { id: 8, name: '美食餐饮', icon: 'star', color: '#FFCA28' },
                { id: 9, name: '做饭阿姨', icon: 'star', color: '#EF5350' },
                { id: 0, name: '更多服务', icon: 'grid', color: '#FFA726' }
            ];
        },
        goToCategory(item) {
            // 如果是"更多服务"，跳转到全部服务页面
            if (item.name === '更多服务' || item.id === 0) {
                uni.navigateTo({
                    url: '/bundle_home_service/pages/service_category/service_category'
                });
                return;
            }
            // 其他分类跳转到列表页面
            uni.navigateTo({
                url: `/bundle_home_service/pages/service_list/service_list?category=${encodeURIComponent(item.name)}&categoryId=${item.id}`
            });
        },
        publishService() {
            // 跳转到发布服务页面
            console.log('发布服务');
        },
        joinMerchant() {
            // 跳转到入驻商家页面
            console.log('入驻商家');
        }
    }
}
</script>

<style lang="scss" scoped>
.home-service-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    color: #FFFFFF;
    font-size: 36rpx;
    font-weight: bold;
}

.navbar-right {
    width: 60rpx;
}

.content-scroll {
    flex: 1;
    width: 100%;
    padding-bottom: 140rpx;
}

/* 促销横幅 */
.promo-banner {
    width: 100%;
    height: 420rpx;
    background: linear-gradient(135deg, #FF3D00 0%, #FF6D00 50%, #FF9100 100%);
    position: relative;
    margin-bottom: 20rpx;
    border-radius: 0 0 20rpx 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(255, 87, 34, 0.3);
}

.banner-location {
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    z-index: 10;
}

.location-tag {
    background-color: rgba(255, 0, 0, 0.8);
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    cursor: pointer;
}

.location-text {
    color: #FFFFFF;
    font-size: 24rpx;
}

.banner-content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 60rpx 30rpx 30rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.banner-title {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.title-text {
    color: #FFFFFF;
    font-size: 80rpx;
    font-weight: bold;
    text-shadow: 2rpx 2rpx 8rpx rgba(0, 0, 0, 0.2);
    letter-spacing: 4rpx;
}

.title-number {
    width: 80rpx;
    height: 80rpx;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 48rpx;
    font-weight: bold;
}

.banner-subtitle {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-top: 20rpx;
}

.gift-badge {
    background-color: #FFEB3B;
    padding: 10rpx 20rpx;
    border-radius: 30rpx;
    box-shadow: 0 2rpx 8rpx rgba(255, 235, 59, 0.5);
}

.gift-text {
    color: #FF5722;
    font-size: 24rpx;
    font-weight: bold;
}

.subtitle-text {
    color: #FFFFFF;
    font-size: 52rpx;
    font-weight: bold;
    text-shadow: 1rpx 1rpx 4rpx rgba(0, 0, 0, 0.2);
}

.banner-footer {
    margin-top: 20rpx;
}

.footer-text {
    background-color: #FFEB3B;
    color: #FF5722;
    padding: 14rpx 28rpx;
    border-radius: 40rpx;
    font-size: 26rpx;
    font-weight: bold;
    display: inline-block;
    box-shadow: 0 2rpx 8rpx rgba(255, 87, 34, 0.3);
}

.banner-icon {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    width: 140rpx;
    height: 140rpx;
    opacity: 0.9;
}

.icon-img {
    width: 100%;
    height: 100%;
}

.ad-label {
    position: absolute;
    bottom: 10rpx;
    right: 10rpx;
    background-color: rgba(0, 0, 0, 0.3);
    color: #FFFFFF;
    font-size: 20rpx;
    padding: 4rpx 12rpx;
    border-radius: 4rpx;
}

/* 搜索框 */
.search-bar {
    padding: 20rpx 30rpx;
    background-color: #FFFFFF;
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    gap: 20rpx;
}

.search-icon {
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
}

.search-btn {
    background-color: #E0E0E0;
    color: #666666;
    padding: 12rpx 24rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
    flex-shrink: 0;
}

/* 服务分类 */
.service-categories {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 30rpx 20rpx;
    padding: 40rpx 30rpx;
    background-color: #FFFFFF;
    margin-bottom: 20rpx;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
}

.category-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.category-name {
    font-size: 24rpx;
    color: #333333;
    text-align: center;
    line-height: 1.2;
}

/* 最新入驻 */
.latest-entry {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #FFFFFF;
    margin-bottom: 20rpx;
    gap: 20rpx;
}

.entry-badge {
    background-color: #FF5722;
    color: #FFFFFF;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    flex-shrink: 0;
}

.entry-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.entry-text {
    font-size: 26rpx;
    color: #333333;
}

.entry-phone {
    font-size: 26rpx;
    color: #FF9800;
    font-weight: bold;
}

.entry-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    flex-shrink: 0;
}

.shield-icon {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.complaint-text {
    font-size: 20rpx;
    color: #999999;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 20rpx;
    padding: 0 30rpx 30rpx;
}

.action-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.publish-btn {
    background: linear-gradient(135deg, #FF9800 0%, #FF6F00 100%);
}

.merchant-btn {
    background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
}

.btn-text {
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
}

/* 广告位 */
.ad-slots {
    display: flex;
    gap: 20rpx;
    padding: 0 30rpx 30rpx;
}

.ad-slot {
    flex: 1;
    height: 200rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.ad-slot-text {
    color: #FFFFFF;
    font-size: 28rpx;
}

.ad-plus {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
}

/* 底部导航栏 */
.bottom-navbar {
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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.bottom-navbar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2rpx;
    background: rgba(255, 255, 255, 0.2);
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
