<template>
    <view class="layout-list-page">
        <custom-navbar title="户型列表"></custom-navbar>

        <!-- 户型筛选标签 -->
        <view class="filter-tabs">
            <view 
                class="filter-tab" 
                :class="{ active: currentTab === idx }" 
                v-for="(tab, idx) in tabList" 
                :key="idx"
                @click="currentTab = idx"
            >
                {{ tab }}
            </view>
        </view>

        <!-- 户型列表 -->
        <scroll-view class="content-scroll" scroll-y>
            <view 
                class="layout-item" 
                v-for="(item, index) in layoutList" 
                :key="index"
                @click="goToDetail(item)"
            >
                <view class="layout-image-wrapper">
                    <view class="image-accent"></view>
                    <image 
                        :src="item.image || 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'" 
                        mode="aspectFit" 
                        class="layout-image"
                    ></image>
                </view>
                <view class="layout-info">
                    <text class="layout-type">{{ item.type }}</text>
                    <text class="layout-area">{{ item.area }}</text>
                    <text class="layout-price">{{ item.price }}</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'LayoutList',
    components: {
        CustomNavbar
    },
    data() {
        return {
            currentTab: 2,
            tabList: ['全部(3)', '2居(3)', '3居(4)', '4居(2)'],
            layoutList: [
                {
                    id: 1,
                    type: '3室2厅2卫',
                    area: '建面 189㎡ 南北',
                    price: '125万',
                    image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
                },
                {
                    id: 2,
                    type: '3室2厅2卫',
                    area: '建面 189㎡ 南北',
                    price: '125万',
                    image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
                },
                {
                    id: 3,
                    type: '3室2厅2卫',
                    area: '建面 189㎡ 南北',
                    price: '125万',
                    image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
                }
            ]
        }
    },
    onLoad(opt) {
        this.houseId = opt.houseId || ''
    },
    methods: {
        goToDetail(item) {
            uni.navigateTo({
                url: '/bundle_property/pages/layout_detail/layout_detail?id=' + (item.id || 1) + '&houseId=' + this.houseId
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.layout-list-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F7;
    padding-top: 88px;
}

.filter-tabs {
    display: flex;
    padding: 24rpx 30rpx;
    background: #FFF;
    gap: 24rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.filter-tab {
    padding: 12rpx 28rpx;
    background: #FFF;
    border: 1rpx solid #E0E0E0;
    border-radius: 32rpx;
    font-size: 26rpx;
    color: #666;
}

.filter-tab.active {
    background: #4CAF50;
    color: #FFF;
    border-color: #4CAF50;
}

.content-scroll {
    height: calc(100vh - 88px - 100rpx);
    padding: 20rpx 30rpx;
}

.layout-item {
    display: flex;
    padding: 24rpx;
    background: #FFF;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    align-items: center;
}

.layout-image-wrapper {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
}

.image-accent {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8rpx;
    background: #4CAF50;
    border-radius: 4rpx 0 0 4rpx;
    z-index: 1;
}

.layout-image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
    background: #F5F5F5;
}

.layout-info {
    flex: 1;
    margin-left: 24rpx;
}

.layout-type {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
}

.layout-area {
    display: block;
    font-size: 26rpx;
    color: #999;
    margin-bottom: 12rpx;
}

.layout-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #E53935;
}
</style>
