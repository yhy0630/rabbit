<template>
    <view :style="'background-image: url(' + $getImageUri('/images/login_bg.png') + ')'">
        <!-- #ifndef  H5 -->

        <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
            <u-navbar
                :is-back="true"
                title="注册账号"
                :title-bold="true"
                :is-fixed="false"
                :border-bottom="false"
                :background="{ background: 'rgba(256,256, 256,0)' }"
            ></u-navbar>
        </u-sticky>
        <!-- #endif -->
        <view class="register">
            <view class="m-t-30 m-b-50 text">注册新账号</view>

            <view class="input-container">
                <view class="input-item flex">
                    <u-input
                        v-model="mobile"
                        class="input"
                        placeholder="输入手机号码"
                        style="width: 100%"
                    />
                </view>
                <view class="input-item flex" v-if="appConfig.register_setting">
                    <u-input v-model="smsCode" style="width: 100%" placeholder="输入验证码" />
                    <button
                        class="bd-primary xs primary br60 flex row-center"
                        :class="{ disable: mobile.length != 11 }"
                        hover-class="none"
                        @click="sendSmsFun"
                    >
                        <!-- 获取验证码 -->
                        <u-verification-code unique-key="register" ref="uCode" @change="codeChange">
                        </u-verification-code>
                        <view class="xs">{{ codeTips }}</view>
                    </button>
                </view>
                <view class="input-item flex">
                    <u-input
                        type="password"
                        v-model="password"
                        placeholder="输入密码"
                        style="width: 100%"
                    />
                </view>
                <view class="input-item flex">
                    <u-input
                        type="password"
                        style="width: 100%"
                        v-model="passwordConfirm"
                        placeholder="请再次输入密码"
                    />
                </view>
            </view>
            <view class="m-t-40 sm flex row-center">
                <u-checkbox v-model="isAgreement" shape="circle">
                    <div class="flex">
                        已阅读并同意
                        <router-link to="/bundle/pages/server_explan/server_explan?type=0">
                            <view class="primary">《服务协议》</view>
                        </router-link>
                        和
                        <router-link to="/bundle/pages/server_explan/server_explan?type=1">
                            <view class="primary">《隐私协议》</view>
                        </router-link>
                    </div>
                </u-checkbox>
            </view>
            <view
                class="btn white bg-primary br60 flex row-center"
                :class="{ disable: disable }"
                @click="registerFun"
            >
                注册
            </view>
            <!-- 阅读协议弹框 -->
            <u-modal
                :value="showModel"
                show-cancel-button
                :show-title="false"
                @confirm=";(isAgreement = true), (showModel = false)"
                @cancel="showModel = false"
                confirm-color="#FF2C3C"
            >
                <view class="comfirm-box">
                    <view> 请先阅读并同意 </view>
                    <view class="flex row-center">
                        <router-link
                            data-theme=""
                            to="/bundle/pages/server_explan/server_explan?type=0"
                        >
                            <view class="agreement">《服务协议》</view>
                        </router-link>
                        和
                        <router-link to="/bundle/pages/server_explan/server_explan?type=1">
                            <view class="agreement">《隐私协议》</view>
                        </router-link>
                    </view>
                </view>
            </u-modal>
        </view>
    </view>
</template>

<script>
import { register, sendSms } from '@/api/app.js'
import { ACCESS_TOKEN } from '@/config/app.js'
import { SMSType } from '@/utils/type.js'
import { mapMutations, mapGetters } from 'vuex'

export default {
    name: 'register',
    created() {},
    data() {
        return {
            isAgreement: false,
            mobile: '',
            smsCode: '',
            password: '',
            passwordConfirm: '',
            canSendSms: true,
            codeTips: '',
            showModel: false
        }
    },
    onLoad() {
        // console.log(this.appConfig)
    },
    methods: {
        ...mapMutations(['login']),
        codeChange(tip) {
            this.codeTips = tip
        },
        registerFun() {
            let { isAgreement, mobile, password, smsCode, passwordConfirm } = this

            if (mobile.length != 11) {
                this.$toast({ title: '请填写正确手机号' })
                return
            }
            if (!password) {
                this.$toast({ title: '请设置密码' })
                return
            }
            if (password != passwordConfirm) {
                this.$toast({ title: '两次密码输入不一致' })
                return
            }
            if (!isAgreement)
                // return this.$toast({
                //   title: '请先勾选"已阅读并同意《服务协议》和《隐私协议》"',
                // });
                return (this.showModel = true)
            let data = {
                mobile: mobile,
                password: password,
                code: smsCode,
                client: 2
            }
            register(data).then((res) => {
                if (res.code == 1) {
                    this.login(data)
                    this.$toast({ title: res.msg })
                    //  跳转到登录页
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 1000)
                }
            })
        },

        countDownFinish() {
            this.canSendSms = true
        },

        sendSmsFun() {
            if (!this.$refs.uCode.canGetCode) return
            if (!this.mobile) {
                this.$toast({ title: '请填写手机号信息～' })
                return
            }
            sendSms({ mobile: this.mobile, key: SMSType.REGISTER }).then((res) => {
                if (res.code == 1) {
                    this.$toast({ title: res.msg })
                    this.$refs.uCode.start()
                }
            })
        }
    },
    computed: {
        ...mapGetters(['appConfig']),
        $getImageUri() {
            return (url) => this.$store.state.app.config.base_domain + url
        },
        disable() {
            if (
                this.mobile.length == 11 &&
                this.password &&
                this.passwordConfirm &&
                this.smsCode &&
                this.appConfig.register_setting
            ) {
                return false
            } else if (
                this.mobile.length == 11 &&
                this.password &&
                this.passwordConfirm &&
                !this.appConfig.register_setting
            ) {
                return false
            } else {
                return true
            }
        }
    }
}
</script>

<style lang="scss">
page {
    background-color: white;
    // background-image: url(../../static/images/login_bg.png);
}
.register {
    padding: 80rpx 40rpx 0;
    .input-container {
        .input-item {
            height: 100%;
            padding: 0 20rpx;
            height: 88rpx;
            margin-bottom: 30rpx;
            border: 1px solid #d7d7d7;
            border-radius: 10rpx;

            .input-label {
                width: 180rpx;
                flex: none;
            }
            .bd-primary {
                height: 56rpx;
                width: 176rpx;
                flex: none;
                border: 1px solid $-color-primary;
                .seconds {
                    color: $-color-primary;
                }
            }
        }
    }
    .btn {
        width: 100%;
        height: 100rpx;
        background-color: $-color-primary;
        margin: 50rpx auto 0rpx;
        border-radius: 10rpx;
    }
    .text {
        font-weight: 500;
        font-size: 28px;
        text-align: left;
    }
    .comfirm-box {
        text-align: center;
        padding: 60rpx 0 70rpx 0;
    }
    .agreement {
        color: $-color-primary;
    }
    .disable {
        opacity: 0.5;
    }
}
</style>
