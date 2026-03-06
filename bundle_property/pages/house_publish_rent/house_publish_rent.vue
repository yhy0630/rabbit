<template>
    <view class="publish-page">
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

        <view class="header-navbar">
            <view class="navbar-content">
                <view class="back-btn" @click="goBack">
                    <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
                </view>
                <view class="navbar-title">发布出租房</view>
                <view class="navbar-right"></view>
            </view>
        </view>

        <scroll-view class="content-scroll" scroll-y>
            <view class="tip-banner rent">
                <view class="tip-title">轻松上架房源，快速寻找租客</view>
                <view class="tip-sub">
                    <text>信息隐藏保护</text>
                    <text>真实租客保障</text>
                    <text>靠谱经纪人合作</text>
                </view>
            </view>

            <view class="form-section">
                <view class="form-item required">
                    <view class="form-label">房源标题</view>
                    <input
                        class="form-input"
                        v-model="form.title"
                        placeholder="请输入房源标题"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>

                <view class="form-item required" @click="showRegionPicker = true">
                    <view class="form-label">省/市/县</view>
                    <view class="form-value">
                        <text class="value-text" :class="{ placeholder: !form.regionText }">
                            {{ form.regionText || '请选择省/市/县' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                </view>
                <view class="form-item required">
                    <view class="form-label">详细地址</view>
                    <input
                        class="form-input"
                        v-model="form.addressDetail"
                        placeholder="请输入街道、门牌号等详细地址"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>
                <view class="form-item required">
                    <view class="form-label">小区名称</view>
                    <input
                        class="form-input"
                        v-model="form.community"
                        placeholder="请输入小区名称"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>
                <view class="form-item required" @click="chooseTencentLocation">
                    <view class="form-label">地图选点</view>
                    <view class="form-value">
                        <text class="value-text" :class="{ placeholder: !form.mapAddress }">
                            {{ form.mapAddress || '点击尝试选点（可选，可改填下方经纬度）' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                </view>
                <view class="form-item required">
                    <view class="form-label">经度</view>
                    <input
                        class="form-input"
                        type="digit"
                        v-model="form.longitude"
                        placeholder="请输入经度"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>
                <view class="form-item required">
                    <view class="form-label">纬度</view>
                    <input
                        class="form-input"
                        type="digit"
                        v-model="form.latitude"
                        placeholder="请输入纬度"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>

                <view class="form-item required">
                    <view class="form-label">房屋类型</view>
                    <picker
                        mode="selector"
                        :range="houseTypeOptions"
                        :value="houseTypeIndex"
                        @change="onHouseTypeChange"
                    >
                        <view class="form-value">
                            <text class="value-text" :class="{ placeholder: houseTypeIndex === -1 }">
                                {{ houseTypeIndex === -1 ? '请选择' : houseTypeOptions[houseTypeIndex] }}
                            </text>
                            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                        </view>
                    </picker>
                </view>

                <view class="form-item required">
                    <view class="form-label">装修类型</view>
                    <picker
                        mode="selector"
                        :range="decorateOptions"
                        :value="decorateIndex"
                        @change="onDecorateChange"
                    >
                        <view class="form-value">
                            <text class="value-text" :class="{ placeholder: decorateIndex === -1 }">
                                {{ decorateIndex === -1 ? '请选择' : decorateOptions[decorateIndex] }}
                            </text>
                            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                        </view>
                    </picker>
                </view>

                <view class="form-item required">
                    <view class="form-label">户型</view>
                    <view class="flex-row">
                        <input
                            class="form-input small"
                            type="number"
                            v-model="form.room"
                            placeholder="几室"
                            placeholder-style="color:#CCCCCC;"
                        />
                        <input
                            class="form-input small"
                            type="number"
                            v-model="form.hall"
                            placeholder="几厅"
                            placeholder-style="color:#CCCCCC;"
                        />
                        <input
                            class="form-input small"
                            type="number"
                            v-model="form.toilet"
                            placeholder="几卫"
                            placeholder-style="color:#CCCCCC;"
                        />
                    </view>
                </view>

                <view class="form-item required">
                    <view class="form-label">楼层</view>
                    <view class="flex-row">
                        <input
                            class="form-input small"
                            type="number"
                            v-model="form.floor"
                            placeholder="当前楼层"
                            placeholder-style="color:#CCCCCC;"
                        />
                        <input
                            class="form-input small"
                            type="number"
                            v-model="form.totalFloor"
                            placeholder="总楼层"
                            placeholder-style="color:#CCCCCC;"
                        />
                    </view>
                </view>

                <view class="form-item required">
                    <view class="form-label">面积</view>
                    <view class="form-value">
                        <input
                            class="form-input"
                            type="digit"
                            v-model="form.area"
                            placeholder="请输入面积"
                            placeholder-style="color:#CCCCCC;"
                        />
                        <text class="suffix-text">㎡</text>
                    </view>
                </view>

                <view class="form-item required">
                    <view class="form-label">租金</view>
                    <view class="form-value">
                        <input
                            class="form-input"
                            type="digit"
                            v-model="form.rent"
                            placeholder="请输入租金"
                            placeholder-style="color:#CCCCCC;"
                        />
                        <text class="suffix-text">元/月</text>
                    </view>
                </view>

                <view class="form-item">
                    <view class="form-label">价格面议</view>
                    <view class="price-negotiable" @click="form.priceDiscuss = !form.priceDiscuss">
                        <view class="checkbox" :class="{ checked: form.priceDiscuss }"></view>
                        <text>价格面议</text>
                    </view>
                </view>

                <view class="form-item">
                    <view class="form-label">标签</view>
                    <view class="tag-section">
                        <view class="tag-input-row">
                            <input
                                class="form-input tag-input"
                                v-model="tagInput"
                                placeholder="请输入标签，最多4字"
                                placeholder-style="color:#CCCCCC;"
                                maxlength="4"
                            />
                            <button class="add-tag-btn" @click="addTag">添加标签</button>
                        </view>
                        <view class="tag-list">
                            <view
                                v-for="(tag, index) in tagList"
                                :key="index"
                                class="tag-item"
                            >
                                <text @click="editTag(index)">{{ tag }}</text>
                                <view class="tag-delete" @click="removeTag(index)">
                                    <u-icon name="close" size="12" color="#999"></u-icon>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="form-item textarea-item">
                    <view class="form-label">房源介绍</view>
                    <textarea
                        class="form-textarea"
                        v-model="form.description"
                        placeholder="请简单介绍房源亮点、周边配套等信息"
                        maxlength="500"
                        placeholder-style="color:#CCCCCC;"
                    ></textarea>
                    <view class="char-count">{{ form.description.length }}/500</view>
                </view>
            </view>

            <view class="form-section">
                <view class="form-subtitle">房源视频（最多1个，小于10M）</view>
                <view class="video-upload">
                    <view v-if="videoUrl" class="video-preview">
                        <video :src="videoUrl" class="video-elem" controls></video>
                        <view class="delete-icon" @click="removeVideo">
                            <u-icon name="close" size="16" color="#FFFFFF"></u-icon>
                        </view>
                    </view>
                    <view v-else class="image-item upload" @click="chooseVideo">
                        <u-icon name="plus" size="36" color="#CCCCCC"></u-icon>
                        <text class="upload-text">上传视频</text>
                    </view>
                </view>
            </view>

            <view class="form-section">
                <view class="form-subtitle">房源图片（最多15张，每张小于2M）</view>
                <view class="image-list">
                    <view
                        class="image-item"
                        v-for="(img, index) in imageList"
                        :key="index"
                    >
                        <image :src="img" mode="aspectFill" class="image"></image>
                        <view class="delete-icon" @click="removeImage(index)">
                            <u-icon name="close" size="16" color="#FFFFFF"></u-icon>
                        </view>
                    </view>
                    <view
                        class="image-item upload"
                        v-if="imageList.length < 15"
                        @click="chooseImage"
                    >
                        <u-icon name="plus" size="36" color="#CCCCCC"></u-icon>
                        <text class="upload-text">上传</text>
                    </view>
                </view>
            </view>

            <view class="form-section">
                <view class="form-item required">
                    <view class="form-label">联系电话</view>
                    <input
                        class="form-input"
                        v-model="form.phone"
                        placeholder="请输入联系电话"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>
            </view>

            <view class="submit-wrapper">
                <button class="submit-btn" @click="submit">提交</button>
            </view>
        </scroll-view>

        <u-picker
            v-model="showRegionPicker"
            mode="region"
            :params="regionParams"
            @confirm="onRegionConfirm"
        ></u-picker>
    </view>
</template>

<script>
import { submitPropertyListing, getPropertyCategoryList } from '@/api/store'
import { uploadFile, uploadVideo } from '@/utils/tools'

export default {
    name: 'HousePublishRent',
    data() {
        return {
            statusBarHeight: 0,
            houseTypeOptions: ['普通住宅', '公寓', '别墅', '其他'],
            decorateOptions: ['毛坯', '简单装修', '中等装修', '精装修', '豪华装修'],
            houseTypeIndex: -1,
            decorateIndex: -1,
            imageList: [],
            videoUrl: '',
            videoUploadUrl: '',
            tagList: [],
            tagInput: '',
            showRegionPicker: false,
            regionParams: { province: true, city: true, area: true },
            rentCategoryId: 0,
            form: {
                title: '',
                regionText: '',
                provinceId: '',
                cityId: '',
                districtId: '',
                addressDetail: '',
                community: '',
                mapAddress: '',
                longitude: '',
                latitude: '',
                houseType: '',
                decorateType: '',
                room: '',
                hall: '',
                toilet: '',
                floor: '',
                totalFloor: '',
                area: '',
                rent: '',
                priceDiscuss: false,
                description: '',
                phone: ''
            }
        }
    },
    onLoad() {
        const systemInfo = uni.getSystemInfoSync()
        this.statusBarHeight = systemInfo.statusBarHeight || 0
        getPropertyCategoryList().then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                const rent = res.data.find((c) => (c.code || '').toLowerCase() === 'rent')
                this.rentCategoryId = rent ? (rent.id || 0) : 0
            }
        })
    },
    methods: {
        goBack() {
            uni.navigateBack()
        },
        onRegionConfirm(e) {
            const region = e
            this.form.provinceId = region.province ? region.province.value : ''
            this.form.cityId = region.city ? region.city.value : ''
            this.form.districtId = region.area ? region.area.value : ''
            const p = region.province ? region.province.label : ''
            const c = region.city ? region.city.label : ''
            const d = region.area ? region.area.label : ''
            this.form.regionText = [p, c, d].filter(Boolean).join(' ')
        },
        chooseTencentLocation() {
            const keyword = [this.form.regionText, this.form.addressDetail, this.form.community].filter(Boolean).join(' ')
            uni.chooseLocation({
                keyword: keyword || undefined,
                success: (res) => {
                    this.form.mapAddress = res.address || res.name || ''
                    this.form.longitude = String(res.longitude ?? '')
                    this.form.latitude = String(res.latitude ?? '')
                    if (res.address && !this.form.addressDetail) this.form.addressDetail = res.address
                },
                fail: (err) => {
                    if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
                        uni.showToast({ title: '选址失败，请检查定位权限或稍后重试', icon: 'none' })
                    }
                }
            })
        },
        addTag() {
            const t = (this.tagInput || '').trim()
            if (!t) {
                uni.showToast({ title: '请输入标签', icon: 'none' })
                return
            }
            if (t.length > 4) {
                uni.showToast({ title: '标签最多4字', icon: 'none' })
                return
            }
            if (this.tagList.indexOf(t) >= 0) {
                uni.showToast({ title: '标签已存在', icon: 'none' })
                return
            }
            this.tagList.push(t)
            this.tagInput = ''
        },
        removeTag(index) {
            this.tagList.splice(index, 1)
        },
        editTag(index) {
            const old = this.tagList[index]
            uni.showModal({
                title: '编辑标签',
                editable: true,
                placeholderText: old,
                success: (res) => {
                    if (res.confirm && res.content !== undefined) {
                        const t = String(res.content).trim()
                        if (!t) return
                        if (t.length > 4) {
                            uni.showToast({ title: '标签最多4字', icon: 'none' })
                            return
                        }
                        this.tagList.splice(index, 1, t)
                    }
                }
            })
        },
        chooseVideo() {
            uni.chooseVideo({
                count: 1,
                sourceType: ['album', 'camera'],
                maxDuration: 120,
                success: (res) => {
                    const size = res.size || 0
                    if (size > 10 * 1024 * 1024) {
                        uni.showToast({ title: '视频需小于10M', icon: 'none' })
                        return
                    }
                    this.videoUrl = res.tempFilePath
                    uni.showLoading({ title: '上传视频中...' })
                    uploadVideo(res.tempFilePath)
                        .then((data) => {
                            this.videoUploadUrl = (data && (data.url || data.uri)) ? (data.url || data.uri) : ''
                            uni.hideLoading()
                            if (!this.videoUploadUrl) uni.showToast({ title: '视频上传失败', icon: 'none' })
                        })
                        .catch(() => {
                            uni.hideLoading()
                            uni.showToast({ title: '视频上传失败', icon: 'none' })
                            this.videoUrl = ''
                        })
                }
            })
        },
        removeVideo() {
            this.videoUrl = ''
            this.videoUploadUrl = ''
        },
        onHouseTypeChange(e) {
            this.houseTypeIndex = Number(e.detail.value)
            this.form.houseType = this.houseTypeOptions[this.houseTypeIndex]
        },
        onDecorateChange(e) {
            this.decorateIndex = Number(e.detail.value)
            this.form.decorateType = this.decorateOptions[this.decorateIndex]
        },
        onPriceDiscussChange(e) {
            this.form.priceDiscuss = e.detail.value
            if (this.form.priceDiscuss) this.form.rent = ''
        },
        chooseImage() {
            const remain = 15 - this.imageList.length
            uni.chooseImage({
                count: remain,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    this.imageList = this.imageList.concat(res.tempFilePaths)
                }
            })
        },
        removeImage(index) {
            this.imageList.splice(index, 1)
        },
        validate() {
            if (!this.form.title) return '请输入房源标题'
            if (!this.form.regionText) return '请选择省/市/县'
            if (!this.form.addressDetail) return '请输入详细地址'
            if (!this.form.community) return '请输入小区名称'
            if (!this.form.longitude || !this.form.latitude) return '请填写经度和纬度'
            if (!this.form.houseType) return '请选择房屋类型'
            if (!this.form.decorateType) return '请选择装修类型'
            if (!this.form.room || !this.form.hall || !this.form.toilet) return '请完善户型信息'
            if (!this.form.floor || !this.form.totalFloor) return '请完善楼层信息'
            if (!this.form.area) return '请输入面积'
            if (!this.form.priceDiscuss && !this.form.rent) return '请输入租金或选择价格面议'
            if (!this.form.phone) return '请输入联系电话'
            if (this.imageList.length === 0) return '请至少上传一张房源图片'
            return ''
        },
        submit() {
            const msg = this.validate()
            if (msg) {
                uni.showToast({ title: msg, icon: 'none' })
                return
            }
            const doSubmit = (imageUrls) => {
                const payload = {
                    title: this.form.title,
                    region_text: this.form.regionText,
                    province_id: this.form.provinceId,
                    city_id: this.form.cityId,
                    district_id: this.form.districtId,
                    address_detail: this.form.addressDetail,
                    community: this.form.community,
                    longitude: this.form.longitude,
                    latitude: this.form.latitude,
                    house_type: this.form.houseType,
                    decorate_type: this.form.decorateType,
                    room: this.form.room,
                    hall: this.form.hall,
                    toilet: this.form.toilet,
                    floor: this.form.floor,
                    total_floor: this.form.totalFloor,
                    area: this.form.area,
                    price: this.form.rent,
                    price_negotiable: this.form.priceDiscuss,
                    tags: this.tagList,
                    description: this.form.description,
                    phone: this.form.phone,
                    images: Array.isArray(imageUrls) ? imageUrls : (imageUrls ? String(imageUrls).split(',').filter(Boolean) : []),
                    video: this.videoUploadUrl || '',
                    category_id: this.rentCategoryId || 0,
                    publish_type: 'rent'
                }
                submitPropertyListing(payload)
                    .then((res) => {
                        uni.hideLoading()
                        if (res && res.code === 1) {
                            uni.showToast({ title: res.msg || '提交成功，请等待审核', icon: 'success' })
                            setTimeout(() => uni.navigateBack(), 1500)
                        } else {
                            uni.showToast({ title: (res && res.msg) || '提交失败', icon: 'none' })
                        }
                    })
                    .catch(() => {
                        uni.hideLoading()
                        uni.showToast({ title: '提交失败，请重试', icon: 'none' })
                    })
            }
            uni.showLoading({ title: '提交中...' })
            if (this.imageList.length === 0) {
                doSubmit([])
                return
            }
            Promise.all(
                this.imageList.map((path) => uploadFile(path).then((data) => (data && (data.url || data.uri)) ? (data.url || data.uri) : ''))
            )
                .then((urls) => {
                    doSubmit(urls.filter(Boolean))
                })
                .catch(() => {
                    uni.hideLoading()
                    uni.showToast({ title: '图片上传失败，请重试', icon: 'none' })
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.publish-page {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
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
    font-size: 34rpx;
    font-weight: bold;
}

.navbar-right {
    width: 60rpx;
}

.content-scroll {
    flex: 1;
}

.tip-banner {
    padding: 30rpx;
    background: linear-gradient(90deg, #C7F0B5 0%, #E0F8D5 100%);
}

.tip-banner.rent {
    background: linear-gradient(90deg, #C9F2FF 0%, #E0F7FF 100%);
}

.tip-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 12rpx;
}

.tip-sub {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    font-size: 22rpx;
    color: #666666;
}

.form-section {
    margin-top: 20rpx;
    background-color: #FFFFFF;
    padding: 0 30rpx 20rpx;
}

.form-item {
    padding-top: 24rpx;
}

.form-item.required .form-label::before {
    content: '*';
    color: #FF5722;
    margin-right: 6rpx;
}

.form-label {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 16rpx;
}

.form-input {
    width: 100%;
    height: 72rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    font-size: 28rpx;
}

.form-input.small {
    flex: 1;
    margin-right: 16rpx;
}

.form-input.small:last-child {
    margin-right: 0;
}

.form-value {
    flex-direction: row;
    align-items: center;
    display: flex;
}

.value-text {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
}

.value-text.placeholder {
    color: #CCCCCC;
}

.suffix-text {
    font-size: 26rpx;
    color: #666666;
    margin-left: 10rpx;
}

.flex-row {
    display: flex;
    align-items: center;
}

.price-negotiable {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #666;
}

.checkbox {
    width: 32rpx;
    height: 32rpx;
    border: 2rpx solid #DDD;
    border-radius: 6rpx;
    margin-right: 8rpx;
}

.checkbox.checked {
    background-color: #4CAF50;
    border-color: #4CAF50;
}

.tag-section {
    width: 100%;
}

.tag-input-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.tag-input {
    flex: 1;
    margin-right: 16rpx;
}

.add-tag-btn {
    padding: 0 24rpx;
    height: 64rpx;
    line-height: 64rpx;
    font-size: 26rpx;
    color: #4CAF50;
    background: #E8F5E9;
    border-radius: 8rpx;
    border: none;
}

.add-tag-btn::after {
    border: none;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.tag-item {
    display: flex;
    align-items: center;
    padding: 8rpx 16rpx;
    background: #F5F5F5;
    border-radius: 8rpx;
    font-size: 26rpx;
}

.tag-delete {
    margin-left: 8rpx;
    padding: 4rpx;
}

.video-upload {
    padding-top: 16rpx;
}

.video-preview {
    width: 300rpx;
    height: 200rpx;
    border-radius: 8rpx;
    overflow: hidden;
    position: relative;
    background: #000;
}

.video-elem {
    width: 100%;
    height: 100%;
}

.textarea-item {
    padding-bottom: 20rpx;
}

.form-textarea {
    width: 100%;
    min-height: 180rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    box-sizing: border-box;
}

.char-count {
    text-align: right;
    font-size: 24rpx;
    color: #999999;
    margin-top: 8rpx;
}

.form-subtitle {
    padding-top: 24rpx;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 16rpx;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.image-item {
    width: 200rpx;
    height: 200rpx;
    border-radius: 8rpx;
    overflow: hidden;
    position: relative;
    background-color: #F5F5F5;
}

.image {
    width: 100%;
    height: 100%;
}

.image-item.upload {
    border: 2rpx dashed #DDDDDD;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.upload-text {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #999999;
}

.delete-icon {
    position: absolute;
    top: 6rpx;
    right: 6rpx;
    width: 36rpx;
    height: 36rpx;
    border-radius: 18rpx;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.submit-wrapper {
    padding: 30rpx;
}

.submit-btn {
    width: 100%;
    height: 88rpx;
    border-radius: 44rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
}

.submit-btn::after {
    border: none;
}
</style>

