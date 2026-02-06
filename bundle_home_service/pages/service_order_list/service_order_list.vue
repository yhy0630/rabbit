<template>
    <view class="service-order-list-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">我的订单</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 标签页 -->
        <view class="tabs-container">
            <view 
                class="tab-item" 
                v-for="(tab, index) in tabs" 
                :key="index"
                :class="{ active: currentTab === index }"
                @click="switchTab(index)"
            >
                <text>{{ tab.name }}</text>
            </view>
        </view>

        <!-- 订单列表 -->
        <scroll-view class="content-scroll" scroll-y @scrolltolower="loadMore" v-if="orderList.length > 0">
            <view class="order-item" v-for="(item, index) in orderList" :key="index" @click="goToDetail(item.id)">
                <view class="order-header">
                    <text class="order-sn">订单号：{{ item.order_sn }}</text>
                    <text class="order-status" :class="{
                        'status-pending': item.status === 0 && item.pay_status === 0,
                        'status-pending-accept': item.status === 0 && item.pay_status === 1,
                        'status-waiting': item.status === 1,
                        'status-completed': item.status === 3,
                        'status-cancelled': item.status === 4
                    }">
                        {{ getStatusText(item.status, item.pay_status) }}
                    </text>
                </view>
                <view class="order-content">
                    <text class="service-name">{{ item.service_name }}</text>
                    <view class="order-info">
                        <text class="appointment-time" v-if="item.appointment_time">上门时间：{{ item.appointment_time }}</text>
                    </view>
                </view>
                <view class="order-footer">
                    <text class="order-price">¥{{ Number(item.total_amount || 0).toFixed(2) }}</text>
                    <view class="order-actions">
                        <button 
                            class="action-btn cancel-btn" 
                            v-if="item.status === 0 && item.pay_status === 0"
                            @click.stop="cancelOrder(item.id)"
                        >
                            取消订单
                        </button>
                        <button 
                            class="action-btn pay-btn" 
                            v-if="item.status === 0 && item.pay_status === 0"
                            @click.stop="goToPay(item)"
                        >
                            立即支付
                        </button>
                        <button 
                            class="action-btn detail-btn" 
                            v-if="item.status === 0 && item.pay_status === 1"
                            @click.stop="goToDetail(item.id)"
                        >
                            查看详情
                        </button>
                        <button 
                            class="action-btn detail-btn" 
                            v-else
                            @click.stop="goToDetail(item.id)"
                        >
                            查看详情
                        </button>
                    </view>
                </view>
            </view>
            
            <!-- 加载更多 -->
            <view class="load-more" v-if="hasMore">
                <u-loading mode="circle" :show="loading"></u-loading>
                <text class="load-more-text">{{ loading ? '加载中...' : '上拉加载更多' }}</text>
            </view>
            <view class="no-more" v-else>
                <text>没有更多了</text>
            </view>
        </scroll-view>

        <!-- 空状态 -->
        <view class="empty-state" v-else>
            <u-empty mode="order" text="暂无订单"></u-empty>
        </view>
    </view>
</template>

<script>
import { getHomeServiceOrderList } from '@/api/store'

