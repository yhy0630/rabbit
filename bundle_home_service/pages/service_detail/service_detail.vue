<template>
    <view class="service-detail-page">
        <!-- 自定义导航栏 -->
        <custom-navbar title="详情"></custom-navbar>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 个人信息卡片 -->
            <view class="profile-card">
                <view class="profile-avatar">
                    <image :src="serviceInfo.avatar" mode="aspectFill" class="avatar-img"></image>
                </view>
                <view class="profile-info">
                    <view class="profile-name">{{ serviceInfo.name || '服务名称' }}</view>
                    <view class="profile-price" v-if="serviceInfo.price">约{{ serviceInfo.price }}元/月</view>
                    <view class="profile-details" v-if="serviceInfo.age || serviceInfo.ethnicity || serviceInfo.experience || serviceInfo.origin || serviceInfo.education || serviceInfo.serviceCount">
                        <view class="detail-row" v-if="serviceInfo.age || serviceInfo.ethnicity || serviceInfo.experience">
                            <text class="detail-item" v-if="serviceInfo.age">年龄: {{ serviceInfo.age }}岁</text>
                            <text class="detail-item" v-if="serviceInfo.ethnicity">民族: {{ serviceInfo.ethnicity }}</text>
                            <text class="detail-item" v-if="serviceInfo.experience">经验: {{ serviceInfo.experience }}</text>
                        </view>
                        <view class="detail-row" v-if="serviceInfo.origin || serviceInfo.education || serviceInfo.serviceCount">
                            <text class="detail-item" v-if="serviceInfo.origin">籍贯: {{ serviceInfo.origin }}</text>
                            <text class="detail-item" v-if="serviceInfo.education">学历: {{ serviceInfo.education }}</text>
                            <text class="detail-item" v-if="serviceInfo.serviceCount">服务: {{ serviceInfo.serviceCount }}户</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 认证资料 -->
            <view class="section-card" v-if="certifications.length > 0">
                <view class="section-title">认证资料</view>
                <view class="certification-list">
                    <view class="certification-item" v-for="(item, index) in certifications" :key="index">
                        <view class="cert-icon">
                            <u-icon :name="item.icon" size="32" color="#333333"></u-icon>
                        </view>
                        <text class="cert-text">{{ item.name }}</text>
                    </view>
                </view>
            </view>

            <!-- 服务经验 -->
            <view class="section-card" v-if="experienceList.length > 0">
                <view class="section-title">服务经验</view>
                <view class="experience-list">
                    <view class="experience-item" v-for="(item, index) in experienceList" :key="index">
                        <text class="experience-label">{{ item.label }}:</text>
                        <text class="experience-content">{{ item.content }}</text>
                    </view>
                </view>
            </view>

            <!-- 求职意向 -->
            <view class="section-card" v-if="intentionList.length > 0">
                <view class="section-title">求职意向</view>
                <view class="intention-list">
                    <view class="intention-item" v-for="(item, index) in intentionList" :key="index">
                        <text class="intention-label">{{ item.label }}:</text>
                        <text class="intention-content">{{ item.content }}</text>
                    </view>
                </view>
            </view>

            <!-- 服务描述 -->
            <view class="section-card" v-if="serviceDescription">
                <view class="section-title">服务描述</view>
                <view class="section-content">
                    <text class="content-text">{{ serviceDescription }}</text>
                </view>
            </view>

            <!-- 服务内容 -->
            <view class="section-card" v-if="serviceContent">
                <view class="section-title">服务内容</view>
                <view class="section-content">
                    <text class="content-text" v-html="serviceContent"></text>
                </view>
            </view>

            <!-- 关联店铺 -->
            <view class="section-card" v-if="storeInfo.name">
                <view class="section-title">{{ storeInfo.name }}</view>
                <view class="store-card">
                    <image src="https://pw3.yihaiguantao.com/static/picture/pi.png" mode="aspectFill" class="store-image"></image>
                    <view class="store-info">
                        <text class="store-address">{{ storeInfo.address || '西百花巷16号3D打印别墅' }}</text>
                        <view class="store-tags" v-if="storeInfo.tags && storeInfo.tags.length > 0">
                            <text class="store-tag" v-for="(tag, index) in storeInfo.tags" :key="index">{{ tag }}</text>
                        </view>
                    </view>
                </view>
                <view class="store-btn" @click="goToStore">
                    <text class="store-btn-text">进店看看</text>
                </view>
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="bottom-action-bar">
            <view class="action-left">
                <view class="action-icon-item" @click="toggleFavorite">
                    <image src="/static/images/shoucang.png" class="action-icon" mode="aspectFit"></image>
                    <text class="action-icon-text">收藏</text>
                </view>
                <view class="action-icon-item" @click="goToStore">
                    <image src="/static/images/dianpu 1.png" class="action-icon" mode="aspectFit"></image>
                    <text class="action-icon-text">店铺</text>
                </view>
            </view>
            <view class="action-right">
                <view class="action-btn consult-btn" @click="consult">
                    <text class="action-btn-text">在线咨询</text>
                </view>
                <view class="action-btn order-btn" @click="placeOrder">
                    <text class="action-btn-text">立即下单</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getHomeServiceDetail } from '@/api/store'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'ServiceDetail',
    components: {
        CustomNavbar
    },
    data() {
        return {
            isFavorite: false,
            loading: true,
            serviceInfo: {
                id: 0,
                name: '',
                avatar: '/static/picture/service-avatar.png',
                price: 0,
                age: 0,
                ethnicity: '',
                experience: '',
                origin: '',
                education: '',
                serviceCount: 0
            },
            certifications: [],
            experienceList: [],
            intentionList: [],
            storeInfo: {
                name: '',
                image: '/static/picture/store-image.png',
                address: '西百花巷16号3D打印别墅',
                tags: ['育儿嫂', '保姆']
            },
            serviceDescription: '',
            serviceContent: ''
        }
    },
    onLoad(options) {
        if (options.id) {
            this.loadServiceDetail(options.id);
        }
    },
    methods: {
        async loadServiceDetail(id) {
            uni.showLoading({ title: '加载中...' });
            try {
                const res = await getHomeServiceDetail({ id: id });
                if (res.code === 1 && res.data) {
                    const data = res.data;
                    this.serviceInfo = {
                        id: data.id,
                        name: data.name || '服务名称',
                        avatar: data.avatar || '/static/picture/service-avatar.png',
                        price: data.price || 0,
                        age: data.age || 0,
                        ethnicity: data.ethnicity || '',
                        experience: data.service_years ? data.service_years + '年' : (data.experiences && data.experiences.length > 0 ? '有经验' : ''),
                        origin: data.origin || '',
                        education: data.education || '',
                        serviceCount: data.service_count || 0
                    };
                    
                    // 处理认证资料
                    if (data.certs && data.certs.length > 0) {
                        this.certifications = data.certs.map(cert => ({
                            name: cert.cert_type_name,
                            icon: 'checkmark-circle',
                            status: cert.status
                        }));
                    }
                    
                    // 处理服务经验（动态数据）
                    if (data.experience && Object.keys(data.experience).length > 0) {
                        this.experienceList = [];
                        // 根据经验配置显示对应的字段
                        // 这里可以根据category_id获取配置，然后显示对应的字段
                        for (let key in data.experience) {
                            if (data.experience[key]) {
                                // 将字段名转换为中文标签（可以从配置中获取）
                                const labelMap = {
                                    'cooking_ability': '做饭能力',
                                    'childcare_ability': '照顾小孩能力',
                                    'eldercare_ability': '照顾老人能力',
                                    'petcare_ability': '照顾宠物能力',
                                    'other_skills': '其他技能',
                                    'cuisine_type': '擅长菜系',
                                    'nutrition_meal': '营养配餐',
                                    'cleaning_type': '清洁类型',
                                    'cleaning_area': '清洁面积',
                                    'equipment_skill': '设备使用',
                                    'vehicle_type': '车辆类型',
                                    'driving_license': '驾驶证类型',
                                    'transport_experience': '运输经验',
                                    'police_record': '公安备案',
                                    'lock_type': '锁具类型',
                                    'service_experience': '服务经验',
                                    'appliance_type': '家电类型',
                                    'repair_experience': '维修经验',
                                    'certification': '相关证书',
                                    'medical_qualification': '医疗资质',
                                    'nursing_experience': '护理经验',
                                    'specialty': '专业特长'
                                };
                                
                                this.experienceList.push({
                                    label: labelMap[key] || key,
                                    content: data.experience[key]
                                });
                            }
                        }
                    }
                    
                    // 处理技能信息
                    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
                        // 如果有技能数据，可以添加到经验列表中或单独显示
                        data.skills.forEach(skill => {
                            if (skill && skill.key && skill.value) {
                                this.experienceList.push({
                                    label: skill.key,
                                    content: skill.value
                                });
                            }
                        });
                    }
                    
                    // 处理求职意向
                    this.intentionList = [];
                    if (data.category_name) {
                        this.intentionList.push({ 
                            label: '工作类型', 
                            content: data.category_name 
                        });
                    }
                    
                    // 处理求职意向数据（JSON格式）
                    if (data.intentions && Array.isArray(data.intentions) && data.intentions.length > 0) {
                        data.intentions.forEach(intention => {
                            if (intention && intention.key && intention.value) {
                                this.intentionList.push({
                                    label: intention.key,
                                    content: intention.value
                                });
                            }
                        });
                    }
                    
                    // 如果没有求职意向数据，至少显示分类
                    if (this.intentionList.length === 0 && data.category_name) {
                        this.intentionList.push({ 
                            label: '工作类型', 
                            content: data.category_name 
                        });
                    }
                    
                    // 更新店铺信息
                    if (data.company_name) {
                        this.storeInfo.name = data.company_name;
                    } else {
                        this.storeInfo.name = 'e家政';
                    }
                    // 地址先写死，后续从接口获取
                    // this.storeInfo.address = data.address || '西百花巷16号3D打印别墅';
                    // 标签先写死，后续从接口获取
                    // this.storeInfo.tags = data.tags || ['育儿嫂', '保姆'];
                    
                    // 处理服务描述
                    if (data.description) {
                        this.serviceDescription = data.description;
                    }
                    
                    // 处理服务内容（优先使用 service_description，其次使用 content）
                    if (data.service_description) {
                        this.serviceContent = data.service_description;
                    } else if (data.content) {
                        this.serviceContent = data.content;
                    }
                } else {
                    uni.showToast({ 
                        title: res.msg || '获取服务详情失败', 
                        icon: 'none' 
                    });
                }
                uni.hideLoading();
            } catch (e) {
                uni.hideLoading();
                uni.showToast({ title: '加载失败', icon: 'error' });
            }
        },
        toggleFavorite() {
            this.isFavorite = !this.isFavorite;
        },
        goToStore() {
            // 跳转到店铺服务列表页面
            uni.navigateTo({
                url: `/bundle_home_service/pages/store_service_list/store_service_list?storeName=${encodeURIComponent(this.storeInfo.name)}&storeId=1`
            });
        },
        consult() {
            // 在线咨询
            console.log('在线咨询');
        },
        placeOrder() {
            // 立即下单，跳转到确认订单页面
            uni.navigateTo({
                url: `/bundle_home_service/pages/service_confirm_order/service_confirm_order?service_id=${this.serviceInfo.id}`
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.service-detail-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 88px; // 为固定定位的导航栏留出空间
}

.content-scroll {
    flex: 1;
    padding: 20rpx 30rpx;
    padding-bottom: 320rpx;
    box-sizing: border-box;
}

.profile-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    gap: 30rpx;
}

.profile-avatar {
    width: 200rpx;
    height: 240rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar-img {
    width: 100%;
    height: 100%;
}

.profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.profile-name {
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
}

.profile-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #FF5722;
}

.profile-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
    row-gap: 20rpx;
}

