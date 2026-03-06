<template>
    <view class="layout-detail-page">
        <custom-navbar title="户型详情"></custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <!-- 主户型图 -->
            <view class="main-image-wrapper">
                <image 
                    :src="detail.mainImage || 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'" 
                    mode="widthFix" 
                    class="main-image"
                ></image>
                <view class="image-indicator">{{ currentImageIndex }}/{{ detail.images && detail.images.length || 1 }}</view>
            </view>

            <!-- 户型概览 -->
            <view class="overview-section">
                <text class="overview-type">{{ detail.type }}</text>
                <view class="overview-data">
                    <view class="data-item">
                        <text class="data-value blue">{{ detail.totalPrice }}</text>
                        <text class="data-label">总价</text>
                    </view>
                    <view class="data-item">
                        <text class="data-value">{{ detail.area }}</text>
                        <text class="data-label">建面</text>
                    </view>
                    <view class="data-item">
                        <text class="data-value">{{ detail.direction }}</text>
                        <text class="data-label">朝向</text>
                    </view>
                </view>
            </view>

            <!-- 地址与楼盘 -->
            <view class="address-section">
                <view class="info-row" @click="showAddress">
                    <text class="info-label">地址</text>
                    <text class="info-value">{{ detail.address }}</text>
                    <u-icon name="arrow-right" size="14" color="#999"></u-icon>
                </view>
                <view class="info-row" @click="showEstate">
                    <text class="info-label">所属楼盘</text>
                    <text class="info-value">{{ detail.estate }}</text>
                    <u-icon name="arrow-right" size="14" color="#999"></u-icon>
                </view>
            </view>

            <!-- 户型解读 -->
            <view class="interpret-section">
                <text class="section-title">户型解读</text>
                <text class="interpret-content">{{ detail.interpret }}</text>
            </view>

            <!-- 经纪人 -->
            <view class="agent-section" @click="callAgent">
                <view class="agent-info">
                    <image :src="detail.agentAvatar" mode="aspectFill" class="agent-avatar"></image>
                    <view class="agent-detail">
                        <text class="agent-name">{{ detail.agentName }}</text>
                        <view class="agent-tag">个人</view>
                    </view>
                </view>
                <view class="call-btn red">
                    <u-icon name="phone" size="36" color="#FFF"></u-icon>
                </view>
            </view>

            <!-- 全部户型 -->
            <view class="layout-list-section">
                <view class="section-header">
                    <text class="section-title">全部户型</text>
                    <text class="section-more" @click="goToLayoutList">更多 &gt;</text>
                </view>
                <view class="layout-tabs">
                    <view 
                        class="layout-tab" 
                        :class="{ active: currentTab === idx }" 
                        v-for="(tab, idx) in tabList" 
                        :key="idx"
                        @click="currentTab = idx"
                    >
                        {{ tab }}
                    </view>
                </view>
                <scroll-view class="layout-scroll" scroll-x>
                    <view 
                        class="layout-card" 
                        v-for="(item, idx) in layoutList" 
                        :key="idx"
                        @click="goToLayoutDetail(item)"
                    >
                        <image :src="item.image" mode="aspectFit" class="layout-image"></image>
                        <text class="layout-type">{{ item.type }}</text>
                        <text class="layout-area">{{ item.area }}</text>
                        <text class="layout-price">{{ item.price }}</text>
                    </view>
                </scroll-view>
            </view>

            <!-- 温馨提示 -->
            <view class="tips-section">
                <text class="tips-text">温馨提示:本平台信息由用户自主发布,请谨慎交易,若发生用户合作纠纷,本平台不承担任何法律责任。</text>
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="bottom-bar">
            <view class="bar-item" @click="collect">
                <u-icon name="star" size="24" :color="isCollected ? '#FFB300' : '#666'"></u-icon>
                <text>收藏</text>
            </view>
            <view class="bar-item" @click="share">
                <u-icon name="share" size="24" color="#666"></u-icon>
                <text>分享</text>
            </view>
            <view class="book-btn" @click="bookVisit">预约看房</view>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'LayoutDetail',
    components: {
        CustomNavbar
    },
    data() {
        return {
            currentImageIndex: 12,
            currentTab: 2,
            isCollected: false,
            houseId: '',
            tabList: ['全部(3)', '2居(3)', '3居(4)', '4居(2)'],
            detail: {
                type: '3室3厅2卫',
                totalPrice: '约1100万',
                area: '185 ㎡',
                direction: '南,北',
                address: '阿瓦提阿瓦提城区建设南路8号',
                estate: '锦秀家园(阿瓦提)',
                interpret: '房源特色:不把山不临街,装修保持好,干净立正,南北通透,首次出租,家电家具齐全。附近交通:交通方便,到太原街,沈阳站,铁百万万达三四站的距离',
                agentName: '周江康',
                agentAvatar: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png',
                mainImage: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
            },
            layoutList: [
                {
                    id: 1,
                    type: '3室2厅1卫',
                    area: '建面123㎡/南 | 北',
                    price: '约123万/套',
                    image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
                },
                {
                    id: 2,
                    type: '3室2厅1卫',
                    area: '建面 135㎡/南 | 北',
                    price: '约125万/套',
                    image: 'https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png'
                }
            ]
        }
    },
    onLoad(opt) {
        this.layoutId = opt.id || ''
        this.houseId = opt.houseId || ''
        // 可根据 layoutId 拉取详情数据
    },
    methods: {
        showAddress() {
            uni.showToast({ title: '查看地址', icon: 'none' })
        },
        showEstate() {
            uni.showToast({ title: '查看楼盘', icon: 'none' })
        },
        callAgent() {
            uni.makePhoneCall({ phoneNumber: '400-xxx-xxxx' })
        },
        goToLayoutList() {
            uni.navigateTo({
                url: '/bundle_property/pages/layout_list/layout_list?houseId=' + this.houseId
            })
        },
        goToLayoutDetail(item) {
            uni.navigateTo({
                url: '/bundle_property/pages/layout_detail/layout_detail?id=' + (item.id || 1) + '&houseId=' + this.houseId
            })
        },
        collect() {
            this.isCollected = !this.isCollected
            uni.showToast({ title: this.isCollected ? '已收藏' : '已取消收藏', icon: 'none' })
        },
        share() {
            uni.showToast({ title: '分享', icon: 'none' })
        },
        bookVisit() {
            uni.showToast({ title: '预约看房', icon: 'none' })
        }
    }
}
</script>

