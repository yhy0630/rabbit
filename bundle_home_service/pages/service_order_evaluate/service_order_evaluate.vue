<template>
    <view class="evaluate-page">
        <!-- 自定义导航栏 -->
        <custom-navbar title="评价"></custom-navbar>

        <!-- 内容区域 -->
        <view class="content-container">
            <!-- 评价输入框 -->
            <view class="evaluate-input-card">
                <textarea 
                    class="evaluate-textarea" 
                    v-model="evaluateContent"
                    placeholder="为本次服务评价~"
                    placeholder-style="color: #999999;"
                    maxlength="500"
                    :auto-height="true"
                ></textarea>
            </view>

            <!-- 图片上传区域 -->
            <view class="upload-section">
                <text class="upload-label">添加图片</text>
                <view class="upload-container">
                    <view 
                        class="upload-item" 
                        v-for="(item, index) in imageList" 
                        :key="index"
                    >
                        <image 
                            :src="item" 
                            mode="aspectFill" 
                            class="uploaded-image"
                            @click="previewImage(index)"
                        ></image>
                        <view class="delete-icon" @click="deleteImage(index)">
                            <u-icon name="close" size="20" color="#FFFFFF"></u-icon>
                        </view>
                    </view>
                    <view 
                        class="upload-placeholder" 
                        v-if="imageList.length < 9"
                        @click="chooseImage"
                    >
                        <u-icon name="camera" size="48" color="#CCCCCC"></u-icon>
                        <text class="upload-text">上传图片</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-container">
            <button class="submit-btn" @click="submitEvaluate">提交</button>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { uploadFile } from '@/utils/tools'
import { baseURL } from '@/config/app.js'

export default {
    name: 'ServiceOrderEvaluate',
    components: {
        CustomNavbar
    },
    data() {
        return {
            orderId: '',
            evaluateContent: '',
            imageList: []
        }
    },
    onLoad(options) {
        if (options.order_id) {
            this.orderId = options.order_id;
        }
    },
    methods: {
        chooseImage() {
            uni.chooseImage({
                count: 9 - this.imageList.length,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    const tempFiles = res.tempFiles;
                    tempFiles.forEach(file => {
                        this.uploadImage(file.path);
                    });
                }
            });
        },
        async uploadImage(filePath) {
            uni.showLoading({ title: '上传中...' });
            try {
                const result = await uploadFile(filePath, { name: 'file' });
                if (result && result.base_uri) {
                    this.imageList.push(result.base_uri);
                } else {
                    uni.showToast({
                        title: '上传失败',
                        icon: 'none'
                    });
                }
            } catch (error) {
                console.error('上传图片失败:', error);
                uni.showToast({
                    title: '上传失败',
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
            }
        },
        deleteImage(index) {
            this.imageList.splice(index, 1);
        },
        previewImage(index) {
            uni.previewImage({
                urls: this.imageList,
                current: index
            });
        },
        async submitEvaluate() {
            if (!this.evaluateContent.trim()) {
                uni.showToast({
                    title: '请输入评价内容',
                    icon: 'none'
                });
                return;
            }

            uni.showLoading({ title: '提交中...' });
            try {
                // TODO: 调用提交评价接口
                // const res = await submitOrderEvaluate({
                //     order_id: this.orderId,
                //     content: this.evaluateContent,
                //     images: this.imageList.join(',')
                // });
                
                // 模拟提交成功
                setTimeout(() => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '评价提交成功',
                        icon: 'success'
                    });
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 1500);
                }, 1000);
            } catch (error) {
                console.error('提交评价失败:', error);
                uni.hideLoading();
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
.evaluate-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    padding-top: calc(128rpx + var(--status-bar-height));
}

.content-container {
    flex: 1;
    padding: 20rpx;
    padding-bottom: 160rpx;
}

.evaluate-input-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.evaluate-textarea {
    width: 100%;
    min-height: 300rpx;
    font-size: 28rpx;
    color: #333333;
    line-height: 1.6;
}

.upload-section {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
}

.upload-label {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 20rpx;
    display: block;
}

.upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.upload-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
}

.uploaded-image {
    width: 100%;
    height: 100%;
}

.delete-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 40rpx;
    height: 40rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 0 0 0 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-placeholder {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
}

.upload-text {
    font-size: 24rpx;
    color: #999999;
}

.submit-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: #FFFFFF;
    border-top: 1rpx solid #E0E0E0;
    z-index: 100;
}

.submit-btn {
    width: 100%;
    height: 88rpx;
    border-radius: 44rpx;
    background: linear-gradient(90deg, #2B920A 0%, #E9F66B 100%);
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.submit-btn::after {
    border: none;
}
</style>

