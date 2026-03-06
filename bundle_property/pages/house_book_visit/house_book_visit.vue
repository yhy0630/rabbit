<template>
    <view class="book-page">
        <custom-navbar title="预约看房"></custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <view class="section">
                <view class="section-title">填写预约信息</view>
                <view class="form-item">
                    <text class="label">联系人 <text class="required">*</text></text>
                    <input
                        class="input"
                        v-model="form.name"
                        placeholder="请填写联系人姓名"
                        placeholder-style="color:#CCCCCC;"
                    />
                </view>
                <view class="form-item">
                    <text class="label">联系电话 <text class="required">*</text></text>
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
                <view class="form-item" @click="showBookingPicker = true">
                    <text class="label">预约看房时间 <text class="required">*</text></text>
                    <view class="picker-value">
                        <text :class="{ placeholder: !form.bookingTimeText }">
                            {{ form.bookingTimeText || '请选择预约看房时间' }}
                        </text>
                        <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
                    </view>
                </view>
            </view>

            <u-picker
                v-model="showBookingPicker"
                mode="time"
                :params="{ year: true, month: true, day: true, hour: true, minute: true, second: false, timestamp: true }"
                :default-time="defaultBookingTime"
                @confirm="onBookingTimeConfirm"
            ></u-picker>

            <view class="submit-wrapper">
                <button class="submit-btn" @click="submit">提交预约</button>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { submitPropertyViewingBooking } from '@/api/store'

export default {
    name: 'HouseBookVisit',
    components: { CustomNavbar },
    data() {
        return {
            listingId: 0,
            categoryId: 0,
            publisherUserId: 0,
            form: {
                name: '',
                phone: '',
                bookingTime: 0,
                bookingTimeText: ''
            },
            showBookingPicker: false
        }
    },
    computed: {
        defaultBookingTime() {
            const d = new Date()
            d.setHours(d.getHours() + 1, 0, 0, 0)
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':00'
        }
    },
    onLoad(opt) {
        this.listingId = parseInt(opt.listing_id || opt.listingId || 0, 10)
        this.categoryId = parseInt(opt.category_id || opt.categoryId || 0, 10)
        this.publisherUserId = parseInt(opt.publisher_user_id || opt.publisherUserId || 0, 10)
    },
    methods: {
        submit() {
            if (!this.form.name || !this.form.phone) {
                uni.showToast({ title: '请填写联系人和联系电话', icon: 'none' })
                return
            }
            if (this.listingId <= 0) {
                uni.showToast({ title: '房源信息无效', icon: 'none' })
                return
            }
            if (!this.form.bookingTime) {
                uni.showToast({ title: '请选择预约看房时间', icon: 'none' })
                return
            }
            uni.showLoading({ title: '提交中...' })
            const post = {
                contact_name: this.form.name,
                contact_phone: this.form.phone,
                booking_time: this.form.bookingTime,
                listing_id: this.listingId,
                category_id: this.categoryId,
                publisher_user_id: this.publisherUserId
            }
            submitPropertyViewingBooking(post).then(res => {
                uni.hideLoading()
                if (res && res.code === 1) {
                    uni.showToast({ title: '预约成功', icon: 'success' })
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
        },
        onBookingTimeConfirm(e) {
            if (e && e.timestamp) {
                this.form.bookingTime = Math.floor(e.timestamp)
                const d = new Date(e.timestamp * 1000)
                const y = e.year || d.getFullYear()
                const m = (e.month !== undefined ? e.month : d.getMonth() + 1)
                const day = (e.day !== undefined ? e.day : d.getDate())
                const h = (e.hour !== undefined ? e.hour : d.getHours())
                const min = (e.minute !== undefined ? e.minute : d.getMinutes())
                this.form.bookingTimeText = y + '-' + String(m).padStart(2, '0') + '-' + String(day).padStart(2, '0') + ' ' + String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.book-page {
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

.form-item {
    margin-bottom: 24rpx;
}

.label { display: block; font-size: 26rpx; color: #333333; margin-bottom: 12rpx; }

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
