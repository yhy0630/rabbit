<template>
    <view class="change-password">
        <custom-navbar title="修改密码"></custom-navbar>

        <view class="content">
            <view class="section-title">修改登录密码</view>

            <view class="form-card bg-white">
                <view class="row bdb-line">
                    <view class="label">新密码</view>
                    <input
                        class="input"
                        type="password"
                        v-model="password"
                        placeholder="请输入新密码"
                        placeholder-class="placeholder"
                    />
                </view>
                <view class="row">
                    <view class="label">确认密码</view>
                    <input
                        class="input"
                        type="password"
                        v-model="confirmPassword"
                        placeholder="请确认新密码"
                        placeholder-class="placeholder"
                    />
                </view>
            </view>

            <view class="rule muted">
                密码建议组合规则：长度为8-16个字符，支持数字大小写字母和标点符号
            </view>
        </view>

        <view class="bottom">
            <button class="submit-btn" @tap="submit" :disabled="loading">确定</button>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'changePassword',
    components: {
        CustomNavbar
    },
    data() {
        return {
            password: '',
            confirmPassword: '',
            loading: false
        }
    },
    methods: {
        submit() {
            if (this.loading) return
            if (!this.password) return this.$toast({ title: '请输入新密码' })
            if (!this.confirmPassword) return this.$toast({ title: '请确认新密码' })
            if (this.password !== this.confirmPassword) return this.$toast({ title: '两次密码输入不一致' })

            // 暂不接接口：先做页面交互（不影响其它功能）
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.$toast({ title: '设置成功' })
                uni.navigateBack({ delta: 1 })
            }, 300)
        }
    }
}
</script>

<style lang="scss">
.change-password {
    padding-top: 88px;
    min-height: calc(100vh - env(safe-area-inset-bottom));
    background: #f8f8f8;
    display: flex;
    flex-direction: column;

    .content {
        padding: 24rpx;
        flex: 1;
    }

    .section-title {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin: 6rpx 0 18rpx;
    }

    .form-card {
        border-radius: 20rpx;
        overflow: hidden;
    }

    .row {
        height: 104rpx;
        display: flex;
        align-items: center;
        padding: 0 24rpx;
    }

    .bdb-line {
        border-bottom: 1rpx solid #eeeeee;
    }

    .label {
        width: 160rpx;
        color: #333;
        font-size: 28rpx;
    }

    .input {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
        color: #333;
        text-align: right;
    }

    .placeholder {
        color: #bdbdbd;
    }

    .rule {
        margin-top: 18rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        padding-left: 32rpx;
        position: relative;
    }

    .rule::before {
        content: '';
        width: 16rpx;
        height: 16rpx;
        background: #ff4d4f;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 10rpx;
    }

    .bottom {
        padding: 0 24rpx 30rpx;
        background: transparent;
    }

    .submit-btn {
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
}
</style>


