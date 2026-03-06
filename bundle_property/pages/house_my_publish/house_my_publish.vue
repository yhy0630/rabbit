<template>
    <view class="publish-list-page">
        <custom-navbar :title="pageTitle"></custom-navbar>

        <view class="tab-bar">
            <view
                v-for="tab in tabs"
                :key="tab.key"
                class="tab-item"
                :class="{ active: currentTab === tab.key }"
                @click="currentTab = tab.key"
            >
                {{ tab.label }}
            </view>
        </view>

        <scroll-view class="content-scroll" scroll-y @scrolltolower="loadMore">
            <view class="tip-bar">
                <text>{{ currentTab === 'online' ? '显示中' : '已下架' }} {{ filteredList.length }} 套房源</text>
            </view>
            <view v-if="loading && filteredList.length === 0" class="empty-tip">加载中...</view>
            <view v-else-if="!loading && filteredList.length === 0" class="empty-tip">暂无房源</view>
            <view
                v-else
                class="house-card"
                v-for="(item, index) in filteredList"
                :key="item.id || index"
            >
                <view class="card-main" @click="goDetail(item)">
                    <image
                        class="card-img"
                        :src="item.image || defaultImg"
                        mode="aspectFill"
                    ></image>
                    <view class="card-info">
                        <view class="card-title-row">
                            <text class="card-title">{{ item.title }}</text>
                        </view>
                        <text class="card-sub">{{ item.location || item.community || item.address }}</text>
                        <view class="card-tags">
                            <text class="tag" v-if="item.type">{{ item.type }}</text>
                            <text class="tag" v-if="item.area">{{ item.area }}</text>
                            <text class="tag status-tag">{{ item.status_text }}</text>
                        </view>
                        <view class="card-footer">
                            <text class="price">{{ item.price || '面议' }}</text>
                        </view>
                    </view>
                </view>

                <view class="card-extra" v-if="currentTab === 'offline'">
                    <text>下架时间：{{ formatTime(item.update_time) }}</text>
                </view>

                <view class="card-actions">
                    <button class="btn ghost" @click.stop="edit(item)">编辑</button>
                    <button
                        v-if="currentTab === 'online'"
                        class="btn ghost"
                        @click.stop="offline(item)"
                    >
                        下架
                    </button>
                    <button
                        v-if="currentTab === 'offline'"
                        class="btn primary"
                        @click.stop="relist(item)"
                    >
                        再次上架
                    </button>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getMyPropertyList, togglePropertyStatus } from '@/api/store'

