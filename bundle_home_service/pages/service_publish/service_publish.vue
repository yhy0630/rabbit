<template>
    <view class="service-publish-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">发布服务</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 表单内容 -->
        <scroll-view class="content-scroll" scroll-y>
            <view class="form-container">
                <!-- 服务类型 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>服务类型</text>
                    </view>
                    <picker 
                        mode="selector" 
                        :range="categoryList" 
                        range-key="name"
                        :value="categoryIndex"
                        @change="onCategoryChange"
                    >
                        <view class="picker-view">
                            <text class="picker-text" :class="{ placeholder: categoryIndex === -1 }">
                                {{ categoryIndex >= 0 ? categoryList[categoryIndex].name : '请选择服务类型' }}
                            </text>
                            <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
                        </view>
                    </picker>
                </view>

                <!-- 预约时间 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>预约时间</text>
                    </view>
                    <view class="time-selector" @click="showAppointmentTimePicker = true">
                        <text class="time-text" :class="{ placeholder: !formData.appointment_time }">
                            {{ formData.appointment_time || '请选择预约时间' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
                    </view>
                </view>

                <!-- 金额 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>金额</text>
                    </view>
                    <view class="price-input-wrapper">
                        <input 
                            class="form-input price-input" 
                            type="digit" 
                            v-model="formData.price"
                            placeholder="请输入金额"
                            placeholder-style="color: #999999;"
                        />
                        <text class="price-unit">元</text>
                    </view>
                </view>

                <!-- 服务位置 - 省市县联动 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>服务位置</text>
                    </view>
                    <view class="address-selector" @click="showRegionPicker = true">
                        <text class="address-text" :class="{ placeholder: !formData.service_region }">
                            {{ formData.service_region || '请选择省/市/县' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
                    </view>
                </view>

                <!-- 详细地址 -->
                <view class="form-item">
                    <view class="form-label">
                        <text>详细地址</text>
                    </view>
                    <input 
                        class="form-input" 
                        type="text" 
                        v-model="formData.service_address_detail"
                        placeholder="请输入详细地址"
                        placeholder-style="color: #999999;"
                    />
                </view>

                <!-- 联系电话 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>联系电话</text>
                    </view>
                    <input 
                        class="form-input" 
                        type="text" 
                        v-model="formData.contact_phone"
                        placeholder="请输入联系电话"
                        placeholder-style="color: #999999;"
                    />
                </view>

                <!-- 服务说明 -->
                <view class="form-item">
                    <view class="form-label">
                        <text>服务说明</text>
                    </view>
                    <textarea 
                        class="form-textarea" 
                        v-model="formData.service_description"
                        placeholder="请输入服务说明"
                        placeholder-style="color: #999999;"
                        maxlength="500"
                    ></textarea>
                    <view class="char-count">{{ formData.service_description.length }}/500</view>
                </view>

                <!-- 备注 -->
                <view class="form-item">
                    <view class="form-label">
                        <text>备注</text>
                    </view>
                    <textarea 
                        class="form-textarea" 
                        v-model="formData.remark"
                        placeholder="请输入备注信息"
                        placeholder-style="color: #999999;"
                        maxlength="200"
                    ></textarea>
                    <view class="char-count">{{ formData.remark.length }}/200</view>
                </view>
            </view>

            <!-- 提交按钮 -->
            <view class="submit-container">
                <button class="submit-btn" @click="submitForm">提交</button>
            </view>
        </scroll-view>

        <!-- 省市县选择器 -->
        <u-picker
            v-model="showRegionPicker"
            mode="region"
            :params="regionParams"
            @confirm="onRegionConfirm"
        ></u-picker>

        <!-- 预约时间选择器 -->
        <u-picker
            v-model="showAppointmentTimePicker"
            mode="time"
            :params="appointmentTimeParams"
            @confirm="onAppointmentTimeConfirm"
        ></u-picker>
    </view>
</template>

<script>
import request from '@/utils/request'
import { getAllHomeServiceCategoryList, addHomeService } from '@/api/store'

export default {
    name: 'ServicePublish',
    data() {
        return {
            statusBarHeight: 0,
            categoryList: [],
            categoryIndex: -1,
            formData: {
                category_id: '',
                appointment_time: '',
                price: '',
                province: '',
                city: '',
                district: '',
                service_region: '', // 显示的省市县文本
                service_address_detail: '',
                contact_phone: '',
                service_description: '',
                remark: ''
            },
            showRegionPicker: false,
            showAppointmentTimePicker: false,
            regionParams: {
                province: true,
                city: true,
                area: true
            },
            appointmentTimeParams: {
                year: true,
                month: true,
                day: true,
                hour: true,
                minute: true
            }
        }
    },
    onLoad() {
        // 获取状态栏高度
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        // 加载服务分类列表
        this.loadCategories();
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        // 加载服务分类
        async loadCategories() {
            try {
                const res = await getAllHomeServiceCategoryList();
                if (res.code === 1 && res.data) {
                    this.categoryList = res.data;
                }
            } catch (error) {
                console.error('加载分类失败:', error);
            }
        },
        // 服务类型选择
        onCategoryChange(e) {
            this.categoryIndex = e.detail.value;
            if (this.categoryIndex >= 0 && this.categoryList[this.categoryIndex]) {
                this.formData.category_id = this.categoryList[this.categoryIndex].id;
            }
        },
        // 省市县选择确认
        onRegionConfirm(e) {
            const region = e;
            this.formData.province = region.province ? region.province.label : '';
            this.formData.city = region.city ? region.city.label : '';
            this.formData.district = region.area ? region.area.label : '';
            this.formData.service_region = `${this.formData.province} ${this.formData.city} ${this.formData.district}`;
        },
        // 预约时间选择确认
        onAppointmentTimeConfirm(e) {
            const time = e;
            const year = time.year || new Date().getFullYear();
            const month = String(time.month || new Date().getMonth() + 1).padStart(2, '0');
            const day = String(time.day || new Date().getDate()).padStart(2, '0');
            const hour = String(time.hour || '00').padStart(2, '0');
            const minute = String(time.minute || '00').padStart(2, '0');
            this.formData.appointment_time = `${year}-${month}-${day} ${hour}:${minute}`;
        },
        // 提交表单
        async submitForm() {
            // 验证必填项
            if (!this.formData.category_id) {
                uni.showToast({
                    title: '请选择服务类型',
                    icon: 'none'
                });
                return;
            }
            if (!this.formData.appointment_time) {
                uni.showToast({
                    title: '请选择预约时间',
                    icon: 'none'
                });
                return;
            }
            if (!this.formData.price) {
                uni.showToast({
                    title: '请输入金额',
                    icon: 'none'
                });
                return;
            }
            if (!this.formData.province || !this.formData.city || !this.formData.district) {
                uni.showToast({
                    title: '请选择服务位置',
                    icon: 'none'
                });
                return;
            }
            if (!this.formData.contact_phone) {
                uni.showToast({
                    title: '请输入联系电话',
                    icon: 'none'
                });
                return;
            }

            // 构建完整地址
            const serviceAddress = `${this.formData.province} ${this.formData.city} ${this.formData.district} ${this.formData.service_address_detail || ''}`.trim();

            // 提交数据
            uni.showLoading({
                title: '提交中...'
            });

            try {
                const res = await addHomeService({
                    category_id: this.formData.category_id,
                    appointment_time: this.formData.appointment_time,
                    price: parseFloat(this.formData.price),
                    province: this.formData.province,
                    city: this.formData.city,
                    district: this.formData.district,
                    service_address: serviceAddress,
                    contact_phone: this.formData.contact_phone,
                    service_description: this.formData.service_description,
                    remark: this.formData.remark
                });

                uni.hideLoading();

                if (res.code === 1) {
                    uni.showToast({
                        title: res.msg || '提交成功',
                        icon: 'success'
                    });
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 1500);
                } else {
                    uni.showToast({
                        title: res.msg || '提交失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                uni.hideLoading();
                console.error('提交失败:', error);
                uni.showToast({
                    title: '提交失败，请重试',
                    icon: 'none'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.service-publish-page {
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
}

.form-container {
    padding: 30rpx;
    background-color: #FFFFFF;
    margin-top: 20rpx;
}

.form-item {
    margin-bottom: 40rpx;
}

.form-label {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.required {
    color: #FF5722;
    margin-right: 8rpx;
}

.form-input {
    width: 100%;
    height: 88rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;
}

.price-input-wrapper {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 24rpx;
}

.price-input {
    flex: 1;
    background-color: transparent;
    padding: 0;
}

.price-unit {
    font-size: 28rpx;
    color: #333333;
    margin-left: 10rpx;
}

.picker-view,
.address-selector,
.time-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 24rpx;
}

.picker-text,
.address-text,
.time-text {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
}

.placeholder {
    color: #999999;
}

.form-textarea {
    width: 100%;
    min-height: 200rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 24rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;
}

.char-count {
    margin-top: 10rpx;
    text-align: right;
    font-size: 24rpx;
    color: #999999;
}

.submit-container {
    padding: 40rpx 30rpx;
    margin-bottom: 40rpx;
}

.submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    border-radius: 44rpx;
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
}

.submit-btn::after {
    border: none;
}
</style>

