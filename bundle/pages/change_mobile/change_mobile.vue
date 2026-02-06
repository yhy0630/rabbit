<template>
    <view class="change-mobile">
        <custom-navbar title="修改手机号"></custom-navbar>

        <view class="content bg-white">

            <view class="field-row bdb-line">
                <input
                    class="field-input"
                    type="number"
                    v-model="new_mobile"
                    placeholder="填写要跟换的手机号"
                    placeholder-class="placeholder"
                />
                <view class="code-action" @tap="sendSmsFun">
                    <u-verification-code
                        :keep-running="true"
                        unique-key="change_mobile"
                        ref="uCode"
                        @change="codeChange"
                    ></u-verification-code>
                    <text class="code-text">{{ codeTips }}</text>
                </view>
            </view>

            <view class="field-row bdb-line">
                <input
                    class="field-input"
                    type="number"
                    v-model="mobileCode"
                    placeholder="验证码"
                    placeholder-class="placeholder"
                />
            </view>

            <button class="submit-btn" @tap="changeMobileSubmit" :disabled="loading">
                确认修改
            </button>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getUserInfo, changeUserMobile } from '@/api/user'
import { sendSms } from '@/api/app'
import { SMSType } from '@/utils/type'

export default {
    name: 'changeMobile',
    components: {
        CustomNavbar
    },
    data() {
        return {
            userInfo: {},
            new_mobile: '',
            mobileCode: '',
            codeTips: '获取验证码',
            smsType: '',
            loading: false
        }
    },
    onLoad() {
        this.getUserInfoFun()
    },
    methods: {
        codeChange(text) {
            this.codeTips = text
        },
        getUserInfoFun() {
            getUserInfo().then((res) => {
                if (res.code == 1) {
                    this.userInfo = res.data
                    this.smsType = this.userInfo.mobile ? SMSType.CHANGE_MOBILE : SMSType.BIND
                }
            })
        },
        sendSmsFun() {
            if (!this.new_mobile) {
                this.$toast({ title: '请输入手机号' })
                return
            }
            if (!this.$refs.uCode || !this.$refs.uCode.canGetCode) return
            sendSms({
                mobile: this.new_mobile,
                key: this.smsType
            }).then((res) => {
                if (res.code == 1) {
                    this.$toast({ title: res.msg })
                    this.$refs.uCode.start()
                }
            })
        },
        changeMobileSubmit() {
            if (this.loading) return
            if (!this.new_mobile) {
                this.$toast({ title: '请输入手机号' })
                return
            }
            // 暂时不校验验证码正确性：直接回传新手机号并返回上一页更新显示
            this.loading = true
            // 兜底：写入缓存，避免部分端返回时收不到事件或不触发渲染
            uni.setStorageSync('pending_user_mobile', this.new_mobile)
            uni.$emit('user_mobile_changed', {
                mobile: this.new_mobile
            })
            setTimeout(() => {
                this.loading = false
                uni.navigateBack({ delta: 1 })
            }, 200)

            // 如需真正修改服务端手机号，可在后续接回接口校验：
            // changeUserMobile({
            //     mobile: this.userInfo.mobile,
            //     new_mobile: this.new_mobile,
            //     code: this.mobileCode,
            //     action: this.userInfo.mobile ? 'change' : 'binding'
            // })
        }
    }
}
</script>

<style lang="scss">
.change-mobile {
    padding-top: 88px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
    min-height: calc(100vh - env(safe-area-inset-bottom));
    background: #f8f8f8;

    .content {
        margin: 20rpx;
        border-radius: 24rpx;
        overflow: hidden;
        padding: 30rpx 24rpx 40rpx;
    }

    .tip {
        padding: 10rpx 0 18rpx;
        font-size: 26rpx;
    }

    .field-row {
        height: 100rpx;
        display: flex;
        align-items: center;
    }

    .bdb-line {
        border-bottom: 1rpx solid #eeeeee;
    }

    .field-input {
        flex: 1;
        height: 100%;
        font-size: 30rpx;
        color: #333;
    }

    .placeholder {
        color: #c0c0c0;
        font-size: 28rpx;
    }

    .code-action {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 180rpx;
        color: #189B07;
    }

    .code-text {
        color: #189B07;
        font-size: 28rpx;
        font-weight: 500;
    }

    .submit-btn {
        margin-top: 60rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 44rpx;
        color: #fff;
        font-size: 32rpx;
        background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
    }

    .submit-btn[disabled] {
        opacity: 0.6;
    }
}
</style>