.detail-row {
    display: contents;
}

.detail-item {
    font-size: 26rpx;
    color: #666666;
}

.section-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30rpx;
}

.certification-list {
    display: flex;
    gap: 40rpx;
}

.certification-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
}

.cert-icon {
    width: 80rpx;
    height: 80rpx;
    border: 2rpx solid #E0E0E0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cert-text {
    font-size: 24rpx;
    color: #333333;
}

.experience-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.experience-item {
    display: flex;
    gap: 12rpx;
}

.experience-label {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    min-width: 160rpx;
}

.experience-content {
    font-size: 28rpx;
    color: #666666;
    flex: 1;
}

.intention-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.intention-item {
    display: flex;
    gap: 12rpx;
}

.intention-label {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    min-width: 160rpx;
}

.intention-content {
    font-size: 28rpx;
    color: #666666;
    flex: 1;
}

.section-content {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.8;
    word-wrap: break-word;
}

.content-text {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.8;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.store-card {
    display: flex;
    gap: 20rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin-right: -10rpx;
}

.store-image { 
    width: 200rpx;
    height: 150rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
}

.store-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.store-address {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 8rpx;
}

.store-tags {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
    margin-bottom: 8rpx;
}

.store-tag {
    background-color: #F0FFF8;
    border: 1rpx solid #1B8902;
    color: #1B8902;
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
}

.store-btn {
    background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
    border-radius: 40rpx;
    padding: 25rpx 0;
    text-align: center;
    margin-top: 20rpx;
    width: 100%;
    box-sizing: border-box;
}

.store-btn-text {
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
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
    align-items: center;
    justify-content: space-between;
    border-top: 1rpx solid #E0E0E0;
    z-index: 100;
    box-sizing: border-box;
}

.action-left {
    display: flex;
    gap: 40rpx;
}

.action-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
}

.action-icon {
    width: 48rpx;
    height: 48rpx;
}

.action-icon-text {
    font-size: 22rpx;
    color: #666666;
}

.action-right {
    display: flex;
    gap: 20rpx;
    padding-right: 10rpx;
}

.action-btn {
    padding: 20rpx 60rpx;
    border-radius: 40rpx;
    min-width: 220rpx;
    text-align: center;
}

.consult-btn {
    border: 2rpx solid #149906;
    background-color: transparent;
}

.order-btn {
    background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
}

.action-btn-text {
    font-size: 28rpx;
    font-weight: bold;
}

.consult-btn .action-btn-text {
    color: #159907;
}

.order-btn .action-btn-text {
    color: #FFFFFF;
}
</style>
