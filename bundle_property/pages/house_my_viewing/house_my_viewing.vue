<template>
    <view class="viewing-page">
        <custom-navbar title="我的预约"></custom-navbar>

        <!-- 按房源选项卡 -->
        <view class="tabs-bar" v-if="listingTabs.length > 1">
            <scroll-view class="tabs-scroll" scroll-x scroll-with-animation :scroll-left="tabsScrollLeft">
                <view
                    v-for="(tab, idx) in listingTabs"
                    :key="tab.listing_id"
                    class="tab-item"
                    :class="{ active: currentTabIndex === idx }"
                    @click="currentTabIndex = idx"
                >
                    <text class="tab-title">{{ tab.listing_title || '房源' + tab.listing_id }}</text>
                    <text class="tab-count">({{ (tab.bookings || []).length }})</text>
                </view>
            </scroll-view>
        </view>

        <scroll-view class="content-scroll" scroll-y>
            <view class="tip-bar" v-if="currentBookings.length">
                {{ currentListingTitle }} 共 {{ currentBookings.length }} 条预约
            </view>
            <view v-if="loading" class="empty-tip">加载中...</view>
            <view v-else-if="!loading && listingTabs.length === 0" class="empty-tip">暂无预约记录，当有用户预约您发布的房源时会显示在这里</view>
            <view
                v-else-if="currentBookings.length > 0"
                class="booking-card"
                v-for="(item, index) in currentBookings"
                :key="item.id || index"
            >
                <view class="card-row">
                    <text class="label">预约用户</text>
                    <text class="value">{{ item.user_nickname || '—' }}</text>
                </view>
                <view class="card-row">
                    <text class="label">联系人</text>
                    <text class="value">{{ item.contact_name || '—' }}</text>
                </view>
                <view class="card-row">
                    <text class="label">联系电话</text>
                    <text class="value phone" @click="callPhone(item.contact_phone)">{{ item.contact_phone || '—' }}</text>
                </view>
                <view class="card-row">
                    <text class="label">预约看房时间</text>
                    <text class="value">{{ item.booking_time_text || '—' }}</text>
                </view>
                <view class="card-row">
                    <text class="label">提交时间</text>
                    <text class="value time-sub">{{ item.create_time_text || '—' }}</text>
                </view>
                <view class="card-actions">
                    <button class="btn-call" @click="callPhone(item.contact_phone)">
                        <u-icon name="phone" size="20" color="#FFF"></u-icon>
                        <text>拨打电话</text>
                    </button>
                </view>
            </view>
            <view v-else-if="listingTabs.length > 0" class="empty-tip">该房源暂无预约</view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getMyViewingBookingsGrouped } from '@/api/store'

export default {
    name: 'HouseMyViewing',
    components: { CustomNavbar },
    data() {
        return {
            listingTabs: [],
            currentTabIndex: 0,
            loading: false,
            tabsScrollLeft: 0
        }
    },
    computed: {
        currentBookings() {
            const t = this.listingTabs[this.currentTabIndex]
            return t && t.bookings ? t.bookings : []
        },
        currentListingTitle() {
            const t = this.listingTabs[this.currentTabIndex]
            return t && t.listing_title ? t.listing_title : '当前房源'
        }
    },
    onLoad() {
        this.loadList()
    },
    methods: {
        loadList() {
            if (this.loading) return
            this.loading = true
            getMyViewingBookingsGrouped().then(res => {
                this.loading = false
                if (res && res.code === 1 && res.data) {
                    const list = res.data.list || []
                    this.listingTabs = list
                    if (this.currentTabIndex >= list.length) {
                        this.currentTabIndex = Math.max(0, list.length - 1)
                    }
                }
            }).catch(() => {
                this.loading = false
            })
        },
        callPhone(phone) {
            if (!phone) {
                uni.showToast({ title: '暂无联系电话', icon: 'none' })
                return
            }
            uni.makePhoneCall({ phoneNumber: String(phone).replace(/\s/g, '') })
        }
    }
}
</script>

<style lang="scss" scoped>
.viewing-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F5;
    padding-top: 88px;
    display: flex;
    flex-direction: column;
}

.tabs-bar {
    background: #FFF;
    padding: 0 24rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.tabs-scroll {
    white-space: nowrap;
    padding: 20rpx 0;
}

.tab-item {
    display: inline-block;
    padding: 12rpx 24rpx;
    margin-right: 16rpx;
    border-radius: 32rpx;
    background: #F5F5F5;
}

.tab-item.active {
    background: #E8F5E9;
    color: #4CAF50;
}

.tab-title {
    font-size: 26rpx;
    color: #333;
}

.tab-item.active .tab-title {
    color: #4CAF50;
}

.tab-count {
    font-size: 22rpx;
    color: #999;
    margin-left: 4rpx;
}

.tab-item.active .tab-count {
    color: #4CAF50;
}

.content-scroll {
    flex: 1;
    height: calc(100vh - 88px - 80rpx);
}

.tip-bar {
    padding: 24rpx 30rpx;
    font-size: 26rpx;
    color: #666;
}

.empty-tip {
    padding: 80rpx 30rpx;
    text-align: center;
    font-size: 28rpx;
    color: #999;
}

.booking-card {
    background: #FFF;
    margin: 0 24rpx 24rpx;
    padding: 24rpx;
    border-radius: 16rpx;
}

.card-row {
    display: flex;
    align-items: flex-start;
    padding: 12rpx 0;
    font-size: 26rpx;
}

.card-row .label {
    width: 180rpx;
    color: #999;
    flex-shrink: 0;
}

.card-row .value {
    flex: 1;
    color: #333;
}

.card-row .value.phone {
    color: #4CAF50;
    text-decoration: underline;
}

.card-row .value.time-sub {
    color: #999;
    font-size: 24rpx;
}

.card-actions {
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #F0F0F0;
}

.btn-call {
    width: 100%;
    height: 72rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFF;
    font-size: 28rpx;
    border-radius: 36rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
}

.btn-call::after { border: none; }

</style>
