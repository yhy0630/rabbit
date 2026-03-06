<template>
    <view class="news-list-page">
        <custom-navbar title="购房资讯"></custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <view
                class="news-item"
                v-for="(item, index) in list"
                :key="index"
                @click="goDetail(item)"
            >
                <image class="thumb" :src="item.image" mode="aspectFill" />
                <view class="info">
                    <text class="title">{{ item.title }}</text>
                    <view class="meta">
                        <text class="city">{{ item.city }}</text>
                        <text class="date">{{ item.date }}</text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'HouseNewsList',
    components: { CustomNavbar },
    data() {
        return {
            list: [
                {
                    id: 1,
                    title: '买房要量力而行，不是说自己想要多大就多大，根据自身的收入情况来评判',
                    city: '北京市顺义区',
                    date: '2023-08-02',
                    image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
                },
                {
                    id: 2,
                    title: '开发商一定要选大不选小，口碑要好，这样可以避免开盘后遇到跑路等风险',
                    city: '北京市顺义区',
                    date: '2023-08-02',
                    image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
                }
            ]
        }
    },
    methods: {
        goDetail(item) {
            uni.navigateTo({
                url: '/bundle_property/pages/house_news_detail/house_news_detail?id=' + (item.id || 1)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.news-list-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F5;
    padding-top: 88px;
}

.content-scroll {
    height: calc(100vh - 88px);
    padding: 10rpx 20rpx 20rpx;
}

.news-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
    background: #FFFFFF;
}

.thumb {
    width: 200rpx;
    height: 140rpx;
    border-radius: 8rpx;
    margin-right: 16rpx;
}

.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.title {
    font-size: 28rpx;
    color: #333333;
    line-height: 1.4;
}

.meta {
    margin-top: 10rpx;
    font-size: 22rpx;
    color: #999999;
}

.city {
    margin-right: 10rpx;
}
</style>

