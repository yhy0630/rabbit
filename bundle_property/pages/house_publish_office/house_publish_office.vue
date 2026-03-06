<template>
    <view class="publish-page">
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">发布写字楼</view>
                <view class="navbar-right"></view>
            </view>
        </view>
        <scroll-view class="content-scroll" scroll-y>
            <PropertyPublishCommercial
                ref="formRef"
                page-title="发布写字楼"
                title-label="写字楼标题"
                description-label="房源描述"
                description-placeholder="请介绍写字楼装修、格局、交通、配套等信息"
                image-subtitle="房源图片（最多15张，每张小于2M）"
                category-code="shop_office"
                :show-floor="true"
                :show-area="true"
                :publish-type-options="publishTypeOptions"
            />
        </scroll-view>
    </view>
</template>

<script>
import PropertyPublishCommercial from '../../components/PropertyPublishCommercial.vue'

export default {
    name: 'HousePublishOffice',
    components: { PropertyPublishCommercial },
    data() {
        return {
            statusBarHeight: 0,
            publishTypeOptions: [
                { label: '出租', value: 'rent' },
                { label: '出售', value: 'sell' }
            ]
        }
    },
    onLoad() {
        const systemInfo = uni.getSystemInfoSync()
        this.statusBarHeight = systemInfo.statusBarHeight || 0
    },
    methods: {
        goBack() {
            uni.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.publish-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
}
.status-bar { width: 100%; background-color: #4CAF50; }
.header-navbar {
    width: 100%;
    background: linear-gradient(180deg, #4CAF50 0%, #45A049 100%);
    padding: 10rpx 0;
}
.navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    height: 88rpx;
}
.back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.navbar-title {
    flex: 1;
    text-align: center;
    color: #FFFFFF;
    font-size: 34rpx;
    font-weight: bold;
}
.navbar-right { width: 60rpx; }
.content-scroll { flex: 1; }
</style>
