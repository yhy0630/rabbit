<template>
    <view class="house-detail-page">
        <custom-navbar title="房源详情"></custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <!-- 图片轮播 -->
            <view class="swiper-wrapper">
                <swiper 
                    class="image-swiper" 
                    :indicator-dots="false"
                    autoplay
                    circular
                    @change="onSwiperChange"
                >
                    <swiper-item v-for="(img, idx) in images" :key="idx">
                        <image :src="img" mode="aspectFill" class="swiper-image"></image>
                    </swiper-item>
                </swiper>
                <view class="swiper-indicator">{{ currentIndex + 1 }}/{{ images.length }}</view>
            </view>

            <!-- 标题与基本信息 -->
            <view class="title-section">
                <text class="house-title">{{ detail.title }}</text>
                <view class="title-meta">
                    <text class="update-time">{{ detail.updateTime }} 更新</text>
                    <view class="distance-tag">
                        <u-icon name="map" size="14" color="#4CAF50"></u-icon>
                        <text>{{ detail.distance }}</text>
                    </view>
                </view>
                <view class="tag-list">
                    <view class="tag-item" v-for="(tag, idx) in detail.tags" :key="idx">{{ tag }}</view>
                </view>
            </view>

            <!-- 核心数据 -->
            <view class="core-data">
                <view class="data-item">
                    <text class="data-value">{{ detail.totalPrice }}</text>
                    <text class="data-label">总价</text>
                </view>
                <view class="data-item">
                    <text class="data-value">{{ detail.unitPrice }}</text>
                    <text class="data-label">单价</text>
                </view>
                <view class="data-item">
                    <text class="data-value">{{ detail.layout }}</text>
                    <text class="data-label">户型</text>
                </view>
            </view>

            <!-- 详细属性 -->
            <view class="attr-section">
                <view class="attr-row" v-for="(item, idx) in attrList" :key="idx">
                    <text class="attr-label">{{ item.label }}</text>
                    <text class="attr-value">{{ item.value }}</text>
                </view>
            </view>

            <!-- 户型图 -->
            <view class="layout-section" v-if="layoutList.length">
                <view class="section-header">
                    <text class="section-title">全部户型</text>
                    <text class="section-more" @click="goToLayoutList">更多&gt;</text>
                </view>
                <view class="layout-tabs">
                    <view 
                        class="layout-tab" 
                        :class="{ active: currentLayoutTab === idx }" 
                        v-for="(tab, idx) in layoutTabs" 
                        :key="idx"
                        @click="currentLayoutTab = idx"
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

            <!-- 核心卖点 -->
            <view class="selling-points">
                <text class="section-title">核心买点</text>
                <text class="points-content">{{ detail.sellingPoints }}</text>
                <text class="points-content">{{ detail.traffic }}</text>
            </view>

            <!-- 温馨提示 -->
            <view class="tips-section">
                <text class="tips-text">温馨提示:本平台信息由用户自主发布,请谨慎交易,若发生用户合作纠纷,本平台不承担任何法律责任。</text>
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
                <view class="call-btn">
                    <u-icon name="phone" size="36" color="#FFF"></u-icon>
                </view>
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
import { getPropertyDetail } from '@/api/store'