<style lang="scss" scoped>
.layout-detail-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F7;
    padding-top: 88px;
    padding-bottom: 120rpx;
}

.content-scroll {
    height: calc(100vh - 88px - 120rpx);
}

.main-image-wrapper {
    position: relative;
    width: 100%;
    background: #FFF;
}

.main-image {
    width: 100%;
    display: block;
}

.image-indicator {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    padding: 8rpx 20rpx;
    background: rgba(0, 0, 0, 0.5);
    color: #FFF;
    font-size: 24rpx;
    border-radius: 20rpx;
}

.overview-section {
    padding: 32rpx;
    background: #FFF;
    margin-bottom: 20rpx;
}

.overview-type {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
}

.overview-data {
    display: flex;
}

.data-item {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.data-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
}

.data-value.blue {
    color: #2196F3;
}

.data-label {
    font-size: 24rpx;
    color: #999;
}

.address-section {
    background: #FFF;
    padding: 0 32rpx;
    margin-bottom: 20rpx;
}

.info-row {
    display: flex;
    align-items: center;
    padding: 28rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    width: 140rpx;
    font-size: 28rpx;
    color: #999;
}

.info-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.interpret-section {
    padding: 32rpx;
    background: #FFF;
    margin-bottom: 20rpx;
}

.section-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
}

.interpret-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
}

.agent-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    background: #FFF;
    margin-bottom: 20rpx;
}

.agent-info {
    display: flex;
    align-items: center;
}

.agent-avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    margin-right: 24rpx;
}

.agent-name {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
}

.agent-tag {
    display: inline-block;
    padding: 4rpx 16rpx;
    background: #E8F5E9;
    color: #4CAF50;
    font-size: 22rpx;
    border-radius: 8rpx;
}

.call-btn {
    width: 80rpx;
    height: 80rpx;
    background: #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.call-btn.red {
    background: #E53935;
}

.layout-list-section {
    background: #FFF;
    padding: 32rpx;
    margin-bottom: 20rpx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}

.section-more {
    font-size: 26rpx;
    color: #4CAF50;
}

.layout-tabs {
    display: flex;
    gap: 32rpx;
    margin-bottom: 24rpx;
}

.layout-tab {
    font-size: 26rpx;
    color: #666;
}

.layout-tab.active {
    color: #4CAF50;
    font-weight: bold;
}

.layout-scroll {
    white-space: nowrap;
}

.layout-card {
    display: inline-block;
    width: 280rpx;
    margin-right: 24rpx;
    vertical-align: top;
}

.layout-image {
    width: 280rpx;
    height: 210rpx;
    border-radius: 12rpx;
    display: block;
    background: #F5F5F5;
}

.layout-type {
    display: block;
    font-size: 26rpx;
    color: #333;
    margin-top: 12rpx;
}

.layout-area {
    display: block;
    font-size: 24rpx;
    color: #999;
}

.layout-price {
    display: block;
    font-size: 26rpx;
    color: #E53935;
    font-weight: bold;
    margin-top: 8rpx;
}

.tips-section {
    margin: 0 32rpx 20rpx;
    padding: 24rpx;
    background: #E8F5E9;
    border-radius: 12rpx;
}

.tips-text {
    font-size: 24rpx;
    color: #4CAF50;
    line-height: 1.5;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #FFF;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
    z-index: 100;
}

.bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 48rpx;
}

.bar-item text {
    font-size: 22rpx;
    color: #666;
}

.book-btn {
    flex: 1;
    height: 80rpx;
    background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    font-size: 32rpx;
    font-weight: bold;
}
</style>
