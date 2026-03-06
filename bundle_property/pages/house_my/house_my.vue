<template>
    <view class="my-page">
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

        <view class="header-bg">
            <view class="header-top">
                <view class="switch-btn" @click="showIdentityPopup = true">
                    <text>切换身份</text>
                    <u-icon name="arrow-down" size="16" color="#FFFFFF"></u-icon>
                </view>
                <view class="title-text">我的</view>
            </view>

            <view class="user-card">
                <view class="user-info">
                    <image class="avatar" :src="user.avatar || '/static/images/portrait_empty.png'" mode="aspectFill"></image>
                    <view class="user-text">
                        <text class="user-name">{{ user.name }}</text>
                        <text class="user-desc">Hi，欢迎使用诚兔邦房产</text>
                    </view>
                </view>
                <view class="stat-row">
                    <view class="stat-item">
                        <text class="stat-number">{{ statsTotal }}</text>
                        <text class="stat-label">已发房源</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-number">{{ user.collectCount }}</text>
                        <text class="stat-label">收藏房源</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-number">{{ user.viewHistory }}</text>
                        <text class="stat-label">浏览足迹</text>
                    </view>
                </view>
                <view class="safe-tip">
                    <u-icon name="shield" size="18" color="#4CAF50"></u-icon>
                    <text> 实力保障，守护您的房产交易</text>
                </view>
            </view>
        </view>

        <scroll-view class="content-scroll" scroll-y>
            <view class="card publish-card">
                <view class="card-title-row">
                    <text class="card-title">我的发布</text>
                </view>
                <view class="publish-grid">
                    <view
                        class="publish-item"
                        v-for="item in publishTypes"
                        :key="item.key"
                        @click="goMyPublish(item.key)"
                    >
                        <view class="publish-icon" :class="'type-' + item.key">
                            <u-icon :name="item.icon" size="32" color="#FFFFFF"></u-icon>
                        </view>
                        <text class="publish-text">{{ item.label }}</text>
                    </view>
                </view>
            </view>

            <view class="card tools-card">
                <view class="card-title-row">
                    <text class="card-title">常用工具</text>
                </view>
                <view class="tools-list">
                    <view class="tool-item" @click="goIdentityApply">
                        <view class="tool-left">
                            <u-icon name="account" size="22" color="#4CAF50"></u-icon>
                            <text class="tool-text">申请入驻</text>
                        </view>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                    <view class="tool-item" @click="goMyViewing" v-if="showCustomerViewingEntry">
                        <view class="tool-left">
                            <u-icon name="calendar" size="22" color="#4CAF50"></u-icon>
                            <text class="tool-text">客户预约看房</text>
                        </view>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                    <view class="tool-item" @click="goMyViewing" v-else>
                        <view class="tool-left">
                            <u-icon name="calendar" size="22" color="#4CAF50"></u-icon>
                            <text class="tool-text">我的预约</text>
                        </view>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                    <view class="tool-item" @click="goNewsList">
                        <view class="tool-left">
                            <u-icon name="file-text" size="22" color="#4CAF50"></u-icon>
                            <text class="tool-text">购房资讯</text>
                        </view>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                    <view class="tool-item" @click="goVip">
                        <view class="tool-left">
                            <u-icon name="vip" size="22" color="#4CAF50"></u-icon>
                            <text class="tool-text">开通会员</text>
                        </view>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                </view>
            </view>
        </scroll-view>

        <u-popup
            v-model="showIdentityPopup"
            mode="bottom"
            border-radius="24"
            safe-area-inset-bottom
        >
            <view class="identity-popup">
                <view class="identity-title">切换身份</view>
                <view
                    v-for="item in identityList"
                    :key="item.key"
                    class="identity-item"
                >
                    <view class="identity-main" :class="{ active: currentIdentity === item.key }">
                        <view class="identity-left">
                            <text class="identity-name">{{ item.label }}</text>
                            <view class="identity-desc-row">
                                <text v-if="item.tag" class="identity-tag">{{ item.tag }}</text>
                                <text class="identity-desc">{{ item.desc }}</text>
                            </view>
                        </view>
                        <view class="identity-right">
                            <text v-if="currentIdentity === item.key" class="identity-current">当前</text>
                            <u-icon
                                v-if="currentIdentity === item.key"
                                name="checkmark-circle-fill"
                                size="20"
                                color="#4CAF50"
                            ></u-icon>
                        </view>
                    </view>
                    <view class="identity-btn-row" v-if="currentIdentity !== item.key">
                        <button class="identity-btn" @click="switchIdentity(item)">切换身份</button>
                    </view>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMyPropertyStats, getMyPropertyIdentities } from '@/api/store'

