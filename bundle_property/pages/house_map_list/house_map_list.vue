<template>
    <view class="map-list-page">
        <custom-navbar title="地图房源列表" :show-back="true"></custom-navbar>

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
                    <text class="card-title">{{ item.title }}</text>
                    <text class="card-location">{{ item.area }} | {{ item.address }}</text>
                    <view class="card-footer">
                        <text class="card-price">{{ item.price }}</text>
                        <text class="card-type">{{ item.type }}</text>
                        <text class="card-area">{{ item.areaSize }}</text>
                        <view class="card-distance">
                            <u-icon name="map" size="12" color="#4CAF50"></u-icon>
                            <text>{{ item.distance }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'HouseMapList',
    components: { CustomNavbar },
    data() {
        return {
            areaName: '',
            defaultImg: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png',
            list: [
                { id: 1, title: '急售 万众家园 顶楼跃层 豪华装修 世界非常好下楼就是地铁', area: '阿瓦提乡', address: '阿克吾斯塘', price: '192万', type: '2室1厅1卫', areaSize: '60.81㎡', distance: '16.00Km', image: '' },
                { id: 2, title: '阿瓦提 阿瓦提城区建2室1厅+南北向+两居室', area: '熟地浣溪谷', address: '大兴—磁各庄-安顺北路6号', price: '192万', type: '2室1厅1卫', areaSize: '60.81㎡', distance: '16.08Km', image: '' },
                { id: 3, title: '急售 万众家园 顶楼跃层 豪华装修', area: '阿瓦提乡', address: '阿克吾斯塘', price: '192万', type: '2室1厅1卫', areaSize: '60.81㎡', distance: '16.69Km', image: '' },
                { id: 4, title: '阿瓦提城区 2室1厅 南北向', area: '熟地浣溪谷', address: '大兴—磁各庄-安顺北路6号', price: '192万', type: '2室1厅1卫', areaSize: '60.81㎡', distance: '16.86Km', image: '' }
            ]
        }
    },
    onLoad(options) {
        if (options.area) {
            this.areaName = decodeURIComponent(options.area)
        }
    },
    methods: {
        loadMore() {},
        goDetail(item) {
            uni.navigateTo({ url: '/bundle_property/pages/house_detail/house_detail?id=' + (item.id || 1) })
        }
    }
}
</script>

<style lang="scss" scoped>
.map-list-page {
    width: 100%;
    min-height: 100vh;
    background: #F5F5F7;
    padding-top: 88px;
}

.content-scroll {
    height: calc(100vh - 88px);
    padding: 20rpx 30rpx;
}

.house-card {
    display: flex;
    padding: 24rpx 0;
    background: #FFF;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
}

.card-img-wrap {
    width: 220rpx;
    height: 180rpx;
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

.card-title {
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

.card-location {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 16rpx;
}

.card-footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16rpx;
}

.card-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #E53935;
}

.card-type,
.card-area {
    font-size: 24rpx;
    color: #999;
}

.card-distance {
    display: flex;
    align-items: center;
    gap: 4rpx;
    font-size: 24rpx;
    color: #4CAF50;
}
</style>
