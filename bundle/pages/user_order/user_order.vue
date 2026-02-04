<template>
    <view class="user-order">
        <custom-navbar
            :title="currentModuleName"
            title-align="left"
            :show-dropdown="true"
            dropdown-icon="▼"
            @titleTap="openModulePopup"
        ></custom-navbar>
        <view class="order-content">
            <tabs 
                :current="active" 
                @change="changeShow" 
                bar-width="60" 
                :is-scroll="false"
                bg-color="#B3EE76"
                active-color="#FFFFFF"
                inactive-color="#FFFFFF"
                :bar-height="6"
                :bold="true"
                :bar-style="barStyle"
            >
                <tab v-for="(item, index) in order" :key="index" :name="item.name">
                    <order-list
                        :order-type="item.type"
                        :module="currentModuleKey"
                        :i="index"
                        :index="active"
                        v-if="isLogin"
                    ></order-list>
                    <button class="btn" @click="handlelogin" v-else>立即登录</button>
                </tab>
            </tabs>
        </view>
        <float-tab></float-tab>

        <!-- 模块选择弹窗 -->
        <u-popup v-model="showModulePopup" mode="bottom" border-radius="24" :maskCloseAble="true">
            <view class="module-popup">
                <view class="module-popup-header">
                    <view class="module-popup-title">{{ currentModuleName }}</view>
                    <view class="module-popup-close" @tap="showModulePopup = false">×</view>
                </view>
                <view class="module-popup-grid">
                    <view
                        v-for="item in modules"
                        :key="item.key"
                        class="module-item"
                        :class="{ active: item.key === currentModuleKey }"
                        @tap="selectModule(item.key)"
                    >
                        {{ item.name }}
                    </view>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import { orderType } from '@/utils/type'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { mapGetters } from 'vuex'

export default {
    components: {
        CustomNavbar
    },
    data() {
        return {
            active: 0,
            showModulePopup: false,
            currentModuleKey: 'all',
            modules: [
                { key: 'all', name: '全部订单' },
                { key: 'secondhand', name: '二手交易' },
                { key: 'life', name: '生活缴费' },
                { key: 'rent', name: '房屋出租' },
                { key: 'local', name: '同城家政' },
                { key: 'rideshare', name: '顺风车' },
                { key: 'express', name: '快递服务' },
                { key: 'recharge', name: '话费充值' }
            ],
            order: [
                {
                    name: '全部',
                    type: orderType.ALL
                },
                {
                    name: '待付款',
                    type: orderType.PAY
                },
                {
                    name: '待收货',
                    type: orderType.DELIVERY
                },
                {
                    name: '已完成',
                    type: orderType.FINISH
                },
                {
                    name: '已关闭',
                    type: orderType.CLOSE
                }
            ]
        }
    },
    onLoad(options) {
        const { order } = this
        const module = this.$Route.query.module
        if (module) {
            this.currentModuleKey = module
        }
        let type = this.$Route.query.type || orderType.ALL
        let index = order.findIndex((item) => item.type == type)
        if (index === -1) {
            index = 0
        }
        this.changeShow(index)
    },
    computed: {
        ...mapGetters(['isLogin']),
        currentModuleName() {
            const hit = this.modules.find((m) => m.key === this.currentModuleKey)
            return hit ? hit.name : '全部订单'
        },
        barStyle() {
            return {
                background: 'linear-gradient(90deg, #1D9D0A 0%, #ACFF00 85.84%)',
                'border-radius': '30rpx'
            }
        }
    },
    methods: {
        openModulePopup() {
            this.showModulePopup = true
        },
        selectModule(key) {
            if (key === this.currentModuleKey) {
                this.showModulePopup = false
                return
            }
            this.currentModuleKey = key
            this.showModulePopup = false
            // 通知当前列表刷新（order-list 内已监听 refreshorder）
            uni.$emit('refreshorder')
        },
        changeShow(index) {
                    this.active = index
        },
        handlelogin() {
            this.$Router.push('/pages/login/login')
        }
    }
}
</script>
<style lang="scss" scoped>
.user-order {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.order-content {
    padding-top: 88px; // Account for fixed navbar height (statusBar + navbar)
}

.btn {
    width: 200rpx;
    background-color: $-color-primary;
    border-radius: 20rpx;
    color: white;
    margin: 100rpx auto;
}

.module-popup {
    padding: 20rpx 20rpx 50rpx;
    background: #ffffff;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
}

.module-popup-header {
    position: relative;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.module-popup-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #189B07;
}

.module-popup-close {
    position: absolute;
    right: 10rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 56rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    border-radius: 28rpx;
    color: #333;
    font-size: 45rpx;
}

.module-popup-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    padding:20rpx  0  40rpx;
}

.module-item {
    /* 一行3个：总gap为2*16rpx */
    flex: 0 0 calc((100% - 32rpx) / 3);
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    border-radius: 10rpx;
    background: #FAFAFA;
    color: #333;
    font-size: 26rpx;
    box-sizing: border-box;
}

.module-item.active {
    background: #F0FFF8;
    color: #1B8902;
    border: 2rpx solid #1b8902;
}
</style>