export default {
    name: 'HouseDetail',
    components: {
        CustomNavbar
    },
    data() {
        return {
            houseId: '',
            listingId: 0,
            categoryId: 0,
            publisherUserId: 0,
            currentIndex: 0,
            currentLayoutTab: 0,
            isCollected: false,
            images: [],
            detail: {},
            attrList: [],
            layoutTabs: [],
            layoutList: []
        }
    },
    onLoad(opt) {
        this.houseId = opt.id || ''
        if (this.houseId) {
            getPropertyDetail({ id: this.houseId }).then(res => {
                if (res && res.code === 1 && res.data) {
                    this.fillDetail(res.data)
                }
            }).catch(() => {})
        }
    },
    methods: {
        fillDetail(d) {
            this.listingId = d.id || 0
            this.categoryId = d.category_id || 0
            this.publisherUserId = d.user_id || 0
            this.images = (d.images && d.images.length) ? d.images : (d.image ? [d.image] : [])
            if (!this.images.length) this.images = ['https://pw3.yihaiguantao.com/static/picture/Rectangle 30305.png']
            const layout = (d.room || d.hall || d.toilet) ? (d.room || 0) + '室' + (d.hall || 0) + '厅' + (d.toilet || 0) + '卫' : ''
            this.detail = {
                title: d.title || '',
                updateTime: d.update_time ? (typeof d.update_time === 'number' ? new Date(d.update_time * 1000).toLocaleDateString() : String(d.update_time)) : '',
                distance: d.distance || '',
                tags: d.selling_points ? d.selling_points.split(/[,，、]/).filter(Boolean).slice(0, 5) : [],
                totalPrice: d.price_text || '',
                unitPrice: (d.price_unit === 'total' && d.area > 0 && d.price > 0) ? (Math.round(d.price * 10000 / d.area) + '元/㎡') : '',
                layout: layout,
                sellingPoints: d.selling_points || '',
                traffic: d.traffic || '',
                agentName: d.contact_name || '房东',
                agentAvatar: '',
                contact_phone: d.contact_phone || ''
            }
            this.attrList = [
                { label: '面积', value: d.area > 0 ? d.area + '㎡' : '' },
                { label: '朝向', value: d.orientation || '' },
                { label: '楼层', value: (d.floor && d.total_floor) ? d.floor + '层/共' + d.total_floor + '层' : (d.floor ? d.floor + '层' : '') },
                { label: '装修', value: d.decorate_type || '' },
                { label: '建成年代', value: d.build_year || '' },
                { label: '房屋类型', value: d.house_type || '' },
                { label: '所在区域', value: '' },
                { label: '所属小区', value: d.community || '' },
                { label: '地址', value: (d.community || '') + (d.address ? ' ' + d.address : '') }
            ].filter(item => item.value)
            this.layoutList = (d.layouts || []).map(l => ({
                id: l.id,
                image: l.image || '',
                type: l.layout_type || '',
                area: l.area_desc || '',
                price: l.price_desc || ''
            }))
            this.layoutTabs = this.layoutList.length ? ['全部(' + this.layoutList.length + ')'] : []
        },
        onSwiperChange(e) {
            this.currentIndex = e.detail.current
        },
        collect() {
            this.isCollected = !this.isCollected
            uni.showToast({ title: this.isCollected ? '已收藏' : '已取消收藏', icon: 'none' })
        },
        share() {
            uni.showToast({ title: '分享', icon: 'none' })
        },
        callAgent() {
            const phone = this.detail.contact_phone || ''
            if (phone) uni.makePhoneCall({ phoneNumber: phone })
            else uni.showToast({ title: '暂无联系电话', icon: 'none' })
        },
        bookVisit() {
            if (!this.listingId) {
                uni.showToast({ title: '房源信息加载中，请稍后再试', icon: 'none' })
                return
            }
            const url = '/bundle_property/pages/house_book_visit/house_book_visit?listing_id=' + this.listingId + '&category_id=' + this.categoryId + '&publisher_user_id=' + this.publisherUserId
            uni.navigateTo({ url })
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
        }
    }
}
</script>

<style lang="scss" scoped>
.house-detail-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F7;
    padding-top: 88px;
    padding-bottom: 120rpx;
}

.content-scroll {
    height: calc(100vh - 88px - 120rpx);
}

.swiper-wrapper {
    position: relative;
    width: 100%;
    height: 480rpx;
    background: #FFF;
}

.image-swiper {
    width: 100%;
    height: 100%;
}

.swiper-image {
    width: 100%;
    height: 100%;
}

.swiper-indicator {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    padding: 8rpx 20rpx;
    background: rgba(0, 0, 0, 0.5);
    color: #FFF;
    font-size: 24rpx;
    border-radius: 20rpx;
}

.title-section {
    padding: 32rpx;
    background: #FFF;
    margin-bottom: 20rpx;
}

.house-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    margin-bottom: 16rpx;
}

.title-meta {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 20rpx;
}

.update-time {
    font-size: 24rpx;
    color: #999;
}

.distance-tag {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: #4CAF50;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.tag-item {
    padding: 8rpx 20rpx;
    background: #F5F5F5;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: #666;
}

.core-data {
    display: flex;
    background: #FFF;
    padding: 32rpx;
    margin-bottom: 20rpx;
}

.data-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.data-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #E53935;
    margin-bottom: 8rpx;
}

.data-label {
    font-size: 24rpx;
    color: #999;
}

.attr-section {
    background: #FFF;
    padding: 32rpx;
    margin-bottom: 20rpx;
}

.attr-row {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F0F0F0;
}

.attr-row:last-child {
    border-bottom: none;
}

.attr-label {
    width: 180rpx;
    font-size: 28rpx;
    color: #999;
}

.attr-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.layout-section {
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

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
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
    width: 320rpx;
    margin-right: 24rpx;
    vertical-align: top;
}

.layout-image {
    width: 320rpx;
    height: 240rpx;
    border-radius: 12rpx;
    display: block;
}

.layout-type {
    display: block;
    font-size: 28rpx;
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
    font-size: 28rpx;
    color: #E53935;
    font-weight: bold;
    margin-top: 8rpx;
}

.selling-points {
    background: #FFF;
    padding: 32rpx;
    margin-bottom: 20rpx;
}

.points-content {
    display: block;
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    margin-top: 16rpx;
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

.agent-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    background: #FFF;
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
