<template>
    <view class="service-category-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">全部服务</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 搜索框 -->
        <view class="search-bar">
            <view class="search-input-wrapper">
                <u-icon name="search" size="18" color="#999999" class="search-icon"></u-icon>
                <input 
                    class="search-input" 
                    type="text" 
                    placeholder="搜索您需要的服务" 
                    placeholder-style="color: #999999;"
                />
            </view>
        </view>

        <!-- 内容区域 -->
        <view class="content-wrapper">
            <!-- 左侧分类导航 -->
            <scroll-view class="category-nav" scroll-y>
                <view 
                    class="category-nav-item" 
                    v-for="(item, index) in categories" 
                    :key="index"
                    :class="{ active: currentCategoryIndex === index }"
                    @click="selectCategory(index)"
                >
                    <text class="category-nav-text">{{ item.name }}</text>
                </view>
            </scroll-view>

            <!-- 右侧服务列表 -->
            <scroll-view 
                class="service-list" 
                scroll-y 
                @scrolltolower="loadMore"
                :lower-threshold="100"
            >
                <view 
                    class="service-item" 
                    v-for="(item, index) in serviceList" 
                    :key="item.id || index"
                    :data-index="index"
                    :data-id="item.id"
                    @click.stop="goToDetail($event, index)"
                >
                    <view class="service-image-wrapper">
                        <image :src="item.image" mode="aspectFill" class="service-image"></image>
                    </view>
                    <view class="service-info">
                        <view class="service-header">
                            <text class="service-name">{{ item.name }}</text>
                            <text class="service-distance" v-if="item.distance">{{ item.distance }}</text>
                        </view>
                        <view class="service-details" v-if="item.age || item.origin || item.education || item.experience">
                            <text class="service-detail-text">
                                <text v-if="item.age">{{ item.age }}岁</text>
                                <text v-if="item.age && item.origin"> | </text>
                                <text v-if="item.origin">{{ item.origin }}</text>
                                <text v-if="item.origin && item.education"> | </text>
                                <text v-if="item.education">{{ item.education }}</text>
                                <text v-if="item.education && item.experience"> | </text>
                                <text v-if="item.experience">{{ item.experience }}</text>
                            </text>
                        </view>
                        <view class="service-type" v-if="item.serviceType">
                            <text class="service-type-text">{{ item.serviceType }}</text>
                        </view>
                        <view class="service-footer">
                            <text class="service-price" v-if="item.price">¥{{ item.price }}元/月</text>
                            <text class="service-company" v-if="item.company">{{ item.company }}</text>
                        </view>
                    </view>
                </view>
                <view class="loading-more" v-if="loading">
                    <text class="loading-text">加载中...</text>
                </view>
                <view class="no-more" v-if="!hasMore && serviceList.length > 0">
                    <text class="no-more-text">没有更多数据了</text>
                </view>
                <view class="empty-state" v-if="!loading && serviceList.length === 0">
                    <text class="empty-text">暂无服务数据</text>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
import { getAllHomeServiceCategoryList, getHomeServiceListByCategory } from '@/api/store'