export default {
    name: 'HouseMy',
    data() {
        return {
            statusBarHeight: 0,
            stats: {},
            collectCount: 0,
            viewHistory: 0,
            showIdentityPopup: false,
            currentIdentity: 'personal',
            identities: { agent: false, agency: false },
            publishTypes: [
                { key: 'secondhand', label: '二手房', icon: 'home' },
                { key: 'rent', label: '租房', icon: 'home' },
                { key: 'shop', label: '商铺写字楼', icon: 'order' },
                { key: 'factory', label: '厂房仓库', icon: 'list' },
                { key: 'parking', label: '车位', icon: 'car' }
            ],
            identityList: [
                { key: 'personal', label: '个人', tag: '默认', desc: '个人买房租房，房东出租出售' },
                { key: 'agent', label: '经纪人', tag: '', desc: '我的资料、客户/房源管理' },
                { key: 'company', label: '经纪公司', tag: '', desc: '我的门店、客户/房源管理' }
            ]
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
        user() {
            const u = this.userInfo || {}
            return {
                avatar: u.avatar,
                name: u.nickname || '未登录',
                collectCount: this.collectCount,
                viewHistory: this.viewHistory
            }
        },
        statsTotal() {
            const s = this.stats
            return ((s.secondhand?.total || 0) + (s.rent?.total || 0) + (s.shop?.total || 0) + (s.factory?.total || 0) + (s.parking?.total || 0)) || 0
        },
        showCustomerViewingEntry() {
            return (this.currentIdentity === 'agent' && this.identities.agent) || (this.currentIdentity === 'company' && this.identities.agency)
        }
    },
    onLoad() {
        const info = uni.getSystemInfoSync()
        this.statusBarHeight = info.statusBarHeight || 0
        this.loadStats()
        this.loadIdentities()
    },
    onShow() {
        this.loadStats()
        this.loadIdentities()
    },
    methods: {
        loadStats() {
            getMyPropertyStats().then(res => {
                if (res && res.code === 1 && res.data) {
                    this.stats = res.data
                }
            }).catch(() => {})
        },
        loadIdentities() {
            getMyPropertyIdentities().then(res => {
                if (res && res.code === 1 && res.data) {
                    this.identities = { agent: !!res.data.agent, agency: !!res.data.agency }
                }
            }).catch(() => {})
        },
        switchIdentity(item) {
            const key = item.key
            const label = key === 'personal' ? '个人' : key === 'agent' ? '经纪人' : '经纪公司'
            if (key === 'agent' && !this.identities.agent) {
                uni.showToast({ title: '您尚未通过经纪人审核，请先提交入驻审核', icon: 'none', duration: 2500 })
                this.showIdentityPopup = false
                setTimeout(() => {
                    uni.navigateTo({ url: '/bundle_property/pages/house_identity_apply/house_identity_apply?from=my' })
                }, 500)
                return
            }
            if (key === 'company' && !this.identities.agency) {
                uni.showToast({ title: '您尚未通过经纪公司审核，请先提交入驻审核', icon: 'none', duration: 2500 })
                this.showIdentityPopup = false
                setTimeout(() => {
                    uni.navigateTo({ url: '/bundle_property/pages/house_identity_apply/house_identity_apply?from=my' })
                }, 500)
                return
            }
            this.currentIdentity = key
            this.showIdentityPopup = false
            uni.showToast({ title: '已切换为' + label, icon: 'none' })
        },
        goIdentityApply() {
            uni.navigateTo({
                url: '/bundle_property/pages/house_identity_apply/house_identity_apply?from=my'
            })
        },
        goMyViewing() {
            uni.navigateTo({
                url: '/bundle_property/pages/house_my_viewing/house_my_viewing'
            })
        },
        goMyPublish(type) {
            uni.navigateTo({
                url: '/bundle_property/pages/house_my_publish/house_my_publish?type=' + type
            })
        },
        goNewsList() {
            uni.navigateTo({
                url: '/bundle_property/pages/house_news_list/house_news_list'
            })
        },
        goVip() {
            uni.navigateTo({
                url: '/bundle_property/pages/house_vip/house_vip'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.my-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
}

.status-bar {
    width: 100%;
    background: linear-gradient(180deg, #4CAF50 0%, #45A049 100%);
}

.header-bg {
    background: linear-gradient(180deg, #4CAF50 0%, #45A049 100%);
    padding: 0 30rpx 40rpx;
}

.header-top {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.switch-btn {
    padding: 10rpx 20rpx;
    border-radius: 32rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #FFFFFF;
}

.switch-btn text {
    margin-right: 6rpx;
}

.title-text {
    font-size: 32rpx;
    color: #FFFFFF;
}

.user-card {
    margin-top: 10rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 24rpx 24rpx 20rpx;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 48rpx;
    margin-right: 20rpx;
}

.user-text {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-size: 32rpx;
    color: #333333;
    margin-bottom: 6rpx;
}

.user-desc {
    font-size: 24rpx;
    color: #FFFFFF;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 0 16rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.stat-item {
    flex: 1;
    align-items: center;
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 4rpx;
}

.stat-label {
    font-size: 22rpx;
    color: #999999;
}

.safe-tip {
    margin-top: 14rpx;
    font-size: 22rpx;
    color: #4CAF50;
    display: flex;
    align-items: center;
}

.content-scroll {
    flex: 1;
    padding: 0 30rpx 20rpx;
}

.card {
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 24rpx;
    margin-top: -40rpx;
    margin-bottom: 20rpx;
}

.publish-card {
    margin-top: -40rpx;
}

.tools-card {
    margin-top: 0;
}

.card-title-row {
    margin-bottom: 20rpx;
}

.card-title {
    font-size: 30rpx;
    color: #333333;
    font-weight: 500;
}

.publish-grid {
    display: flex;
    justify-content: space-between;
}

.publish-item {
    flex: 1;
    align-items: center;
    text-align: center;
}

.publish-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10rpx;
    background: #4CAF50;
}

.publish-text {
    font-size: 24rpx;
    color: #333333;
}

.tools-list {
    border-top: 1rpx solid #F5F5F5;
}

.tool-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22rpx 0;
    border-bottom: 1rpx solid #F5F5F5;
}

.tool-left {
    display: flex;
    align-items: center;
}

.tool-text {
    margin-left: 12rpx;
    font-size: 26rpx;
    color: #333333;
}

.identity-popup {
    padding: 30rpx;
    background: #FFFFFF;
}

.identity-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
}

.identity-item {
    margin-bottom: 20rpx;
}

.identity-main {
    background: #F8F8F8;
    border-radius: 18rpx;
    padding: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.identity-main.active {
    border: 1rpx solid #4CAF50;
    background: #E8F5E9;
}

.identity-left {
    flex: 1;
}

.identity-name {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 6rpx;
}

.identity-desc-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.identity-tag {
    font-size: 20rpx;
    color: #4CAF50;
    border-radius: 18rpx;
    padding: 4rpx 10rpx;
    background: #E8F5E9;
    margin-right: 8rpx;
}

.identity-desc {
    font-size: 22rpx;
    color: #666666;
}

.identity-right {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.identity-current {
    font-size: 22rpx;
    color: #4CAF50;
}

.identity-btn-row {
    margin-top: 12rpx;
    display: flex;
    justify-content: flex-end;
}

.identity-btn {
    height: 64rpx;
    padding: 0 36rpx;
    border-radius: 32rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    font-size: 26rpx;
    border: none;
}

.identity-btn::after {
    border: none;
}
</style>

