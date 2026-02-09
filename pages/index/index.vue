<template>
    <view>
        <mescroll-body
            ref="mescrollRef"
            @init="mescrollInit"
            @down="downCallback"
            @up="upCallback"
            :up="{ use: false, toTop: { bottom: '300rpx' } }"
        >
            <view class="index index-bg" :style="[headerStyle]">
                <view class="index-bg" :style="[headerStyle]">
                    <!-- #ifdef MP -->
                    <!-- 顶部导航栏标题文字已隐藏 -->
                    <!--
                    <view class="mp-title-test" style="padding-top: 100rpx; padding-bottom: 20rpx; text-align: center; position: relative; z-index: 9999;">
                        <text style="color: #FFFFFF; font-size: 36rpx; font-weight: bold; text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);">首页</text>
                    </view>
                    -->
                    <!-- #endif -->
                    
                    <u-navbar
                            :is-fixed="false"
                            :border-bottom="false"
                            :background="{ background: 'transparent' }"
                            :is-back="false"
                        >
                            <view class="flex-1 flex row row-center" style="position: relative">
                                <!-- 城市 -->
                                <router-link
                                    class="flex white row-center"
                                    to="/bundle_b/pages/city/city"
                                    style="margin-right: 16rpx; flex-shrink: 0;"
                                >
                                    <text style="color: #FFFFFF; font-size: 28rpx; font-weight: bold;">{{ cityInfo.name || '北京' }}</text>
                                    <u-icon name="arrow-down" size="24" color="#FFFFFF"></u-icon>
                                </router-link>
                                
                                <!-- 搜索框 -->
                                <view class="flex-1" style="margin: 0 16rpx;">
                                    <router-link to="/pages/goods_search/goods_search">
                                        <view style="background: rgba(255, 255, 255, 0.3); border: 2rpx solid rgba(255, 255, 255, 0.6); border-radius: 60rpx; padding: 16rpx 32rpx; display: flex; align-items: center;">
                                            <u-icon name="search" size="32" color="rgba(255, 255, 255, 0.8)"></u-icon>
                                            <text style="color: rgba(255, 255, 255, 0.8); font-size: 28rpx; margin-left: 16rpx;">搜索</text>
                                        </view>
                                    </router-link>
                                </view>
                                
                                <!-- 扫描图标 -->
                                <view class="scan-icon" style="margin-left: 16rpx; margin-right: 16rpx;">
                                    <image 
                                        src="/static/picture/saomiao.png" 
                                        style="width: 48rpx; height: 48rpx;"
                                        mode="aspectFit"
                                    ></image>
                                </view>

                                <!-- #ifdef MP -->
                                <!-- <view class="capsule-tips flex row-between" v-if="offPrompt">
                                    <text class="m-r-10">添加到"我的小程序"，红包、优惠不错过</text>
                                    <u-icon
                                        name="close"
                                        color="#FFFFFF"
                                        @click="clearIntervalFunc"
                                    ></u-icon>
                                </view> -->
                                <!-- #endif -->
                            </view>
                        </u-navbar>
                        
                        <!-- 功能入口 -->
                        <view class="service-menu" style="display: flex; justify-content: space-around; padding: 30rpx 20rpx; background: transparent;">
                            <view class="menu-item" style="display: flex; flex-direction: column; align-items: center;">
                                <image 
                                    src="/static/picture/taohuafei 1.png" 
                                    style="width: 80rpx; height: 80rpx; margin-bottom: 16rpx;"
                                    mode="aspectFit"
                                ></image>
                                <text style="color: #FFFFFF; font-size: 24rpx;">话费充值</text>
                            </view>
                            
                            <view class="menu-item" style="display: flex; flex-direction: column; align-items: center;">
                                <image 
                                    src="/static/picture/zhaopinhui 1.png" 
                                    style="width: 80rpx; height: 80rpx; margin-bottom: 16rpx;"
                                    mode="aspectFit"
                                ></image>
                                <text style="color: #FFFFFF; font-size: 24rpx;">招聘会</text>
                            </view>
                            
                            <view class="menu-item" style="display: flex; flex-direction: column; align-items: center;" @click="goToLifePayment">
                                <image 
                                    src="/static/picture/shuidian-2 1.png" 
                                    style="width: 80rpx; height: 80rpx; margin-bottom: 16rpx;"
                                    mode="aspectFit"
                                ></image>
                                <text style="color: #FFFFFF; font-size: 24rpx;">生活缴费</text>
                            </view>
                            
                            <view class="menu-item" style="display: flex; flex-direction: column; align-items: center;" @click="goToExpress">
                                <image 
                                    src="/static/picture/kuaidi 1.png" 
                                    style="width: 80rpx; height: 80rpx; margin-bottom: 16rpx;"
                                    mode="aspectFit"
                                ></image>
                                <text style="color: #FFFFFF; font-size: 24rpx;">寄快递</text>
                            </view>
                        </view>
                        
                        <!-- 标签栏和分类按钮已隐藏 -->
                        <!-- <view class="flex">
                            <view class="flex-1" style="min-width: 600rpx">
                                <u-tabs
                                    active-color="#fff"
                                    inactive-color="#fff"
                                    :current="active"
                                    :list="cateList"
                                    bg-color="transparent"
                                    :active-item-style="{ fontSize: '32rpx' }"
                                    :bar-width="64"
                                    :bold="false"
                                    :barStyle="{
                                        background:
                                            'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 49%, rgba(255, 255, 255, 0) 100%)'
                                    }"
                                    @change="changeActive"
                                >
                                </u-tabs>
                            </view>
                            <router-link to="/pages/goods_cate/goods_cate" navType="pushTab">
                                <view class="white flex cate-btn m-l-10">
                                    <image
                                        class="icon-xs m-r-4"
                                        src="/static/images/icon_cate.png"
                                        alt=""
                                    />
                                    分类
                                </view>
                            </router-link>
                        </view> -->
                    </view>
                
                <view class="tab-con">
                    <view v-show="active == 0">
                        <index-home
                            ref="indexHome"
                            :home-data="homeData"
                            :nav-list="navList"
                            :live-list="liveLists"
                        >
                        </index-home>
                        <goods-column ref="mescrollItem" :autoGetData="false"></goods-column>
                    </view>
                    <template v-for="(item, index) in cateList">
                        <view
                            v-if="index > 0"
                            class="tab-item"
                            v-show="active == index"
                            :key="index"
                        >
                            <view>
                                <cate-home
                                    v-if="showCateList[index]"
                                    :top="cateTop"
                                    ref="cateItem"
                                    :i="index"
                                    :index="active"
                                    :cate="item"
                                >
                                </cate-home>
                            </view>
                        </view>
                    </template>
                </view>
            </view>

            <!-- 悬浮：投诉/建议 -->
            <view class="float-report" @tap="handleReport">
                <image
                    :src="STATIC_BASE_URL + 'static/picture/Frame 1171275731.png'"
                    class="float-report-icon"
                    mode="aspectFit"
                ></image>
                <text class="float-report-text">投诉/建议</text>
            </view>
            <!-- #ifdef APP-PLUS -->
            <lyg-popup
                v-if="appConfig.app_agreement"
                title="用户使用及隐私保护政策提示"
                protocolPath="/bundle/pages/server_explan/server_explan?type=0"
                policyPath="/bundle/pages/server_explan/server_explan?type=1"
                policyStorageKey="has_read_privacy"
            >
            </lyg-popup>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <!-- 用户隐私协议弹框 -->
            <privacy-popup v-model="showPrivacyPopup"></privacy-popup>
            <!-- #endif -->
        </mescroll-body>
        <!-- #ifdef H5 -->
        <view class="record_number">
            <a :href="appConfig.icp_link" style="color: #495770; text-decoration: none">
                {{ appConfig.icp_number }}
            </a>
        </view>
        <!-- #endif -->

        <!-- 原生导航栏 -->
        <!-- <tabbar></tabbar> -->
        
        <!-- 自定义导航栏 -->
        <custom-tabbar :current="0" :tabs="tabbarTabs" @change="onTabChange"></custom-tabbar>

        <!-- 无网络提示 -->
        <u-no-network z-index="1200" @retry="handleRetry"></u-no-network>
    </view>
