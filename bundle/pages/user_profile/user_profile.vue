<template>
    <view class="user-profile p-t-10">
        <custom-navbar title="我的基本信息"></custom-navbar>
        <view class="content">
            <view class="profile-card bg-white">
                <view class="row-info flex bdb-line">
                    <view class="label md">头像</view>
                    <view class="flex-1"></view>
                    <!-- #ifdef MP-WEIXIN -->
                    <button
                        class="avatar-action"
                        hover-class="none"
                        open-type="chooseAvatar"
                        @chooseavatar="onChooseAvatar"
                        @click="onChooseAvatar"
                    >
                        <image
                            class="avatar-sm"
                            :src="
                                userInfo.avatar1 != ''
                                    ? userInfo.avatar
                                    : '/static/images/portrait_empty.png'
                            "
                        ></image>
                        <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                    </button>
                    <!-- #endif -->
                    <!-- #ifndef MP-WEIXIN -->
                    <view class="avatar-action" @tap="onChooseAvatar">
                        <image
                            class="avatar-sm"
                            :src="
                                userInfo.avatar1 != ''
                                    ? userInfo.avatar
                                    : '/static/images/portrait_empty.png'
                            "
                        ></image>
                        <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                    </view>
                    <!-- #endif -->
                </view>

                <view class="row-info flex bdb-line">
                    <view class="label md">会员编号</view>
                    <view class="value md flex-1">{{ userInfo.sn }}</view>
                </view>

                <view class="row-info flex bdb-line">
                    <view class="label md">推荐人</view>
                    <view class="value md flex-1">196****9966</view>
                </view>
                <view class="row-info flex bdb-line" @tap="goChangeNickname">
                    <view class="label md">昵称</view>
                    <view class="value md flex-1">{{ userInfo.nickname }}</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>
                <view class="row-info flex bdb-line" @tap="changeSex">
                    <view class="label md">性别</view>
                    <view class="value md flex-1" :class="userInfo.sex == 0 ? 'muted' : ''">{{
                        userInfo.sex
                    }}</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>
                <view class="row-info flex bdb-line" @tap="goChangeMobile">
                    <view class="label md">手机号</view>
                    <view class="value md flex-1" :class="{ muted: !userInfo.mobile }">{{
                        userInfo.mobile ? userInfo.mobile : '未绑定'
                    }}</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>

                <view class="row-info flex bdb-line" @tap="goChangePassword">
                    <view class="label md">修改密码</view>
                    <view class="value md flex-1 muted">点击设置</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>

                <view class="row-info flex bdb-line" @tap="goPersonalAuth">
                    <view class="label md">个人认证</view>
                    <view class="value md flex-1 muted">点击设置</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>

                <view class="row-info flex bdb-line" @tap="goWithdrawSetting(5)">
                    <view class="label md">银行卡绑定</view>
                    <view class="value md flex-1 muted">点击设置</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>

                <view class="row-info flex bdb-line" @tap="goWithdrawSetting()">
                    <view class="label md">收款方式</view>
                    <view class="value md flex-1 muted">点击设置</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>
                <!-- <view class="row-info flex bdb-line">
                    <view class="label md">注册时间</view>
                    <view class="value md flex-1">{{ userInfo.create_time }}</view>
                </view> -->

                <view class="row-info flex bdb-line" @tap="goToCancel">
                    <view class="label md">账号注销</view>
                    <view class="value md flex-1 muted">注销后无法恢复</view>
                    <u-icon name="arrow-right" color="#B2B2B2" size="32" />
                </view>

                <view class="logout-row lg" @tap="logout">退出登录</view>
                <!-- #ifndef MP-WEIXIN-->
                <!-- <view class="row-info flex row-between bdb-line" @tap="showPwdPop">
                    <view class="label md">登录密码</view>
                    <view class="flex">
                        <view class="muted">点击设置</view>
                        <u-icon name="arrow-right" />
                    </view>
                </view> -->
                <!-- #endif -->
                <!-- <view class="row-info flex row-between bdb-line mt10" @tap="goToExplain(0)">
                    <view class="label md">服务协议</view>
                    <u-icon name="arrow-right" />
                </view>
                <view class="row-info flex row-between bdb-line" @tap="goToExplain(1)">
                    <view class="label md">隐私政策</view>
                    <u-icon name="arrow-right" />
                </view> -->
                <!-- #ifdef H5-->
                <!-- <view
                    class="row-info flex row-between bdb-line"
                    @tap="bindWeixin"
                    v-if="!userInfo.oa_auth"
                >
                    <view class="label md">微信授权 </view>
                    <u-icon name="arrow-right" />
                </view> -->
                <!-- #endif -->
                <!-- <view class="row-info flex row-between bdb-line" @tap="goToCancel">
                    <view class="label md">注销账号</view>
                    <u-icon name="arrow-right" />
                </view> -->
                <!-- <view class="row-info flex row-between bdb-line" @tap="goLicense()">
                    <view class="label md">资质信息</view>
                    <u-icon name="arrow-right" />
                </view> -->
                <!-- <view class="row-info flex row-between">
                    <view class="label md">关于我们</view>
                    <view>v{{ version }}</view>
                </view> -->
            </view>
        </view>

        <!-- 版权信息 -->
        <view class="license xs text-center" v-if="appConfig.copyright_info">
            <view>{{ appConfig.copyright_info }}</view>
            <view>{{ appConfig.icp_number }}</view>
        </view>

        <!-- 已移除：更换手机号弹窗（改为跳转到独立页面修改） -->
        <!-- 已移除：修改昵称弹窗（改为跳转到独立页面修改） -->
        <!-- 已移除：修改密码弹窗（改为跳转到独立页面修改） -->
        <u-picker
            mode="selector"
            v-model="showPicker"
            :default-selector="[0]"
            :range="sexList"
            @confirm="onConfirm"
        />
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import {
    userLogout,
    getUserInfo,
    setUserInfo,
    setWechatInfo,
    apibindOa
} from '@/api/user'
import { baseURL, version } from '@/config/app'
import { forgetPwd } from '@/api/app'
import { SMSType } from '@/utils/type'
import { mapGetters } from 'vuex'
import { uploadFile, isWeixinClient, trottle } from '@/utils/tools'
import { getUserProfile } from '@/utils/login'
import wechath5 from '@/utils/wechath5'

