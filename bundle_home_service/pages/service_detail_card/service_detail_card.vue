<template>
    <view class="service-detail-card-page">
        <!-- 自定义导航栏 -->
        <custom-navbar :title="serviceInfo.name || '详情'"></custom-navbar>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 服务卡片区域 -->
            <view class="service-card-section">
                <view class="service-image-wrapper">
                    <swiper 
                        class="service-swiper" 
                        :indicator-dots="imageList.length > 1"
                        :autoplay="false"
                        :circular="true"
                        indicator-color="rgba(255, 255, 255, 0.5)"
                        indicator-active-color="#FFFFFF"
                        @change="onSwiperChange"
                    >
                        <swiper-item v-for="(img, index) in imageList" :key="index">
                            <image :src="img" mode="aspectFill" class="service-main-image"></image>
                        </swiper-item>
                    </swiper>
                    <view class="image-indicator" v-if="imageList.length > 1">
                        <text class="indicator-text">{{ currentImageIndex + 1 }}/{{ imageList.length }}</text>
                    </view>
                </view>
                
                <!-- 服务标签 -->
                <view class="service-tags-wrapper" v-if="serviceTags.length > 0">
                    <view 
                        class="service-tag-item" 
                        v-for="(tag, index) in serviceTags" 
                        :key="index"
                    >
                        {{ tag }}
                    </view>
                </view>
            </view>

            <!-- 价格和销售信息 -->
            <view class="price-info-section">
                <view class="price-row">
                    <text class="service-title">{{ serviceInfo.name || '服务名称' }}</text>
                </view>
                <view class="price-row">
                    <text class="service-price">¥ {{ formatPrice(serviceInfo.price) }}</text>
                    <text class="sales-count" v-if="serviceInfo.sales_count">已售{{ serviceInfo.sales_count }}</text>
                </view>
            </view>

            <!-- 图文介绍 -->
            <view class="section-card" v-if="serviceDescription || serviceContent">
                <view class="section-title">图文介绍</view>
                <view class="section-content">
                    <text class="content-text" v-if="serviceDescription">{{ serviceDescription }}</text>
                    <view class="content-html" v-if="serviceContent" v-html="serviceContent"></view>
                </view>
            </view>

            <!-- 关联店铺 -->
            <view class="section-card" v-if="storeInfo.name">
                <view class="section-title">{{ storeInfo.name }}</view>
                <view class="store-card">
                    <image :src="storeInfo.image" mode="aspectFill" class="store-image"></image>
                    <view class="store-info">
                        <text class="store-address">{{ storeInfo.address || '西百花巷16号3D打印别墅' }}</text>
                        <view class="store-tags" v-if="storeInfo.tags && storeInfo.tags.length > 0">
                            <text class="store-tag" v-for="(tag, index) in storeInfo.tags" :key="index">{{ tag }}</text>
                        </view>
                    </view>
                </view>
                <view class="store-btn" @click="goToStore">
                    <text class="store-btn-text">进店看看</text>
                </view>
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="bottom-action-bar">
            <view class="action-left">
                <view class="action-icon-item" @click="toggleFavorite">
                    <image src="/static/images/shoucang.png" class="action-icon" mode="aspectFit"></image>
                    <text class="action-icon-text">收藏</text>
                </view>
                <view class="action-icon-item" @click="goToStore">
                    <image src="/static/images/dianpu 1.png" class="action-icon" mode="aspectFit"></image>
                    <text class="action-icon-text">店铺</text>
                </view>
            </view>
            <view class="action-right">
                <view class="action-btn consult-btn" @click="consult">
                    <text class="action-btn-text">在线咨询</text>
                </view>
                <view class="action-btn order-btn" @click="placeOrder">
                    <text class="action-btn-text">立即下单</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getHomeServiceDetail } from '@/api/store'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'ServiceDetailCard',
    components: {
        CustomNavbar
    },
    data() {
        return {
            isFavorite: false,
            loading: true,
            currentImageIndex: 0,
            serviceInfo: {
                id: 0,
                name: '',
                price: 0,
                sales_count: 0
            },
            imageList: [],
            serviceTags: [],
            storeInfo: {
                name: '',
                image: '/static/picture/pi.png',
                address: '西百花巷16号3D打印别墅',
                tags: []
            },
            serviceDescription: '',
            serviceContent: ''
        }
    },
    onLoad(options) {
        if (options.id) {
            this.loadServiceDetail(options.id);
        }
    },
    methods: {
        formatPrice(value) {
            const n = Number(value);
            if (Number.isFinite(n)) {
                return n.toFixed(2);
            }
            return '0.00';
        },
        onSwiperChange(e) {
            this.currentImageIndex = e.detail.current;
        },
        async loadServiceDetail(id) {
            uni.showLoading({ title: '加载中...' });
            try {
                const res = await getHomeServiceDetail({ id: id });
                if (res.code === 1 && res.data) {
                    const data = res.data;
                    
                    // 处理服务基本信息
                    this.serviceInfo = {
                        id: data.id,
                        name: data.name || '服务名称',
                        price: data.price || 0,
                        sales_count: data.sales_count || data.sold_count || 0
                    };
                    
                    // 处理图片列表
                    this.imageList = [];
                    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                        this.imageList = data.images;
                    } else if (data.image) {
                        this.imageList = [data.image];
                    } else if (data.avatar) {
                        this.imageList = [data.avatar];
                    } else {
                        this.imageList = ['/static/picture/service-avatar.png'];
                    }
                    
                    // 处理服务标签
                    this.serviceTags = [];
                    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
                        this.serviceTags = data.tags;
                    } else if (data.service_tags && Array.isArray(data.service_tags)) {
                        this.serviceTags = data.service_tags;
                    } else if (data.category_name) {
                        // 如果没有标签，使用分类名称
                        this.serviceTags = [data.category_name];
                    }
                    
                    // 更新店铺信息
                    if (data.company_name) {
                        this.storeInfo.name = data.company_name;
                    } else {
                        this.storeInfo.name = 'e家政';
                    }
                    
                    if (data.company_image || data.company_avatar) {
                        this.storeInfo.image = data.company_image || data.company_avatar || '/static/picture/pi.png';
                    }
                    
                    // 处理服务描述
                    if (data.description) {
                        this.serviceDescription = data.description;
                    }
                    
                    // 处理服务内容（优先使用 service_description，其次使用 content）
                    if (data.service_description) {
                        this.serviceContent = data.service_description;
                    } else if (data.content) {
                        this.serviceContent = data.content;
                    }
                } else {
                    uni.showToast({ 
                        title: res.msg || '获取服务详情失败', 
                        icon: 'none' 
                    });
                }
                uni.hideLoading();
            } catch (e) {
                uni.hideLoading();
                uni.showToast({ title: '加载失败', icon: 'error' });
            }
        },
        toggleFavorite() {
            this.isFavorite = !this.isFavorite;
        },
        goToStore() {
            // 跳转到店铺服务列表页面
            uni.navigateTo({
                url: `/bundle_home_service/pages/store_service_list/store_service_list?storeName=${encodeURIComponent(this.storeInfo.name)}&storeId=1`
            });
        },
        consult() {
            // 在线咨询
            console.log('在线咨询');
        },
        placeOrder() {
            // 立即下单，跳转到确认订单页面
            uni.navigateTo({
                url: `/bundle_home_service/pages/service_confirm_order/service_confirm_order?service_id=${this.serviceInfo.id}`
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-detail-card-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: calc(130rpx + var(--status-bar-height));}

.content-scroll {
    flex: 1;
    padding-bottom: 320rpx;
    box-sizing: border-box;
}

// 服务卡片区域
.service-card-section {
    position: relative;
    width: 100%;
    margin-bottom: 20rpx;
}

.service-image-wrapper {
    position: relative;
    width: 100%;
    height: 500rpx;
    overflow: hidden;
}

.service-swiper {
    width: 100%;
    height: 100%;
}

.service-main-image {
    width: 100%;
    height: 100%;
}

.image-indicator {
    position: absolute;
    bottom: 20rpx;
    right: 20rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20rpx;
    padding: 8rpx 16rpx;
}

.indicator-text {
    font-size: 24rpx;
    color: #FFFFFF;
}

// 服务标签
.service-tags-wrapper {
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    right: 20rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    z-index: 10;
}

.service-tag-item {
    background-color: rgba(33, 150, 243, 0.9);
    color: #FFFFFF;
    font-size: 24rpx;
    padding: 8rpx 20rpx;
    border-radius: 8rpx;
    white-space: nowrap;
}

// 价格和销售信息
.price-info-section {
    background-color: #FFFFFF;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
    
    &:last-child {
        margin-bottom: 0;
    }
}

.service-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
}

.service-price {
    font-size: 48rpx;
    font-weight: bold;
    color: #FF5722;
}

.sales-count {
    font-size: 28rpx;
    color: #999999;
}

// 通用卡片样式
.section-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin: 0 20rpx 20rpx;
    box-sizing: border-box;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30rpx;
}

