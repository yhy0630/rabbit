<template>
    <view class="user" :style="[background]">
        <custom-navbar title="个人中心" :bg-color="'#189B07'" :show-back="false"></custom-navbar>
        <view class="top-right-icons">
            <router-link to="/bundle/pages/chat/chat">
                <view class="icon-item">
                    <image class="icon" src="/static/images/kefu-5 1.png"></image>
                    <text class="label">客服</text>
                </view>
            </router-link>
            <router-link to="/bundle/pages/user_set/user_set">
                <view class="icon-item">
                    <image class="icon" src="/static/images/setting-two 1.png"></image>
                    <text class="label">设置</text>
                </view>
            </router-link>
        </view>
        <view class="header">
            <view class="hd-wrap">
                <view class="user-info flex row-between">
                    <router-link to="/bundle/pages/user_profile/user_profile">
                        <view class="info flex">
                            <image
                                class="avatar m-r-20 flex-none"
                                :src="
                                    isLogin ? userInfo.avatar : '/static/images/portrait_empty.png'
                                "
                            />
                            <view v-if="isLogin">
                                <view class="name flex">
                                    <view class="xxl bold line-2">{{ userInfo.nickname }}</view>
                                    <view
                                        class="level br60 m-l-10 flex-none flex"
                                        v-if="userInfo.vip"
                                    >
                                        <text class="m-r-10">
                                            <text class="v xxl m-r-4">T</text>
                                            <text class="xxs">{{ userInfo.vip }}</text>
                                        </text>
                                        <text class="xxs">{{ userInfo.level_name }}</text>
                                    </view>
                                </view>
                                <view class="flex m-t-10" v-if="userInfo.sn">
                                    <view class="user-id xs m-r-20">会员编号: {{ userInfo.sn }}</view>
                                    <!-- <view class="xs primary row-center m-l-5" @tap.stop="onCopy"
                                        >复制</view
                                    > -->
                                </view>
                            </view>
                            <view v-else>
                                <view style="font-size: 42rpx">点击登录</view>
                                <view class="sm m-t-10 lighter">登录体验更多功能</view>
                            </view>
                        </view>
                    </router-link>
                    <view class="flex m-l-20">
                        <router-link to="/bundle/pages/integral_sign/integral_sign">
                            <view class="sign-btn flex row-center">
                                <image class="sign-icon" src="/static/images/qiandao.png" mode="aspectFit"></image>
                                <text class="sign-text">签到</text>
                            </view>
                        </router-link>
                    </view>
                </view>

                <view class="user-assets flex ">
                    <router-link
                        class="user-assests-item"
                        to="/bundle/pages/integral_sign/integral_sign"
                    >
                        <view class="flex-col col-center">
                            <view class="xl primary">
                                {{ userInfo.integral || 0 }}
                            </view>
                            <view class="sm m-t-10"> 积分 </view>
                        </view>
                    </router-link>
                    <router-link
                        class="user-assests-item"
                        to="/bundle/pages/user_wallet/user_wallet"
                    >
                        <view class="flex-col col-center">
                            <view class="xl primary">
                                {{ userInfo.user_money || 0 }}
                            </view>
                            <view class="sm m-t-10"> 钱包</view>
                        </view>
                    </router-link>
                    <router-link
                        class="user-assests-item"
                        to="/bundle/pages/user_coupon/user_coupon"
                    >
                        <view class="flex-col col-center">
                            <view class="xl primary">
                                {{ userInfo.coupon || 0 }}
                            </view>
                            <view class="sm m-t-10"> 优惠券 </view>
                        </view>
                    </router-link>
                    <router-link
                        class="user-assests-item"
                        to="/bundle/pages/user_collection/user_collection"
                    >
                        <view class="flex-col col-center">
                            <view class="xl primary">
                                {{ userInfo.collect || 0 }}
                            </view>
                            <view class="sm m-t-10"> 收藏 </view>
                        </view>
                    </router-link>
                </view>
            </view>
        </view>

        <view class="order-nav bg-white">
            <router-link to="/bundle/pages/order_modeSelect/order_modeSelect">
                <view class="title flex row-between">
                    <view class="lg">我的订单</view>
                    <view class="muted sm row">
                        查看全部
                        <u-icon name="arrow-right" size="28rpx" />
                    </view>
                </view>
            </router-link>
            <view class="nav flex">
                <router-link
                    class="item"
                    :to="{
                        path: '/bundle/pages/user_order/user_order',
                        query: { type: 'pay' }
                    }"
                >
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_pay"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_pay }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/daifukuan-2 1.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">待付款</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/user_order/user_order?type=use">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <image
                                class="nav-icon"
                                src="/static/images/yuyue-2 1.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">待使用</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/user_order/user_order?type=delivery">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_delivery"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_delivery }}
                            </view>
                            <image
                                class="nav-icon m-b-10"
                                src="/static/images/daifahuo-2 1.png"
                            ></image>
                        </view>
                        <view class="sm">待发货</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/user_order/user_order?type=take">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_take"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_take }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/daishouhuo 1.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">待收货</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/user_comment/user_comment">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_comment"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_comment }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/fankui 1.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">待评价</view>
                    </view>
                </router-link>
                <!-- <router-link class="item" to="/bundle/pages/after_sales/after_sales">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.after_sale"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.after_sale }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/icon_my_shouhou.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">退款/售后</view>
                    </view>
                </router-link> -->
            </view>
        </view>
              <!-- 邀请好友 / 推广中心 -->
              <view class="invite-promote">
            <view class="invite-card" @tap="goInviteFriend">
                <view class="invite-text">
                    <view class="invite-title">邀请好友</view>
                    <view class="invite-sub">迎优惠好礼 ></view>
                </view>
                <image class="invite-img" src="https://pw3.yihaiguantao.com/static/picture/friend.png" mode="aspectFit"></image>
            </view>
            <view class="invite-card" @tap="goPromotionCenter">
                <view class="invite-text">
                    <view class="invite-title">推广中心</view>
                    <view class="invite-sub">享更多特权 ></view>
                </view>
                <image class="invite-img" src="https://pw3.yihaiguantao.com/static/picture/center.png" mode="aspectFit"></image>
            </view>
        </view>

        <view class="common-tools bg-white">
            <view class="title flex row-between">
                <view class="lg">常用工具</view>
            </view>
            <view class="tool-list">
                <view class="tool-item flex row-between" @tap="goToolPage('/bundle/pages/user_deposit/user_deposit')">
                    <view class="flex row-center">
                        <image class="tool-icon" src="/static/images/dingwei 3.png"></image>
                        <text class="tool-name">我的保证金</text>
                    </view>
                    <u-icon name="arrow-right" size="28rpx" color="#999" />
                </view>
                <view class="tool-item flex row-between" @tap="goToolPage('/bundle/pages/user_address/user_address')">
                    <view class="flex row-center">
                        <image class="tool-icon" src="/static/images/dingwei 1.png"></image>
                        <text class="tool-name">我的地址</text>
                    </view>
                    <u-icon name="arrow-right" size="28rpx" color="#999" />
                </view>
                <view class="tool-item flex row-between" @tap="goToolPage('/bundle/pages/store_settled/store_settled')">
                    <view class="flex row-center">
                        <image class="tool-icon" src="/static/images/shenqing 1.png"></image>
                        <text class="tool-name">申请入驻</text>
                    </view>
                    <u-icon name="arrow-right" size="28rpx" color="#999" />
                </view>
                <view class="tool-item flex row-between" @tap="goToolPage('/bundle/pages/chat/chat')">
                    <view class="flex row-center">
                        <image class="tool-icon" src="/static/images/kefu-3 1.png"></image>
                        <text class="tool-name">联系客服</text>
                    </view>
                    <u-icon name="arrow-right" size="28rpx" color="#999" />
                </view>
                <view class="tool-item flex row-between" @tap="goToolPage('/bundle_b/pages/published_works/published_works')">
                    <view class="flex row-center">
                        <image class="tool-icon" src="/static/images/gonggao 1.png"></image>
                        <text class="tool-name">我的发布</text>
                    </view>
                    <u-icon name="arrow-right" size="28rpx" color="#999" />
                </view>
                <view class="tool-item flex row-between" @tap="goToolPage('/bundle/pages/user_spread/user_spread')">
                    <view class="flex row-center">
                        <image class="tool-icon" src="/static/images/tongxunlu 1.png"></image>
                        <text class="tool-name">我的团队</text>
                    </view>
                    <u-icon name="arrow-right" size="28rpx" color="#999" />
                </view>
                <view class="tool-item flex row-between" @tap="goToolPage('/bundle/pages/about_us/about_us')">
                    <view class="flex row-center">
                        <image class="tool-icon" src="/static/images/zixunjieda 1.png"></image>
                        <text class="tool-name">关于我们</text>
                    </view>
                    <u-icon name="arrow-right" size="28rpx" color="#999" />
                </view>
            </view>
        </view>

        <!-- <view class="server-nav bg-white" v-if="menuList && menuList.length > 0">
            <view>
                <view class="title flex row-between">
                    <view class="lg">我的功能</view>
                </view>
            </view>
            <view class="nav flex flex-wrap">
                <view
                    v-for="(item, index) in menuList"
                    :key="index"
                    class="item flex-col col-center m-b-20"
                    style="width: 25%"
                    @tap="menuJump(item)"
                >
                    <image class="nav-icon" :src="item.image"></image>
                    <view class="sm m-t-10">{{ item.name }}</view>
                </view>
            </view>
        </view> -->
        <!-- <goods-column ref="mescrollItem"></goods-column> -->
        <custom-tabbar :current="4" :tabs="tabbarTabs"></custom-tabbar>
    </view>
