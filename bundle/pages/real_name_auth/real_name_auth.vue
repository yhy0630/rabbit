<template>
    <view class="real-name-auth">
        <custom-navbar title="实名认证"></custom-navbar>

        <view class="content">
            <view class="title">实名认证</view>
            <view class="desc muted">
                根据法规及政策要求，交易需要实名认证，方可进行交易。我们需要验证您的身份，信息仅作用于认证您的身份，我们将对您填写的信息进行严格保密。
            </view>

            <view class="form-card bg-white">
                <view class="field-row">
                    <input
                        class="field-input"
                        type="text"
                        v-model="realName"
                        placeholder="请输入姓名"
                        placeholder-class="placeholder"
                    />
                </view>
                <view class="field-row">
                    <input
                        class="field-input"
                        type="idcard"
                        v-model="idCard"
                        placeholder="请输入身份证号"
                        placeholder-class="placeholder"
                    />
                </view>
                <view class="field-row">
                    <input
                        class="field-input"
                        type="number"
                        v-model="mobile"
                        placeholder="请输入手机号"
                        placeholder-class="placeholder"
                    />
                </view>
            </view>

            <button class="submit-btn" @tap="submit" :disabled="loading">认证</button>

            <view class="hint-card ">
                <view class="hint-title">温馨提示</view>
                <view class="hint-item">
                    1.身份证信息认证通过后不能修改，且每天有认证次数限制，请核对无误后再提交；
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'realNameAuth',
    components: {
        CustomNavbar
    },
    data() {
        return {
            realName: '',
            idCard: '',
            mobile: '',
            loading: false
        }
    },
    methods: {
        submit() {
            if (this.loading) return
            // 暂时只做前端交互（不影响其它功能），后续接入接口再完善
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.$toast({ title: '提交成功' })
            }, 300)
        }
    }
}
</script>

<style lang="scss">
.real-name-auth {
    padding-top: 88px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
    min-height: calc(100vh - env(safe-area-inset-bottom));
    background: #fff;

    .content {
        padding: 24rpx;
    }

    .title {
        font-size: 44rpx;
        font-weight: 600;
        color: #333;
        margin: 10rpx 0 16rpx;
    }
 
    .desc {
        font-size: 26rpx;
        line-height: 40rpx;
        margin-bottom: 22rpx;
    }

    .form-card {
        border-radius: 20rpx;
        padding: 14rpx 24rpx;
    }

    .field-row {
        height: 96rpx;
        display: flex;
        align-items: center;
        background: #f7f7f7;
        border-radius: 16rpx;
        padding: 0 20rpx;
        margin-top: 40rpx;
    }

    .field-input {
        flex: 1;
        height: 100%;
        font-size: 30rpx;
        color: #333;
    }

    .placeholder {
        color: #c7c7c7;
        font-size: 28rpx;
    }

    .submit-btn {
        margin-top: 34rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 44rpx;
        color: #fff;
        font-size: 32rpx;
        background: linear-gradient(91.58deg, #49ab02 15.84%, #e4e872 83.36%, #effd6b 96.79%);
    }

    .submit-btn[disabled] {
        opacity: 0.6;
    }

    .hint-card {
        margin-top: 26rpx;
        border-radius: 20rpx;
        padding: 30rpx 24rpx;
        background: #f7f7f7;


    }

    .hint-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 10rpx;
    }

    .hint-item {
        font-size: 24rpx;
        color: #666;
        line-height: 36rpx;
    }
}
</style>


