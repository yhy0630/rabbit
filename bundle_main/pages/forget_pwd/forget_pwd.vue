<template>
    <view :style="'background-image: url(' + $getImageUri('/images/login_bg.png') + ')'">
        <!-- #ifndef  H5 -->

        <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
            <u-navbar
                :is-back="true"
                title="忘记密码"
                :title-bold="true"
                :is-fixed="false"
                :border-bottom="false"
                :background="{ background: 'rgba(256,256, 256,0)' }"
            ></u-navbar>
        </u-sticky>
        <!-- #endif -->
        <view class="forget-pwd">
            <view class="m-t-30 m-b-50 text">忘记登录密码</view>
            <view class="input-container">
                <view class="input-item flex">
                    <u-input v-model="mobile" class="input" placeholder="输入手机号码" />
                </view>
                <view class="input-item flex">
                    <u-input v-model="smsCode" style="width: 100%" placeholder="输入验证码" />
                    <button
                        class="bd-primary xs primary br60 flex row-center"
                        :class="{ disable: mobile.length != 11 }"
                        @click="sendSmsFun"
                    >
                        <!-- 获取验证码 -->
                        <u-verification-code
                            unique-key="forget-pwd"
                            ref="uCode"
                            @change="codeChange"
                        >
                        </u-verification-code>
                        <view class="xs">{{ codeTips }}</view>
                    </button>
                </view>
                <view class="input-item flex">
                    <u-input
                        type="password"
                        v-model="resetPwd"
                        placeholder="输入新密码"
                        style="width: 100%"
                    />
                </view>
                <!-- <view class="input-item flex">
        <u-input
          type="password"
          v-model="comfirmPwd"
          placeholder="请再次输入密码"
        />
      </view> -->
            </view>
            <view
                class="btn white flex row-center"
                @click="forgetPwdFun"
                :class="{ disable: disable }"
            >
                立即重置密码
            </view>
        </view>
    </view>
</template>

<script>
import { forgetPwd, sendSms } from '@/api/app.js'
import { ACCESS_TOKEN } from '@/config/app.js'
import { SMSType } from '@/utils/type.js'
import { mapMutations } from 'vuex'
export default {
    name: 'forgetPwd',
    data() {
        return {
            mobile: '',
            smsCode: '',
            resetPwd: '',
            comfirmPwd: '',
            time: 59,
            codeTips: ''
        }
    },
    onLoad() {},
    computed: {
        disable() {
            if (this.mobile.length == 11 && this.smsCode && this.resetPwd) {
                return false
            } else {
                return true
            }
        },
        $getImageUri() {
            return (url) => this.$store.state.app.config.base_domain + url
        }
    },
    methods: {
        ...mapMutations(['login']),
        codeChange(tip) {
            this.codeTips = tip
        },
        forgetPwdFun() {
            let { mobile, smsCode, resetPwd } = this
            if (!mobile) {
                this.$toast({
                    title: '请填写手机号'
                })
                return
            }
            if (!smsCode) {
                this.$toast({
                    title: '请填写短信验证码'
                })
                return
            }
            if (!resetPwd) {
                this.$toast({
                    title: '请填写重置密码'
                })
                return
            }
            // if (!comfirmPwd) {
            //   this.$toast({
            //     title: "请填写确认密码",
            //   });
            //   return;
            // }
            //   if (resetPwd != comfirmPwd) {
            //     this.$toast({
            //       title: "两次密码输入不一致",
            //     });
            //     return;
            //   }
            let data = {
                mobile: mobile,
                code: smsCode,
                password: resetPwd
                // repassword: comfirmPwd,
            }
            forgetPwd(data).then((res) => {
                if (res.code == 1) {
                    this.login(data)
                    this.$toast({
                        title: res.msg
                    })
                    //  跳转到登录页
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 1000)
                }
            })
        },
        sendSmsFun() {
            if (!this.$refs.uCode.canGetCode) return
            if (!this.mobile) {
                this.$toast({
                    title: '请填写手机号信息'
                })
                return
            }
            sendSms({
                mobile: this.mobile,
                key: SMSType.FINDPWD
            }).then((res) => {
                if (res.code == 1) {
                    this.$toast({ title: res.msg })
                    this.$refs.uCode.start()
                }
            })
        }
    }
}
</script>

<style lang="scss">
page {
    padding: 0;
    background-color: white;
    // background-image: url(../../static/images/login_bg.png);
}
.forget-pwd {
    min-height: 100vh;
    padding: 40px 20px 0;
    padding: 80rpx 40rpx 0;

    .input-container {
        .input-item {
            padding: 0 20rpx;
            height: 100rpx;
            margin-bottom: 30rpx;
            border: 1px solid #d7d7d7;
            border-radius: 14rpx;

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
        margin: 100rpx auto 0rpx;
        border-radius: 14rpx;
    }
    .text {
        font-weight: 500;
        font-size: 28px;
        text-align: left;
    }
    .disable {
        opacity: 0.5;
    }
}
</style>
