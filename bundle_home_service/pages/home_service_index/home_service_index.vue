<template>
    <view class="home-service-page">
        <custom-navbar title="家政服务"></custom-navbar>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 顶部横幅：固定背景图 -->
            <view class="promo-banner">
                <image
                    src="/static/picture/beijing.png"
                    mode="aspectFill"
                    class="promo-banner-image"
                ></image>
            </view>

            <!-- 搜索框 -->
            <view class="search-bar">
                <view class="search-input-wrapper">
                    <u-icon name="search" size="22" color="#CCCCCC" class="search-icon"></u-icon>
                    <input 
                        class="search-input" 
                        type="text" 
                        placeholder="输入搜索关键词" 
                        placeholder-style="color: #CCCCCC;"
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
                    <view class="category-icon">
                        <image
                            :src="getCategoryIcon(item)"
                            class="category-icon-img"
                            mode="aspectFit"
                        ></image>
                    </view>
                    <text class="category-name">{{ item.name }}</text>
                </view>
            </view>

            <!-- 最新入驻 -->
            <view class="latest-entry">
                <image
                    src="/static/picture/new.png"
                    mode="aspectFit"
                    class="entry-badge-image"
                ></image>
                <view class="entry-content">
                    <text class="entry-text">03/12 欢迎</text>
                    <text class="entry-phone">152****3231</text>
                    <text class="entry-text">的店铺成功入驻</text>
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
                </view>
            </view>
        </scroll-view>

        <!-- 底部导航栏：复用全局 custom-tabbar -->
        <custom-tabbar
            :current="0"
            :tabs="tabbarTabs"
        ></custom-tabbar>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHomeServiceCategoryList } from '@/api/store'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
    name: 'HomeServiceIndex',
    components: {
        CustomNavbar,
        CustomTabbar
    },
    data() {
        return {
            categories: [],
            // 家政模块底部导航栏按钮配置：首页 / 消息 / 我的
            // 图标与文字统一在 components/custom-tabbar/custom-tabbar.vue 中维护
            tabbarTabs: [
                {
                    id: 'home',
                    path: '/bundle_home_service/pages/home_service_index/home_service_index'
                },
                {
                    id: 'message',
                    // 暂无跳转页面，留空则点击不跳转（仅高亮）
                    path: ''
                },
                {
                    id: 'user',
                    path: '/bundle_home_service/pages/service_user/service_user'
                }
            ]
        }
    },
    onLoad() {
        // 加载分类数据
        this.loadCategories();
    },
    computed: {
        ...mapGetters(['cityInfo'])
    },
    methods: {
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
        // 根据分类名称返回对应的图标图片
        getCategoryIcon(item) {
            const name = item.name || '';
            if (name === '保姆月嫂') return '/static/picture/baomu.png';
            if (name === '保洁清洗') return '/static/picture/baojie.png';
            if (name === '搬家货运') return '/static/picture/banjia.png';
            if (name === '家电维修') return '/static/picture/jiadian.png';
            if (name === '开锁换锁') return '/static/picture/kaisuo.png';
            if (name === '鲜花绿植') return '/static/picture/xianhua.png';
            if (name === '医护健康') return '/static/picture/yihu.png';
            if (name === '美食餐饮') return '/static/picture/meishi.png';
            if (name === '做饭阿姨') return '/static/picture/zuofan.png';
            if (name === '更多服务' || item.id === 0) return '/static/picture/fuwu.png';
            // 其他未指定的分类统一使用“更多服务”图标
            return '/static/picture/fuwu.png';
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
            uni.navigateTo({
                url: '/bundle_home_service/pages/service_publish/service_publish'
            });
        },
        joinMerchant() {
            // 跳转到入驻商家页面
            uni.navigateTo({
                url: '/bundle_home_service/pages/merchant_join/merchant_join'
            });
        },
        goToUser() {
            // 跳转到我的页面
            uni.navigateTo({
                url: '/bundle_home_service/pages/service_user/service_user'
            });
        }
    }
}
</script>

<style lang="scss" scoped>

.home-service-page {
    width: 100%;
    height: 110vh;
    background-color: #F5F5F7;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 88px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
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
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.promo-banner-image {
    width: 100%;
    height: 100%;
    display: block;
}

/* 搜索框 */
.search-bar {
    padding: 20rpx 30rpx;
    background-color: #F5F5F7;
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 40rpx;
    padding: 18rpx 26rpx;
    gap: 18rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.search-icon {
    flex-shrink: 0;
}

/* 放大搜索图标：覆盖 u-icon 内部的 font-size */
/deep/ .search-icon .u-icon__icon {
    font-size: 20px !important; /* 按需可再调大或调小 */
}

.search-input {
    flex: 1;
    font-size: 26rpx;
    color: #666666;
}

.search-btn {
    background-color: transparent;
    color: #999999;
    padding-left: 24rpx;
    // border-left: 1px solid #F0F0F0;
    font-size: 30rpx;
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
    overflow: hidden;
}

.category-icon-img {
    width: 100%;
    height: 100%;
    display: block;
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

.entry-badge-image {
    width: 90rpx;
    height: 90rpx;
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
