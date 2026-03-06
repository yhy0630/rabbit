<template>
    <view class="house-list-page">
        <custom-navbar :title="categoryName"></custom-navbar>

        <!-- 搜索区域 -->
        <view class="search-bar">
            <view class="search-input-wrapper" @click="handleSearch">
                <u-icon name="search" size="22" color="#999" class="search-icon"></u-icon>
                <text class="search-placeholder">搜索标题/小区/商圈...</text>
            </view>
            <view class="map-btn" @click="goToMap">
                <u-icon name="map" size="20" color="#4CAF50"></u-icon>
                <text>地图找房</text>
            </view>
        </view>

        <!-- 筛选Tab -->
        <view class="filter-bar">
            <view 
                class="filter-item" 
                v-for="(item, index) in filterOptions" 
                :key="index"
                @click="showFilterPopup(index)"
            >
                <text class="filter-text">{{ item.label }}-</text>
                <u-icon name="arrow-down" size="14" color="#666"></u-icon>
            </view>
        </view>

        <!-- 热门标签 -->
        <view class="tag-bar">
            <view 
                class="tag-item" 
                :class="{ active: activeTag === item }" 
                v-for="item in tagList" 
                :key="item"
                @click="activeTag = item"
            >
                {{ item }}
            </view>
        </view>

        <!-- 房源列表 -->
        <scroll-view class="content-scroll" scroll-y @scrolltolower="loadMore">
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
                    <text class="house-title">{{ item.title }}</text>
                    <text class="house-location">{{ item.area }} | {{ item.address }}</text>
                    <view class="house-footer">
                        <text class="house-price">{{ item.price }}</text>
                        <text class="house-type">{{ item.type }}</text>
                        <text class="house-area">{{ item.areaSize }}</text>
                        <view class="house-distance">
                            <u-icon name="map" size="12" color="#4CAF50"></u-icon>
                            <text>{{ item.distance }}</text>
                        </view>
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
                    <view 
                        class="filter-option" 
                        v-for="(option, idx) in filterData" 
                        :key="idx" 
                        @click="selectFilterOption(option)"
                    >
                        <text>{{ option.name }}</text>
                    </view>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getPropertyCategoryList, getPropertyList } from '@/api/store'

export default {
    name: 'HouseList',
    components: {
        CustomNavbar
    },
    data() {
        return {
            showFilter: false,
            currentFilterIndex: 0,
            activeTag: '低容积',
            filterOptions: [
                { label: '区域', key: 'area' },
                { label: '附近', key: 'nearby' },
                { label: '价格', key: 'price' },
                { label: '户型', key: 'layout' },
                { label: '更多', key: 'more' }
            ],
            filterData: [],
            tagList: ['低容积', '近地铁', '南北通透', '房东急售', '优惠楼盘'],
            houseList: [],
            categoryId: '',
            categoryName: '二手房',
            page: 1,
            limit: 20,
            total: 0,
            loading: false
        }
    },
    computed: {
        currentFilterLabel() {
            const item = this.filterOptions[this.currentFilterIndex]
            return item ? item.label : ''
        }
    },
    onLoad(opt) {
        this.categoryName = opt.title || '二手房'
        const type = opt.type || 'secondhand'
        getPropertyCategoryList().then(res => {
            if (res && res.code === 1 && Array.isArray(res.data)) {
                const cat = res.data.find(c => (c.code || '') === type)
                this.categoryId = cat ? cat.id : ''
                this.loadList(true)
            } else {
                this.loadList(true)
            }
        }).catch(() => { this.loadList(true) })
    },
    methods: {
        loadList(reset) {
            if (this.loading) return
            if (reset) {
                this.page = 1
                this.houseList = []
            }
            this.loading = true
            const params = { page: this.page, limit: this.limit }
            if (this.categoryId) params.category_id = this.categoryId
            getPropertyList(params).then(res => {
                this.loading = false
                if (res && res.code === 1 && res.data) {
                    const lists = res.data.lists || []
                    this.total = res.data.count || 0
                    if (reset) {
                        this.houseList = lists
                    } else {
                        this.houseList = this.houseList.concat(lists)
                    }
                }
            }).catch(() => { this.loading = false })
        },
        loadMore() {
            if (this.houseList.length >= this.total) return
            this.page++
            this.loadList(false)
        },
        handleSearch() {
            uni.showToast({ title: '搜索', icon: 'none' })
        },
        goToMap() {
            uni.showToast({ title: '地图找房', icon: 'none' })
        },
        showFilterPopup(index) {
            this.currentFilterIndex = index
            const key = this.filterOptions[index].key
            if (key === 'area') {
                this.filterData = [
                    { id: 1, name: '不限' },
                    { id: 2, name: '阿瓦提乡' },
                    { id: 3, name: '大兴区' },
                    { id: 4, name: '朝阳区' }
                ]
            } else if (key === 'price') {
                this.filterData = [
                    { id: 1, name: '不限' },
                    { id: 2, name: '100万以下' },
                    { id: 3, name: '100-200万' },
                    { id: 4, name: '200-300万' },
                    { id: 5, name: '300万以上' }
                ]
            } else {
                this.filterData = [{ id: 0, name: '暂无数据' }]
            }
            this.showFilter = true
        },
        selectFilterOption(option) {
            this.showFilter = false
        },
        goToDetail(item) {
            uni.navigateTo({ url: '/bundle_property/pages/house_detail/house_detail?id=' + (item.id || 1) })
        },
        loadMore() {
            this.loadList(false)
        }
    }
}
</script>

<style lang="scss" scoped>
.house-list-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F7;
    padding-top: 88px;
}

.search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background: #FFF;
    gap: 20rpx;
}

.search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background: #F5F5F5;
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

.map-btn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 26rpx;
    color: #4CAF50;
}

.filter-bar {
    display: flex;
    background: #FFF;
    padding: 24rpx 20rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-text {
    font-size: 28rpx;
    color: #333;
    margin-right: 4rpx;
}

.tag-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    padding: 24rpx 30rpx;
    background: #FFF;
}

.tag-item {
    padding: 12rpx 28rpx;
    background: #FFF;
    border: 1rpx solid #E0E0E0;
    border-radius: 32rpx;
    font-size: 26rpx;
    color: #333;
}

.tag-item.active {
    background: #4CAF50;
    color: #FFF;
    border-color: #4CAF50;
}

.content-scroll {
    height: calc(100vh - 88px - 220rpx);
    padding: 20rpx 30rpx;
}

.house-item {
    display: flex;
    padding: 24rpx 0;
    background: #FFF;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
}

.house-image-wrapper {
    width: 220rpx;
    height: 180rpx;
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

.house-title {
    display: block;
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    margin-bottom: 12rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.house-location {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 16rpx;
}

.house-footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16rpx;
}

.house-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #E53935;
}

.house-type,
.house-area {
    font-size: 24rpx;
    color: #999;
}

.house-distance {
    display: flex;
    align-items: center;
    gap: 4rpx;
    font-size: 24rpx;
    color: #4CAF50;
}

.filter-popup {
    padding: 40rpx;
}

.filter-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
}

.filter-popup-title {
    font-size: 32rpx;
    font-weight: bold;
}

.filter-popup-close {
    font-size: 48rpx;
    color: #999;
}

.filter-option {
    padding: 24rpx 0;
    font-size: 30rpx;
    color: #333;
}
</style>
