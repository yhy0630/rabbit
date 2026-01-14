<template>
    <view
        class="login"
        :style="'background-image: url(' + $getImageUri('/images/login_bg.png') + ')'"
    >
        <!-- #ifndef  H5 -->
        <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
            <u-navbar
                :is-back="true"
                title="登录"
                :title-bold="true"
                :is-fixed="false"
                :border-bottom="false"
                :background="{ background: 'rgba(256,256, 256,0)' }"
            ></u-navbar>
        </u-sticky>
        <!-- #endif -->

        <view class="acount-login">
            <image class="logo" :src="appConfig.shop_login_logo" mode="heightFix"></image>
            <block v-if="!phoneLogin">
                <!-- #ifdef MP-WEIXIN -->
                <button size="lg" class="white flex row-center btn" @click="mnpLoginFun">
                    <text>用户一键登录</text>
                </button>
                <mplogin-popup
                    v-model="showLoginPop"
                    :logo="appConfig.shop_login_logo"
                    :title="appConfig.name"
                    :login-data="loginData"
                    @close="closePopup"
                    @update="handleSubmitInfo"
                />
                <!--  #endif -->
                <!-- #ifdef H5-->
                <button
                    size="lg"
                    class="white flex row-center btn"
                    @click="getCodeUrl"
                    v-if="isOaWxAuth && isWeixin"
                >
                    <text>用户一键登录</text>
                </button>
                <!--  #endif -->
                <!-- #ifdef APP-PLUS -->
                <button
                    size="lg"
                    class="white flex row-center btn"
                    @click="appWxLogin"
                    v-if="appConfig.app_wechat_login"
                >
                    <text>用户一键登录</text>
                </button>
                <!--  #endif -->

                <button
                    size="lg"
                    class="white flex row-center phone-btn"
                    @click="phoneLogin = !phoneLogin"
                >
                    <text>手机号登录</text>
                </button>
            </block>
            <block v-if="phoneLogin">
                <view v-if="loginType == 0" style="width: 100%">
                    <view class="input">
                        <u-input
                            v-model="mobile"
                            style="width: 100%"
                            placeholder="请输入手机号"
                            :input-border="false"
                        />
                    </view>
                    <view class="input">
                        <u-input
                            v-model="password"
                            type="password"
                            style="flex: 1"
                            :password-icon="false"
                            placeholder="请输入密码"
                            :input-border="false"
                        />
                        <navigator
                            style="width: 132rpx; border-left: 1rpx solid #ccc"
                            url="/pages/forget_pwd/forget_pwd"
                            hover-class="none"
                            >忘记密码</navigator
                        >
                    </view>
                </view>
                <view v-if="loginType == 1" style="width: 100%">
                    <view class="input">
                        <u-input
                            v-model="telephone"
                            style="width: 100%"
                            placeholder="手机号"
                            :input-border="false"
                        />
                    </view>
                    <view class="input flex">
                        <u-input
                            v-model="smsCode"
                            style="flex: 1"
                            placeholder="请输入验证码"
                            :input-border="false"
                        />
                        <view class="flex" :class="{ disable: telephone.length != 11 }">
                            <view class="sms-btn primary flex row-center br60" @click="$sendSms">
                                <!-- 获取验证码 -->
                                <u-verification-code
                                    unique-key="login"
                                    ref="uCode"
                                    @change="codeChange"
                                >
                                </u-verification-code>
                                <view class="xs">{{ codeTips }}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="m-t-30 flex" v-if="phoneLogin" style="width: 100%">
                    <u-checkbox v-model="isAgreement" shape="circle">
                        <div class="flex text-xs">
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
                <button
                    size="lg"
                    class="btn white flex row-center"
                    :class="{ disable: disable }"
                    type="primary"
                    @click="loginFun"
                    style="margin-top: 50rpx"
                >
                    <text> 登录 </text>
                </button>
                <view class="flex row-between m-t-30" style="width: 100%">
                    <view class="lighter" @click="changeLoginType"
                        >已有账号，使用
                        <text style="color: #ff2c3c">{{
                            loginType == 0 ? '验证码登录' : '密码登录'
                        }}</text></view
                    >
                    <navigator class="lighter" url="/pages/register/register" hover-class="none"
                        >注册账号</navigator
                    >
                </view>
            </block>

            <!-- <view class="flex-1 wx-login">
       <view v-if="appConfig.app_wechat_login">
          <u-divider>其他登录方式</u-divider>
          <view @click="appWxLogin">
            <image class="image" src="/static/images/icon_wechat.png"></image>
            <view class="sm">微信登录</view>
            <text selectable>{{ text }}</text>
          </view>
        </view>

        <view>
          <u-divider>其他登录方式</u-divider>
          <view @click="getCodeUrl">
            <image class="image" src="/static/images/icon_wechat.png"></image>
            <view class="sm">微信登录</view>
            <text selectable>{{ text }}</text>
          </view>
        </view>

      </view> -->
        </view>

        <view class="flex p-l-60" v-if="!phoneLogin">
            <u-checkbox v-model="isAgreement" shape="circle">
                <div class="flex text-xs">
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
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import {
    accountLogin,
    codeLogin,
    sendSms,
    wxpLogin,
    smsCodeLogin,
    opLogin,
    authLogin,
    updateUser
} from '@/api/app'
import { bindSuperior } from '@/api/user'
import wechath5 from '@/utils/wechath5'
import { isWeixinClient, currentPage, client, trottle } from '@/utils/tools'
import { SMSType } from '@/utils/type'
import Cache from '@/utils/cache'
import { BACK_URL, INVITE_CODE } from '@/config/cachekey'
import { getWxCode, getUserProfile } from '@/utils/login'
const loginType = {
    ACCOUNT_LOGIN: 0,
    SMS_CODE_LOGIN: 1
}
export default {
    data() {
        return {
            isAgreement: false,
            password: '',
            mobile: '',
            code: '',
            isWeixin: '',
            loginType: 0,
            smsCode: '',
            codeTips: '',
            telephone: '',
            text: '',
            showLoginPop: false,
            loginData: {},
            showModel: false,
            phoneLogin: false
        }
    },

    async onLoad(option) {
        this.mnpLoginFun = trottle(this.mnpLoginFun)
        this.appWxLogin = trottle(this.appWxLogin)
        this.getCodeUrl = trottle(this.getCodeUrl)
        // H5微信登录
        // #ifdef H5
        this.oaAutoLogin()
        // #endif
    },
    onUnload() {},
    methods: {
        ...mapMutations(['login']),
        ...mapActions(['getUser']),
        // 开启小程序微信授权
        isOaWxAuth() {
            const { h5_wechat_auth } = this.appConfig
            return h5_wechat_auth
        },
        codeChange(tip) {
            this.codeTips = tip
        },
        getCodeUrl() {
            if (!this.isAgreement)
                // return this.$toast({
                //   title: '请先勾选"已阅读并同意《服务协议》和《隐私协议》"',
                // });
                return (this.showModel = true)
            wechath5.getWxUrl()
        },
        // 公众号微信登录
        async oaLogin(code) {
            const data = await wechath5.authLogin(code)
            this.loginHandle(data)
        },
        oaAutoLogin() {
            // H5微信登录
            const { code } = this.$Route.query
            this.isWeixin = isWeixinClient()
            if (this.isLogin) {
                // 已经登录 => 首页
                uni.switchTab({
                    url: '/pages/index/index'
                })
                return
            }
            if (code) {
                // 带有code => 登录
                return this.oaLogin(code)
            }
            // if (this.isWeixin && this.isOaWxAutoLogin) {
            //     // 开启自动授权登录
            //     this.getCodeUrl()
            // }
        },
        // 小程序登录
        async mnpLoginFun() {
            if (!this.isAgreement)
                // return this.$toast({
                //   title: '请先勾选"已阅读并同意《服务协议》和《隐私协议》"',
                // });
                return (this.showModel = true)
            const {
                userInfo: { avatarUrl, nickName, gender }
            } = await getUserProfile()
            uni.showLoading({
                title: '登录中...',
                mask: true
            })
            const wxCode = await getWxCode()
            const { code, data, msg } = await authLogin({
                code: wxCode,
                nickname: nickName,
                headimgurl: avatarUrl
            })
            if (code == 1) {
                if (data.is_new_user) {
                    uni.hideLoading()
                    this.showLoginPop = true
                    this.loginData = data
                } else {
                    this.loginHandle(data)
                }
            } else {
                this.$toast({
                    title: msg
                })
            }
        },
        // 账号登录
        async loginFun() {
            const { mobile, password, telephone, smsCode } = this
            if (this.loginType == 0) {
                if (!mobile) {
                    this.$toast({
                        title: '请输入账户/手机号'
                    })
                    return
                }
                if (!password) {
                    this.$toast({
                        title: '请输入密码'
                    })
                    return
                }
                if (!this.isAgreement)
                    // return this.$toast({
                    //   title: '请先勾选"已阅读并同意《服务协议》和《隐私协议》"',
                    // });
                    return (this.showModel = true)
                const { code, data } = await accountLogin({
                    mobile,
                    password,
                    client: client
                })
                if (code == 1) {
                    this.loginHandle(data)
                }
            } else {
                if (!telephone) {
                    this.$toast({
                        title: '请输入手机号'
                    })
                    return
                }
                if (!smsCode) {
                    this.$toast({
                        title: '请输入验证码'
                    })
                    return
                }
                smsCodeLogin({
                    mobile: telephone,
                    code: smsCode
                }).then((res) => {
                    if (res.code == 1) {
                        this.loginHandle(res.data)
                    }
                })
            }
        },
        // 登录结果处理
        async loginHandle(data) {
            this.login(data)
            uni.hideLoading()
            // 绑定邀请码
            const inviteCode = Cache.get(INVITE_CODE)
            if (inviteCode) {
                bindSuperior({
                    code: inviteCode
                })
                Cache.remove(INVITE_CODE)
            }

            if (getCurrentPages().length > 1) {
                uni.navigateBack({
                    success() {
                        const { onLoad, options } = currentPage()
                        onLoad && onLoad(options)
                    }
                })
            } else if (Cache.get(BACK_URL)) {
                this.$Router.replace(Cache.get(BACK_URL))
            } else {
                this.$Router.pushTab('/pages/index/index')
            }
            Cache.remove(BACK_URL)
        },
        changeLoginType() {
            if (this.loginType == loginType.ACCOUNT_LOGIN) {
                this.loginType = loginType.SMS_CODE_LOGIN
            } else if (this.loginType == loginType.SMS_CODE_LOGIN) {
                this.loginType = loginType.ACCOUNT_LOGIN
            }
        },
        // 发送验证码
        $sendSms() {
            if (!this.$refs.uCode.canGetCode) return
            if (!this.telephone) {
                this.$toast({
                    title: '请输入手机号'
                })
                return
            }

            sendSms({
                mobile: this.telephone,
                key: SMSType.LOGIN
            }).then((res) => {
                if (res.code == 1) {
                    this.$refs.uCode.start()
                    this.$toast({
                        title: res.msg
                    })
                }
            })
        },
        // app微信登录
        async appWxLogin() {
            if (!this.isAgreement) return (this.showModel = true)
            uni.login({
                provider: 'weixin',
                success: (res) => {
                    uni.showLoading({
                        title: '登录中...',
                        mask: true
                    })
                    const { openid, access_token } = res.authResult
                    opLogin({
                        openid,
                        access_token
                    })
                        .then((res) => {
                            uni.hideLoading()
                            if (res.code == 1) {
                                this.loginHandle(res.data)
                            }
                        })
                        .catch(() => {
                            uni.hideLoading()
                        })
                }
            })
        },
        async handleSubmitInfo(e) {
            const loginData = this.loginData
            const res = await updateUser(e, loginData.token)
            if (res.code == 1) {
                this.loginHandle(loginData)
            }
        },
        closePopup() {
            this.showLoginPop = false
        }
    },
    computed: {
        ...mapGetters(['appConfig']),
        isOaWxAutoLogin() {
            return this.appConfig.wechat_h5
        },
        $getImageUri() {
            return (url) => this.$store.state.app.config.base_domain + url
        },
        disable() {
            if (this.mobile && this.password && this.loginType == 0) {
                return false
            } else if (this.telephone.length == 11 && this.smsCode && this.loginType == 1) {
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
    background-color: #fff;
    text-align: center;
    padding: 0;
    // background-image: url(../../static/images/login_bg.png);

    .login {
        min-height: 100vh;
        display: flex;
        flex-direction: column;

        .mpwx-login {
            min-height: 0;
            padding: 60rpx;
            .logo {
                margin-top: 200rpx;
                width: 180rpx;
                height: 180rpx;
            }

            .image {
                width: 50rpx;
                height: 50rpx;
            }
        }
        .btn {
            width: 100%;
            height: 100rpx;
            background-color: $-color-primary;
            margin: 100rpx auto 0rpx;
            border-radius: 14rpx;
        }
        .phone-btn {
            width: 100%;
            height: 100rpx;
            border: 1px solid #bbb;
            margin: 40rpx auto 0rpx;
            color: #666666;
            border-radius: 14rpx;
        }
        .acount-login {
            padding: 60rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
            min-height: 0;

            .logo {
                width: 180rpx;
                height: 180rpx;
                margin-bottom: 50rpx;
                margin-top: 50rpx;
            }

            .input {
                padding: 0 30rpx;
                display: flex;
                align-items: center;
                height: 100rpx;
                width: 100%;
                border: $-solid-border;
                margin-top: 30rpx;
                border-radius: 14rpx;
            }

            .sms-btn {
                border: 1px solid $-color-primary;
                width: 176rpx;
                height: 60rpx;
                box-sizing: border-box;
            }

            .wx-login {
                margin-top: 60rpx;

                .image {
                    margin-top: 40rpx;
                    width: 80rpx;
                    height: 80rpx;
                }
            }
        }
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
    .text-xs {
        font-size: 24rpx;
    }
}
</style>
