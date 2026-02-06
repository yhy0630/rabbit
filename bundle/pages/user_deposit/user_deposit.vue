<template>
    <view class="user-deposit">
        <custom-navbar title="保证金"></custom-navbar>

        <view class="content">
            <!-- 保证金卡片 -->
            <view class="deposit-card bg-white">
                <view class="card-title">我的保证金</view>
                <view class="deposit-amount">
                    <text class="amount-symbol">¥</text>
                    <text class="amount-value">{{ depositAmount || 0 }}</text>
                </view>
                <button class="pay-btn" @tap="payDeposit">缴纳保证金</button>
            </view>

            <!-- 保证金明细 -->
            <view class="detail-section">
                <view class="detail-title">
                    <view class="title-bar"></view>
                    <text class="title-text">保证金明细</text>
                </view>
                <view class="detail-list bg-white">
                    <view
                        class="detail-item"
                        v-for="(item, index) in detailList"
                        :key="index"
                    >
                        <view class="item-left">
                            <view class="item-desc">{{ item.desc }}</view>
                            <view class="item-time">{{ item.time }}</view>
                        </view>
                        <view class="item-amount" :class="{ negative: item.amount < 0 }">
                            {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
                        </view>
                    </view>
                    <view v-if="detailList.length === 0" class="empty-tip">
                        暂无明细记录
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'userDeposit',
    components: {
        CustomNavbar
    },
    data() {
        return {
            depositAmount: 300, // 保证金金额，后续从接口获取
            detailList: [
                {
                    desc: '缴纳保证金',
                    amount: 300,
                    time: '2022-11-04 11:21'
                },
                {
                    desc: '扣除保证金',
                    amount: -100,
                    time: '2022-11-04 11:21'
                },
                {
                    desc: '缴纳保证金',
                    amount: 300,
                    time: '2022-11-04 11:21'
                },
                {
                    desc: '扣除保证金',
                    amount: -100,
                    time: '2022-11-04 11:21'
                }
            ]
        }
    },
    onLoad() {
        // 后续接入接口获取保证金信息和明细
        // this.getDepositInfo()
    },
    methods: {
        payDeposit() {
            // 缴纳保证金逻辑，后续接入接口
            this.$toast({ title: '功能开发中' })
        }
    }
}
</script>

<style lang="scss">
.user-deposit {
    padding-top: 100px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
    min-height: calc(100vh - env(safe-area-inset-bottom));
    background: #EDF9EF;

    .content {
        padding: 20rpx;
    }

    .deposit-card {
        border-radius: 24rpx;
        padding: 40rpx 30rpx;
        margin-bottom: 30rpx;
        text-align: center;

        .card-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333;
            margin-bottom: 30rpx;
        }

        .deposit-amount {
            margin-bottom: 40rpx;

            .amount-symbol {
                font-size: 36rpx;
                color: #49AB02;
                font-weight: 500;
            }

            .amount-value {
                font-size: 64rpx;
                color: #49AB02;
                font-weight: 600;
            }
        }

        .pay-btn {
            width: 100%;
            height: 88rpx;
            line-height: 88rpx;
            border-radius: 44rpx;
            color: #fff;
            font-size: 32rpx;
            background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
        }
    }

    .detail-section {
        .detail-title {
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;
            padding-left: 20rpx;

            .title-bar {
                width: 6rpx;
                height: 32rpx;
                background-color: #1B8902;
                border-radius: 3rpx;
                margin-right: 12rpx;
            }

            .title-text {
                font-size: 32rpx;
                font-weight: 600;
                color: #1B8902;
            }
        }

        .detail-list {
            border-radius: 24rpx;
            overflow: hidden;

            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx;
                border-bottom: 1rpx solid #f2f2f2;

                &:last-child {
                    border-bottom: none;
                }

                .item-left {
                    flex: 1;

                    .item-desc {
                        font-size: 30rpx;
                        color: #333;
                        margin-bottom: 10rpx;
                    }

                    .item-time {
                        font-size: 24rpx;
                        color: #999;
                    }
                }

                .item-amount {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #49AB02;

                    &.negative {
                        color: #ff2c3c;
                    }
                }
            }

            .empty-tip {
                padding: 60rpx 0;
                text-align: center;
                font-size: 28rpx;
                color: #999;
            }
        }
    }
}
</style>