export default {
    name: 'ServiceOrderList',
    data() {
        return {
            statusBarHeight: 0,
            currentTab: 0,
            tabs: [
                { name: '全部', status: '', pay_status: '' },
                { name: '待付款', status: 0, pay_status: 0 },
                { name: '待接单', status: 0, pay_status: 1 },
                { name: '待服务', status: 1, pay_status: '' },
                { name: '已完成', status: 3, pay_status: '' }
            ],
            orderList: [],
            page: 1,
            limit: 20,
            hasMore: true,
            loading: false
        }
    },
    onLoad(options) {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        // 如果有传入状态参数，切换到对应标签
        if (options.status !== undefined) {
            const status = parseInt(options.status);
            const tabIndex = this.tabs.findIndex(tab => {
                if (status === 0) return tab.status === 0;
                if (status === 1) return tab.status === 1;
                if (status === 3) return tab.status === 3;
                return false;
            });
            if (tabIndex >= 0) {
                this.currentTab = tabIndex;
            }
        }
        
        this.loadOrderList();
    },
    onShow() {
        // 从支付页面返回时刷新列表
        this.page = 1;
        this.hasMore = true;
        this.loadOrderList();
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        switchTab(index) {
            this.currentTab = index;
            this.page = 1;
            this.hasMore = true;
            this.orderList = [];
            this.loadOrderList();
        },
        async loadOrderList() {
            if (this.loading) return;
            
            this.loading = true;
            try {
                const params = {
                    page: this.page,
                    limit: this.limit
                };
                
                const currentTab = this.tabs[this.currentTab];
                if (currentTab.status !== '' && currentTab.status !== null && currentTab.status !== undefined) {
                    params.status = currentTab.status;
                }
                if (currentTab.pay_status !== '' && currentTab.pay_status !== null && currentTab.pay_status !== undefined) {
                    params.pay_status = currentTab.pay_status;
                }
                
                console.log('请求订单列表参数:', params);
                const res = await getHomeServiceOrderList(params);
                console.log('订单列表响应:', res);

                if (res.code === 1 && res.data) {
                    if (this.page === 1) {
                        this.orderList = res.data.lists || [];
                    } else {
                        this.orderList = [...this.orderList, ...(res.data.lists || [])];
                    }
                    
                    this.hasMore = res.data.lists && res.data.lists.length >= this.limit;
                } else {
                    // API返回错误
                    console.error('获取订单列表失败:', res.msg || '未知错误');
                    if (this.page === 1) {
                        this.orderList = [];
                    }
                    if (res.msg) {
                        uni.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            } catch (error) {
                console.error('加载订单列表失败:', error);
                if (this.page === 1) {
                    this.orderList = [];
                }
                uni.showToast({
                    title: '加载订单失败，请稍后重试',
                    icon: 'none',
                    duration: 2000
                });
            } finally {
                this.loading = false;
            }
        },
        loadMore() {
            if (this.hasMore && !this.loading) {
                this.page++;
                this.loadOrderList();
            }
        },
        getStatusText(status, payStatus) {
            if (status === 0 && payStatus === 0) {
                return '待付款';
            } else if (status === 0 && payStatus === 1) {
                return '待接单';
            } else if (status === 1) {
                return '待服务';
            } else if (status === 2) {
                return '服务中';
            } else if (status === 3) {
                return '已完成';
            } else if (status === 4) {
                return '已取消';
            }
            return '未知';
        },
        getStatusClass(status, payStatus) {
            // 此方法保留用于其他地方，但不在模板的:class中使用
            if (status === 0 && payStatus === 0) {
                return 'status-pending';
            } else if (status === 1) {
                return 'status-waiting';
            } else if (status === 3) {
                return 'status-completed';
            } else if (status === 4) {
                return 'status-cancelled';
            }
            return '';
        },
        goToDetail(orderId) {
            uni.navigateTo({
                url: `/bundle_home_service/pages/service_order_detail/service_order_detail?id=${orderId}`
            });
        },
        goToPay(order) {
            uni.redirectTo({
                url: `/pages/payment/payment?order_id=${order.id}&from=home_service&amount=${order.total_amount}`
            });
        },
        cancelOrder(orderId) {
            uni.showModal({
                title: '提示',
                content: '确定要取消这个订单吗？',
                success: (res) => {
                    if (res.confirm) {
                        // TODO: 调用取消订单接口
                        uni.showToast({
                            title: '订单已取消',
                            icon: 'success'
                        });
                        // 刷新列表
                        this.page = 1;
                        this.hasMore = true;
                        this.loadOrderList();
                    }
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-order-list-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.status-bar {
    width: 100%;
    background-color: #4CAF50;
}

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
    font-size: 36rpx;
    font-weight: bold;
}

.navbar-right {
    width: 60rpx;
}

.tabs-container {
    display: flex;
    background-color: #FFFFFF;
    border-bottom: 1rpx solid #E0E0E0;
}

.tab-item {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #666666;
    position: relative;
}

.tab-item.active {
    color: #4CAF50;
    font-weight: bold;
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60rpx;
    height: 4rpx;
    background-color: #4CAF50;
    border-radius: 2rpx;
}

.content-scroll {
    flex: 1;
    width: 100%;
    padding: 20rpx;
}

.order-item {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.order-sn {
    font-size: 24rpx;
    color: #999999;
}

.order-status {
    font-size: 28rpx;
    font-weight: bold;
}

.status-pending {
    color: #FF5722;
}

.status-pending-accept {
    color: #2196F3;
}

.status-waiting {
    color: #FF9800;
}

.status-completed {
    color: #4CAF50;
}

.status-cancelled {
    color: #999999;
}

.order-content {
    margin-bottom: 20rpx;
}

.service-name {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    display: block;
    margin-bottom: 10rpx;
}

.order-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.appointment-time {
    font-size: 24rpx;
    color: #666666;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid #F0F0F0;
}

.order-price {
    font-size: 32rpx;
    color: #FF5722;
    font-weight: bold;
}

.order-actions {
    display: flex;
    gap: 20rpx;
}

.action-btn {
    padding: 12rpx 32rpx;
    border-radius: 40rpx;
    font-size: 26rpx;
    border: none;
}

.cancel-btn {
    background-color: #F5F5F5;
    color: #666666;
}

.pay-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
}

.detail-btn {
    background-color: #F5F5F5;
    color: #333333;
}

.action-btn::after {
    border: none;
}

.load-more,
.no-more {
    text-align: center;
    padding: 40rpx 0;
    font-size: 24rpx;
    color: #999999;
}

.empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