</template>

<script>
import MescrollCompMixin from '@/components/mescroll-uni/mixins/mescroll-comp'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { mapGetters, mapActions } from 'vuex'
import { getMenu } from '@/api/store'
import { toLogin } from '@/utils/login'
import { menuJump, copy } from '@/utils/tools'
import Cache from '@/utils/cache'
const app = getApp()
export default {
    mixins: [MescrollCompMixin],
    components: {
        CustomTabbar,
        CustomNavbar
    },
    data() {
        return {
            showNav: false,
            navBg: 0,
            menuList: [],
            // 底部导航栏配置，不包含消息按钮
            tabbarTabs: [
                { id: 'home', path: '/pages/index/index' },
                { id: 'mall', path: '/pages/goods_cate/goods_cate' },
                { id: 'publish', path: '/bundle_b/pages/published_works/published_works' },
                { id: 'order', path: '/bundle/pages/user_order/user_order' },
                { id: 'user', path: '/pages/user/user' }
            ]
        }
    },

    onLoad(options) {
        this.getMenuFun()
    },

    onShow() {
        this.getUser()
        this.getCartNum()
        console.log(this.userInfo)
    },

    onPageScroll(e) {
        const top = uni.upx2px(100)
        const { scrollTop } = e
        let percent = scrollTop / top > 1 ? 1 : scrollTop / top
        this.navBg = percent
    },
    onPullDownRefresh() {
        this.getUser().then(() => {
            uni.stopPullDownRefresh()
        })
        this.getMenuFun()
    },
    methods: {
        ...mapActions(['getCartNum', 'getUser']),
        goLogin() {
            let { isLogin } = this
            if (isLogin) {
                uni.navigateTo({
                    url: '/bundle/pages/user_profile/user_profile'
                })
                return
            }
            uni.navigateTo({
                url: '/pages/login/login'
            })
        },

        goPage(url) {
            if (!this.isLogin) return toLogin()
            uni.navigateTo({
                url
            })
        },
        async getMenuFun() {
            const { data, code } = await getMenu({
                type: 2
            })
            if (code == 1) {
                this.menuList = data
            }
        },
        onCopy(e) {   
            copy(this.userInfo.sn)
        },
        menuJump(item) {
            menuJump(item)
        },
        goToolPage(url) {
            if (!this.isLogin) return toLogin()
            uni.navigateTo({
                url
            })
        },
        // 邀请好友
        goInviteFriend() {
            if (!this.isLogin) return toLogin()
            uni.navigateTo({
                url: '/bundle/pages/invite_fans/invite_fans'
            })
        },
        // 推广中心
        goPromotionCenter() {
            if (!this.isLogin) return toLogin()
            uni.navigateTo({
                url: '/bundle/pages/user_spread/user_spread'
            })
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'inviteCode', 'appConfig']),
        background() {
            const { center_setting } = this.appConfig
            return center_setting.top_bg_image
                ? {
                      'background-image': `url(${center_setting.top_bg_image})`
                  }
                : {}
        }
    }
}
</script>
<style lang="scss" scoped>
.user {
    background: linear-gradient(180deg, #199C07 40%, #B1DF14 60%, #F8F8F8 90%);
    background-size: 100% 1000rpx;
    background-repeat: no-repeat;
    padding-bottom: 180rpx;
    padding-top: calc(65rpx + var(--status-bar-height));
    

    .top-right-icons {
        display: flex;
        justify-content: flex-end;
        padding: 0 30rpx 20rpx;
        position: relative; /* Added for positioning the icons within the green header */
        top: 60rpx; /* Adjust as needed to align with the image */
        z-index: 10; /* Ensure icons are above other content */

        .icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 30rpx;
            .icon {
                width: 50rpx;
                height: 50rpx;
            }
            .label {
                color: #fff;
                font-size: 24rpx;
                margin-top: 5rpx;
            }
        }
    }

    .header {
        margin: 0rpx 20rpx;
        padding-top: 20rpx;

        .hd-wrap {
            padding-bottom: 20rpx;
            border-radius: 20rpx;
        }

        .user-info {
            padding: 25rpx;

            .avatar {
                height: 110rpx;
                width: 110rpx;
                border-radius: 50%;
                overflow: hidden;
                border: 4rpx solid #fff;
            }

            .name {
                text-align: left;
                margin-bottom: 5rpx;
                font-size: 36rpx;
                color: #fff;
            }

            .user-id {
                border-radius: 100rpx;
                padding: 2rpx 15rpx;
                color: #fff;
            }

            .user-opt {
                position: relative;

                .dot {
                    position: absolute;
                    background-color: #ee0a24;
                    border: 2rpx solid #ffffff;
                    color: $-color-primary;
                    border-radius: 100%;
                    top: 6rpx;
                    right: 0rpx;
                    font-size: 22rpx;
                    min-width: 16rpx;
                    height: 16rpx;
                }
            }

            .sign-btn {
                background-color: #FFF;
                border-radius: 50rpx;
                padding: 12rpx 24rpx;
                align-items: center;
                gap: 8rpx;

                .sign-icon {
                    width: 32rpx;
                    height: 32rpx;
                }

                .sign-text {
                    font-size: 28rpx;
                    color: #0F0F0F;
                    font-weight: 500;
                }
            }

            .level {
                background: #333;
                padding: 0 15rpx;
                color: #ffdea5;
                line-height: 40rpx;

                .v {
                    font-style: italic;
                }
            }
        }

        .user-assets {
            flex: 1;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 20rpx;
            padding: 20rpx;
            padding-top: 30rpx;

            .user-assests-item {
                flex: 1;

                .xl.primary {
                    color: #199c07;
                    font-weight: bold;
                }
                .sm.m-t-10 {
                    font-weight: bold;
                }
            }
        }
    }

    .order-nav {
        .icon-contain {
            position: relative;
        }
    }

    .invite-promote {
        margin: 0rpx 20rpx 20rpx;
        display: flex;
        justify-content: space-between;
        gap: 20rpx;
    }

    .invite-card {
        flex: 1;
        background-color: #ffffff;
        border-radius: 20rpx;
        padding: 10rpx 24rpx 10rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        box-shadow: 0 8rpx 24rpx raba(0,0,0,0.06);
        
    }

    .invite-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .invite-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #111111;
    }

    .invite-sub {
        margin-top: 8rpx;
        font-size: 24rpx;
        color: #189b07;
    }

    .invite-img {
        width: 150rpx;
        height: 140rpx;
        margin-left: 10rpx;
    }

    .order-nav,
    .common-tools,
    .server-nav,
    .my-assets {
        margin: 0rpx 20rpx 20rpx;
        border-radius: 20rpx;
        background-color: #fff;
        padding: 0;
        box-shadow: 0 8rpx 24rpx raba(0,0,0,0.06);


        .title {
            height: 88rpx;
            padding: 0 30rpx;
            border-bottom: 1rpx solid #f2f2f2;
        }
    }

    .common-tools {
        .tool-list {
            padding: 0 30rpx;

            .tool-item {
                height: 100rpx;
                border-bottom: 1rpx solid #f2f2f2;
                align-items: center;

                &:last-child {
                    border-bottom: none;
                }

                .tool-icon {
                    width: 64rpx;
                    height: 64rpx;
                    margin-right: 20rpx;
                }

                .tool-name {
                    font-size: 30rpx;
                    color: #333;
                }
            }
        }
    }


    .title {
        height: 88rpx;
        padding: 0 30rpx;
    }

    .nav {
        .assets-item {
            flex: 1;
        }

        .item {
            width: 25%;
        }

        .badge {
            padding: 0 6rpx;
            min-width: 28rpx;
            height: 28rpx;
            border-radius: 28rpx;
            box-sizing: border-box;
            border: 1rpx solid $-color-primary;
            color: $-color-primary;
            position: absolute;
            left: 33rpx;
            top: -10rpx;
            z-index: 2;
        }

        .nav-icon {
            width: 64rpx;
            height: 64rpx;
        }
    }
}
</style>