export default {
    name: 'HouseMyPublish',
    components: { CustomNavbar },
    data() {
        return {
            type: 'rent',
            currentTab: 'online',
            tabs: [
                { key: 'online', label: '显示中' },
                { key: 'offline', label: '已下架' }
            ],
            defaultImg: '/static/images/portrait_empty.png',
            listOnline: [],
            listOffline: [],
            loading: false,
            pageOnline: 1,
            pageOffline: 1,
            hasMoreOnline: true,
            hasMoreOffline: true
        }
    },
    computed: {
        pageTitle() {
            switch (this.type) {
                case 'secondhand': return '我的发布-二手房'
                case 'shop': return '我的发布-商铺写字楼'
                case 'factory': return '我的发布-厂房仓库'
                case 'parking': return '我的发布-车位'
                default: return '我的发布-房屋出租'
            }
        },
        filteredList() {
            return this.currentTab === 'online' ? this.listOnline : this.listOffline
        }
    },
    watch: {
        currentTab() {
            if (this.currentTab === 'online' && this.listOnline.length === 0) {
                this.loadList()
            } else if (this.currentTab === 'offline' && this.listOffline.length === 0) {
                this.loadList()
            }
        }
    },
    onLoad(options) {
        if (options.type) this.type = options.type
        this.loadList()
    },
    onShow() {
        this.loadList()
    },
    methods: {
        formatTime(t) {
            if (!t) return '-'
            const d = new Date(t * 1000)
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
        },
        loadList(reset) {
            if (this.loading) return
            const status = this.currentTab === 'online' ? 1 : 2
            const pageKey = this.currentTab === 'online' ? 'pageOnline' : 'pageOffline'
            const hasMoreKey = this.currentTab === 'online' ? 'hasMoreOnline' : 'hasMoreOffline'
            if (reset) {
                this[pageKey] = 1
                this[hasMoreKey] = true
                if (this.currentTab === 'online') this.listOnline = []
                else this.listOffline = []
            }
            if (!this[hasMoreKey]) return
            this.loading = true
            const page = this[pageKey]
            getMyPropertyList({
                type: this.type,
                status,
                page,
                limit: 20
            }).then(res => {
                this.loading = false
                if (res && res.code === 1 && res.data) {
                    const list = res.data.lists || []
                    if (this.currentTab === 'online') {
                        this.listOnline = reset ? list : [...this.listOnline, ...list]
                    } else {
                        this.listOffline = reset ? list : [...this.listOffline, ...list]
                    }
                    this[hasMoreKey] = list.length >= 20
                    if (list.length >= 20) this[pageKey] = page + 1
                }
            }).catch(() => { this.loading = false })
        },
        loadMore() {
            this.loadList(false)
        },
        goDetail(item) {
            if (item.status === 1) {
                uni.navigateTo({ url: '/bundle_property/pages/house_detail/house_detail?id=' + item.id })
            }
        },
        edit(item) {
            const code = item.category_code || ''
            let url = ''
            if (code === 'secondhand') url = '/bundle_property/pages/house_publish_sell/house_publish_sell?id=' + item.id
            else if (code === 'rent') url = '/bundle_property/pages/house_publish_rent/house_publish_rent?id=' + item.id
            else if (code === 'shop_office') url = '/bundle_property/pages/house_publish_shop/house_publish_shop?id=' + item.id
            else if (code === 'factory' || code === 'warehouse') url = '/bundle_property/pages/house_publish_factory/house_publish_factory?id=' + item.id
            else if (code === 'parking') url = '/bundle_property/pages/house_publish_parking/house_publish_parking?id=' + item.id
            else url = '/bundle_property/pages/house_publish_rent/house_publish_rent?id=' + item.id
            uni.navigateTo({ url })
        },
        offline(item) {
            uni.showModal({
                title: '确认下架',
                content: '确定要下架该房源吗？',
                success: (res) => {
                    if (res.confirm) {
                        togglePropertyStatus({ id: item.id, status: 2 }).then(r => {
                            if (r && r.code === 1) {
                                uni.showToast({ title: '已下架', icon: 'success' })
                                this.loadList(true)
                            } else {
                                uni.showToast({ title: r?.msg || '操作失败', icon: 'none' })
                            }
                        }).catch(() => uni.showToast({ title: '操作失败', icon: 'none' }))
                    }
                }
            })
        },
        relist(item) {
            togglePropertyStatus({ id: item.id, status: 1 }).then(r => {
                if (r && r.code === 1) {
                    uni.showToast({ title: '已上架', icon: 'success' })
                    this.loadList(true)
                } else {
                    uni.showToast({ title: r?.msg || '操作失败', icon: 'none' })
                }
            }).catch(() => uni.showToast({ title: '操作失败', icon: 'none' }))
        }
    }
}
</script>

<style lang="scss" scoped>
.publish-list-page {
    width: 100%;
    min-height: 100vh;
    background: #F5F5F7;
    padding-top: 88px;
}

.tab-bar {
    display: flex;
    background: #FFFFFF;
    border-bottom: 1rpx solid #F0F0F0;
}

.tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    font-size: 28rpx;
    color: #666666;
}

.tab-item.active {
    color: #4CAF50;
    border-bottom: 4rpx solid #4CAF50;
    font-weight: 500;
}

.content-scroll {
    height: calc(100vh - 88px - 88rpx);
    padding: 20rpx 20rpx 20rpx;
}

.tip-bar {
    padding: 12rpx 10rpx;
    font-size: 24rpx;
    color: #999999;
}

.house-card {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
}

.card-main {
    display: flex;
}

.card-img {
    width: 220rpx;
    height: 180rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
}

.card-info {
    flex: 1;
}

.card-title {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 8rpx;
}

.card-sub {
    font-size: 24rpx;
    color: #999999;
    margin-bottom: 8rpx;
}

.card-tags {
    font-size: 22rpx;
    color: #999999;
    margin-bottom: 8rpx;
}

.tag {
    margin-right: 12rpx;
}

.card-footer {
    display: flex;
    align-items: baseline;
    margin-top: 4rpx;
}

.price {
    font-size: 34rpx;
    font-weight: bold;
    color: #E53935;
    margin-right: 6rpx;
}

.unit {
    font-size: 24rpx;
    color: #E53935;
}

.card-extra {
    margin-top: 10rpx;
    font-size: 22rpx;
    color: #999999;
}

.empty-tip {
    padding: 60rpx;
    text-align: center;
    color: #999999;
    font-size: 26rpx;
}

.status-tag {
    color: #4CAF50;
}

.card-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-top: 16rpx;
}

.btn {
    min-width: 140rpx;
    height: 64rpx;
    border-radius: 32rpx;
    font-size: 24rpx;
    border-width: 1rpx;
}

.btn::after {
    border: none;
}

.btn.ghost {
    background: #FFFFFF;
    border-color: #DDDDDD;
    color: #666666;
}

.btn.primary {
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    border-color: transparent;
}
</style>

