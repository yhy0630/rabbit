<template>
    <view class="service-order-detail-page">
        <!-- 自定义导航栏 -->
        <custom-navbar title="订单详情"></custom-navbar>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y v-if="orderDetail.id">
            <!-- 订单状态（图片样式：白色卡片） -->
            <view class="status-card">
                <text class="status-text">
                    {{ getStatusText(orderDetail.status, orderDetail.pay_status) }}
                </text>
            </view>

            <!-- 地址卡片（左侧地图图标 + 右侧箭头） -->
            <view class="address-card">
                <image class="address-icon" src="/static/images/map-pin-2-fill.png" mode="aspectFit"></image>
                <view class="address-main">
                    <text class="address-text">{{ displayAddress }}</text>
                    <view class="address-sub">
                        <text class="contact-name">{{ orderDetail.contact_name }}</text>
                        <text class="contact-phone">{{ orderDetail.contact_phone }}</text>
                    </view>
                </view>
                <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
            </view>

            <!-- 服务信息卡片（左图 + 名称 + 价格 + 说明） -->
            <view class="service-card">
                <image
                    class="service-image"
                    :src="orderDetail.service_info && orderDetail.service_info.avatar || orderDetail.service_image || orderDetail.service_img || orderDetail.image"
                    mode="aspectFill"
                ></image>
                <view class="service-main">
                    <text class="service-title">{{ orderDetail.service_name }}</text>
                    <view class="service-meta">
                        <text class="service-price">¥{{ formatPrice(orderDetail.service_price) }}</text>
                        <text class="service-desc" v-if="orderDetail.service_remark">说明</text>
                    </view>
                </view>
            </view>

            <!-- 上门时间（单行） -->
            <view class="time-row" v-if="orderDetail.appointment_time">
                <text class="time-label">上门时间</text>
                <text class="time-value">{{ orderDetail.appointment_time }}</text>
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
                <!-- <view class="order-info-item">
                    <text class="info-label">服务价格：</text>
                    <text class="info-value">¥{{ formatPrice(orderDetail.service_price) }}</text>
                </view> -->
                <!-- <view class="order-info-item total">
                    <text class="info-label">合计：</text>
                    <text class="info-value price">¥{{ formatPrice(orderDetail.total_amount) }}</text>
                </view> -->
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="footer-bar" v-if="orderDetail.id">
            <view class="footer-amount">
                <text class="amount-label">实付：</text>
                <text class="amount-value">
                    ¥{{ formatPrice(orderDetail.total_amount || orderDetail.pay_price || orderDetail.service_price) }}
                </text>
            </view>
            <view class="footer-actions">
                <button 
                    class="footer-btn cancel-btn" 
                    v-if="Number(orderDetail.status) === 0 && Number(orderDetail.pay_status) === 0"
                    @click="cancelOrder"
                >
                    取消订单
                </button>
                <button 
                    class="footer-btn pay-btn" 
                    v-if="Number(orderDetail.status) === 0 && Number(orderDetail.pay_status) === 0"
                    @click="goToPay"
                >
                    去支付
                </button>
                <button 
                    class="footer-btn cancel-btn" 
                    v-if="Number(orderDetail.status) === 0 && Number(orderDetail.pay_status) === 1"
                    @click="cancelOrder"
                >
                    取消订单
                </button>
                <button 
                    class="footer-btn cancel-btn" 
                    v-if="Number(orderDetail.status) === 1"
                    @click="applyRefund"
                >
                    申请退款
                </button>
                <button 
                    class="footer-btn detail-btn" 
                    v-if="Number(orderDetail.status) === 3"
                    @click="goToEvaluate"
                >
                    订单评价
                </button>
            </view>
        </view>
    </view>
</template>

