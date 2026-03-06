<template>
    <view class="vip-page">
        <custom-navbar title="开通会员"></custom-navbar>

        <scroll-view class="content-scroll" scroll-y>
            <view class="top-card">
                <text class="top-title">开通VIP套餐 提升售卖效率</text>
                <view class="plan-row">
                    <view
                        v-for="plan in plans"
                        :key="plan.key"
                        class="plan-item"
                        :class="{ active: currentPlan === plan.key }"
                        @click="currentPlan = plan.key"
                    >
                        <text class="plan-price">¥{{ plan.price }}</text>
                        <text class="plan-days">{{ plan.days }}天会员</text>
                    </view>
                </view>
                <view class="big-price-row">
                    <text class="big-label">VIP（{{ currentPlanObj.days }}天）</text>
                    <text class="big-price">{{ currentPlanObj.total }}元</text>
                    <button class="buy-btn" @click="buy">立即购买</button>
                </view>
            </view>

            <view class="section">
                <view class="section-title">VIP特权</view>
                <view class="vip-privilege">
                    <view class="vip-badge">
                        <u-icon name="vip" size="30" color="#FFFFFF"></u-icon>
                        <text class="badge-text">会员特权</text>
                    </view>
                    <view class="privilege-list">
                        <view class="privilege-item" v-for="(p, idx) in privileges" :key="idx">
                            <text>{{ idx + 1 }}.{{ p }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="section">
                <view class="section-title">会员规则</view>
                <view class="rule-text">
                    <text v-for="(r, idx) in rules" :key="idx">
                        {{ idx + 1 }}.{{ r }}{{
                            idx === rules.length - 1 ? '' : '\n'
                        }}
                    </text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'HouseVip',
    components: { CustomNavbar },
    data() {
        return {
            plans: [
                { key: '30', price: 298, days: 30, total: 298 },
                { key: '90', price: 498, days: 90, total: 498 },
                { key: '365', price: 998, days: 365, total: 998 }
            ],
            currentPlan: '30',
            privileges: [
                '每单佣金折扣优惠，一天几元享会员',
                '房源优先展示，更多曝光机会，提升成交效率',
                '无限次刷新房源，修改房源标题、修改房源价格'
            ],
            rules: [
                '会员服务期内在房产模块享受相应权益，具体权益以页面展示为准。',
                '会员为虚拟服务，一旦开通不支持退款和转让，请谨慎购买。',
                '如发现恶意发布虚假房源等违规行为，平台有权取消会员资格。'
            ]
        }
    },
    computed: {
        currentPlanObj() {
            return this.plans.find((p) => p.key === this.currentPlan) || this.plans[0]
        }
    },
    methods: {
        buy() {
            uni.showToast({
                title: '模拟支付：' + this.currentPlanObj.total + '元',
                icon: 'none'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.vip-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F5F5F5;
    padding-top: 88px;
}

.content-scroll {
    height: calc(100vh - 88px);
    padding: 20rpx 24rpx 30rpx;
}

.top-card {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 26rpx 24rpx 20rpx;
    margin-bottom: 20rpx;
}

.top-title {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 20rpx;
}

.plan-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
}

.plan-item {
    flex: 1;
    margin-right: 16rpx;
    background: #F5F5F5;
    border-radius: 12rpx;
    padding: 16rpx 0;
    text-align: center;
}

.plan-item:last-child {
    margin-right: 0;
}

.plan-item.active {
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
}

.plan-price {
    font-size: 30rpx;
    font-weight: bold;
}

.plan-days {
    font-size: 22rpx;
}

.big-price-row {
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.big-label {
    font-size: 26rpx;
    color: #333333;
}

.big-price {
    font-size: 30rpx;
    color: #E53935;
    font-weight: bold;
}

.buy-btn {
    height: 64rpx;
    padding: 0 40rpx;
    border-radius: 32rpx;
    background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
    color: #FFFFFF;
    font-size: 26rpx;
    border: none;
}

.buy-btn::after {
    border: none;
}

.section {
    background: #FFFFFF;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 20rpx;
}

.vip-privilege {
    background: #F3FBF3;
    border-radius: 16rpx;
    padding: 20rpx;
}

.vip-badge {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.badge-text {
    font-size: 26rpx;
    color: #4CAF50;
    margin-left: 10rpx;
}

.privilege-list {
    font-size: 24rpx;
    color: #333333;
}

.privilege-item + .privilege-item {
    margin-top: 8rpx;
}

.rule-text {
    font-size: 24rpx;
    color: #666666;
    line-height: 1.6;
    white-space: pre-line;
}
</style>