export default {
    name: 'ServiceCategory',
    data() {
        return {
            statusBarHeight: 0,
            currentCategoryIndex: 0,
            categories: [],
            serviceList: [],
            loading: false,
            page: 1,
            limit: 20,
            hasMore: true
        }
    },
    onLoad(options) {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        // 加载分类数据
        this.loadCategories();
        
        if (options.category) {
            // 延迟查找，等待分类数据加载完成
            this.$nextTick(() => {
                const index = this.categories.findIndex(item => item.name === options.category);
                if (index !== -1) {
                    this.currentCategoryIndex = index;
                    const category = this.categories[index];
                    if (category && category.id) {
                        this.loadServiceList(category.id);
                    }
                }
            });
        } else if (this.categories.length > 0) {
            // 默认加载第一个分类的服务列表
            const category = this.categories[0];
            if (category && category.id) {
                this.loadServiceList(category.id);
            }
        }
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        async loadCategories() {
            try {
                const res = await getAllHomeServiceCategoryList();
                if (res.code === 1 && res.data && res.data.length > 0) {
                    this.categories = res.data;
                    // 默认加载第一个分类的服务列表
                    if (this.categories.length > 0) {
                        const category = this.categories[0];
                        if (category && category.id) {
                            this.loadServiceList(category.id);
                        }
                    }
                } else {
                    // 如果接口失败，使用默认数据
                    this.setDefaultCategories();
                    if (this.categories.length > 0) {
                        const category = this.categories[0];
                        if (category && category.id) {
                            this.loadServiceList(category.id);
                        }
                    }
                }
            } catch (error) {
                console.error('加载分类失败:', error);
                // 如果接口失败，使用默认数据
                this.setDefaultCategories();
            }
        },
        setDefaultCategories() {
            this.categories = [
                { id: 1, name: '保姆月嫂' },
                { id: 2, name: '保洁清洗' },
                { id: 3, name: '搬家货运' },
                { id: 4, name: '家电维修' },
                { id: 5, name: '开锁换锁' },
                { id: 6, name: '鲜花绿植' },
                { id: 7, name: '医护健康' },
                { id: 8, name: '美食餐饮' },
                { id: 9, name: '做饭阿姨' },
                { id: 10, name: '月嫂' },
                { id: 11, name: '陪诊' }
            ];
        },
        selectCategory(index) {
            this.currentCategoryIndex = index;
            // 加载对应分类的服务列表
            const category = this.categories[index];
            if (category && category.id) {
                this.page = 1;
                this.hasMore = true;
                this.serviceList = [];
                this.loadServiceList(category.id);
            }
        },
        async loadServiceList(categoryId) {
            if (this.loading || !this.hasMore) {
                return;
            }
            
            this.loading = true;
            try {
                const res = await getHomeServiceListByCategory({
                    category_id: categoryId || 0,
                    page: this.page,
                    limit: this.limit
                });
                
                if (res.code === 1 && res.data && res.data.lists) {
                    const newList = res.data.lists.map((item, idx) => {
                        // 确保 id 字段存在
                        const serviceId = item.id || item.service_id || 0;
                        if (!serviceId) {
                            console.warn('服务项缺少ID:', item, 'index:', idx);
                        }
                        return {
                            id: serviceId,
                            name: item.name || '服务名称',
                            distance: item.distance || '',
                            age: item.age || 0,
                            origin: item.origin || '',
                            education: item.education || '',
                            experience: item.experience || '',
                            serviceType: item.serviceType || item.category_name || '',
                            price: item.price || 0,
                            company: item.company_name || '',
                            image: item.avatar || '/static/picture/service-avatar.png'
                        };
                    });
                    
                    if (this.page === 1) {
                        this.serviceList = newList;
                    } else {
                        this.serviceList = [...this.serviceList, ...newList];
                    }
                    
                    // 判断是否还有更多数据
                    this.hasMore = newList.length >= this.limit;
                    if (this.hasMore) {
                        this.page++;
                    }
                } else {
                    this.hasMore = false;
                    if (this.page === 1) {
                        this.serviceList = [];
                    }
                }
            } catch (error) {
                console.error('加载服务列表失败:', error);
                this.hasMore = false;
            } finally {
                this.loading = false;
            }
        },
        loadMore() {
            // 加载更多
            if (this.categories.length > 0 && this.currentCategoryIndex >= 0) {
                const category = this.categories[this.currentCategoryIndex];
                if (category && category.id) {
                    this.loadServiceList(category.id);
                }
            }
        },
        goToDetail(event, index) {
            // 跳转到服务详情页面
            let item = null;
            let serviceId = null;
            
            // 优先从事件对象的 dataset 中获取
            if (event && event.currentTarget && event.currentTarget.dataset) {
                const dataset = event.currentTarget.dataset;
                serviceId = dataset.id;
                const itemIndex = dataset.index !== undefined ? dataset.index : index;
                if (itemIndex !== undefined && this.serviceList && this.serviceList[itemIndex]) {
                    item = this.serviceList[itemIndex];
                }
            }
            
            // 如果从 dataset 获取到了 id，直接使用
            if (serviceId && serviceId !== 'undefined' && serviceId !== 'null' && serviceId !== '') {
                uni.navigateTo({
                    url: `/bundle_home_service/pages/service_detail/service_detail?id=${serviceId}`
                });
                return;
            }
            
            // 否则从 item 对象中获取
            if (item && item.id !== undefined && item.id !== null && item.id !== '' && item.id !== 0) {
                uni.navigateTo({
                    url: `/bundle_home_service/pages/service_detail/service_detail?id=${item.id}`
                });
                return;
            }
            
            // 如果都没有，尝试通过 index 获取
            if (index !== undefined && this.serviceList && this.serviceList[index]) {
                item = this.serviceList[index];
                if (item && item.id !== undefined && item.id !== null && item.id !== '' && item.id !== 0) {
                    uni.navigateTo({
                        url: `/bundle_home_service/pages/service_detail/service_detail?id=${item.id}`
                    });
                    return;
                }
            }
            
            // 所有方式都失败，显示错误
            console.error('服务信息不完整:', {
                event: event,
                index: index,
                serviceId: serviceId,
                item: item,
                serviceListLength: this.serviceList ? this.serviceList.length : 0
            });
            uni.showToast({
                title: '服务信息不完整，请稍后再试',
                icon: 'none',
                duration: 2000
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-category-page {
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

.search-bar {
    padding: 20rpx 30rpx;
    background-color: #F5F5F5;
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
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

.content-wrapper {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.category-nav {
    width: 200rpx;
    background-color: #FFFFFF;
    border-right: 1rpx solid #E0E0E0;
}

.category-nav-item {
    padding: 30rpx 20rpx;
    border-left: 4rpx solid transparent;
    transition: all 0.3s;
    
    &.active {
        background-color: #F5F5F5;
        border-left-color: #4CAF50;
        
        .category-nav-text {
            color: #4CAF50;
            font-weight: bold;
        }
    }
}

.category-nav-text {
    font-size: 28rpx;
    color: #333333;
}

.service-list {
    flex: 1;
    background-color: #F5F5F5;
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
}

.service-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.service-distance {
    font-size: 24rpx;
    color: #4CAF50;
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

.loading-more, .no-more, .empty-state {
    padding: 40rpx 0;
    text-align: center;
}

.loading-text, .no-more-text, .empty-text {
    font-size: 28rpx;
    color: #999999;
}
</style>