<script>
import { getHomeServiceOrderDetail } from '@/api/store'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'ServiceOrderDetail',
    components: {
        CustomNavbar
    },
    computed: {
        statusClass() {
            return this.getStatusClass(this.orderDetail.status, this.orderDetail.pay_status);
        },
        displayAddress() {
            const d = this.orderDetail || {};
            // 兼容不同字段命名：service_address / address / province+city+district+address
            const addr =
                d.service_address ||
                d.address ||
                [d.province, d.city, d.district, d.address_detail || d.detail_address].filter(Boolean).join(' ') ||
                '';
            return addr || '-';
        }
    },
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
        methods: {
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
            const s = Number(status);
            const p = Number(payStatus);
            if (s === 0 && p === 0) {
                return '待付款';
            } else if (s === 0 && p === 1) {
                return '待接单';
            } else if (s === 1) {
                return '待服务';
            } else if (s === 2) {
                return '服务中';
            } else if (s === 3) {
                return '已完成';
            } else if (s === 4) {
                return '已取消';
            }
            return '未知';
        },
        getStatusClass(status, payStatus) {
            const s = Number(status);
            const p = Number(payStatus);
            if (s === 0 && p === 0) {
                return 'status-pending';
            } else if (s === 0 && p === 1) {
                return 'status-pending-accept';
            } else if (s === 1) {
                return 'status-waiting';
            } else if (s === 3) {
                return 'status-completed';
            } else if (s === 4) {
                return 'status-cancelled';
            }
            return '';
        },
        formatPrice(value) {
            const n = Number(value);
            if (Number.isFinite(n)) return n.toFixed(2);
            return '0.00';
        },
        formatTime(timestamp) {
            if (!timestamp) return '';
            // 接口可能返回：秒级时间戳 / 毫秒时间戳 / 已格式化字符串
            if (typeof timestamp === 'string') {
                // 已格式化时间直接返回
                if (timestamp.includes('-') || timestamp.includes('/')) return timestamp;
                const parsed = Number(timestamp);
                if (Number.isFinite(parsed)) timestamp = parsed;
            }

            let ms = Number(timestamp);
            if (!Number.isFinite(ms)) return '';
            // 10位通常是秒级，13位通常是毫秒级
            if (String(Math.floor(ms)).length === 10) ms = ms * 1000;
            const date = new Date(ms);
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
        applyRefund() {
            uni.showModal({
                title: '提示',
                content: '确定要申请退款吗？',
                success: (res) => {
                    if (res.confirm) {
                        // TODO: 调用申请退款接口
                        uni.showToast({
                            title: '退款申请已提交',
                            icon: 'success'
                        });
                        setTimeout(() => {
                            this.loadOrderDetail();
                        }, 1500);
                    }
                }
            });
        },
        goToPay() {
            uni.redirectTo({
                url: `/pages/payment/payment?order_id=${this.orderDetail.id}&amount=${this.orderDetail.total_amount}&type=home_service`
            });
        },
        goToEvaluate() {
            uni.navigateTo({
                url: `/bundle_home_service/pages/service_order_evaluate/service_order_evaluate?order_id=${this.orderDetail.id}`,
                fail: (err) => {
                    console.error('跳转评价页面失败:', err);
                    uni.showToast({
                        title: '页面不存在',
                        icon: 'none'
                    });
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-order-detail-page {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(180deg, #B2ED76 10%, rgba(178, 237, 118, 0) 40%);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: calc(128rpx + var(--status-bar-height));
}

.content-scroll {
    flex: 1;
    width: 100%;
    padding: 20rpx;
    padding-bottom: 200rpx;
    box-sizing: border-box;
}

.status-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 26rpx 30rpx;
    margin-bottom: 20rpx;
}

.status-text {
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
}

.address-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 26rpx 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: flex-start;
    gap: 18rpx;
}

.address-icon {
    width: 44rpx;
    height: 44rpx;
    flex-shrink: 0;
    margin-top: 4rpx;
}

.address-main {
    flex: 1;
    min-width: 0;
}

.address-text {
    display: block;
    font-size: 28rpx;
    color: #333333;
    line-height: 1.4;
    margin-bottom: 10rpx;
}

.address-sub {
    display: flex;
    align-items: center;
    gap: 16rpx;
    font-size: 26rpx;
    color: #666666;
}

.service-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 26rpx 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    gap: 20rpx;
    align-items: center;
}

.service-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
}

.service-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.service-title {
    font-size: 28rpx;
    color: #333333;
    font-weight: 600;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.service-meta {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.service-price {
    font-size: 28rpx;
    color: #FF3B30;
    font-weight: 600;
}

.service-desc {
    font-size: 24rpx;
    color: #999999;
    padding: 6rpx 14rpx;
    border-radius: 999rpx;
    background-color: #F4F5F6;
}

.time-row {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 26rpx 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
}

.time-label {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.time-value {
    font-size: 26rpx;
    color: #333333;
    font-weight: 600;

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
    font-weight: 600;
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
    color: #333;
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
    align-items: center;
    justify-content: space-between;
    border-top: 1rpx solid #E0E0E0;
    z-index: 100;
    box-sizing: border-box;
}

.footer-amount {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 28rpx;
}

.amount-label {
    color: #333333;
}

.amount-value {
    margin-left: 6rpx;
    color: #FF3B30;
    font-size: 30rpx;
    font-weight: 600;
}

.footer-actions {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.footer-btn {
    height: 68rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40rpx;
}

.cancel-btn {
    background-color: #FFFFFF;
    color: #149906;
    border: 1rpx solid #149906;
}

.pay-btn {
    background: linear-gradient(90deg, #2B920A 0%, #E9F66B 100%);
    color: #FFFFFF;
}

.detail-btn {
    background-color: #FFFFFF;
    color: #149906;
    border: 1rpx solid #149906;
}

.footer-btn::after {
    border: none;
}
</style>