const FieldType = {
    NONE: '',
    SEX: 'sex',
    NICKNAME: 'nickname',
    AVATAR: 'avatar',
    MOBILE: 'mobile'
}
export default {
    name: 'userProfile',
    components: {
        CustomNavbar
    },
    data() {
        return {
            action: baseURL + '/api/file/formimage',
            fileList: [],
            userInfo: {},
            sexList: ['男', '女'],
            fieldType: FieldType.NONE,
            showPicker: false,
            smsType: '',
            version
        }
    },
    methods: {
        onSuccess(e) {
            console.log(e)
        },
        uploadImage(path) {
            uni.showLoading({
                title: '正在上传中...',
                mask: true
            })
            uploadFile(path)
                .then((res) => {
                    uni.hideLoading()
                    this.setUserInfoFun(res.uri)
                })
                .catch(() => {
                    uni.hideLoading()
                    this.$toast({
                        title: '上传失败'
                    })
                })
        },
        bindWeixin() {
            this.oaAuth()
        },
        oaAuth() {
            wechath5.getWxUrl()
        },
        onChooseAvatar(e) {
            this.fieldType = FieldType.AVATAR
            // #ifndef MP-WEIXIN
            // 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
            uni.$u.route({
                // 关于此路径，请见下方"注意事项"
                url: '/components/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
                // 内部已设置以下默认参数值，可不传这些参数
                params: {
                    // 输出图片宽度，高等于宽，单位px
                    destWidth: 300,
                    // 裁剪框宽度，高等于宽，单位px
                    rectWidth: 200,
                    // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
                    fileType: 'jpg'
                }
            })
            // #endif
            // #ifdef MP-WEIXIN
            if (e.detail.avatarUrl) {
                this.uploadImage(e.detail.avatarUrl)
            }
            // #endif
        },
        // 更新小程序头像信息
        async getUserProfileFun() {
            const { userInfo } = await getUserProfile()
            const { avatarUrl, nickName, gender } = userInfo
            const { msg, code } = await setWechatInfo({
                nickname: nickName,
                avatar: avatarUrl,
                sex: gender
            })
            if (code == 1) {
                this.$toast({
                    title: msg
                })
                this.getUserInfoFun()
            }
        },

        // end
        async logout() {
            const [req, res] = await uni.showModal({
                title: '提示',
                content: '是否退出登录？'
            })
            if (!res.confirm) return
            //  退出登录
            userLogout().then((res) => {
                if (res.code == 1) {
                    this.$store.commit('logout')
                    this.$toast({
                        title: '退出成功'
                    })
                    setTimeout(() => {
                        this.$Router.replace('/pages/login/login')
                    }, 500)
                }
            })
        },
        goToExplain(value) {
            this.$Router.push({
                path: '/bundle/pages/server_explan/server_explan',
                query: {
                    type: value
                }
            })
        },
        goLicense() {
            this.$Router.push({
                path: '/bundle/pages/license/license',
                query: {
                    id: ''
                }
            })
        },
        goToCancel() {
            this.$Router.push({
                path: '/bundle/pages/cancel/cancel',
                query: {
                    id: ''
                }
            })
        },
        goChangePassword() {
            uni.navigateTo({
                url: '/bundle/pages/change_password/change_password'
            })
        },
        getUserInfoFun() {
            getUserInfo().then((res) => {
                if (res.code == 1) {
                    this.userInfo = res.data
                }
            })
        },
        goChangeMobile() {
            uni.navigateTo({
                url: '/bundle/pages/change_mobile/change_mobile'
            })
        },
        goChangeNickname() {
            uni.navigateTo({
                url: '/bundle/pages/change_nickname/change_nickname'
            })
        },
        // 修改用户信息
        async setUserInfoFun(value) {
            const res = await setUserInfo({
                field: this.fieldType,
                value: value
            })
            if (res.code == 1) {
                this.$toast({
                    title: res.msg
                })
                this.getUserInfoFun()
            }
        },
        onConfirm(value) {
            this.setUserInfoFun(value[0] + 1)
            this.showPicker = false
        },
        changeSex(e) {
            this.showPicker = true
            this.fieldType = FieldType.SEX
        },

        goPersonalAuth() {
            uni.navigateTo({
                url: '/bundle/pages/real_name_auth/real_name_auth'
            })
        },
        goWithdrawSetting(type) {
            const url = type ? `/bundle/pages/user_withdraw/user_withdraw?type=${type}` : '/bundle/pages/user_withdraw/user_withdraw'
            uni.navigateTo({ url })
        },
        // 修改昵称：改为跳转页面（不再弹窗）
        // 已移除：小程序 getPhoneNumber 绑定手机（改为跳转到独立页面修改）
    },

    async onLoad() {
        this.getUserInfoFun()
        // 接收“修改手机号”页面回传的新手机号，立即更新本页显示
        uni.$on('user_mobile_changed', ({ mobile }) => {
            if (!mobile) return
            this.userInfo = {
                ...this.userInfo,
                mobile
            }
        })
        // 接收“修改昵称”页面回传的新昵称，立即更新本页显示
        uni.$on('user_nickname_changed', ({ nickname }) => {
            if (!nickname) return
            this.userInfo = {
                ...this.userInfo,
                nickname
            }
        })
        // #ifdef H5
        let { code, form } = this.$Route.query
        if (code) {
            if (Array.isArray(code)) code = code.pop()

            await apibindOa({
                code
            })
        }
        // #endif
        uni.$on('uAvatarCropper', (path) => {
            console.log(path)
            this.uploadImage(path)
        })
        this.getUserProfileFun = trottle(this.getUserProfileFun, 500, this)
    },
    onShow() {
        // 兜底：从缓存读取待更新手机号，确保返回时立刻变更
        const mobile = uni.getStorageSync('pending_user_mobile')
        if (mobile) {
            uni.removeStorageSync('pending_user_mobile')
            this.userInfo = {
                ...this.userInfo,
                mobile
            }
        }
        // 兜底：从缓存读取待更新昵称，确保返回时立刻变更
        const nickname = uni.getStorageSync('pending_user_nickname')
        if (nickname) {
            uni.removeStorageSync('pending_user_nickname')
            this.userInfo = {
                ...this.userInfo,
                nickname
            }
        }
    },
    onUnload() {
        uni.$off('uAvatarCropper')
        uni.$off('user_mobile_changed')
        uni.$off('user_nickname_changed')
    },
    computed: {
        ...mapGetters(['token', 'appConfig'])
    }
}
</script>

