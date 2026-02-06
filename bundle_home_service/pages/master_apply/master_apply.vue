<template>
    <view class="master-apply-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">师傅入驻</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <view class="form-container">
                <!-- 个人信息 -->
                <view class="form-section">
                    <view class="section-title">个人信息</view>
                    
                    <view class="form-item">
                        <text class="label">真实姓名<text class="required">*</text></text>
                        <input 
                            class="input" 
                            v-model="formData.real_name" 
                            placeholder="请输入真实姓名"
                            maxlength="20"
                        />
                    </view>
                    
                    <view class="form-item">
                        <text class="label">手机号<text class="required">*</text></text>
                        <input 
                            class="input" 
                            v-model="formData.mobile" 
                            placeholder="请输入手机号"
                            type="number"
                            maxlength="11"
                        />
                    </view>
                    
                    <view class="form-item">
                        <text class="label">身份证号</text>
                        <input 
                            class="input" 
                            v-model="formData.id_card" 
                            placeholder="请输入身份证号"
                            maxlength="18"
                        />
                    </view>
                </view>

                <!-- 入驻行业 -->
                <view class="form-section">
                    <view class="section-title">入驻行业<text class="required">*</text></view>
                    <view class="category-selector" @click="showCategoryPicker = true">
                        <text class="category-text" :class="{ placeholder: !formData.category_name }">
                            {{ formData.category_name || '请选择入驻的行业类型' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
                    </view>
                </view>

                <!-- 证件图片 -->
                <view class="form-section">
                    <view class="section-title">证件图片</view>
                    <view class="upload-tips">请上传相关证件照片（如身份证、技能证书等）</view>
                    <view class="upload-container">
                        <view 
                            class="upload-item" 
                            v-for="(img, index) in certImages" 
                            :key="index"
                        >
                            <image :src="img" mode="aspectFill" class="upload-image"></image>
                            <view class="delete-btn" @click="removeImage(index)">
                                <u-icon name="close" size="16" color="#FFFFFF"></u-icon>
                            </view>
                        </view>
                        <view class="upload-btn" @click="chooseImage" v-if="certImages.length < 9">
                            <u-icon name="plus" size="32" color="#CCCCCC"></u-icon>
                            <text class="upload-text">上传图片</text>
                        </view>
                    </view>
                </view>

                <!-- 说明 -->
                <view class="form-section">
                    <view class="section-title">个人说明</view>
                    <textarea 
                        class="textarea" 
                        v-model="formData.description" 
                        placeholder="请填写您的专业技能、工作经验等相关说明"
                        maxlength="500"
                    ></textarea>
                    <view class="char-count">{{ formData.description.length }}/500</view>
                </view>
            </view>
        </scroll-view>

        <!-- 提交按钮 - 固定在底部 -->
        <view class="submit-section-fixed">
            <button class="submit-btn" @click="submitApply" :disabled="submitting">
                {{ submitting ? '提交中...' : '提交申请' }}
            </button>
        </view>

        <!-- 行业类型选择器 -->
        <u-picker 
            :show="showCategoryPicker" 
            :columns="[categoryList]" 
            keyName="name"
            @confirm="onCategoryConfirm"
            @cancel="showCategoryPicker = false"
        ></u-picker>
    </view>
</template>

<script>
import { applyHomeServiceMaster, getAllHomeServiceCategoryList } from '@/api/store'

export default {
    name: 'MasterApply',
    data() {
        return {
            statusBarHeight: 0,
            formData: {
                real_name: '',
                mobile: '',
                id_card: '',
                category_id: 0,
                category_name: '',
                description: ''
            },
            certImages: [],
            categoryList: [],
            showCategoryPicker: false,
            submitting: false
        }
    },
    onLoad() {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        this.loadCategories();
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        async loadCategories() {
            try {
                const res = await getAllHomeServiceCategoryList();
                if (res.code === 1 && res.data) {
                    this.categoryList = res.data.map(item => ({
                        id: item.id,
                        name: item.name
                    }));
                }
            } catch (error) {
                console.error('加载分类失败:', error);
            }
        },
        onCategoryConfirm(e) {
            const selected = e.value[0];
            this.formData.category_id = selected.id;
            this.formData.category_name = selected.name;
            this.showCategoryPicker = false;
        },
        chooseImage() {
            uni.chooseImage({
                count: 9 - this.certImages.length,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    this.certImages = [...this.certImages, ...res.tempFilePaths];
                    // TODO: 上传图片到服务器，获取URL
                    // 这里暂时使用本地路径，实际应该上传到服务器
                }
            });
        },
        removeImage(index) {
            this.certImages.splice(index, 1);
        },
        async submitApply() {
            // 验证表单
            if (!this.formData.real_name.trim()) {
                uni.showToast({
                    title: '请输入真实姓名',
                    icon: 'none'
                });
                return;
            }
            if (!this.formData.mobile.trim()) {
                uni.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                });
                return;
            }
            if (!/^1[3-9]\d{9}$/.test(this.formData.mobile)) {
                uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                });
                return;
            }
            if (!this.formData.category_id) {
                uni.showToast({
                    title: '请选择入驻的行业类型',
                    icon: 'none'
                });
                return;
            }

            this.submitting = true;
            try {
                const data = {
                    ...this.formData,
                    cert_images: this.certImages.join(',') // TODO: 应该使用上传后的URL
                };
                
                const res = await applyHomeServiceMaster(data);
                if (res.code === 1) {
                    uni.showToast({
                        title: '申请提交成功',
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
                console.error('提交申请失败:', error);
                uni.showToast({
                    title: '提交失败，请重试',
                    icon: 'none'
                });
            } finally {
                this.submitting = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.master-apply-page {
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
    padding-bottom: 120rpx; /* 为底部按钮留出空间 */
}

.form-container {
    padding-bottom: 40rpx;
}

.form-section {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
    margin-bottom: 30rpx;
}

.required {
    color: #FF5722;
    margin-left: 4rpx;
}

.form-item {
    margin-bottom: 30rpx;
    
    &:last-child {
        margin-bottom: 0;
    }
}

.label {
    font-size: 28rpx;
    color: #333333;
    display: block;
    margin-bottom: 16rpx;
}

.input {
    width: 100%;
    height: 88rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333333;
}

.category-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 24rpx;
}

.category-text {
    font-size: 28rpx;
    color: #333333;
    
    &.placeholder {
        color: #999999;
    }
}

.upload-tips {
    font-size: 24rpx;
    color: #999999;
    margin-bottom: 20rpx;
}

.upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.upload-item {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
    overflow: hidden;
}

.upload-image {
    width: 100%;
    height: 100%;
}

.delete-btn {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 40rpx;
    height: 40rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-btn {
    width: 200rpx;
    height: 200rpx;
    border: 2rpx dashed #CCCCCC;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
}

.upload-text {
    font-size: 24rpx;
    color: #999999;
}

.textarea {
    width: 100%;
    min-height: 200rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 24rpx;
    font-size: 28rpx;
    color: #333333;
}

.char-count {
    text-align: right;
    font-size: 24rpx;
    color: #999999;
    margin-top: 12rpx;
}

.submit-section {
    margin-top: 40rpx;
}

.submit-section-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 20rpx;
    background-color: #FFFFFF;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 44rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.submit-btn::after {
    border: none;
}

.submit-btn[disabled] {
    opacity: 0.6;
}
</style>

