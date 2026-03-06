<template>
    <view class="commercial-publish">
        <view v-if="publishTypeOptions.length" class="form-section tip-banner">
            <view class="tab-row">
                <view
                    v-for="item in publishTypeOptions"
                    :key="item.value"
                    class="tab-item"
                    :class="{ active: form.publishType === item.value }"
                    @click="form.publishType = item.value"
                >
                    {{ item.label }}
                </view>
            </view>
        </view>

        <view class="form-section">
            <view class="form-item required">
                <view class="form-label">{{ titleLabel }}</view>
                <input
                    class="form-input"
                    v-model="form.title"
                    :placeholder="'请填写' + titleLabel"
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
            <view class="form-item required" @click="chooseMapLocation">
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

            <view v-if="extraChipLabel && extraChipOptions.length" class="form-item">
                <view class="form-label">{{ extraChipLabel }}</view>
                <view class="chip-row">
                    <view
                        v-for="item in extraChipOptions"
                        :key="item"
                        class="chip"
                        :class="{ active: form.extraChipValue === item }"
                        @click="form.extraChipValue = item"
                    >
                        {{ item }}
                    </view>
                </view>
            </view>

            <view v-if="showFloor" class="form-item required">
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

            <view v-if="showArea" class="form-item" :class="{ required: areaRequired }">
                <view class="form-label">面积</view>
                <view class="form-value">
                    <input
                        class="form-input"
                        type="digit"
                        v-model="form.area"
                        placeholder="请填写面积"
                        placeholder-style="color:#CCCCCC;"
                    />
                    <text class="suffix-text">㎡</text>
                </view>
            </view>

            <view class="form-item required">
                <view class="form-label">{{ isRent ? '租金' : '售价' }}</view>
                <view class="form-value price-row">
                    <input
                        class="form-input"
                        type="digit"
                        v-model="form.price"
                        :placeholder="isRent ? '请填写租金' : '请填写售价'"
                        placeholder-style="color:#CCCCCC;"
                        :disabled="form.priceNegotiable"
                    />
                    <text class="suffix-text">{{ isRent ? '元/月' : '万元' }}</text>
                    <view v-if="isRent" class="opt-check" @click="form.priceNegotiable = !form.priceNegotiable">
                        <view class="checkbox" :class="{ checked: form.priceNegotiable }"></view>
                        <text>租金面议</text>
                    </view>
                </view>
            </view>

            <view class="form-item">
                <view class="form-label">物业费</view>
                <view class="form-value price-row">
                    <input
                        class="form-input"
                        type="digit"
                        v-model="form.propertyFee"
                        placeholder="选填，元/㎡·月或元/月"
                        placeholder-style="color:#CCCCCC;"
                    />
                    <view class="opt-check" @click="form.propertyFeeIncluded = !form.propertyFeeIncluded">
                        <view class="checkbox" :class="{ checked: form.propertyFeeIncluded }"></view>
                        <text>是否包含物业费</text>
                    </view>
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
                <view class="form-label">{{ descriptionLabel }}</view>
                <textarea
                    class="form-textarea"
                    v-model="form.description"
                    :placeholder="descriptionPlaceholder"
                    maxlength="500"
                    placeholder-style="color:#CCCCCC;"
                ></textarea>
                <view class="char-count">{{ form.description.length }}/500</view>
            </view>
        </view>

        <view class="form-section">
            <view class="form-subtitle">{{ imageSubtitle }}</view>
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
            <button class="submit-btn" @click="submit">立即发布</button>
        </view>

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
import { uploadFile } from '@/utils/tools'

