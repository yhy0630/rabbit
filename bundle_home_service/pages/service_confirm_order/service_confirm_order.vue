<template>
    <view class="service-confirm-order-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">确认订单</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 服务地址选择 -->
            <navigator hover-class="none" url="/bundle/pages/user_address/user_address?type=1">
                <view class="address-card">
                    <image class="address-icon" src="/static/images/icon_address.png"></image>
                    <view class="address-content">
                        <view class="address-info" v-if="!address.contact">
                            <text class="address-placeholder">设置服务地址</text>
                        </view>
                        <view class="address-info" v-else>
                            <view class="address-header">
                                <text class="address-name">{{ address.contact }}</text>
                                <text class="address-phone">{{ address.telephone }}</text>
                            </view>
                            <view class="address-detail">
                                {{ address.province }} {{ address.city }} {{ address.district }} {{ address.address }}
                            </view>
                        </view>
                    </view>
                    <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
                </view>
            </navigator>

            <!-- 服务信息 -->
            <view class="service-card">
                <image :src="serviceInfo.avatar" mode="aspectFill" class="service-image"></image>
                <view class="service-info">
                    <text class="service-name">{{ serviceInfo.name }}</text>
                    <view class="service-price">
                        <text class="price-symbol">¥</text>
                        <text class="price-amount">{{ serviceInfo.price.toFixed(2) }}</text>
                    </view>
                </view>
            </view>

            <!-- 上门时间 -->
            <view class="form-card">
                <view class="form-item" @click="showAppointmentTimePicker = true">
                    <text class="form-label">上门时间</text>
                    <view class="form-value">
                        <text class="form-text" :class="{ placeholder: !appointmentTime }">
                            {{ appointmentTime || '请选择上门时间' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
                    </view>
                </view>
            </view>

            <!-- 服务备注 -->
            <view class="form-card">
                <view class="form-item">
                    <text class="form-label">服务备注</text>
                </view>
                <textarea 
                    class="remark-textarea" 
                    v-model="serviceRemark"
                    placeholder="请输入服务备注"
                    placeholder-style="color: #999999;"
                    maxlength="500"
                ></textarea>
            </view>

            <!-- 照片上传 -->
            <view class="form-card">
                <text class="form-label">照片上传</text>
                <view class="upload-container">
                    <u-upload
                        :file-list="fileList"
                        @after-read="afterRead"
                        @delete="deletePic"
                        name="file"
                        multiple
                        :max-count="9"
                        :preview-full-image="true"
                        :action="uploadAction"
                        :header="uploadHeader"
                    ></u-upload>
                </view>
            </view>

            <!-- 下单说明 -->
            <view class="notice-card">
                <text class="notice-title">下单说明:</text>
                <view class="notice-list">
                    <text class="notice-item">1. 下单首次支付费用均为定金,具体收费标准可参考收费说明。</text>
                    <text class="notice-item">2. 工程师上门后,因用户个人原因取消订单,需支付30元上门费,如达成服务后可抵扣服务费。</text>
                    <text class="notice-item">3. 请勿私下与工程师联系服务,所出一切问题(财产安全、人身安全等)与本公司无关。</text>
                    <text class="notice-item">4. 除本次服务费用,公司严令禁止工程师私下收取额外费用,如有发生,请直接拨打官方客服电话进行投诉。</text>
                </view>
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="footer-bar">
            <view class="footer-left">
                <u-checkbox 
                    v-model="agreeProtocol" 
                    shape="circle"
                    :active-color="colorConfig.primary"
                >
                    <text class="protocol-text">同意《下单协议》</text>
                </u-checkbox>
                <view class="total-price">
                    <text class="total-label">合计:</text>
                    <text class="total-amount">¥{{ totalAmount.toFixed(2) }}</text>
                </view>
            </view>
            <button class="pay-btn" @click="handlePay">立即支付</button>
        </view>

        <!-- 时间选择器 -->
        <u-picker
            v-model="showAppointmentTimePicker"
            mode="time"
            :params="appointmentTimeParams"
            @confirm="onAppointmentTimeConfirm"
        ></u-picker>

        <!-- 确认对话框 -->
        <u-modal
            v-model="showConfirmDialog"
            :show-cancel-button="true"
            confirm-text="确认提交"
            :confirm-color="colorConfig.primary"
            :show-title="false"
            @confirm="confirmSubmitOrder"
        >
            <view class="confirm-dialog-content">
                <text class="confirm-title">确认提交订单吗？</text>
            </view>
        </u-modal>
    </view>
</template>

<script>
import { getHomeServiceDetail } from '@/api/store'
import { createHomeServiceOrder } from '@/api/store'
import { getAddressLists, getOneAddress } from '@/api/user'

export default {
    name: 'ServiceConfirmOrder',
    data() {
        return {
            statusBarHeight: 0,
            serviceId: 0,
            serviceInfo: {
                id: 0,
                name: '',
                avatar: '/static/picture/service-avatar.png',
                price: 0
            },
            address: {
                contact: '',
                telephone: '',
                province: '',
                city: '',
                district: '',
                address: '',
                id: 0
            },
            addressId: 0,
            appointmentTime: '',
            serviceRemark: '',
            fileList: [],
            agreeProtocol: false,
            showAppointmentTimePicker: false,
            showConfirmDialog: false,
            appointmentTimeParams: {
                year: true,
                month: true,
                day: true,
                hour: true,
                minute: true
            },
            uploadAction: '',
            uploadHeader: {},
            totalAmount: 0
        }
    },
    computed: {
        colorConfig() {
            return {
                primary: '#4CAF50'
            }
        }
    },
    onLoad(options) {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        if (options.service_id) {
            this.serviceId = parseInt(options.service_id);
            this.loadServiceDetail();
        }

        // 设置上传接口
        const baseURL = getApp().globalData.baseURL || '';
        this.uploadAction = baseURL + '/api/file/formimage';
        
        // 设置上传请求头
        const token = uni.getStorageSync('token') || '';
        if (token) {
            this.uploadHeader = {
                'token': token
            };
        }

        // 监听地址选择
        uni.$on('selectaddress', (e) => {
            this.addressId = e.id;
            this.loadAddress();
        });

        // 页面显示时加载地址
        this.loadAddress();
    },
    onShow() {
        // 页面显示时重新加载地址（从地址选择页面返回时）
        this.loadAddress();
    },
    onUnload() {
        uni.$off('selectaddress');
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        async loadServiceDetail() {
            uni.showLoading({ title: '加载中...' });
            try {
                const res = await getHomeServiceDetail({ id: this.serviceId });
                if (res.code === 1 && res.data) {
                    const price = parseFloat(res.data.price) || 0;
                    this.serviceInfo = {
                        id: res.data.id,
                        name: res.data.name || '服务',
                        avatar: res.data.avatar || '/static/picture/service-avatar.png',
                        price: price
                    };
                    this.totalAmount = price;
                    console.log('服务价格:', price, '总金额:', this.totalAmount);
                } else {
                    uni.showToast({
                        title: res.msg || '加载服务详情失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.error('加载服务详情失败:', error);
                uni.showToast({
                    title: '加载服务详情失败',
                    icon: 'error'
                });
            } finally {
                uni.hideLoading();
            }
        },
        async loadAddress() {
            try {
                // 先获取地址列表
                const addressRes = await getAddressLists();
                if (addressRes.code === 1 && addressRes.data && addressRes.data.length > 0) {
                    // 存储地址列表到本地
                    uni.setStorageSync('addressList', addressRes.data);
                    
                    // 如果没有地址ID，尝试获取默认地址
                    if (!this.addressId) {
                        const defaultAddress = addressRes.data.find(item => item.is_default == 1) || addressRes.data[0];
                        if (defaultAddress) {
                            this.addressId = defaultAddress.id;
                        }
                    }

                    // 从地址列表获取选中的地址
                    if (this.addressId) {
                        const selectedAddress = addressRes.data.find(item => item.id == this.addressId);
                        if (selectedAddress) {
                            this.address = {
                                contact: selectedAddress.contact || '',
                                telephone: selectedAddress.telephone || '',
                                province: selectedAddress.province || '',
                                city: selectedAddress.city || '',
                                district: selectedAddress.district || '',
                                address: selectedAddress.address || '',
                                id: selectedAddress.id
                            };
                            return;
                        }
                    }

                    // 如果没有选中地址，使用默认地址或第一个地址
                    const defaultAddress = addressRes.data.find(item => item.is_default == 1) || addressRes.data[0];
                    if (defaultAddress) {
                        this.addressId = defaultAddress.id;
                        this.address = {
                            contact: defaultAddress.contact || '',
                            telephone: defaultAddress.telephone || '',
                            province: defaultAddress.province || '',
                            city: defaultAddress.city || '',
                            district: defaultAddress.district || '',
                            address: defaultAddress.address || '',
                            id: defaultAddress.id
                        };
                    }
                } else {
                    // 如果没有地址，清空地址信息
                    this.address = {
                        contact: '',
                        telephone: '',
                        province: '',
                        city: '',
                        district: '',
                        address: '',
                        id: 0
                    };
                    this.addressId = 0;
                }
            } catch (error) {
                console.error('加载地址失败:', error);
                // 如果API调用失败，尝试从本地存储获取
                const addressList = uni.getStorageSync('addressList') || [];
                if (addressList.length > 0) {
                    const defaultAddress = addressList.find(item => item.is_default == 1) || addressList[0];
                    if (defaultAddress) {
                        this.addressId = defaultAddress.id;
                        this.address = {
                            contact: defaultAddress.contact || '',
                            telephone: defaultAddress.telephone || '',
                            province: defaultAddress.province || '',
                            city: defaultAddress.city || '',
                            district: defaultAddress.district || '',
                            address: defaultAddress.address || '',
                            id: defaultAddress.id
                        };
                    }
                }
            }
        },
        onAppointmentTimeConfirm(e) {
            const time = e;
            const year = time.year || new Date().getFullYear();
            const month = String(time.month || new Date().getMonth() + 1).padStart(2, '0');
            const day = String(time.day || new Date().getDate()).padStart(2, '0');
            const hour = String(time.hour || '00').padStart(2, '0');
            const minute = String(time.minute || '00').padStart(2, '0');
            
            // 判断是上午还是下午
            const hourNum = parseInt(hour);
            const period = hourNum < 12 ? '上午' : '下午';
            
            this.appointmentTime = `${year}-${month}-${day} ${period}`;
        },
        afterRead(event) {
            console.log('选择图片:', event);
        },
        deletePic(event) {
            this.fileList.splice(event.index, 1);
        },
        handlePay() {
            // 验证必填项
            if (!this.address.contact) {
                uni.showToast({
                    title: '请选择服务地址',
                    icon: 'none'
                });
                return;
            }
            if (!this.appointmentTime) {
                uni.showToast({
                    title: '请选择上门时间',
                    icon: 'none'
                });
                return;
            }
            if (!this.agreeProtocol) {
                uni.showToast({
                    title: '请同意下单协议',
                    icon: 'none'
                });
                return;
            }

            // 显示确认对话框
            this.showConfirmDialog = true;
        },
        async confirmSubmitOrder() {
            this.showConfirmDialog = false;

            // 收集图片URL
            const images = this.fileList.map(item => {
                if (item.response && item.response.code === 1 && item.response.data && item.response.data.url) {
                    return item.response.data.url;
                }
                if (item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'))) {
                    return item.url;
                }
                return '';
            }).filter(url => url);

            uni.showLoading({
                title: '提交中...'
            });

            // 确保价格正确
            const finalAmount = parseFloat(this.totalAmount) || parseFloat(this.serviceInfo.price) || 0;
            console.log('提交订单，价格:', finalAmount, '服务价格:', this.serviceInfo.price, '总金额:', this.totalAmount);

            try {
                const res = await createHomeServiceOrder({
                    service_id: this.serviceId,
                    address_id: this.addressId,
                    appointment_time: this.appointmentTime,
                    service_remark: this.serviceRemark,
                    images: images.join(','),
                    total_amount: finalAmount
                });

                uni.hideLoading();

                if (res.code === 1) {
                    // 跳转到支付页面
                    uni.redirectTo({
                        url: `/pages/payment/payment?order_id=${res.data.order_id}&from=home_service&amount=${finalAmount}`
                    });
                } else {
                    uni.showToast({
                        title: res.msg || '提交订单失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                uni.hideLoading();
                console.error('提交订单失败:', error);
                uni.showToast({
                    title: '提交订单失败，请重试',
                    icon: 'none'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.service-confirm-order-page {
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
    padding-bottom: 200rpx;
}

.address-card {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    padding: 30rpx;
    margin-bottom: 20rpx;
    gap: 20rpx;
}

.address-icon {
    width: 40rpx;
    height: 40rpx;
    flex-shrink: 0;
}

.address-content {
    flex: 1;
}

.address-info {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.address-placeholder {
    font-size: 28rpx;
    color: #333333;
}

.address-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.address-name {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.address-phone {
    font-size: 28rpx;
    color: #333333;
}

.address-detail {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.5;
}

.service-card {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    padding: 30rpx;
    margin-bottom: 20rpx;
    gap: 20rpx;
}

.service-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
}

.service-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.service-name {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.service-price {
    display: flex;
    align-items: baseline;
}

.price-symbol {
    font-size: 24rpx;
    color: #FF5722;
    font-weight: bold;
}

.price-amount {
    font-size: 36rpx;
    color: #FF5722;
    font-weight: bold;
}

.form-card {
    background-color: #FFFFFF;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
}

.form-label {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.form-value {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.form-text {
    font-size: 28rpx;
    color: #333333;
}

.placeholder {
    color: #999999;
}

.remark-textarea {
    width: 100%;
    min-height: 200rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;
    margin-top: 20rpx;
}

.upload-container {
    margin-top: 20rpx;
}

.notice-card {
    background-color: #FFFFFF;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.notice-title {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 20rpx;
    display: block;
}

.notice-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.notice-item {
    font-size: 24rpx;
    color: #666666;
    line-height: 1.6;
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

.footer-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.protocol-text {
    font-size: 24rpx;
    color: #333333;
}

.total-price {
    display: flex;
    align-items: baseline;
    gap: 8rpx;
}

.total-label {
    font-size: 28rpx;
    color: #333333;
}

.total-amount {
    font-size: 32rpx;
    color: #FF5722;
    font-weight: bold;
}

.pay-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
    padding: 24rpx 60rpx;
    border-radius: 44rpx;
    border: none;
}

.pay-btn::after {
    border: none;
}

.confirm-dialog-content {
    padding: 40rpx;
    text-align: center;
}

.confirm-title {
    font-size: 32rpx;
    color: #333333;
}
</style>