</template>

<script>
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import MescrollCompMixin from '@/components/mescroll-uni/mixins/mescroll-comp'
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getMenu, getHome, getLevelOneList } from '@/api/store'
import { getConfig, STATIC_BASE_URL } from '@/api/app'
import { getLiveLists } from '@/api/live'
const homeItem = {
    name: '首页'
}
export default {
    components: {
        CustomTabbar
    },
    mixins: [MescrollMixin, MescrollCompMixin],
    data() {
        return {
            offPrompt: true,
            active: 0,
            navBg: 0,
            goodsList: [],
            homeData: {},
            navList: [],
            enable: true,
            cateList: [homeItem],
            showCateList: [],
            liveLists: [],
            showPrivacyPopup: false, //微信用户隐私协议
            // 自定义底部导航栏按钮配置
            // 这里只配置「使用哪些按钮」以及「各自的跳转路径」
            // 图标和文字在 components/custom-tabbar/custom-tabbar.vue 中统一维护
            tabbarTabs: [
                {
                    id: 'home',
                    path: '/pages/index/index'
                },
                {
                    id: 'mall',
                    path: '/pages/goods_cate/goods_cate'
                },
                {
                    id: 'publish',
                    path: '/bundle_b/pages/published_works/published_works'
                },
                {
                    id: 'order',
                    path: '/bundle/pages/user_order/user_order'
                },
                {
                    id: 'user',
                    path: '/pages/user/user'
                }
            ],
            // 静态资源基础地址（用于悬浮投诉/建议图片等）
            STATIC_BASE_URL
        }
    },
    async onLoad(options) {
        // #ifdef MP-WEIXIN
        wx.getPrivacySetting({
            success: (res) => {
                console.log(res, '------') // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
                if (res.needAuthorization) {
                    // 需要弹出隐私协议
                    this.showPrivacyPopup = true
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
        // #endif

        // 选择城市后是否刷新
        if (options?.refresh) await this.getHomeFun()
        // 监听是否刷新页面，目前秒杀时会用到
        uni.$on('refreshhome', () => {
            this.getHomeFun()
        })
        // #ifdef MP-WEIXIN
        this.getLiveListsFun()
        // #endif
    },
    onUnload() {
        uni.$off('refreshhome')
    },
    onShow() {
        this.enable = this.active == 0 ? true : false
        this.getCartNum()
    },
    onHide() {
        // #ifdef H5
        this.enable = false
        // #endif
    },
    onReady() {
        // #ifdef MP
        // 关闭胶囊提示
        this.offPromptFunc()
        // #endif
    },
    methods: {
        ...mapActions(['getCartNum', 'getUser', 'initLocationFunc']),
        ...mapMutations(['setConfig']),
        // 自定义导航栏切换事件
        onTabChange(index) {
            console.log('切换到tab:', index)
        },
        // 网络重试刷新网络请求（解决在ios中首次进入时需要授权蜂窝加载空白页面问题
        async handleRetry() {
            console.log('网络重试刷')
            const { code, data } = await getConfig()
            if (code == 1) {
                this.setConfig(data)
                if (data.is_open_nearby) {
                    // 获取定位
                    this.initLocationFunc()
                }
            }
            this.getUser()
        },
        // #ifdef MP
        offPromptFunc() {
            let time = 8
            this.offPrompt = setInterval(() => {
                time -= 1
                if (time <= 0) this.clearIntervalFunc()
            }, 1000)
        },
        clearIntervalFunc() {
            clearInterval(this.offPrompt)
            this.offPrompt = false
        },
        // #endif
        // 获取1级分类
        async getLevelOneListFun() {
            const { code, data } = await getLevelOneList()
            if (code == 1) {
                this.cateList = [homeItem, ...data]
                this.showCateList = []
            }
        },
        handleReport() {
            // 悬浮按钮：投诉/建议
            console.log('点击投诉/建议')
            // TODO: 如果你有具体页面路径，我可以直接接上跳转
            // uni.navigateTo({ url: '/bundle_b/pages/xxx/xxx' })
        },
        // 跳转到二手交易页面
        goToGoodsCate() {
            uni.navigateTo({
                url: '/pages/goods_cate/goods_cate'
            })
        },
        // 跳转到生活缴费页面
        goToLifePayment() {
            uni.navigateTo({
                url: '/bundle_life_payment/pages/life_payment_index/life_payment_index'
            })
        },
        // 跳转到寄快递页面
        goToExpress() {
            uni.navigateTo({
                url: '/bundle_express/pages/send_express/send_express'
            })
        },
        // 获取菜单
        async getMenuFun() {
            const { code, data } = await getMenu({
                type: 1
            })
            if (code == 1) {
                this.navList = data
            }
        },
        // 获取首页数据
        async getHomeFun() {
            const { code, data } = await getHome({ city_id: this.cityInfo.id })
            if (code == 1) {
                this.homeData = data
            }
        },
        // #ifdef MP-WEIXIN
        async getLiveListsFun() {
            const { code, data } = await getLiveLists({ page_size: 6, page_no: 1 })
            if (code == 1) {
                this.liveLists = data.list
            }
        },
        // #endif
        changeActive(index) {
            this.active = index
            this.enable = index == 0
            this.mescroll.optDown.use = index == 0
            this.showCateList[index] = true
        },
        async downCallback() {
            await this.getLevelOneListFun()
            await this.getMenuFun()
            await this.getHomeFun()
            // #ifdef MP-WEIXIN
            this.getLiveListsFun()
            // #endif
            this.$refs.mescrollItem.getData()
            this.mescroll.endSuccess(0, false)
        }
    },
    computed: {
        ...mapGetters(['sysInfo', 'inviteCode', 'appConfig', 'cityInfo']),
        navH() {
            return this.sysInfo.navHeight + 'px'
        },
        // 分类栏悬浮高度
        cateTop() {
            return this.sysInfo.navHeight + uni.upx2px(80) + 'px'
        },
        headerStyle() {
            const { active, cateList, appConfig } = this
            let bg = cateList[active].bg_image
            if (active == 0) {
                bg = appConfig.index_setting.top_bg_image
            }
            return bg
                ? {
                      'background-image': `url(${bg})`
                  }
                : {}
        }
    }
}
</script>

<style lang="scss">
page {
    padding: 0;
}
.index-bg {
    background-image: url('../../static/images/index_bg.png');
    background-size: 100% 700rpx;
    background-repeat: no-repeat;
    background-position: top center;
}

.index {
    min-height: calc(100vh - var(--window-bottom));

    // 小程序标题
    .mp-title {
        padding: 20rpx 0;
        text-align: center;
        
        .mp-title-text {
            color: #FFFFFF;
            font-size: 36rpx;
            font-weight: bold;
        }
    }


    // 胶囊提示
    .capsule-tips {
        width: 584rpx;
        color: #ffffff;
        padding: 12rpx 18rpx;
        border-radius: 14rpx;
        background: rgba(0, 0, 0, 0.7);
        position: relative;
        position: absolute;
        z-index: 9999;
        bottom: -80rpx;
        right: -150rpx;
    }
    .capsule-tips::after {
        content: '';
        border-bottom: 14rpx solid rgba(0, 0, 0, 0.7);
        border-right: 14rpx solid transparent;
        border-left: 14rpx solid transparent;
        position: absolute;
        top: -14rpx;
        right: 88rpx;
    }

    .cate-btn {
        padding: 12rpx 16rpx 12rpx 20rpx;
        border-radius: 60rpx 0 0 60rpx;
        background-color: rgba(256, 256, 256, 0.4);
    }
}
.record_number {
    text-align: center;
    padding: 30rpx;
    font-size: 24rpx;
}

/* 悬浮投诉/建议按钮 */
.float-report {
    position: fixed;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1201; /* 高于 u-no-network(1200) */
    width: 120rpx;
    padding: 10rpx 10rpx;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.float-report-icon {
    width: 90rpx;
    height: 90rpx;
}

.float-report-text {
    margin-top: 6rpx;
    font-size: 20rpx;
    color: #289301;
    white-space: nowrap;
    font-weight: bold;
}
</style>
