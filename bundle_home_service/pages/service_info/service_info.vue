<template>
    <view class="service-info-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">服务详情</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 服务基本信息 -->
            <view class="info-card">
                <view class="info-header">
                    <view class="info-avatar">
                        <image :src="serviceInfo.avatar" mode="aspectFill" class="avatar-img"></image>
                    </view>
                    <view class="info-basic">
                        <text class="info-name">{{ serviceInfo.name }}</text>
                        <text class="info-price">约{{ serviceInfo.price }}元/月</text>
                    </view>
                </view>
            </view>

            <!-- 服务介绍 -->
            <view class="section-card">
                <view class="section-title">服务介绍</view>
                <view class="section-content">
                    <text class="content-text">{{ serviceInfo.introduction }}</text>
                </view>
            </view>

            <!-- 服务内容 -->
            <view class="section-card">
                <view class="section-title">服务内容</view>
                <view class="service-content-list">
                    <view class="content-item" v-for="(item, index) in serviceContent" :key="index">
                        <view class="content-icon">
                            <u-icon name="checkmark-circle" size="20" color="#4CAF50"></u-icon>
                        </view>
                        <text class="content-item-text">{{ item }}</text>
                    </view>
                </view>
            </view>

            <!-- 服务优势 -->
            <view class="section-card">
                <view class="section-title">服务优势</view>
                <view class="advantage-list">
                    <view class="advantage-item" v-for="(item, index) in advantages" :key="index">
                        <view class="advantage-icon">
                            <u-icon name="star" size="20" color="#FF9800"></u-icon>
                        </view>
                        <view class="advantage-content">
                            <text class="advantage-title">{{ item.title }}</text>
                            <text class="advantage-desc">{{ item.desc }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 服务流程 -->
            <view class="section-card">
                <view class="section-title">服务流程</view>
                <view class="process-list">
                    <view class="process-item" v-for="(item, index) in processList" :key="index">
                        <view class="process-number">{{ index + 1 }}</view>
                        <view class="process-content">
                            <text class="process-title">{{ item.title }}</text>
                            <text class="process-desc">{{ item.desc }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 注意事项 -->
            <view class="section-card">
                <view class="section-title">注意事项</view>
                <view class="notice-list">
                    <view class="notice-item" v-for="(item, index) in notices" :key="index">
                        <text class="notice-text">{{ item }}</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="bottom-action-bar">
            <view class="action-btn consult-btn" @click="consult">
                <text class="action-btn-text">在线咨询</text>
            </view>
            <view class="action-btn order-btn" @click="placeOrder">
                <text class="action-btn-text">立即下单</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'ServiceInfo',
    data() {
        return {
            statusBarHeight: 0,
            serviceInfo: {
                id: 1,
                name: '杜阿姨',
                avatar: '/static/picture/service-avatar.png',
                price: 4500,
                introduction: '专业保姆月嫂服务，拥有丰富的育儿和家政经验，擅长照顾婴幼儿、老人，能够提供全方位的家庭服务。服务态度认真负责，深受客户好评。'
            },
            serviceContent: [
                '照顾婴幼儿日常起居',
                '制作营养丰富的婴幼儿辅食',
                '协助产妇进行产后恢复',
                '进行家庭日常清洁整理',
                '协助处理家庭日常事务',
                '提供专业的育儿建议和指导'
            ],
            advantages: [
                {
                    title: '专业认证',
                    desc: '持有健康证、育婴师证等专业资质'
                },
                {
                    title: '经验丰富',
                    desc: '拥有3-5年专业服务经验，服务过多个家庭'
                },
                {
                    title: '服务贴心',
                    desc: '服务态度认真负责，能够根据家庭需求提供个性化服务'
                },
                {
                    title: '安全保障',
                    desc: '实名认证，背景清晰，让您放心选择'
                }
            ],
            processList: [
                {
                    title: '在线咨询',
                    desc: '通过平台在线咨询，了解服务详情和价格'
                },
                {
                    title: '预约服务',
                    desc: '选择合适的服务人员，预约服务时间'
                },
                {
                    title: '签订合同',
                    desc: '双方确认服务内容，签订服务合同'
                },
                {
                    title: '开始服务',
                    desc: '服务人员按时到达，开始提供专业服务'
                },
                {
                    title: '服务评价',
                    desc: '服务结束后，对服务进行评价和反馈'
                }
            ],
            notices: [
                '服务前请提前预约，确保服务人员能够按时到达',
                '如需变更服务时间，请提前24小时通知',
                '服务期间请配合服务人员的工作，提供必要的工作条件',
                '如有任何问题或建议，请及时与服务人员或平台客服联系',
                '服务费用按合同约定支付，支持多种支付方式'
            ]
        }
    },
    onLoad(options) {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        if (options.id) {
            this.loadServiceInfo(options.id);
        }
        if (options.name) {
            this.serviceInfo.name = decodeURIComponent(options.name);
        }
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        loadServiceInfo(id) {
            // 加载服务详情数据
            console.log('加载服务详情:', id);
        },
        consult() {
            // 在线咨询
            console.log('在线咨询');
        },
        placeOrder() {
            // 立即下单
            console.log('立即下单');
        }
    }
}
</script>

<style lang="scss" scoped>
.service-info-page {
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
    padding: 20rpx;
    padding-bottom: 140rpx;
}

.info-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.info-header {
    display: flex;
    align-items: center;
    gap: 30rpx;
}

.info-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar-img {
    width: 100%;
    height: 100%;
}

.info-basic {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.info-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
}

.info-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #FF5722;
}

.section-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #F5F5F5;
}

.section-content {
    line-height: 1.8;
}

.content-text {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.8;
}

.service-content-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.content-item {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
}

.content-icon {
    flex-shrink: 0;
    margin-top: 4rpx;
}

.content-item-text {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
    flex: 1;
}

.advantage-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.advantage-item {
    display: flex;
    gap: 20rpx;
}

.advantage-icon {
    flex-shrink: 0;
    margin-top: 4rpx;
}

.advantage-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.advantage-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
}

.advantage-desc {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.6;
}

.process-list {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
}

.process-item {
    display: flex;
    gap: 20rpx;
    position: relative;
}

.process-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 30rpx;
    top: 60rpx;
    width: 2rpx;
    height: calc(100% + 30rpx);
    background-color: #E0E0E0;
}

.process-number {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    font-size: 28rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}

.process-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    padding-top: 10rpx;
}

.process-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
}

.process-desc {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.6;
}

.notice-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.notice-item {
    padding-left: 20rpx;
    position: relative;
}

.notice-item::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #4CAF50;
    font-size: 32rpx;
}

.notice-text {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.8;
}

.bottom-action-bar {
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
}

.action-btn {
    flex: 1;
    padding: 24rpx 0;
    border-radius: 40rpx;
    text-align: center;
}

.consult-btn {
    border: 2rpx solid #4CAF50;
    background-color: transparent;
}

.order-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
}

.action-btn-text {
    font-size: 28rpx;
    font-weight: bold;
}

.consult-btn .action-btn-text {
    color: #4CAF50;
}

.order-btn .action-btn-text {
    color: #FFFFFF;
}
</style>
