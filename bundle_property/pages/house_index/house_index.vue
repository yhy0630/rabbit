<template>
    <view class="property-page">
        <custom-navbar 
            :title="cityInfo.name || '河北'" 
            :show-back="false" 
            title-align="left" 
            :show-dropdown="true" 
            @title-tap="goToCity"
        >
            <template #right></template>
        </custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <!-- 搜索区域 -->
            <view class="search-bar">
                <view class="search-input-wrapper" @click="goToSearch">
                    <u-icon name="search" size="22" color="#999" class="search-icon"></u-icon>
                    <text class="search-placeholder">输入小区、地址、商圈</text>
                </view>
            </view>

            <!-- 功能图标区：两行各5个 -->
            <view class="service-menu">
                <view class="menu-row">
                    <view class="menu-item" @click="goToHouseList('secondhand', '二手房')">
                        <view class="menu-icon icon-red"><u-icon name="home" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">二手房</text>
                    </view>
                    <view class="menu-item" @click="goToHouseList('rent', '租房')">
                        <view class="menu-icon icon-blue"><u-icon name="home" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">租房</text>
                    </view>
                    <view class="menu-item" @click="goToHouseList('shop_office', '商铺写字楼')">
                        <view class="menu-icon icon-light-blue"><u-icon name="rmb-circle" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">商铺写字楼</text>
                    </view>
                    <view class="menu-item" @click="goToHouseList('factory', '厂房仓库')">
                        <view class="menu-icon icon-orange"><u-icon name="list" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">厂房仓库</text>
                    </view>
                    <view class="menu-item">
                        <view class="menu-icon icon-cyan"><u-icon name="account" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">我是房东</text>
                    </view>
                </view>
                <view class="menu-row">
                    <view class="menu-item">
                        <view class="menu-icon icon-blue"><u-icon name="list" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">找小区</text>
                    </view>
                    <view class="menu-item" @click="goToHouseList('parking', '找车位')">
                        <view class="menu-icon icon-purple"><u-icon name="car" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">找车位</text>
                    </view>
                    <view class="menu-item">
                        <view class="menu-icon icon-blue"><u-icon name="account" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">找经纪人</text>
                    </view>
                    <view class="menu-item">
                        <view class="menu-icon icon-blue"><u-icon name="question-circle" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">求租求购</text>
                    </view>
                    <view class="menu-item">
                        <view class="menu-icon icon-blue"><u-icon name="file-text" size="40" color="#FFF"></u-icon></view>
                        <text class="menu-text">房产资讯</text>
                    </view>
                </view>
            </view>

            <!-- 推广横幅 -->
            <view class="promo-banner" @click="publishHouse">
                <view class="promo-content">
                    <view class="promo-text">
                        <text class="promo-title">急售?快速卖房!</text>
                        <text class="promo-desc">一键发布,直连海量真实买家</text>
                    </view>
                    <view class="promo-btn">发布卖房</view>
                </view>
            </view>

            <view class="recommend-section">
                <view class="section-header">
                    <text class="section-title active">推荐</text>
                    <text class="section-subtitle" @click="goToNearby">附近房源</text>
                </view>
                <view class="filter-tabs">
                    <view 
                        class="filter-tab" 
                        :class="{ active: currentTag === item }" 
                        v-for="item in filterTags" 
                        :key="item"
                        @click="currentTag = item"
                    >
                        {{ item }}
                    </view>
                </view>
                <view 
                    class="house-item" 
                    v-for="(item, index) in houseList" 
                    :key="index"
                    @click="goToDetail(item)"
                >
                    <view class="house-image-wrapper">
                        <image 
                            :src="item.image || 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'" 
                            mode="aspectFill" 
                            class="house-image"
                        ></image>
                    </view>
                    <view class="house-info">
                        <text class="house-name">{{ item.name }}</text>
                        <text class="house-location">{{ item.location }}</text>
                        <text class="house-tags">{{ item.tags }}</text>
                        <view class="house-footer">
                            <text class="house-price">{{ item.price }}</text>
                            <view class="house-status" v-if="item.status">{{ item.status }}</view>
                            <text class="house-distance">{{ item.distance }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 发布弹窗 -->
        <u-popup
            v-model="showPublishPopup"
            mode="bottom"
            border-radius="24"
            safe-area-inset-bottom
        >
            <view class="publish-popup">
                <view class="publish-popup-header">
                    <text class="publish-popup-title">发布</text>
                    <u-icon name="close" size="20" color="#999999" @click="showPublishPopup = false"></u-icon>
                </view>

                <view class="publish-main-actions">
                    <view class="publish-main-item sell" @click="goPublishSell">
                        <text class="main-title">发布卖房</text>
                        <text class="main-desc">1分钟快速发布,精准卖房</text>
                    </view>
                    <view class="publish-main-item rent" @click="goPublishRent">
                        <text class="main-title">发布租房</text>
                        <text class="main-desc">完善房源信息,快速出租</text>
                    </view>
                </view>

                <view class="publish-sub-actions">
                    <view class="sub-item" @click="goPublishShop">
                        <text class="sub-title">商铺</text>
                        <text class="sub-desc">出租/出售/转让</text>
                    </view>
                    <view class="sub-item" @click="goPublishOffice">
                        <text class="sub-title">写字楼</text>
                        <text class="sub-desc">出租/出售</text>
                    </view>
                    <view class="sub-item" @click="goPublishFactory">
                        <text class="sub-title">厂房仓库</text>
                        <text class="sub-desc">出租/出售</text>
                    </view>
                    <view class="sub-item" @click="goPublishParking">
                        <text class="sub-title">车位</text>
                        <text class="sub-desc">出租/出售</text>
                    </view>
                </view>
            </view>
        </u-popup>

        <!-- 底部导航栏 -->
        <custom-tabbar :current="0" :tabs="tabbarTabs"></custom-tabbar>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import { getPropertyList } from '@/api/store'

export default {
    name: 'HouseIndex',
    components: {
        CustomNavbar,
        CustomTabbar
    },
    data() {
        return {
            currentTag: '低容积',
            filterTags: ['低容积', '近地铁', '优惠楼盘'],
            houseList: [],
            showPublishPopup: false,
            tabbarTabs: [
                { id: 'home', path: '/bundle_property/pages/house_index/house_index' },
                { id: 'mall', path: '/bundle_property/pages/house_list/house_list' },
                { id: 'publish', path: '' },
                { id: 'message', path: '' },
                { id: 'user', path: '/bundle_property/pages/house_my/house_my' }
            ]
        }
    },
    computed: {
        ...mapGetters(['cityInfo'])
    },
    onLoad() {
        this.loadRecommendList()
    },
    methods: {
        loadRecommendList() {
            getPropertyList({ page: 1, limit: 20 }).then(res => {
                if (res && res.code === 1 && res.data && res.data.lists) {
                    this.houseList = res.data.lists
                }
            }).catch(() => {})
        },
        goToCity() {
            uni.navigateTo({ url: '/bundle_b/pages/city/city' })
        },
        goToSearch() {
            uni.navigateTo({ url: '/bundle_property/pages/house_search_result/house_search_result' })
        },
        goToNearby() {
            uni.navigateTo({ url: '/bundle_property/pages/house_map/house_map' })
        },
        goToHouseList(type, title) {
            const t = title || (type === 'secondhand' ? '二手房' : type === 'rent' ? '租房' : type === 'shop_office' ? '商铺写字楼' : type === 'factory' ? '厂房仓库' : type === 'parking' ? '找车位' : '房源列表')
            uni.navigateTo({ url: '/bundle_property/pages/house_list/house_list?type=' + (type || 'secondhand') + '&title=' + encodeURIComponent(t) })
        },
        goToDetail(item) {
            uni.navigateTo({ url: '/bundle_property/pages/house_detail/house_detail?id=' + (item.id || 1) })
        },
        publishHouse() {
            this.showPublishPopup = true
        },
        goPublishSell() {
            this.showPublishPopup = false
            uni.navigateTo({ url: '/bundle_property/pages/house_publish_sell/house_publish_sell' })
        },
        goPublishRent() {
            this.showPublishPopup = false
            uni.navigateTo({ url: '/bundle_property/pages/house_publish_rent/house_publish_rent' })
        },
        goPublishShop() {
            this.showPublishPopup = false
            uni.navigateTo({ url: '/bundle_property/pages/house_publish_shop/house_publish_shop' })
        },
        goPublishFactory() {
            this.showPublishPopup = false
            uni.navigateTo({ url: '/bundle_property/pages/house_publish_factory/house_publish_factory' })
        },
        goPublishParking() {
            this.showPublishPopup = false
            uni.navigateTo({ url: '/bundle_property/pages/house_publish_parking/house_publish_parking' })
        },
        goPublishOffice() {
            this.showPublishPopup = false
            uni.navigateTo({ url: '/bundle_property/pages/house_publish_office/house_publish_office' })
        }
    }
}
</script>

<style lang="scss" scoped>
.property-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F7;
    padding-top: 88px;
    padding-bottom: 140rpx;
}

