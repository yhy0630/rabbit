<template>
    <view class="merchant-join-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">入驻商家</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 表单内容 -->
        <scroll-view class="content-scroll" scroll-y>
            <view class="form-container">
                <!-- 公司名称 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>公司名称</text>
                    </view>
                    <input 
                        class="form-input" 
                        type="text" 
                        v-model="formData.name"
                        placeholder="请输入公司名称"
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

                <!-- 负责人 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>负责人</text>
                    </view>
                    <input 
                        class="form-input" 
                        type="text" 
                        v-model="formData.contact_person"
                        placeholder="请输入负责人姓名"
                        placeholder-style="color: #999999;"
                    />
                </view>

                <!-- 上传凭证 -->
                <view class="form-item">
                    <view class="form-label">
                        <text>上传凭证</text>
                    </view>
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
                        <view class="upload-tip">支持多图上传，最多9张</view>
                    </view>
                </view>

                <!-- 公司地址 - 省市县联动 -->
                <view class="form-item">
                    <view class="form-label">
                        <text class="required">*</text>
                        <text>公司地址</text>
                    </view>
                    <view class="address-selector" @click="showRegionPicker = true">
                        <text class="address-text" :class="{ placeholder: !formData.address_region }">
                            {{ formData.address_region || '请选择省/市/县' }}
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
                        v-model="formData.address_detail"
                        placeholder="请输入详细地址"
                        placeholder-style="color: #999999;"
                    />
                </view>

                <!-- 营业时间 -->
                <view class="form-item">
                    <view class="form-label">
                        <text>营业时间</text>
                    </view>
                    <view class="time-selector" @click="showTimePicker = true">
                        <text class="time-text" :class="{ placeholder: !formData.business_hours }">
                            {{ formData.business_hours || '请选择营业时间' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
                    </view>
                </view>
            </view>

            <!-- 提交按钮 -->
            <view class="submit-container">
                <button class="submit-btn" @click="submitForm">提交申请</button>
            </view>
        </scroll-view>

        <!-- 省市县选择器 -->
        <u-picker
            v-model="showRegionPicker"
            mode="region"
            :params="regionParams"
            @confirm="onRegionConfirm"
        ></u-picker>

        <!-- 时间选择器 -->
        <u-picker
            v-model="showTimePicker"
            mode="time"
            :params="timeParams"
            :default-time="defaultTime"
            @confirm="onTimeConfirm"
        ></u-picker>
    </view>
</template>

<script>
import request from '@/utils/request'
import { addHomeServiceCompany } from '@/api/store'

export default {
    name: 'MerchantJoin',
    data() {
        return {
            statusBarHeight: 0,
            formData: {
                name: '',
                contact_phone: '',
                contact_person: '',
                certificates: [], // 凭证图片URL数组
                province: '',
                city: '',
                district: '',
                address_region: '', // 显示的省市县文本
                address_detail: '',
                business_hours: ''
            },
            fileList: [],
            showRegionPicker: false,
            showTimePicker: false,
            regionParams: {
                province: true,
                city: true,
                area: true
            },
            timeParams: {
                hour: true,
                minute: true
            },
            defaultTime: '09:00',
            uploadAction: '', // 上传接口地址
            uploadHeader: {}
        }
    },
    onLoad() {
        // 获取状态栏高度
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        // 设置上传接口
        const baseURL = getApp().globalData.baseURL || '';
        this.uploadAction = baseURL + '/api/file/formimage';
        
        // 设置上传请求头（如果需要token）
        const token = uni.getStorageSync('token') || '';
        if (token) {
            this.uploadHeader = {
                'token': token
            };
        }
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        // 图片选择后
        afterRead(event) {
            // event.file 是选择的文件
            // u-upload组件会自动上传，这里只需要处理上传成功后的逻辑
            console.log('选择图片:', event);
        },
        // 删除图片
        deletePic(event) {
            this.fileList.splice(event.index, 1);
        },
        // 省市县选择确认
        onRegionConfirm(e) {
            const region = e;
            this.formData.province = region.province ? region.province.label : '';
            this.formData.city = region.city ? region.city.label : '';
            this.formData.district = region.area ? region.area.label : '';
            this.formData.address_region = `${this.formData.province} ${this.formData.city} ${this.formData.district}`;
        },
        // 时间选择确认
        onTimeConfirm(e) {
            const time = e;
            this.formData.business_hours = `${time.hour}:${time.minute}`;
        },
        // 提交表单
        async submitForm() {
            // 验证必填项
            if (!this.formData.name) {
                uni.showToast({
                    title: '请输入公司名称',
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
            if (!this.formData.contact_person) {
                uni.showToast({
                    title: '请输入负责人',
                    icon: 'none'
                });
                return;
            }
            if (!this.formData.province || !this.formData.city || !this.formData.district) {
                uni.showToast({
                    title: '请选择公司地址',
                    icon: 'none'
                });
                return;
            }

            // 收集凭证图片URL（u-upload组件上传成功后，url会在response中）
            const certificates = this.fileList.map(item => {
                // 如果已经上传成功，使用response中的url
                if (item.response && item.response.code === 1 && item.response.data && item.response.data.url) {
                    return item.response.data.url;
                }
                // 如果item.url是完整的http/https地址，直接使用
                if (item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'))) {
                    return item.url;
                }
                // 否则返回空，表示还未上传成功
                return '';
            }).filter(url => url);

            // 构建完整地址
            const address = `${this.formData.province} ${this.formData.city} ${this.formData.district} ${this.formData.address_detail || ''}`.trim();

            // 提交数据
            uni.showLoading({
                title: '提交中...'
            });

            try {
                const res = await addHomeServiceCompany({
                    name: this.formData.name,
                    contact_phone: this.formData.contact_phone,
                    contact_person: this.formData.contact_person,
                    certificates: certificates.join(','),
                    province: this.formData.province,
                    city: this.formData.city,
                    district: this.formData.district,
                    address: address,
                    business_hours: this.formData.business_hours
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
.merchant-join-page {
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

.upload-container {
    margin-top: 20rpx;
}

.upload-tip {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #999999;
}

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

.address-text,
.time-text {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
}

.placeholder {
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

