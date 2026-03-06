<template>
    <view class="apply-page">
        <custom-navbar title="申请入驻"></custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <!-- 第一步：选择角色 -->
            <view class="section">
                <view class="section-title">选择申请角色</view>
                <view class="role-grid">
                    <view
                        v-for="item in roleList"
                        :key="item.id"
                        class="role-card"
                        :class="{ active: form.member_role_id === item.id }"
                        @click="selectRole(item)"
                    >
                        <view class="role-icon">
                            <u-icon :name="item.code === 'personal' ? 'account' : item.code === 'agent' ? 'account-fill' : 'home'" size="36" color="#4CAF50"></u-icon>
                        </view>
                        <text class="role-name">{{ item.name }}</text>
                        <text class="role-desc">{{ roleDesc[item.code] || '' }}</text>
                    </view>
                </view>
            </view>

            <!-- 第二步：填写表单 -->
            <view v-if="form.member_role_id" class="section">
                <view class="section-title" v-if="selectedRoleCode === 'agency'">经纪公司资料</view>
                <view class="section-title" v-else>申请资料</view>

                <!-- 联系人信息（所有角色通用） -->
                <view class="form-item">
                    <text class="label">联系人名称</text>
                    <input
                        class="input"
                        v-model="form.name"
                        placeholder="请填写联系人名称"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>

                <view class="form-item">
                    <text class="label">联系电话</text>
                    <view class="phone-row">
                        <text class="phone-prefix">+86</text>
                        <input
                            class="input phone-input"
                            v-model="form.phone"
                            type="number"
                            placeholder="请填写联系电话"
                            placeholder-style="color:#CCCCCC;"
                        />
                    </view>
                </view>

                <view class="form-item">
                    <text class="label">邮箱</text>
                    <input
                        class="input"
                        v-model="form.email"
                        placeholder="请填写邮箱"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>

                <!-- 地址信息 -->
                <view class="form-item" @click="pickRegion">
                    <text class="label">省/市/县</text>
                    <view class="picker-value">
                        <text :class="{ placeholder: !form.region }">
                            {{ form.region || '请选择省/市/县' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                </view>

                <view class="form-item">
                    <text class="label">详细地址</text>
                    <input
                        class="input"
                        v-model="form.address"
                        placeholder="街道、小区、门牌号等详细地址"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>

                <!-- 经纪人/经纪公司：房产经纪公司名称（须为系统中已存在的公司） -->
                <view v-if="selectedRoleCode === 'agent' || selectedRoleCode === 'agency'" class="form-item">
                    <text class="label">房产经纪公司全称 <text class="required">*</text></text>
                    <input
                        class="input"
                        v-model="form.company"
                        placeholder="请填写已在系统中登记的经纪公司完整全称"
                        placeholder-style="color:#CCCCCC;"
                    />
                    <text class="form-tip">仅支持已在本平台登记的经纪公司，否则无法提交</text>
                </view>

                <!-- 简介 -->
                <view class="form-item textarea-item">
                    <text class="label">简介/主营说明</text>
                    <textarea
                        class="textarea"
                        v-model="form.desc"
                        :placeholder="selectedRoleCode === 'agency' || selectedRoleCode === 'agent' ? '请介绍公司/个人主营业务、服务范围等' : '如：主营XX区域二手房，100%真实房源假必赔，佣金不高于 X%。'"
                        placeholder-style="color:#CCCCCC;"
                        maxlength="500"
                    ></textarea>
                    <view class="char-count">{{ (form.desc || '').length }}/500</view>
                </view>

                <!-- 资质图片，仅经纪人 / 经纪公司需要 -->
                <view v-if="selectedRoleCode === 'agent' || selectedRoleCode === 'agency'" class="upload-row">
                    <view class="upload-item" @click="chooseLicense">
                        <view class="upload-box">
                            <image v-if="form.license" :src="form.license" class="upload-preview" mode="aspectFill" />
                            <u-icon v-else name="plus" size="32" color="#CCCCCC"></u-icon>
                        </view>
                        <text class="upload-text">营业执照</text>
                    </view>
                    <view v-if="selectedRoleCode === 'agency'" class="upload-item" @click="chooseOrgCert">
                        <view class="upload-box">
                            <image v-if="form.orgCert" :src="form.orgCert" class="upload-preview" mode="aspectFill" />
                            <u-icon v-else name="plus" size="32" color="#CCCCCC"></u-icon>
                        </view>
                        <text class="upload-text">经纪机构备案证明</text>
                    </view>
                </view>
            </view>

            <view v-if="form.member_role_id" class="submit-wrapper">
                <button class="submit-btn" @click="submit">提交申请</button>
            </view>
        </scroll-view>

        <u-picker
            v-model="showRegionPicker"
            mode="region"
            @confirm="onRegionConfirm"
        ></u-picker>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getPropertyMemberRoleList, submitPropertyIdentityApply } from '@/api/store'
import { uploadFile } from '@/utils/tools'

export default {
    name: 'HouseIdentityApply',
    components: { CustomNavbar },
    data() {
        return {
            roleList: [],
            form: {
                member_role_id: 0,
                name: '',
                phone: '',
                email: '',
                region: '',
                address: '',
                avatar: '',
                desc: '',
                company: '',
                license: '',
                orgCert: ''
            },
            showRegionPicker: false,
            roleDesc: {
                personal: '个人买房租房',
                agent: '管理客户和房源',
                agency: '旗下可管理多个经纪人'
            }
        }
    },
    computed: {
        selectedRoleCode() {
            const r = this.roleList.find(x => x.id === this.form.member_role_id)
            return r ? r.code : ''
        }
    },
    onLoad() {
        this.loadRoles()
    },
    methods: {
        loadRoles() {
            getPropertyMemberRoleList().then(res => {
                if (res && res.code === 1 && res.data) {
                    this.roleList = res.data
                }
            }).catch(() => {})
        },
        selectRole(item) {
            this.form.member_role_id = item.id
        },
        chooseAvatar() {
            uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: (res) => {
                    this.form.avatar = res.tempFilePaths[0]
                }
            })
        },
        pickRegion() {
            this.showRegionPicker = true
        },
        onRegionConfirm(e) {
            if (e && (e.province || e.city)) {
                const arr = [e.province?.label, e.city?.label, e.area?.label].filter(Boolean)
                this.form.region = arr.join(' ')
            }
        },
        chooseLicense() {
            uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: (res) => {
                    this.form.license = res.tempFilePaths[0]
                }
            })
        },
        chooseOrgCert() {
            uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: (res) => {
                    this.form.orgCert = res.tempFilePaths[0]
                }
            })
        },
        async uploadImages() {
            const imgs = []
            if (this.form.license) {
                const d = await uploadFile(this.form.license)
                const url = (d && (d.url || d.uri)) ? (d.url || d.uri) : (typeof d === 'string' ? d : '')
                if (url) imgs.push(url)
            }
            if (this.form.orgCert) {
                const d = await uploadFile(this.form.orgCert)
                const url = (d && (d.url || d.uri)) ? (d.url || d.uri) : (typeof d === 'string' ? d : '')
                if (url) imgs.push(url)
            }
            return imgs.filter(Boolean).join(',')
        },
        submit() {
            if (!this.form.member_role_id) {
                uni.showToast({ title: '请选择申请角色', icon: 'none' })
                return
            }
            const code = this.selectedRoleCode
            if (!this.form.name || !this.form.phone) {
                uni.showToast({ title: '请填写联系人和联系电话', icon: 'none' })
                return
            }
            if (code === 'personal') {
                if (!this.form.email || !this.form.region || !this.form.address) {
                    uni.showToast({ title: '请完善邮箱、省市县和详细地址', icon: 'none' })
                    return
                }
            }
            if (code === 'agent' || code === 'agency') {
                if (!this.form.company) {
                    uni.showToast({ title: '请填写经纪公司全称', icon: 'none' })
                    return
                }
            }
            uni.showLoading({ title: '提交中...' })
            this.uploadImages().then(certImages => {
                const post = {
                    member_role_id: this.form.member_role_id,
                    contact_name: this.form.name,
                    contact_phone: this.form.phone,
                    email: this.form.email || '',
                    region: this.form.region || '',
                    address_detail: this.form.address || '',
                    intro: this.form.desc || '',
                    company_name: this.form.company || '',
                    cert_images: certImages
                }
                submitPropertyIdentityApply(post).then(res => {
                    uni.hideLoading()
                    if (res && res.code === 1) {
                        uni.showToast({ title: '提交成功，请等待审核', icon: 'success' })
                        setTimeout(() => {
                            uni.navigateBack()
                        }, 1500)
                    } else {
                        uni.showToast({ title: res?.msg || '提交失败', icon: 'none' })
                    }
                }).catch(() => {
                    uni.hideLoading()
                    uni.showToast({ title: '提交失败', icon: 'none' })
                })
            }).catch(() => {
                uni.hideLoading()
                uni.showToast({ title: '图片上传失败', icon: 'none' })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.apply-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F5;
    padding-top: 88px;
}

.content-scroll {
    height: calc(100vh - 88px);
}

.section {
    background-color: #FFFFFF;
    padding: 24rpx 30rpx 30rpx;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 24rpx;
    font-weight: 500;
}

.required { color: #E53935; }

.role-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.role-card {
    flex: 1;
    min-width: 200rpx;
    padding: 24rpx;
    border-radius: 16rpx;
    border: 2rpx solid #EEEEEE;
    text-align: center;
    transition: all 0.2s;
}

.role-card.active {
    border-color: #4CAF50;
    background: #E8F5E9;
}

.role-icon {
    margin-bottom: 12rpx;
}

.role-name {
    display: block;
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 8rpx;
}

.role-desc {
    font-size: 22rpx;
    color: #999999;
}

.avatar-row {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
}

.avatar-label {
    font-size: 26rpx;
    color: #333333;
    width: 150rpx;
}

.avatar-upload {
    flex: 1;
    display: flex;
}

.avatar-img,
.avatar-placeholder {
    width: 96rpx;
    height: 96rpx;
    border-radius: 48rpx;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-item {
    margin-bottom: 24rpx;
}

.label { display: block; font-size: 26rpx; color: #333333; margin-bottom: 12rpx; }

.form-tip { display: block; font-size: 22rpx; color: #999999; margin-top: 8rpx; }

.input {
    width: 100%;
    height: 72rpx;
    border-radius: 8rpx;
    background: #F5F5F5;
    padding: 0 20rpx;
    box-sizing: border-box;
    font-size: 26rpx;
}

.phone-row { display: flex; align-items: center; }

.phone-prefix { width: 120rpx; font-size: 26rpx; color: #666666; }

.phone-input { flex: 1; }

.picker-value {
    height: 72rpx;
    background: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.picker-value text { font-size: 26rpx; color: #333333; }

.picker-value text.placeholder { color: #999999; }

.textarea {
    width: 100%;
    min-height: 160rpx;
    border-radius: 8rpx;
    background: #F5F5F5;
    padding: 16rpx 20rpx;
    box-sizing: border-box;
    font-size: 26rpx;
}

.char-count {
    text-align: right;
    font-size: 22rpx;
    color: #999999;
    margin-top: 8rpx;
}

.upload-row {
    display: flex;
    gap: 20rpx;
    margin-top: 10rpx;
}

.upload-item { flex: 1; }

.upload-box {
    height: 160rpx;
    border-radius: 8rpx;
    border: 2rpx dashed #DDDDDD;
    background: #F9F9F9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10rpx;
    overflow: hidden;
}

.upload-preview {
    width: 100%;
    height: 100%;
}

.upload-text { font-size: 22rpx; color: #666666; }

.submit-wrapper { padding: 30rpx; }

.submit-btn {
    width: 100%;
    height: 88rpx;
    border-radius: 44rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    font-size: 30rpx;
    font-weight: bold;
    border: none;
}

.submit-btn::after { border: none; }
</style>
