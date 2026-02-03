<template>
    <view class="service-add-page">
        <!-- 状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        
        <!-- 顶部导航栏 -->
        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">{{ isEdit ? '编辑服务' : '添加服务' }}</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y>
            <!-- 基本信息 -->
            <view class="form-section">
                <view class="section-title">基本信息</view>
                
                <!-- 头像 -->
                <view class="form-item">
                    <view class="form-label">头像</view>
                    <view class="avatar-upload" @click="chooseAvatar">
                        <image v-if="formData.avatar" :src="formData.avatar" mode="aspectFill" class="avatar-img"></image>
                        <view v-else class="avatar-placeholder">
                            <u-icon name="camera" size="40" color="#CCCCCC"></u-icon>
                            <text class="placeholder-text">上传头像</text>
                        </view>
                    </view>
                </view>

                <!-- 服务名称 -->
                <view class="form-item">
                    <view class="form-label required">服务名称</view>
                    <input v-model="formData.name" placeholder="请输入服务名称" class="form-input" />
                </view>

                <!-- 选择分类 -->
                <view class="form-item">
                    <view class="form-label required">服务类型</view>
                    <picker mode="selector" :range="categoryList" range-key="name" @change="onCategoryChange" :value="categoryIndex">
                        <view class="picker-view">
                            <text v-if="selectedCategory">{{ selectedCategory.name }}</text>
                            <text v-else class="placeholder">请选择服务类型</text>
                            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                        </view>
                    </picker>
                </view>

                <!-- 选择公司 -->
                <view class="form-item">
                    <view class="form-label required">所属公司</view>
                    <picker mode="selector" :range="companyList" range-key="name" @change="onCompanyChange" :value="companyIndex">
                        <view class="picker-view">
                            <text v-if="selectedCompany">{{ selectedCompany.name }}</text>
                            <text v-else class="placeholder">请选择公司</text>
                            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                        </view>
                    </picker>
                </view>

                <!-- 年龄 -->
                <view class="form-item">
                    <view class="form-label">年龄</view>
                    <input v-model.number="formData.age" type="number" placeholder="请输入年龄" class="form-input" />
                </view>

                <!-- 性别 -->
                <view class="form-item">
                    <view class="form-label">性别</view>
                    <view class="radio-group">
                        <view class="radio-item" @click="formData.gender = 1" :class="{ active: formData.gender == 1 }">
                            <text>男</text>
                        </view>
                        <view class="radio-item" @click="formData.gender = 2" :class="{ active: formData.gender == 2 }">
                            <text>女</text>
                        </view>
                    </view>
                </view>

                <!-- 籍贯 -->
                <view class="form-item">
                    <view class="form-label">籍贯</view>
                    <input v-model="formData.origin" placeholder="请输入籍贯" class="form-input" />
                </view>

                <!-- 民族 -->
                <view class="form-item">
                    <view class="form-label">民族</view>
                    <input v-model="formData.ethnicity" placeholder="请输入民族" class="form-input" />
                </view>

                <!-- 学历 -->
                <view class="form-item">
                    <view class="form-label">学历</view>
                    <picker mode="selector" :range="educationOptions" @change="onEducationChange" :value="educationIndex">
                        <view class="picker-view">
                            <text v-if="formData.education">{{ formData.education }}</text>
                            <text v-else class="placeholder">请选择学历</text>
                            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                        </view>
                    </picker>
                </view>

                <!-- 服务年限 -->
                <view class="form-item">
                    <view class="form-label">服务年限</view>
                    <input v-model.number="formData.service_years" type="number" placeholder="请输入服务年限（年）" class="form-input" />
                </view>

                <!-- 服务价格 -->
                <view class="form-item">
                    <view class="form-label">服务价格</view>
                    <view class="price-input-wrapper">
                        <input v-model.number="formData.price" type="digit" placeholder="0" class="form-input price-input" />
                        <text class="price-unit">元/月</text>
                    </view>
                </view>

                <!-- 服务户数 -->
                <view class="form-item">
                    <view class="form-label">服务户数</view>
                    <input v-model.number="formData.service_count" type="number" placeholder="请输入服务户数" class="form-input" />
                </view>

                <!-- 服务描述 -->
                <view class="form-item">
                    <view class="form-label">服务描述</view>
                    <textarea v-model="formData.description" placeholder="请输入服务描述" class="form-textarea" maxlength="500"></textarea>
                </view>
            </view>

            <!-- 认证资料 -->
            <view class="form-section" v-if="certTypes.length > 0">
                <view class="section-title">认证资料</view>
                <view class="form-item" v-for="(certType, index) in certTypes" :key="certType.id">
                    <view class="form-label" :class="{ required: certType.is_required }">{{ certType.name }}</view>
                    <view class="cert-upload" @click="chooseCertImage(index)">
                        <image v-if="certImages[certType.id]" :src="certImages[certType.id]" mode="aspectFill" class="cert-img"></image>
                        <view v-else class="cert-placeholder">
                            <u-icon name="camera" size="32" color="#CCCCCC"></u-icon>
                            <text class="placeholder-text">上传{{ certType.name }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 服务经验（动态表单） -->
            <view class="form-section" v-if="experienceConfigs.length > 0">
                <view class="section-title">服务经验</view>
                <view class="form-item" v-for="(config, index) in experienceConfigs" :key="config.id">
                    <view class="form-label" :class="{ required: config.is_required }">{{ config.field_label }}</view>
                    
                    <!-- 文本输入 -->
                    <input v-if="config.field_type === 'text'" 
                           v-model="experienceData[config.field_name]" 
                           :placeholder="'请输入' + config.field_label" 
                           class="form-input" />
                    
                    <!-- 多行文本 -->
                    <textarea v-else-if="config.field_type === 'textarea'" 
                              v-model="experienceData[config.field_name]" 
                              :placeholder="'请输入' + config.field_label" 
                              class="form-textarea" 
                              maxlength="500"></textarea>
                    
                    <!-- 选择器 -->
                    <picker v-else-if="config.field_type === 'select' && config.options.length > 0" 
                            mode="selector" 
                            :range="config.options" 
                            range-key="label"
                            @change="(e) => onExperienceSelectChange(e, config.field_name, config.options)"
                            :value="getExperienceSelectIndex(config.field_name, config.options)">
                        <view class="picker-view">
                            <text v-if="experienceData[config.field_name]">{{ getExperienceSelectLabel(config.field_name, config.options) }}</text>
                            <text v-else class="placeholder">请选择{{ config.field_label }}</text>
                            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                        </view>
                    </picker>
                </view>
            </view>
        </scroll-view>

        <!-- 底部提交按钮 -->
        <view class="bottom-action-bar">
            <view class="submit-btn" @click="submitForm">
                <text class="submit-btn-text">{{ isEdit ? '保存修改' : '提交' }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'ServiceAdd',
    data() {
        return {
            statusBarHeight: 0,
            isEdit: false,
            serviceId: 0,
            categoryList: [],
            selectedCategory: null,
            categoryIndex: 0,
            companyList: [],
            selectedCompany: null,
            companyIndex: 0,
            certTypes: [],
            certImages: {},
            experienceConfigs: [],
            experienceData: {},
            educationOptions: ['小学', '初中', '高中', '中专', '大专', '本科', '硕士', '博士'],
            educationIndex: -1,
            formData: {
                name: '',
                category_id: 0,
                company_id: 0,
                avatar: '',
                age: 0,
                gender: 0,
                origin: '',
                ethnicity: '',
                education: '',
                service_years: 0,
                price: 0,
                service_count: 0,
                description: '',
                status: 1
            }
        }
    },
    onLoad(options) {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        
        if (options.id) {
            this.isEdit = true;
            this.serviceId = parseInt(options.id);
            this.loadServiceDetail();
        }
        
        this.loadCategoryList();
        this.loadCompanyList();
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        
        // 加载分类列表
        async loadCategoryList() {
            try {
                const res = await this.$u.get('/api/home_service.category/getAllList');
                if (res.code === 1) {
                    this.categoryList = res.data || [];
                }
            } catch (e) {
                console.error('加载分类列表失败:', e);
            }
        },
        
        // 加载公司列表
        async loadCompanyList() {
            try {
                const res = await this.$u.get('/api/home_service.company/getAllCompanies');
                if (res.code === 1) {
                    this.companyList = res.data || [];
                }
            } catch (e) {
                console.error('加载公司列表失败:', e);
            }
        },
        
        // 分类改变
        async onCategoryChange(e) {
            const index = parseInt(e.detail.value);
            this.categoryIndex = index;
            this.selectedCategory = this.categoryList[index];
            this.formData.category_id = this.selectedCategory.id;
            
            // 加载该分类下的认证类型和经验配置
            await this.loadCertTypes();
            await this.loadExperienceConfigs();
        },
        
        // 公司改变
        onCompanyChange(e) {
            const index = parseInt(e.detail.value);
            this.companyIndex = index;
            this.selectedCompany = this.companyList[index];
            this.formData.company_id = this.selectedCompany.id;
        },
        
        // 学历改变
        onEducationChange(e) {
            const index = parseInt(e.detail.value);
            this.educationIndex = index;
            this.formData.education = this.educationOptions[index];
        },
        
        // 加载认证类型
        async loadCertTypes() {
            if (!this.formData.category_id) return;
            
            try {
                const res = await this.$u.get('/api/home_service.service/getCertTypes', {
                    category_id: this.formData.category_id
                });
                if (res.code === 1) {
                    this.certTypes = res.data || [];
                }
            } catch (e) {
                console.error('加载认证类型失败:', e);
            }
        },
        
        // 加载经验配置
        async loadExperienceConfigs() {
            if (!this.formData.category_id) return;
            
            try {
                const res = await this.$u.get('/api/home_service.service/getExperienceConfig', {
                    category_id: this.formData.category_id
                });
                if (res.code === 1) {
                    this.experienceConfigs = res.data || [];
                    // 初始化经验数据
                    this.experienceConfigs.forEach(config => {
                        if (!this.experienceData[config.field_name]) {
                            this.experienceData[config.field_name] = '';
                        }
                    });
                }
            } catch (e) {
                console.error('加载经验配置失败:', e);
            }
        },
        
        // 选择头像
        chooseAvatar() {
            uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    this.uploadImage(res.tempFilePaths[0], 'avatar');
                }
            });
        },
        
        // 选择认证图片
        chooseCertImage(index) {
            uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    const certType = this.certTypes[index];
                    this.uploadImage(res.tempFilePaths[0], 'cert', certType.id);
                }
            });
        },
        
        // 上传图片
        async uploadImage(filePath, type, certTypeId = 0) {
            uni.showLoading({ title: '上传中...' });
            try {
                // 这里需要调用实际的上传接口
                // const res = await this.$u.upload('/api/common/upload/image', filePath);
                // 模拟上传成功
                setTimeout(() => {
                    uni.hideLoading();
                    if (type === 'avatar') {
                        this.formData.avatar = filePath; // 实际应该是 res.data.url
                    } else if (type === 'cert') {
                        this.$set(this.certImages, certTypeId, filePath); // 实际应该是 res.data.url
                    }
                    uni.showToast({ title: '上传成功', icon: 'success' });
                }, 1000);
            } catch (e) {
                uni.hideLoading();
                uni.showToast({ title: '上传失败', icon: 'error' });
            }
        },
        
        // 经验选择改变
        onExperienceSelectChange(e, fieldName, options) {
            const index = parseInt(e.detail.value);
            this.experienceData[fieldName] = options[index].value;
        },
        
        // 获取经验选择索引
        getExperienceSelectIndex(fieldName, options) {
            const value = this.experienceData[fieldName];
            if (!value) return 0;
            const index = options.findIndex(opt => opt.value === value);
            return index >= 0 ? index : 0;
        },
        
        // 获取经验选择标签
        getExperienceSelectLabel(fieldName, options) {
            const value = this.experienceData[fieldName];
            if (!value) return '';
            const option = options.find(opt => opt.value === value);
            return option ? option.label : '';
        },
        
        // 加载服务详情（编辑时）
        async loadServiceDetail() {
            uni.showLoading({ title: '加载中...' });
            try {
                const res = await this.$u.get('/api/home_service.service/getDetail', {
                    id: this.serviceId
                });
                if (res.code === 1 && res.data) {
                    const data = res.data;
                    this.formData = {
                        name: data.name || '',
                        category_id: data.category_id || 0,
                        company_id: data.company_id || 0,
                        avatar: data.avatar || '',
                        age: data.age || 0,
                        gender: data.gender || 0,
                        origin: data.origin || '',
                        ethnicity: data.ethnicity || '',
                        education: data.education || '',
                        service_years: data.service_years || 0,
                        price: data.price || 0,
                        service_count: data.service_count || 0,
                        description: data.description || '',
                        status: data.status || 1
                    };
                    
                    // 设置分类和公司
                    const categoryIndex = this.categoryList.findIndex(cat => cat.id === data.category_id);
                    if (categoryIndex >= 0) {
                        this.categoryIndex = categoryIndex;
                        this.selectedCategory = this.categoryList[categoryIndex];
                    }
                    
                    const companyIndex = this.companyList.findIndex(com => com.id === data.company_id);
                    if (companyIndex >= 0) {
                        this.companyIndex = companyIndex;
                        this.selectedCompany = this.companyList[companyIndex];
                    }
                    
                    // 设置学历索引
                    const eduIndex = this.educationOptions.findIndex(edu => edu === data.education);
                    if (eduIndex >= 0) {
                        this.educationIndex = eduIndex;
                    }
                    
                    // 加载认证类型和经验配置
                    await this.loadCertTypes();
                    await this.loadExperienceConfigs();
                    
                    // 设置认证图片和经验数据
                    if (data.certs) {
                        data.certs.forEach(cert => {
                            if (cert.image) {
                                this.$set(this.certImages, cert.cert_type_id, cert.image);
                            }
                        });
                    }
                    
                    if (data.experience) {
                        this.experienceData = { ...data.experience };
                    }
                }
                uni.hideLoading();
            } catch (e) {
                uni.hideLoading();
                uni.showToast({ title: '加载失败', icon: 'error' });
            }
        },
        
        // 提交表单
        async submitForm() {
            // 验证必填项
            if (!this.formData.name) {
                uni.showToast({ title: '请输入服务名称', icon: 'none' });
                return;
            }
            if (!this.formData.category_id) {
                uni.showToast({ title: '请选择服务类型', icon: 'none' });
                return;
            }
            if (!this.formData.company_id) {
                uni.showToast({ title: '请选择公司', icon: 'none' });
                return;
            }
            
            // 构建提交数据
            const submitData = {
                ...this.formData,
                cert_types: this.certTypes.map(ct => ct.id),
                cert_images: this.certImages,
                experience: this.experienceData
            };
            
            if (this.isEdit) {
                submitData.id = this.serviceId;
            }
            
            uni.showLoading({ title: '提交中...' });
            try {
                const url = this.isEdit ? '/api/home_service.service/edit' : '/api/home_service.service/add';
                const res = await this.$u.post(url, submitData);
                uni.hideLoading();
                
                if (res.code === 1) {
                    uni.showToast({ title: this.isEdit ? '保存成功' : '提交成功', icon: 'success' });
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 1500);
                } else {
                    uni.showToast({ title: res.msg || '提交失败', icon: 'error' });
                }
            } catch (e) {
                uni.hideLoading();
                uni.showToast({ title: '提交失败', icon: 'error' });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.service-add-page {
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
    padding: 20rpx 30rpx;
    padding-bottom: 200rpx;
    box-sizing: border-box;
}

.form-section {
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
}

.form-item {
    margin-bottom: 30rpx;
    
    &:last-child {
        margin-bottom: 0;
    }
}

.form-label {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 20rpx;
    display: block;
    
    &.required::before {
        content: '*';
        color: #FF5722;
        margin-right: 8rpx;
    }
}

.form-input {
    width: 100%;
    height: 80rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;
}

.price-input-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.price-input {
    flex: 1;
}

.price-unit {
    font-size: 28rpx;
    color: #666666;
}

.form-textarea {
    width: 100%;
    min-height: 200rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;
}

.picker-view {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333333;
    
    .placeholder {
        color: #CCCCCC;
    }
}

.radio-group {
    display: flex;
    gap: 30rpx;
}

.radio-item {
    padding: 16rpx 40rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #666666;
    
    &.active {
        background-color: #4CAF50;
        color: #FFFFFF;
    }
}

.avatar-upload {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #F5F5F5;
}

.avatar-img {
    width: 100%;
    height: 100%;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
}

.placeholder-text {
    font-size: 24rpx;
    color: #CCCCCC;
}

.cert-upload {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #F5F5F5;
}

.cert-img {
    width: 100%;
    height: 100%;
}

.cert-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
}

.bottom-action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #E0E0E0;
    z-index: 100;
}

.submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.submit-btn-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #FFFFFF;
}
</style>