.content-scroll {
    height: calc(100vh - 88px - 140rpx);
}

.search-bar {
    padding: 20rpx 30rpx;
    background: linear-gradient(180deg, #149906 0%, #B3EE76 100%);
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 40rpx;
    padding: 20rpx 28rpx;
}

.search-icon {
    margin-right: 16rpx;
}

.search-placeholder {
    font-size: 28rpx;
    color: #999;
}

.service-menu {
    padding: 40rpx 20rpx;
    background: #FFF;
    margin-bottom: 20rpx;
}

.menu-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 40rpx;
}

.menu-row:last-child {
    margin-bottom: 0;
}

.menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.menu-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
}

.icon-red { background: #E53935; }
.icon-blue { background: #2196F3; }
.icon-light-blue { background: #03A9F4; }
.icon-orange { background: #FF9800; }
.icon-cyan { background: #00BCD4; }
.icon-purple { background: #9C27B0; }

.menu-text {
    font-size: 24rpx;
    color: #333;
}

.promo-banner {
    margin: 0 30rpx 20rpx;
    padding: 32rpx;
    background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
    border-radius: 16rpx;
}

.promo-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.promo-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
}

.promo-desc {
    font-size: 24rpx;
    color: #666;
}

.promo-btn {
    padding: 16rpx 40rpx;
    background: #2196F3;
    color: #FFF;
    font-size: 28rpx;
    border-radius: 40rpx;
}

.recommend-section {
    padding: 20rpx 30rpx;
    background: #FFF;
}

.section-header {
    margin-bottom: 24rpx;
}

.section-title {
    font-size: 32rpx;
    color: #666;
}

.section-title.active {
    color: #4CAF50;
    font-weight: bold;
    text-decoration: underline;
    margin-right: 16rpx;
}

.section-subtitle {
    font-size: 28rpx;
    color: #999;
}
.section-subtitle:active {
    color: #4CAF50;
}

.filter-tabs {
    display: flex;
    gap: 32rpx;
    margin-bottom: 24rpx;
}

.filter-tab {
    font-size: 28rpx;
    color: #666;
}

.filter-tab.active {
    color: #4CAF50;
    font-weight: bold;
    border-bottom: 4rpx solid #4CAF50;
}

.house-item {
    display: flex;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
}

.house-image-wrapper {
    width: 200rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
}

.house-image {
    width: 100%;
    height: 100%;
}

.house-info {
    flex: 1;
    margin-left: 24rpx;
}

.house-name {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
}

.house-location {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
}

.house-tags {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 12rpx;
}

.house-footer {
    display: flex;
    align-items: center;
}

.house-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #E53935;
    margin-right: 16rpx;
}

.house-status {
    padding: 4rpx 12rpx;
    background: #4CAF50;
    color: #FFF;
    font-size: 20rpx;
    border-radius: 8rpx;
    margin-right: 16rpx;
}

.house-distance {
    font-size: 24rpx;
    color: #4CAF50;
}

.publish-popup {
    padding: 32rpx 30rpx 40rpx;
    background-color: #FFFFFF;
}

.publish-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.publish-popup-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.publish-main-actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32rpx;
}

.publish-main-item {
    flex: 1;
    padding: 32rpx 24rpx;
    border-radius: 20rpx;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 20rpx;
}

.publish-main-item:last-child {
    margin-right: 0;
}

.publish-main-item.sell {
    background: linear-gradient(135deg, #FFE9E2 0%, #FFD0C1 100%);
}

.publish-main-item.rent {
    background: linear-gradient(135deg, #E0F5FF 0%, #C4E9FF 100%);
}

.main-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 8rpx;
}

.main-desc {
    font-size: 24rpx;
    color: #666666;
}

.publish-sub-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 20rpx;
}

.sub-item {
    width: 48%;
    padding: 24rpx;
    border-radius: 16rpx;
    background-color: #F5F5F5;
}

.sub-title {
    display: block;
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 6rpx;
}

.sub-desc {
    font-size: 22rpx;
    color: #999999;
}
</style>