.section-content {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.8;
    word-wrap: break-word;
}

.content-text {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.8;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.content-html {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.8;
    word-wrap: break-word;
}

// 店铺信息
.store-card {
    display: flex;
    gap: 20rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin-right: -10rpx;
}

.store-image { 
    width: 200rpx;
    height: 150rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
}

.store-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.store-address {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 8rpx;
}

.store-tags {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
    margin-bottom: 8rpx;
}

.store-tag {
    background-color: #F0FFF8;
    border: 1rpx solid #1B8902;
    color: #1B8902;
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
}

.store-btn {
    background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
    border-radius: 40rpx;
    padding: 25rpx 0;
    text-align: center;
    margin-top: 20rpx;
    width: 100%;
    box-sizing: border-box;
}

.store-btn-text {
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
}

// 底部操作栏
.bottom-action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1rpx solid #E0E0E0;
    z-index: 100;
    box-sizing: border-box;
}

.action-left {
    display: flex;
    gap: 40rpx;
}

.action-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
}

.action-icon {
    width: 48rpx;
    height: 48rpx;
}

.action-icon-text {
    font-size: 22rpx;
    color: #666666;
}

.action-right {
    display: flex;
    gap: 20rpx;
    padding-right: 10rpx;
}

.action-btn {
    padding: 20rpx 60rpx;
    border-radius: 40rpx;
    min-width: 220rpx;
    text-align: center;
}

.consult-btn {
    border: 2rpx solid #149906;
    background-color: transparent;
}

.order-btn {
    background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
}

.action-btn-text {
    font-size: 28rpx;
    font-weight: bold;
}

.consult-btn .action-btn-text {
    color: #159907;
}

.order-btn .action-btn-text {
    color: #FFFFFF;
}
</style>

