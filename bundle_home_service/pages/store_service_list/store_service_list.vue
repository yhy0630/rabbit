<template>
    <view class="store-service-list-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">{{ storeName || 'e家政' }}</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 服务列表 -->
            <view 
                class="service-item" 
                v-for="(item, index) in serviceList" 
                :key="index"
                @click="goToServiceInfo(item)"
            >
                <view class="service-image-wrapper">
                    <image :src="item.image" mode="aspectFill" class="service-image"></image>
                </view>
                <view class="service-info">
                    <view class="service-header">
                        <text class="service-name">{{ item.name }}</text>
                        <view class="service-tags">
                            <text class="service-tag" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{ tag }}</text>
                        </view>
                    </view>
                    <view class="service-details">
                        <text class="service-detail-text">{{ item.age }}岁 | {{ item.origin }} | {{ item.education }} | {{ item.experience }}</text>
                    </view>
                    <view class="service-type">
                        <text class="service-type-text">{{ item.serviceType }}</text>
                    </view>
                    <view class="service-footer">
                        <text class="service-price">¥{{ item.price }}元/月</text>
                        <text class="service-company">{{ item.company }}</text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    name: 'StoreServiceList',
    data() {
        return {
            statusBarHeight: 0,
            storeName: 'e家政',
            serviceList: [
                {
                    id: 1,
                    name: '杜阿姨',
                    age: 29,
                    origin: '北京人',
                    education: '本科',
                    experience: '3-5年',
                    serviceType: '保姆月嫂',
                    price: 4500,
                    company: 'e家政',
                    image: '/static/picture/service-avatar.png',
                    tags: ['育儿嫂', '保姆']
                },
                {
                    id: 2,
                    name: '李阿姨',
                    age: 35,
                    origin: '上海人',
                    education: '大专',
                    experience: '5-8年',
                    serviceType: '保姆月嫂',
                    price: 5000,
                    company: 'e家政',
                    image: '/static/picture/service-avatar.png',
                    tags: ['月嫂', '育儿嫂']
                },
                {
                    id: 3,
                    name: '王阿姨',
                    age: 32,
                    origin: '广州人',
                    education: '本科',
                    experience: '3-5年',
                    serviceType: '保姆月嫂',
                    price: 4800,
                    company: 'e家政',
                    image: '/static/picture/service-avatar.png',
                    tags: ['保姆', '育儿嫂']
                },
                {
                    id: 4,
                    name: '张阿姨',
                    age: 28,
                    origin: '深圳人',
                    education: '大专',
                    experience: '2-3年',
                    serviceType: '保姆月嫂',
                    price: 4200,
                    company: 'e家政',
                    image: '/static/picture/service-avatar.png',
                    tags: ['月嫂']
                },
                {
                    id: 5,
                    name: '刘阿姨',
                    age: 30,
                    origin: '杭州人',
                    education: '本科',
                    experience: '4-6年',
                    serviceType: '保姆月嫂',
                    price: 4600,
                    company: 'e家政',
                    image: '/static/picture/service-avatar.png',
                    tags: ['育儿嫂', '保姆']
                }
            ]
        }
    },
    onLoad(options) {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        if (options.storeName) {
            this.storeName = decodeURIComponent(options.storeName);
        }
        if (options.storeId) {
            this.loadStoreServices(options.storeId);
        }
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        loadStoreServices(storeId) {
            // 加载店铺服务列表
            console.log('加载店铺服务:', storeId);
        },
        goToServiceInfo(item) {
            uni.navigateTo({
                url: `/bundle_home_service/pages/service_info/service_info?id=${item.id}&name=${encodeURIComponent(item.name)}`
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.store-service-list-page {
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
    padding: 20rpx;
}

.service-item {
    display: flex;
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.service-image-wrapper {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
    margin-right: 20rpx;
}

.service-image {
    width: 100%;
    height: 100%;
}

.service-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.service-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10rpx;
    flex-wrap: wrap;
    gap: 12rpx;
}

.service-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.service-tags {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

.service-tag {
    background-color: #4CAF50;
    color: #FFFFFF;
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
}

.service-details {
    margin-bottom: 10rpx;
}

.service-detail-text {
    font-size: 24rpx;
    color: #999999;
}

.service-type {
    margin-bottom: 10rpx;
}

.service-type-text {
    font-size: 26rpx;
    color: #4CAF50;
}

.service-footer {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.service-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #FF5722;
}

.service-company {
    font-size: 24rpx;
    color: #999999;
}
</style>
