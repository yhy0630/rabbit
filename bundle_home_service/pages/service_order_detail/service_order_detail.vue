<template>
    <view class="service-order-detail-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">订单详情</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y v-if="orderDetail.id">
            <!-- 订单状态 -->
            <view class="status-card">
                <view class="status-text" :class="statusClass">
                    {{ getStatusText(orderDetail.status, orderDetail.pay_status) }}
                </view>
                <view class="status-desc" v-if="orderDetail.status === 0 && orderDetail.pay_status === 0">
                    请尽快完成支付，超时订单将自动取消
                </view>
            </view>

            <!-- 服务地址 -->
            <view class="info-card">
                <view class="card-title">服务地址</view>
                <view class="address-info">
                    <view class="address-header">
                        <text class="contact-name">{{ orderDetail.contact_name }}</text>
                        <text class="contact-phone">{{ orderDetail.contact_phone }}</text>
                    </view>
                    <view class="address-detail">{{ orderDetail.address }}</view>
                </view>
            </view>

            <!-- 服务信息 -->
            <view class="info-card">
                <view class="card-title">服务信息</view>
                <view class="service-info">
                    <text class="service-name">{{ orderDetail.service_name }}</text>
                    <view class="service-detail" v-if="orderDetail.appointment_time">
                        <text class="detail-label">上门时间：</text>
                        <text class="detail-value">{{ orderDetail.appointment_time }}</text>
                    </view>
                    <view class="service-detail" v-if="orderDetail.service_remark">
                        <text class="detail-label">服务备注：</text>
                        <text class="detail-value">{{ orderDetail.service_remark }}</text>
                    </view>
                </view>
            </view>

            <!-- 上传照片 -->
            <view class="info-card" v-if="orderDetail.images">
                <view class="card-title">上传照片</view>
                <view class="images-container">
                    <image 
                        v-for="(img, index) in imageList" 
                        :key="index"
                        :src="img" 
                        mode="aspectFill" 
                        class="upload-image"
                        @click="previewImage(index)"
                    ></image>
                </view>
            </view>

            <!-- 订单信息 -->
            <view class="info-card">
                <view class="card-title">订单信息</view>
                <view class="order-info-item">
                    <text class="info-label">订单号：</text>
                    <text class="info-value">{{ orderDetail.order_sn }}</text>
                </view>
                <view class="order-info-item">
                    <text class="info-label">下单时间：</text>
                    <text class="info-value">{{ formatTime(orderDetail.create_time) }}</text>
                </view>
                <view class="order-info-item">
                    <text class="info-label">服务价格：</text>
                    <text class="info-value">¥{{ orderDetail.service_price.toFixed(2) }}</text>
                </view>
                <view class="order-info-item total">
                    <text class="info-label">合计：</text>
                    <text class="info-value price">¥{{ orderDetail.total_amount.toFixed(2) }}</text>
                </view>
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="footer-bar" v-if="orderDetail.id">
            <button 
                class="footer-btn cancel-btn" 
                v-if="orderDetail.status === 0 && orderDetail.pay_status === 0"
                @click="cancelOrder"
            >
                取消订单
            </button>
            <button 
                class="footer-btn pay-btn" 
                v-if="orderDetail.status === 0 && orderDetail.pay_status === 0"
                @click="goToPay"
            >
                立即支付
            </button>
        </view>
    </view>
</template>

<script>
import { getHomeServiceOrderDetail } from '@/api/store'

export default {
    name: 'ServiceOrderDetail',
    data() {
        return {
            statusBarHeight: 0,
            orderId: 0,
            orderDetail: {},
            imageList: []
        }
    },
    onLoad(options) {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        if (options.id) {
            this.orderId = parseInt(options.id);
            this.loadOrderDetail();
            }
        },
        computed: {
            statusClass() {
                return this.getStatusClass(this.orderDetail.status, this.orderDetail.pay_status);
            }
        },
        methods: {
        goBack() {
            uni.navigateBack();
        },
        async loadOrderDetail() {
            uni.showLoading({ title: '加载中...' });
            try {
                const res = await getHomeServiceOrderDetail({ id: this.orderId });
                if (res.code === 1 && res.data) {
                    this.orderDetail = res.data;
                    
                    // 处理图片列表
                    if (res.data.images) {
                        this.imageList = res.data.images.split(',').filter(url => url);
                    }
                } else {
                    uni.showToast({
                        title: res.msg || '获取订单详情失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.error('加载订单详情失败:', error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            } finally {
                uni.hideLoading();
            }
        },
        getStatusText(status, payStatus) {
            if (status === 0 && payStatus === 0) {
                return '待付款';
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
        formatTime(timestamp) {
            if (!timestamp) return '';
            const date = new Date(timestamp * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}`;
        },
        previewImage(index) {
            uni.previewImage({
                urls: this.imageList,
                current: index
            });
        },
        cancelOrder() {
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
                        setTimeout(() => {
                            uni.navigateBack();
                        }, 1500);
                    }
                }
            });
        },
        goToPay() {
            uni.redirectTo({
                url: `/pages/payment/payment?order_id=${this.orderDetail.id}&amount=${this.orderDetail.total_amount}&type=home_service`
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-order-detail-page {
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

.content-scroll {
    flex: 1;
    width: 100%;
    padding: 20rpx;
    padding-bottom: 200rpx;
}

.status-card {
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    border-radius: 16rpx;
    padding: 40rpx 30rpx;
    margin-bottom: 20rpx;
    text-align: center;
}

.status-text {
    font-size: 48rpx;
    font-weight: bold;
    color: #FFFFFF;
    margin-bottom: 10rpx;
}

.status-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
}

.status-pending {
    color: #FFEB3B;
}

.status-waiting {
    color: #FF9800;
}

.status-completed {
    color: #FFFFFF;
}

.status-cancelled {
    color: #CCCCCC;
}

.info-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.card-title {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.address-info {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.address-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.contact-name {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.contact-phone {
    font-size: 28rpx;
    color: #333333;
}

.address-detail {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.6;
}

.service-info {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.service-name {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.service-detail {
    display: flex;
    font-size: 26rpx;
    color: #666666;
}

.detail-label {
    color: #999999;
}

.detail-value {
    color: #666666;
    flex: 1;
}

.images-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-top: 20rpx;
}

.upload-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
}

.order-info-item {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
    font-size: 26rpx;
}

.order-info-item.total {
    border-top: 1rpx solid #F0F0F0;
    margin-top: 10rpx;
    padding-top: 20rpx;
}

.info-label {
    color: #999999;
}

.info-value {
    color: #333333;
}

.info-value.price {
    color: #FF5722;
    font-weight: bold;
    font-size: 32rpx;
}

.footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    display: flex;
    gap: 20rpx;
    border-top: 1rpx solid #E0E0E0;
    z-index: 100;
    box-sizing: border-box;
}

.footer-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cancel-btn {
    background-color: #F5F5F5;
    color: #666666;
}

.pay-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
}

.footer-btn::after {
    border: none;
}
</style>