export default {
    name: 'PropertyPublishCommercial',
    props: {
        pageTitle: { type: String, default: '发布' },
        titleLabel: { type: String, default: '标题' },
        descriptionLabel: { type: String, default: '房源描述' },
        descriptionPlaceholder: { type: String, default: '请简单介绍' },
        imageSubtitle: { type: String, default: '房源图片（最多15张，每张小于2M）' },
        categoryCode: { type: String, required: true },
        showFloor: { type: Boolean, default: true },
        showArea: { type: Boolean, default: true },
        areaRequired: { type: Boolean, default: true },
        publishTypeOptions: {
            type: Array,
            default: () => [
                { label: '出租', value: 'rent' },
                { label: '出售', value: 'sell' }
            ]
        },
        extraChipLabel: { type: String, default: '' },
        extraChipOptions: { type: Array, default: () => [] }
    },
    data() {
        return {
            showRegionPicker: false,
            regionParams: { province: true, city: true, area: true },
            imageList: [],
            tagList: [],
            tagInput: '',
            categoryId: 0,
            form: {
                publishType: 'rent',
                title: '',
                regionText: '',
                provinceId: '',
                cityId: '',
                districtId: '',
                addressDetail: '',
                mapAddress: '',
                longitude: '',
                latitude: '',
                floor: '',
                totalFloor: '',
                area: '',
                price: '',
                priceNegotiable: false,
                propertyFee: '',
                propertyFeeIncluded: false,
                description: '',
                phone: '',
                extraChipValue: ''
            }
        }
    },
    computed: {
        isRent() {
            return this.form.publishType === 'rent'
        }
    },
    created() {
        getPropertyCategoryList().then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                const code = (this.categoryCode || '').toLowerCase()
                const cat = res.data.find((c) => (c.code || '').toLowerCase() === code)
                this.categoryId = cat ? (cat.id || 0) : 0
            }
        })
    },
    methods: {
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
        chooseMapLocation() {
            const keyword = [this.form.regionText, this.form.addressDetail].filter(Boolean).join(' ')
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
            if (!this.form.title) return '请填写' + this.titleLabel
            if (!this.form.regionText) return '请选择省/市/县'
            if (!this.form.addressDetail) return '请输入详细地址'
            if (!this.form.longitude || !this.form.latitude) return '请填写经度和纬度'
            if (this.showFloor && (!this.form.floor || !this.form.totalFloor)) return '请完善楼层信息'
            if (this.showArea && this.areaRequired && !this.form.area) return '请填写面积'
            if (!this.form.priceNegotiable && !this.form.price) return '请填写' + (this.isRent ? '租金' : '售价')
            if (!this.form.phone) return '请输入联系电话'
            if (this.imageList.length === 0) return '请至少上传一张图片'
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
                    community: '',
                    longitude: this.form.longitude,
                    latitude: this.form.latitude,
                    floor: this.form.floor || 0,
                    total_floor: this.form.totalFloor || 0,
                    area: this.form.area || 0,
                    price: this.form.price || 0,
                    price_negotiable: this.form.priceNegotiable,
                    description: this.form.description,
                    phone: this.form.phone,
                    tags: this.tagList,
                    images: Array.isArray(imageUrls) ? imageUrls : (imageUrls ? String(imageUrls).split(',').filter(Boolean) : []),
                    category_id: this.categoryId || 0,
                    publish_type: this.form.publishType,
                    selling_points: this.tagList.length ? this.tagList.join(',') : ''
                }
                if (this.form.extraChipValue) payload.extra_type = this.form.extraChipValue
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
                .then((urls) => doSubmit(urls.filter(Boolean)))
                .catch(() => {
                    uni.hideLoading()
                    uni.showToast({ title: '图片上传失败，请重试', icon: 'none' })
                })
        },
        getForm() {
            return { ...this.form, tagList: [...this.tagList], imageList: [...this.imageList] }
        }
    }
}
</script>

<style lang="scss" scoped>
.commercial-publish {
    width: 100%;
}
.form-section {
    margin-top: 20rpx;
    background-color: #FFFFFF;
    padding: 0 30rpx 20rpx;
}
.form-item { padding-top: 24rpx; }
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
.form-input.small { flex: 1; margin-right: 16rpx; }
.form-input.small:last-child { margin-right: 0; }
.form-value {
    display: flex;
    align-items: center;
    flex-direction: row;
}
.value-text { flex: 1; font-size: 28rpx; color: #333333; }
.value-text.placeholder { color: #CCCCCC; }
.suffix-text { font-size: 26rpx; color: #666666; margin-left: 10rpx; }
.price-row { flex-wrap: wrap; align-items: center; }
.opt-check {
    display: flex;
    align-items: center;
    margin-left: 20rpx;
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
.flex-row { display: flex; align-items: center; }
.chip-row { display: flex; flex-wrap: wrap; gap: 16rpx; }
.chip {
    padding: 10rpx 20rpx;
    border-radius: 30rpx;
    background-color: #F5F5F5;
    font-size: 24rpx;
    color: #666666;
}
.chip.active { background-color: #E8F5E9; color: #4CAF50; }
.tag-section { width: 100%; }
.tag-input-row { display: flex; align-items: center; margin-bottom: 16rpx; }
.tag-input { flex: 1; margin-right: 16rpx; }
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
.add-tag-btn::after { border: none; }
.tag-list { display: flex; flex-wrap: wrap; gap: 16rpx; }
.tag-item {
    display: flex;
    align-items: center;
    padding: 8rpx 16rpx;
    background: #F5F5F5;
    border-radius: 8rpx;
    font-size: 26rpx;
}
.tag-delete { margin-left: 8rpx; padding: 4rpx; }
.textarea-item { padding-bottom: 20rpx; }
.form-textarea {
    width: 100%;
    min-height: 180rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    box-sizing: border-box;
}
.char-count { text-align: right; font-size: 24rpx; color: #999999; margin-top: 8rpx; }
.form-subtitle {
    padding-top: 24rpx;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 16rpx;
}
.image-list { display: flex; flex-wrap: wrap; gap: 20rpx; }
.image-item {
    width: 200rpx;
    height: 200rpx;
    border-radius: 8rpx;
    overflow: hidden;
    position: relative;
    background-color: #F5F5F5;
}
.image { width: 100%; height: 100%; }
.image-item.upload {
    border: 2rpx dashed #DDDDDD;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.tip-banner { padding: 20rpx 30rpx; }
.tab-row {
    display: flex;
    border-radius: 40rpx;
    background-color: #F5F5F5;
    overflow: hidden;
}
.tab-item {
    flex: 1;
    text-align: center;
    padding: 18rpx 0;
    font-size: 28rpx;
    color: #666666;
}
.tab-item.active {
    background-color: #4CAF50;
    color: #FFFFFF;
    font-weight: 500;
}
.upload-text { margin-top: 8rpx; font-size: 24rpx; color: #999999; }
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
.submit-wrapper { padding: 30rpx; }
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
.submit-btn::after { border: none; }
</style>
