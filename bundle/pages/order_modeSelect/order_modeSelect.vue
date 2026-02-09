<template>
    <view class="order-mode">
        <custom-navbar title="我的订单"></custom-navbar>
        <view class="content">
            <view class="grid">
                <view
                    v-for="item in modules"
                    :key="item.key"
                    class="card"
                    @tap="selectModule(item)"
                >
                    <view class="card-left">
                        <view class="icon-wrap">
                            <image class="icon" :src="item.icon" mode="aspectFit"></image>
                        </view>
                        <view class="name">{{ item.name }}</view>
                    </view>
                    <u-icon name="arrow-right" size="28" color="#999"></u-icon>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    components: { CustomNavbar },
    data() {
        return {
            modules: [
                {
                    key: 'secondhand',
                    name: '二手交易',
                    icon: '/bundle/static/Group 1410085276.png'
                },
                {
                    key: 'life',
                    name: '生活缴费',
                    icon: '/bundle/static/shenghuojiaofei.png'
                },
                {
                    key: 'rent',
                    name: '房屋出租',
                    icon: '/bundle/static/fangwuchuzu.png'
                },
                {
                    key: 'local',
                    name: '同城家政',
                    icon: '/bundle/static/tongchengjiazheng.png'
                },
                {
                    key: 'rideshare',
                    name: '顺风车',
                    icon: '/bundle/static/shunfengche.png'
                },
                {
                    key: 'express',
                    name: '快递服务',
                    icon: '/bundle/static/kuaidi.png'
                },
                {
                    key: 'recharge',
                    name: '话费充值',
                    icon: '/bundle/static/huafei.png'
                }
            ]
        }
    },
    onLoad(query) {
    },
    methods: {
        selectModule(item) {
            // 回到订单页，并把模块带过去（订单页会显示标题并按模块过滤）
            this.$Router.replace({
                path: '/bundle/pages/user_order/user_order',
                query: { module: item.key }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.order-mode {
    min-height: 100vh;
    background: #f8f8f8;
}

.content {
    padding-top: 110px;
    padding-left: 20rpx;
    padding-right: 20rpx;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    padding: 10rpx 0 40rpx;
}

.card {
    flex: 0 0 calc((100% - 16rpx) / 2);
    height: 108rpx;
    padding:75rpx 22rpx;
    background: #fff;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.card-left {
    display: flex;
    align-items: center;
    min-width: 0;
}

.icon-wrap {
    width: 100rpx;
    height: 100rpx;
    // border-radius: 36rpx;
    // background: linear-gradient(180deg, #1D9D0A 0%, #B3EE76 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
}

.icon {
    width:120rpx;
    height: 75rpx;
}

.name {
    margin-left: 18rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

