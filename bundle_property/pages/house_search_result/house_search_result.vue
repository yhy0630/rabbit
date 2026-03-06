<template>
    <view class="search-result-page">
        <custom-navbar title="搜索结果" :show-back="true"></custom-navbar>

        <!-- 搜索与筛选 -->
        <view class="search-bar">
            <view class="search-row">
                <view class="region-picker" @click="showRegionPicker = true">
                    <text class="region-text">{{ regionName }}</text>
                    <u-icon name="arrow-down" size="14" color="#666"></u-icon>
                </view>
                <view class="search-input-wrap">
                    <u-icon name="search" size="20" color="#999"></u-icon>
                    <input
                        class="search-input"
                        v-model="keyword"
                        placeholder="输入小区、地址、商圈"
                        placeholder-class="placeholder"
                        @confirm="doSearch"
                    />
                    <u-icon
                        v-if="keyword"
                        name="close-circle-fill"
                        size="18"
                        color="#999"
                        @click="keyword = ''"
                    ></u-icon>
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

        <!-- 房源列表 -->
        <scroll-view class="content-scroll" scroll-y @scrolltolower="loadMore">
            <view
                class="house-card"
                v-for="(item, index) in list"
                :key="index"
                @click="goDetail(item)"
            >
                <view class="card-img-wrap">
                    <image
                        :src="item.image || defaultImg"
                        mode="aspectFill"
                        class="card-img"
                    ></image>
                </view>
                <view class="card-info">
                    <view class="card-title-row">
                        <text class="card-name">{{ item.name }}</text>
                        <view v-if="item.status" class="card-status">{{ item.status }}</view>
                    </view>
                    <text class="card-location">{{ item.location }}</text>
                    <text class="card-tags">{{ item.tags }}</text>
                    <view class="card-footer">
                        <text class="card-price">{{ item.price }}</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 区域选择（占位，可后续接 picker） -->
        <u-popup v-model="showRegionPicker" mode="bottom" border-radius="24">
            <view class="popup-region">
                <view class="popup-title">选择区域</view>
                <view class="popup-option" @click="regionName = '河北'; showRegionPicker = false">河北</view>
                <view class="popup-option" @click="regionName = '北京'; showRegionPicker = false">北京</view>
                <view class="popup-option" @click="showRegionPicker = false">取消</view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'HouseSearchResult',
    components: { CustomNavbar },
    data() {
        return {
            keyword: '',
            regionName: '河北',
            showRegionPicker: false,
            filterTabs: [
                { label: '区域', key: 'area' },
                { label: '价格', key: 'price' },
                { label: '户型', key: 'layout' },
                { label: '更多', key: 'more' }
            ],
            defaultImg: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png',
            list: [
                { id: 1, name: '锦秀花园一期', location: '北京 | 建面 146-160m²', tags: '别墅 地铁沿线 环线房 公交直达', price: '449000元/㎡', status: '在售', image: '' },
                { id: 2, name: '锦秀花园二期', location: '北京 | 建面 146-160m²', tags: '别墅 地铁沿线 环线房 公交直达', price: '449000元/㎡', status: '在售', image: '' },
                { id: 3, name: '锦秀花园三期', location: '北京 | 建面 146-160m²', tags: '别墅 地铁沿线 环线房 公交直达', price: '449000元/㎡', status: '在售', image: '' },
                { id: 4, name: '锦秀花园四期', location: '北京 | 建面 146-160m²', tags: '别墅 地铁沿线 环线房 公交直达', price: '449000元/㎡', status: '在售', image: '' },
                { id: 5, name: '锦秀花园五期', location: '北京 | 建面 146-160m²', tags: '别墅 地铁沿线 环线房 公交直达', price: '449000元/㎡', status: '在售', image: '' }
            ]
        }
    },
    onLoad(options) {
        if (options.keyword) {
            this.keyword = decodeURIComponent(options.keyword)
        }
    },
    methods: {
        doSearch() {
            // 可在此调用接口刷新 list
        },
        openFilter(idx) {
            uni.showToast({ title: this.filterTabs[idx].label + '筛选（待接入）', icon: 'none' })
        },
        loadMore() {},
        goDetail(item) {
            uni.navigateTo({ url: '/bundle_property/pages/house_detail/house_detail?id=' + (item.id || 1) })
        }
    }
}
</script>

<style lang="scss" scoped>
.search-result-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F7;
    padding-top: 88px;
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

.region-picker {
    display: flex;
    align-items: center;
    margin-right: 16rpx;
    padding: 12rpx 16rpx;
    background: #F5F5F5;
    border-radius: 8rpx;
}

.region-text {
    font-size: 26rpx;
    color: #333;
    margin-right: 6rpx;
}

.search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    background: #F5F5F5;
    border-radius: 40rpx;
    padding: 16rpx 24rpx;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    margin: 0 12rpx;
}

.placeholder {
    color: #999;
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

.content-scroll {
    height: calc(100vh - 88px - 200rpx);
    padding: 20rpx 30rpx;
}

.house-card {
    display: flex;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
    background: #FFF;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
}

.card-img-wrap {
    width: 200rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
    background: #E8E8E8;
}

.card-img {
    width: 100%;
    height: 100%;
}

.card-info {
    flex: 1;
    margin-left: 24rpx;
}

.card-title-row {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.card-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-right: 12rpx;
}

.card-status {
    padding: 4rpx 12rpx;
    background: #4CAF50;
    color: #FFF;
    font-size: 20rpx;
    border-radius: 8rpx;
}

.card-location {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
}

.card-tags {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 12rpx;
}

.card-footer .card-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #E53935;
}

.popup-region {
    padding: 40rpx;
    background: #FFF;
}

.popup-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
}

.popup-option {
    padding: 24rpx 0;
    font-size: 30rpx;
    color: #333;
}
</style>
