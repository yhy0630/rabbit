<template>
    <view class="map-page">
        <custom-navbar title="地图找房" :show-back="true"></custom-navbar>

        <!-- 搜索与筛选 -->
        <view class="search-bar">
            <view class="search-row">
                <view class="search-input-wrap" @click="goSearchResult">
                    <u-icon name="search" size="20" color="#999"></u-icon>
                    <text class="search-placeholder">搜索标题/小区/商圈...</text>
                </view>
                <view class="map-tab" @click="goSearchResult">
                    <u-icon name="map" size="20" color="#4CAF50"></u-icon>
                    <text>地图找房</text>
                </view>
            </view>
            <view class="filter-row">
                <view
                    v-for="(item, idx) in filterTabs"
                    :key="idx"
                    class="filter-tab"
                    @click="openFilter(idx)"
                >
                    <text>{{ item.label }}</text>
                    <u-icon name="arrow-down" size="12" color="#666"></u-icon>
                </view>
            </view>
        </view>

        <!-- 地图区域：可点击的标记块，点击后进入地图房源列表 -->
        <view class="map-container">
            <view class="map-placeholder">
                <view class="marker-list">
                    <view
                        v-for="(m, i) in markerList"
                        :key="i"
                        class="marker-btn"
                        :style="{ left: m.left, top: m.top }"
                        @click="goMapList(m)"
                    >
                        <text class="marker-name">{{ m.name }}</text>
                        <text class="marker-count">{{ m.count }}个</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'HouseMap',
    components: { CustomNavbar },
    data() {
        return {
            filterTabs: [
                { label: '区域', key: 'area' },
                { label: '价格', key: 'price' },
                { label: '户型', key: 'layout' },
                { label: '更多', key: 'more' }
            ],
            markerList: [
                { name: '阿萨', count: 157, left: '15%', top: '12%' },
                { name: '阿克塔', count: 456, left: '8%', top: '35%' },
                { name: '亚郎', count: 896, left: '28%', top: '30%' },
                { name: '亚尔贝希', count: 567, left: '55%', top: '28%' },
                { name: '亚喀塔', count: 567, left: '25%', top: '55%' },
                { name: '英其开', count: 0, left: '48%', top: '52%' },
                { name: '吐格曼希', count: 456, left: '62%', top: '50%' },
                { name: '托喀木', count: 346, left: '42%', top: '78%' }
            ]
        }
    },
    onReady() {},
    methods: {
        goSearchResult() {
            uni.navigateTo({ url: '/bundle_property/pages/house_search_result/house_search_result' })
        },
        openFilter(idx) {
            uni.showToast({ title: this.filterTabs[idx].label + '筛选（待接入）', icon: 'none' })
        },
        goMapList(marker) {
            uni.navigateTo({
                url: '/bundle_property/pages/house_map_list/house_map_list?area=' + encodeURIComponent(marker.name || '') + '&count=' + (marker.count || 0)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.map-page {
    width: 100%;
    height: 100vh;
    background: #F5F5F7;
    padding-top: 88px;
    display: flex;
    flex-direction: column;
}

.search-bar {
    background: #FFF;
    padding: 20rpx 24rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.search-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    background: #F5F5F5;
    border-radius: 40rpx;
    padding: 16rpx 24rpx;
}

.search-placeholder {
    font-size: 28rpx;
    color: #999;
    margin-left: 12rpx;
}

.map-tab {
    display: flex;
    align-items: center;
    margin-left: 16rpx;
    font-size: 26rpx;
    color: #4CAF50;
}

.map-tab text {
    margin-left: 6rpx;
}

.filter-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.filter-tab {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #333;
}

.filter-tab text {
    margin-right: 4rpx;
}

.map-container {
    flex: 1;
    width: 100%;
    position: relative;
    background: #E5E5E5;
}

.map-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #E8E8E8 0%, #D0D0D0 100%);
    position: relative;
}

.marker-list {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.marker-btn {
    position: absolute;
    min-width: 120rpx;
    padding: 12rpx 20rpx;
    background: #4CAF50;
    color: #FFF;
    border-radius: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.4);
}

.marker-name {
    font-size: 24rpx;
    font-weight: bold;
}

.marker-count {
    font-size: 20rpx;
    opacity: 0.9;
}
</style>
