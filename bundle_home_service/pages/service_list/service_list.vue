<template>
    <view class="service-list-page">
        <custom-navbar :title="categoryName || '保姆月嫂'"></custom-navbar>

        <!-- 筛选栏 -->
        <view class="filter-bar">
            <view 
                class="filter-item" 
                v-for="(item, index) in filterOptions" 
                :key="index"
                @click="showFilterPopup(index)"
            >
                <text class="filter-text">{{ item.label }}</text>
                <u-icon name="arrow-down" size="14" color="#666666"></u-icon>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <view 
                class="service-item" 
                v-for="(item, index) in serviceList" 
                :key="index"
                @click="goToDetail(item)"
            >
                <view class="service-image-wrapper">
                    <view class="recommend-tag" v-if="item.recommend">推荐</view>
                    <image src="/static/picture/Rectangle 30305.png" mode="aspectFill" class="service-image"></image>
                </view>
                <view class="service-info">
                    <view class="service-header">
                        <text class="service-name">{{ item.name }}</text>
                        <view class="service-distance-wrapper">
                            <u-icon name="map" size="14" color="#4CAF50" class="distance-icon"></u-icon>
                            <text class="service-distance">{{ item.distance }}</text>
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

        <!-- 筛选弹窗 -->
        <u-popup v-model="showFilter" mode="bottom" border-radius="24" :mask-close-able="true">
            <view class="filter-popup">
                <view class="filter-popup-header">
                    <text class="filter-popup-title">{{ currentFilterLabel }}</text>
                    <view class="filter-popup-close" @click="showFilter = false">×</view>
                </view>
                <view class="filter-popup-content">
                    <!-- 这里可以根据不同的筛选类型显示不同的内容 -->
                    <view class="filter-option" v-for="(option, idx) in filterData" :key="idx" @click="selectFilterOption(option)">
                        <text>{{ option.name }}</text>
                    </view>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'ServiceList',
    components: {
        CustomNavbar
    },
    data() {
        return {
            categoryName: '',
            showFilter: false,
            currentFilterIndex: 0,
            filterOptions: [
                { label: '区域', key: 'area' },
                { label: '分类', key: 'category' },
                { label: '筛选', key: 'filter' },
                { label: '排序', key: 'sort' }
            ],
            filterData: [],
            serviceList: [
                {
                    id: 1,
                    name: '杜阿姨',
                    distance: '16.66Km',
                    age: 29,
                    origin: '北京人',
                    education: '本科',
                    experience: '1-2年',
                    serviceType: '打扫卫生',
                    price: 2000,
                    company: '苏州芳旭保洁服务有限公司',
                    image: '/static/picture/service-avatar.png',
                    recommend: true
                },
                {
                    id: 2,
                    name: '杜阿姨',
                    distance: '16.66Km',
                    age: 29,
                    origin: '北京人',
                    education: '本科',
                    experience: '1-2年',
                    serviceType: '打扫卫生',
                    price: 2000,
                    company: '苏州芳旭保洁服务有限公司',
                    image: '/static/picture/service-avatar.png',
                    recommend: false
                },
                {
                    id: 3,
                    name: '杜阿姨',
                    distance: '16.66Km',
                    age: 29,
                    origin: '北京人',
                    education: '本科',
                    experience: '1-2年',
                    serviceType: '打扫卫生',
                    price: 2000,
                    company: '苏州芳旭保洁服务有限公司',
                    image: '/static/picture/service-avatar.png',
                    recommend: true
                },
                {
                    id: 4,
                    name: '杜阿姨',
                    distance: '16.66Km',
                    age: 29,
                    origin: '北京人',
                    education: '本科',
                    experience: '1-2年',
                    serviceType: '打扫卫生',
                    price: 2000,
                    company: '苏州芳旭保洁服务有限公司',
                    image: '/static/picture/service-avatar.png',
                    recommend: false
                },
                {
                    id: 5,
                    name: '杜阿姨',
                    distance: '16.66Km',
                    age: 29,
                    origin: '北京人',
                    education: '本科',
                    experience: '1-2年',
                    serviceType: '打扫卫生',
                    price: 2000,
                    company: '苏州芳旭保洁服务有限公司',
                    image: '/static/picture/service-avatar.png',
                    recommend: false
                }
            ]
        }
    },
    computed: {
        currentFilterLabel() {
            return this.filterOptions[this.currentFilterIndex]?.label || '';
        }
    },
    onLoad(options) {
        if (options && options.category) {
            // uni-app 会自动解码 URL 参数，直接使用即可
            this.categoryName = options.category;
        }
    },
    methods: {
        showFilterPopup(index) {
            this.currentFilterIndex = index;
            // 根据不同的筛选类型加载不同的数据
            this.loadFilterData(this.filterOptions[index].key);
            this.showFilter = true;
        },
        loadFilterData(key) {
            // 这里可以根据key加载不同的筛选数据
            this.filterData = [
                { name: '选项1', value: '1' },
                { name: '选项2', value: '2' },
                { name: '选项3', value: '3' }
            ];
        },
        selectFilterOption(option) {
            // 更新筛选选项
            const filterOption = this.filterOptions[this.currentFilterIndex];
            filterOption.label = option.name + '-';
            this.showFilter = false;
            // 重新加载服务列表
            this.loadServiceList();
        },
        loadServiceList() {
            // 加载服务列表
            console.log('加载服务列表');
        },
        goToDetail(item) {
            // 跳转到服务详情页面（个人信息详情）
            uni.navigateTo({
                url: `/bundle_home_service/pages/service_detail/service_detail?id=${item.id}`
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-list-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 88px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
}

.filter-bar {
    display: flex;
    background-color: #FFFFFF;
    padding: 0 30rpx;
    border-bottom: 1rpx solid #E0E0E0;
}

.filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #333333;
}

.filter-text {
    font-size: 28rpx;
    color: #333333;
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
    position: relative;
}

.service-image-wrapper {
    width: 160rpx;
    height: 220rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
    margin-right: 20rpx;
    position: relative;
}

.recommend-tag {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #FF9800;
    color: #FFFFFF;
    font-size: 20rpx;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
    z-index: 10;
    font-weight: bold;
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
    gap: 20rpx;
    margin-bottom: 10rpx;
}

.service-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.service-distance-wrapper {
    display: flex;
    align-items: center;
    gap: 4rpx;
}

.distance-icon {
    flex-shrink: 0;
}

/* 放大距离图标：覆盖 u-icon 内部的 font-size */
/deep/ .distance-icon .u-icon__icon {
    font-size: 18px !important; /* 按需可再调大或调小 */
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
    color: #1B8902;
    background-color: #F0FFF8;
    padding: 4rpx 12rpx;
    border-radius: 10rpx;
    font-weight: bold;
    display: inline-block;
}

.service-footer {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.service-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #F94B30;
    border-bottom: 1rpx dashed #E4E4E4;
    padding-bottom: 20rpx;
    margin-bottom: 8rpx;
}

.service-company {
    font-size: 26rpx;
    color: #999999;
}

.filter-popup {
    padding: 40rpx 30rpx;
    max-height: 60vh;
}

.filter-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #E0E0E0;
}

.filter-popup-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.filter-popup-close {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    color: #999999;
}

.filter-popup-content {
    max-height: 50vh;
    overflow-y: auto;
}

.filter-option {
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #333333;
    border-bottom: 1rpx solid #F5F5F5;
}
</style>
