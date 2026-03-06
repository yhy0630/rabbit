<template>
    <view class="news-detail-page">
        <custom-navbar title="资讯详情"></custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <view class="content">
                <text class="title">{{ detail.title }}</text>
                <view class="meta">
                    <text class="city">{{ detail.city }}</text>
                    <text class="date">{{ detail.date }}</text>
                </view>
                <image class="banner" :src="detail.image" mode="widthFix" />
                <view class="rich-text">
                    <text>{{ detail.content }}</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'HouseNewsDetail',
    components: { CustomNavbar },
    data() {
        return {
            detail: {
                title: '如何能让媒体讲“真话”，为什么说真话越来越难？',
                city: '北京市顺义区',
                date: '2023-08-02',
                image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png',
                content:
                    '这里是资讯正文示例内容。真实项目中可替换为后端返回的富文本数据，展示更多购房政策、楼市解读、置业指南等信息。'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.news-detail-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F5;
    padding-top: 88px;
}

.content-scroll {
    height: calc(100vh - 88px);
}

.content {
    padding: 24rpx 24rpx 40rpx;
    background: #FFFFFF;
}

.title {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
    margin-bottom: 12rpx;
}

.meta {
    font-size: 22rpx;
    color: #999999;
    margin-bottom: 16rpx;
}

.city {
    margin-right: 10rpx;
}

.banner {
    width: 100%;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
}

.rich-text {
    font-size: 26rpx;
    color: #333333;
    line-height: 1.7;
}
</style>