<style lang="scss">
.user-profile {
    padding-top: 88px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
    min-height: calc(100vh - env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    .content {
        // flex: 1;
        padding: 20rpx;

        .profile-card {
            border-radius: 24rpx;
            overflow: hidden;
        }

        .row-info {
            padding: 30rpx 24rpx;
            align-items: center;

            .label {
                width: 180rpx;
                color: #333;
            }

            .value {
                text-align: right;
                padding-right: 16rpx;
                color: #333;
            }

            .bd-btn {
                padding: 8rpx 24rpx;
                border: 1px solid #1b8902;
                color: #1b8902;
                background-color: #f0fff8;
            }
        }

        .bdb-line {
            border-bottom: 1rpx solid #e5e5e5;
        }

        .avatar-action {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            background: transparent;
            border: none;
            padding: 0;
            margin: 0;
            line-height: 1;
        }

        .avatar-sm {
            width: 64rpx;
            height: 64rpx;
            border-radius: 50%;
            margin-right: 10rpx;
        }

        .logout-row {
            height: 110rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
    }
    .license {
        margin-top: 20rpx;
        color: #a7a7a7;
    }
    .modify-container {
        padding: 30rpx;
        width: 620rpx;
        border-radius: 30rpx;

        .title {
            padding: 26rpx 0rpx;
        }

        .btn {
            height: 80rpx;
            border-radius: 20rpx;
            margin: 60rpx 50rpx 0;
        }
    }
}
</style>
